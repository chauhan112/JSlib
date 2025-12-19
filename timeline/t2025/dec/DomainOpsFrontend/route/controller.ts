import { RouteWebPage, DefaultPageContent, SidebarCtrl, Page404 } from "./ui";
import { GComponent } from "../../../april/GComponent";

export type RouteHandler = (params: any, state: any) => void;

export class AdvanceRouter {
    routes: { path: string, handler: RouteHandler | AdvanceRouter }[] = [];
    private state: any = null;
    private isRoot: boolean = true;

    constructor(isRoot: boolean = true) {
        this.isRoot = isRoot;
        if (this.isRoot) {
            window.addEventListener("hashchange", () => this.route());
        }
    }

    addRoute(path: string, handler: RouteHandler | AdvanceRouter) {
        this.routes.push({ path, handler });
    }

    addRoutes(routes: { [path: string]: RouteHandler | AdvanceRouter }) {
        for (const path in routes) {
            this.addRoute(path, routes[path]);
        }
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

    route(subPath?: string, state?: any) {
        const path = subPath !== undefined ? subPath : (window.location.hash.slice(1) || "/");
        const currentState = state !== undefined ? state : this.state;
        
        if (subPath === undefined) this.state = null;

        for (const route of this.routes) {
            const match = this.match(route.path, path);
            if (match) {
                if (route.handler instanceof AdvanceRouter) {
                    route.handler.route(match.remaining, currentState);
                } else {
                    route.handler(match.params, currentState);
                }
                return;
            }
        }

        const wildcard = this.routes.find(r => r.path === "*");
        if (wildcard) {
            if (wildcard.handler instanceof AdvanceRouter) {
                wildcard.handler.route(path, currentState);
            } else {
                wildcard.handler({}, currentState);
            }
        }
    }

    navigate(path: string, state: any = null) {
        this.state = state;
        window.location.hash = path;
    }
    relative_navigate(path: string, state: any=null) {
        this.state = state;
        let new_path = path;
        if (path.startsWith("/")) {
            new_path = path.slice(1);
        }
        if (window.location.hash.endsWith("/")) {
            window.location.hash += new_path;
        } else {
            window.location.hash += "/" + new_path;
        }
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
    display_page(comp: GComponent, href: string) {
        this.comp.s.mainBody.update({ innerHTML: "", child: comp });
        if (!this.comp.s.sidebar.getElement().classList.contains('-translate-x-full') && window.innerWidth < 1024) {
            this.on_toggle_sidebar();
        }
        let link = this.get_link(href);
        this.sidebar_ctrl.select_menu_item(link);
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
    static routeWebPage(menus: { label: string, href: string }[], route_pages: { href: string, page: () => GComponent }[], home_page?: () => GComponent, 
           app_name: string = "DomainOps") {
        const routeWebPageCtrl = new RouteWebPageController();
        const routeWebPage = RouteWebPage();
        routeWebPageCtrl.set_comp(routeWebPage);
        routeWebPageCtrl.setup();
        routeWebPageCtrl.set_menus(menus);
        routeWebPageCtrl.set_app_name(app_name);
        for (const route_page of route_pages) {
            routeWebPageCtrl.add_route_page(route_page.href, route_page.page);
        }
        if (home_page) {
            routeWebPageCtrl.home_page_getter = home_page;
        }
        routeWebPageCtrl.add_route_page("/", routeWebPageCtrl.home_page_getter);
        return routeWebPageCtrl;
    }
}