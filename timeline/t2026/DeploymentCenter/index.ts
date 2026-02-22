import { Tools } from "../../globalComps/tools";
import { DefaultPageContent } from "../../t2025/dec/DomainOpsFrontend/route/ui";
import { type IApp, type IRouteController } from "./interfaces";
import {
    HomeRouteController,
    MainCtrl as DafaultCompCtrl,
} from "./apps/defaults";
import { SettingsPageCtrl, MainCtrl as SettingsPageMainCtrl } from "./settings";
import { MainCtrl as GitRepoPageMainCtrl } from "./apps/git-cloner";
import { CrudListAsPage } from "./apps/domOps/crud_list";
import { SearchComponentAsPage } from "./apps/domOps/searchComp";
import { AIChats } from "../q1/AIChats";
import { SearchCompAsPage } from "../q1/view_crud_list/searchComp";
import { CrudPage } from "../q1/view_crud_list";
import { DirectusTableCrud } from "../q1/ExperimentView/first_try";
import { DynamicFormGenerator } from "../q1/dynamicFormGenerator";
import { ListerPage } from "../q1/lister";
import { ExpViewPage } from "../q1/ExperimentView";
import { HeaderBodyNewPage, HeaderBodyOldPage } from "../q1/WebPageWithRoutes";
import { UIShowcasePage } from "../q1/ui-showcase";
import { DomOpsPage } from "../q1/domOps";

export const DeploymentCenterPage = () => {
    return Tools.comp("div", {
        class: "flex-1 flex flex-col",
        textContent: "Hello World",
    });
};

export class DeploymentCenterPageCtrl {
    comp: any;
    apps: { name: string; href: string }[] = [];
    routes: IRouteController[] = [];
    home_route_ctrl: HomeRouteController =
        DafaultCompCtrl.homeRouteController();
    settings_route_ctrl: SettingsPageCtrl = SettingsPageMainCtrl.settingsPage();

    constructor() {
        globalThis.addEventListener("hashchange", () => this.route());
        this.settings_route_ctrl.parent = this;
    }
    setup() {
        this.routes.push(this.home_route_ctrl);
        this.routes.push(this.settings_route_ctrl);
        this.route();
    }
    set_comp(comp: any) {
        this.comp = comp;
    }
    add_app(route_ctrl: IRouteController) {
        for (const route of this.routes) {
            if (route.get_info().href === route_ctrl.get_info().href) {
                throw new Error("App already exists");
            }
        }
        this.routes.push(route_ctrl);
        let app: IApp = route_ctrl.get_info();
        this.home_route_ctrl.add_app(app);
    }
    route() {
        let path = globalThis.location.hash;
        if (path.startsWith("#")) {
            path = path.slice(1);
        }
        for (const route of this.routes) {
            if (route.matches_path(path)) {
                let params = this.settings_route_ctrl.get_app_infos(
                    route.get_info(),
                );
                if (!route.initialized) {
                    (route as any).setup();
                }
                let comp = route.get_component(params);
                this.comp.update({ innerHTML: "", child: comp });
                return;
            }
        }
        this.comp.update({ innerHTML: "", child: DefaultPageContent() });
    }
    route_to_app(app: IApp) {
        let path = app.href;
        for (const route of this.routes) {
            if (route.matches_path(path)) {
                let comp = route.get_component({ parent: this });
                this.comp.update({ innerHTML: "", child: comp });
                return;
            }
        }
    }
}

export const DeploymentCenter = () => {
    const deploymentCenterPageCtrl = new DeploymentCenterPageCtrl();
    deploymentCenterPageCtrl.set_comp(DeploymentCenterPage());
    let gitRepoSearchRouteCtrl = GitRepoPageMainCtrl.gitRepoPage();
    deploymentCenterPageCtrl.add_app(gitRepoSearchRouteCtrl);
    let navs: IRouteController[] = [];
    navs.push(new CrudListAsPage());
    navs.push(new SearchComponentAsPage());
    navs.push(new AIChats());
    navs.push(new SearchCompAsPage());
    navs.push(new CrudPage());
    navs.push(new DirectusTableCrud());
    navs.push(new DynamicFormGenerator());
    navs.push(new ListerPage());
    navs.push(new ExpViewPage());
    navs.push(new HeaderBodyOldPage());
    navs.push(new HeaderBodyNewPage());
    navs.push(new UIShowcasePage());
    navs.push(new DomOpsPage());

    for (const nav of navs) {
        deploymentCenterPageCtrl.add_app(nav);
    }
    deploymentCenterPageCtrl.setup();
    return deploymentCenterPageCtrl;
};

export class MainCtrl {
    static deploymentCenterPage() {
        const deploymentCenterPageCtrl = new DeploymentCenterPageCtrl();
        deploymentCenterPageCtrl.set_comp(DeploymentCenterPage());
        deploymentCenterPageCtrl.setup();
        return deploymentCenterPageCtrl;
    }
}
