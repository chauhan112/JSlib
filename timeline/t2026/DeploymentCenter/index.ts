import { Tools } from "../../t2025/april/tools";
import {SidebarCtrl, RouteWebPage, DefaultPageContent} from "../../t2025/dec/DomainOpsFrontend/route/ui";
import { HeaderWithSearch } from "./Components";
import { MainCtrl as ListDisplayerMainCtrl, ListDisplayerCtrl } from "../../t2025/dec/DomainOpsFrontend/components/ListDisplayer";
import { MainCtrl as RouteWebPageMainCtrl } from "../../t2025/dec/DomainOpsFrontend/route/controller";
import { MainRouteController, type IRouteController } from "./routeController";


export const DeploymentCenterPage = () => {
    const header = HeaderWithSearch();
    const bodyContent = Tools.comp("div", {
        class: "flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 lg:p-8",
        textContent: "Hello World",
    });
    return Tools.comp("div", {
        class: "flex-1 flex flex-col h-screen overflow-hidden",
        children: [header, bodyContent],
    }, {}, { header, bodyContent });
};

export class WebPageWithNav{
    comp: any;
    sidebar_ctrl: SidebarCtrl = new SidebarCtrl();
    setup() {
        this.sidebar_ctrl.set_comp(this.comp.s.sidebar);
        this.sidebar_ctrl.setup();
        this.comp.s.header.s.hamburger_btn.update({}, { click: () => this.toggle_sidebar() });
        this.comp.s.sidebar.s.header.s.close_btn.update({}, { click: () => this.toggle_sidebar() });
        this.comp.s.header.s.title.update({}, { click: () => globalThis.location.href = "/" });
        this.sidebar_ctrl.get_menu_item = this.get_menu_item;
    }
    set_comp(comp: any) {
        this.comp = comp;
    }
    toggle_sidebar() {
        this.comp.s.sidebar.getElement().classList.toggle('-translate-x-full');
        this.comp.s.overlay.getElement().classList.toggle('hidden');
    }
    set_app_name(app_name: string) {
        this.comp.s.header.s.title.update({textContent: app_name});
        this.sidebar_ctrl.set_app_name(app_name);
    }
    get_menu_item(label: string, href: string) {
        return Tools.comp("a", {
            href: "#" + href,
            class: "nav-link flex items-center px-4 py-3 rounded-md transition-colors duration-200 hover:bg-gray-700",
            textContent: label,
        })
    }
}

export class HeaderController {
    comp: any;
    setup() {
        this.comp.s.title.update({}, { click: () => globalThis.location.href = "/"  });
        this.comp.s.setting.update({}, { click: () => RouteWebPageMainCtrl.navigate("/settings") });
    }
    set_comp(comp: any) {
        this.comp = comp;
    }
}

export class DeploymentCenterPageCtrl {
    comp: any;
    apps: {name: string, href: string}[] = [];
    app_list_ctrl: ListDisplayerCtrl | undefined;
    header_ctrl: HeaderController = new HeaderController();
    routes: IRouteController[] = [];
    constructor() {
        globalThis.addEventListener("hashchange", () => this.route());
    }
    setup() {
        this.header_ctrl.set_comp(this.comp.s.header);
        this.header_ctrl.setup();
        this.app_list_ctrl = ListDisplayerMainCtrl.listDisplayer(this.apps, 10, (data: any) => {
            RouteWebPageMainCtrl.navigate(data.href);
        }, undefined, []);
        this.app_list_ctrl.title_getter = (data: any) => data.name;
        this.routes.push(MainRouteController.route("", (params: any) => {
            this.app_list_ctrl!.update();
            return Tools.comp("div", {
                children: [this.app_list_ctrl!.comp],
            });
        }));
        this.route();
    }
    set_comp(comp: any) {
        this.comp = comp;
    }
    add_app(app: {name: string, href: string}) {
        this.apps.push(app);
        this.app_list_ctrl?.set_data(this.apps.map(app => ({name: app.name, href: app.href})));
    }
    route() {
        for (const route of this.routes) {
            if (route.matches_path(globalThis.location.hash)) {
                let comp = route.get_component(this);
                this.comp.s.bodyContent.update({innerHTML: "", child: comp});
                return;
            }
        }
        this.comp.s.bodyContent.update({innerHTML: "", child: DefaultPageContent()});
    }
}

export const DeploymentCenter = () => {
    const deploymentCenterPageCtrl = new DeploymentCenterPageCtrl();
    deploymentCenterPageCtrl.set_comp(DeploymentCenterPage());
    deploymentCenterPageCtrl.add_app({name: "App 1", href: "/app-1"});
    deploymentCenterPageCtrl.add_app({name: "App 2", href: "/app-2"});
    deploymentCenterPageCtrl.setup();
    return deploymentCenterPageCtrl;
}

export class MainCtrl {
    static deploymentCenterPage() {
        const deploymentCenterPageCtrl = new DeploymentCenterPageCtrl();
        deploymentCenterPageCtrl.set_comp(DeploymentCenterPage());
        deploymentCenterPageCtrl.setup();
        return deploymentCenterPageCtrl;
    }
    static webPageWithNav() {
        const webPageWithNavCtrl = new WebPageWithNav();
        webPageWithNavCtrl.set_comp(RouteWebPage());
        webPageWithNavCtrl.setup();
        return webPageWithNavCtrl;
    }
}