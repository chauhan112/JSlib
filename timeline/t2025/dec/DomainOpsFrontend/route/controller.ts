import { RouteWebPage, DefaultPageContent, SidebarCtrl, Page404 } from "./ui";
import { GComponent } from "../../../april/GComponent";

export type RouteHandler = (params: any, state: any) => void;

export class AdvanceRouter {
    routes: { path: string, handler: RouteHandler | AdvanceRouter, type: "match" | "exact" }[] = [];
    private state: any = null;
    private isRoot: boolean = true;
    private next_route_calls: (() => void)[] = [];

    constructor(isRoot: boolean = true) {
        this.isRoot = isRoot;
        if (this.isRoot) {
            globalThis.addEventListener("hashchange", () => this.route());
        }
    }

    addRoute(path: string, handler: RouteHandler | AdvanceRouter, type: "match" | "exact" = "match") {
        this.routes.push({ path, handler, type });
    }
    removeRoute(path: string) {
        this.routes = this.routes.filter((route) => route.path !== path);
    }

    updateRoute(path: string, handler: RouteHandler | AdvanceRouter, type: "match" | "exact" = "match") {
        this.routes = this.routes.map((route) => {
            if (route.path === path) {
                return { ...route, handler, type };
            }
            return route;
        });
    }

    match(pattern: string, path: string) {
        if (pattern === "*") return { params: {}, remaining: "" };

        const isPrefixMatch = pattern !== "/" && pattern.endsWith("/");
        const cleanPattern = isPrefixMatch ? pattern.slice(0, -1) : pattern;
        
        const patternSegments = cleanPattern.split("/").filter(s => s !== "");
        const pathSegments = path.split("/").filter(s => s !== "");

        if (!isPrefixMatch && patternSegments.length !== pathSegments.length) {
            return null;
        }
        
        if (isPrefixMatch && pathSegments.length < patternSegments.length) {
            return null;
        }

        const params: any = {};
        for (let i = 0; i < patternSegments.length; i++) {
            const pSeg = patternSegments[i];
            const uSeg = pathSegments[i];

            if (pSeg.startsWith("{") && pSeg.endsWith("}")) {
                const paramName = pSeg.slice(1, -1);
                params[paramName] = uSeg || "";
            } else if (pSeg !== uSeg) {
                return null;
            }
        }

        const remaining = "/" + pathSegments.slice(patternSegments.length).join("/");
        return { params, remaining };
    }
    private sub_route(router: AdvanceRouter | RouteHandler, path: string, state: any, params: any = {}){
        if (router instanceof AdvanceRouter) {
            router._route(path, state);
        } else {
            router(params, state);
        }
    }
    private call_and_clear_next_route_calls() {
        for (const call of this.next_route_calls) {
            call();
        }
        this.next_route_calls = [];
    }

    route(subPath?: string, state?: any) {
        this.call_and_clear_next_route_calls();
        this._route(subPath, state);
    }
    _route(subPath?: string, state?: any) {
        const path = subPath !== undefined ? subPath : (window.location.hash.slice(1) || "/");
        const currentState = state !== undefined ? state : this.state;
        
        if (subPath === undefined) this.state = null;
        for (const route of this.routes) {
           
            if (route.type === "exact" && path === route.path) {
                this.sub_route(route.handler, path, currentState);
                return;
            }
            const match = this.match(route.path, path);
            if (match) {
                this.sub_route(route.handler, match.remaining, currentState, match.params);
                return;
            }
        }
    }

    navigate(path: string, state: any = null) {
        this.state = state;
        globalThis.location.hash = path;
    }
    relative_navigate(path: string, state: any=null) {
        this.state = state;
        let new_path = path;
        if (path.startsWith("/")) {
            new_path = path.slice(1);
        }
        if (globalThis.location.hash.endsWith("/")) {
            globalThis.location.hash += new_path;
        } else {
            globalThis.location.hash += "/" + new_path;
        }
    }
    go_back() {
        window.history.back();
    }
    add_unset_call(call: () => void) {
        this.next_route_calls.push(call);
    }
    
}

export class RouteWebPageController {
    comp: any;
    router: AdvanceRouter = new AdvanceRouter();
    home_page_getter: (params: any, state: any) => GComponent = DefaultPageContent;
    sidebar_ctrl: SidebarCtrl = new SidebarCtrl();
    
    set_comp(comp: any) {
        this.comp = comp;
    }

    setup() {
        this.sidebar_ctrl.set_comp(this.comp.s.sidebar);
        this.sidebar_ctrl.setup();
        this.comp.s.header.s.hamburger_btn.update({}, { click: () => this.on_toggle_sidebar() });
        this.comp.s.sidebar.s.header.s.close_btn.update({}, { click: () => this.on_toggle_sidebar() });
    }
    add_menu_item(label: string, href: string) {
        this.sidebar_ctrl.add_menu_item(label, href);
    }
    add_menu_as_component(component: GComponent, href: string) {
        this.sidebar_ctrl.add_menu_as_component(component, href);
    }
    set_menus(menus: { label: string, href: string }[]) {
        for (const menu of menus) {
            this.add_menu_item(menu.label, this.get_link(menu.href));
        }
    }
    get_link(href: string) {
        if (href[0] !== "#") 
            return "#" + href;
        return href;
    }
    add_route_page(href: string, page: (params: any, state: any) => GComponent) {
        this.router.addRoute(href, (params, state) => {
            this.display_page(page(params, state), href);
        });
    }
    select_menu_item(href: string) {
        this.sidebar_ctrl.select_menu_item(this.get_link(href));
    }
    display_page(comp: GComponent, href: string) {
        this.comp.s.mainBody.update({ innerHTML: "", child: comp });
        this.select_menu_item(href);
    }
    on_toggle_sidebar() {
        this.comp.s.sidebar.getElement().classList.toggle('-translate-x-full');
        this.comp.s.overlay.getElement().classList.toggle('hidden');
        
    }
    set_app_name(app_name: string) {
        this.comp.s.header.s.title.update({textContent: app_name});
        this.sidebar_ctrl.set_app_name(app_name);
    }
    add_404_page(){
        this.add_route_page("*", Page404);
    }
}

export class MainCtrl {
    static routeWebPage(menus: { label: string, href: string }[], home_page?: () => GComponent, app_name: string = "DomainOps") {
        const routeWebPageCtrl = new RouteWebPageController();
        const routeWebPage = RouteWebPage();
        routeWebPageCtrl.set_comp(routeWebPage);
        routeWebPageCtrl.setup();
        routeWebPageCtrl.set_menus(menus);
        routeWebPageCtrl.set_app_name(app_name);
        if (home_page) {
            routeWebPageCtrl.home_page_getter = home_page;
        }
        routeWebPageCtrl.add_route_page("/", routeWebPageCtrl.home_page_getter);
        return routeWebPageCtrl;
    }

    static navigate(path: string) {
        globalThis.location.hash = path;
    }
    static relative_navigate(path: string) {
        let new_path = path;
        if (path.startsWith("/")) {
            new_path = path.slice(1);
        }
        if (globalThis.location.hash.endsWith("/")) {
            globalThis.location.hash += new_path;
        } else {
            globalThis.location.hash += "/" + new_path;
        }
    }
}