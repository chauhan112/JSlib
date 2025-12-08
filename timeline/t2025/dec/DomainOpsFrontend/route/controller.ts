import { RouteWebPage, DefaultPageContent, SidebarCtrl, Page404 } from "./ui";
import { Router } from "../../../may/ToolsHomepage/Router";
import { GComponent } from "../../../april/GComponent";

export class RouteWebPageController {
    comp: any;
    router: Router = Router.getInstance();
    home_page_getter: () => GComponent = DefaultPageContent;
    sidebar_ctrl: SidebarCtrl = new SidebarCtrl();
    set_comp(comp: any) {
        this.comp = comp;
    }
    setup() {
        this.sidebar_ctrl.set_comp(this.comp.s.sidebar);
        this.sidebar_ctrl.setup();
        this.add_route_page("/", this.home_page_getter);
        this.add_route_page("*", Page404);
        this.comp.s.header.s.hamburger_btn.update({}, { click: () => this.on_toggle_sidebar() });
        this.comp.s.sidebar.s.header.s.close_btn.update({}, { click: () => this.on_toggle_sidebar() });
    }
    add_menu_item(label: string, href: string) {
        this.sidebar_ctrl.add_menu_item(label, href);
    }
    add_menu_as_component(component: GComponent) {
        this.sidebar_ctrl.add_menu_as_component(component);
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
    add_route_page(href: string, page: () => GComponent) {
        this.router.addRoute(href, () => {
            this.comp.s.mainBody.update({ innerHTML: "", child: page() });
            if (!this.comp.s.sidebar.getElement().classList.contains('-translate-x-full') && window.innerWidth < 1024) {
                this.on_toggle_sidebar();
            }
            this.sidebar_ctrl.select_menu_item(this.get_link(href));
        });
    }
    on_toggle_sidebar() {
        this.comp.s.sidebar.getElement().classList.toggle('-translate-x-full');
        this.comp.s.overlay.getElement().classList.toggle('hidden');
        
    }
}

export class MainCtrl {
    static routeWebPage(menus: { label: string, href: string }[], route_pages: { href: string, page: () => GComponent }[], home_page?: () => GComponent) {
        const routeWebPageCtrl = new RouteWebPageController();
        const routeWebPage = RouteWebPage();
        routeWebPageCtrl.set_comp(routeWebPage);
        routeWebPageCtrl.setup();
        routeWebPageCtrl.set_menus(menus);
        for (const route_page of route_pages) {
            routeWebPageCtrl.add_route_page(route_page.href, route_page.page);
        }
        if (home_page) {
            routeWebPageCtrl.home_page_getter = home_page;
        }
        return routeWebPageCtrl;
    }
}