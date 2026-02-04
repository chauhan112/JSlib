import { Tools } from "../../globalComps/tools";
import { DefaultPageContent } from "../../t2025/dec/DomainOpsFrontend/route/ui";
import { type IApp, type IRouteController } from "./routeController";
import { HomeRouteController, MainCtrl as DafaultCompCtrl } from "./apps/defaults";
import { SettingsPageCtrl, MainCtrl as SettingsPageMainCtrl } from "./settings";
import { MainCtrl as GitRepoPageMainCtrl, GitRepoPageCtrl } from "./apps/git-cloner";
export const DeploymentCenterPage = () => {
    return Tools.comp("div", {
        class: "flex-1 flex flex-col",
        textContent: "Hello World",
    });
};

export class DeploymentCenterPageCtrl {
    comp: any;
    apps: {name: string, href: string}[] = [];
    routes: IRouteController[] = [];
    home_route_ctrl: HomeRouteController = DafaultCompCtrl.homeRouteController();
    settings_route_ctrl: SettingsPageCtrl = SettingsPageMainCtrl.settingsPage();

    constructor() {
        globalThis.addEventListener("hashchange", () => this.route());
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
        this.routes.push(route_ctrl);
        let app: IApp = route_ctrl.get_info();
        this.home_route_ctrl.add_app(app);
    }
    route() {
        let path = globalThis.location.hash
        if (path.startsWith("#")) {
            path = path.slice(1);
        }
        for (const route of this.routes) {
            if (route.matches_path(path)) {
                let params = this.settings_route_ctrl.get_app_infos(route.get_info());
                let comp = route.get_component({parent: this, params});
                this.comp.update({innerHTML: "", child: comp});
                return;
            }
        }
        this.comp.update({innerHTML: "", child: DefaultPageContent()});
    }
    route_to_app(app: IApp) {
        let path = app.href;
        for (const route of this.routes) {
            if (route.matches_path(path)) {
                let comp = route.get_component({parent: this});
                this.comp.update({innerHTML: "", child: comp});
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
    for (let i = 0; i < 20; i++) {
        let app2RouteCtrl = DafaultCompCtrl.defaultPageSkeleton(`/app-${i}`, {
            name: `App ${i}`, href: `/app-${i}`, subtitle: `app ${i}`, params: []
        });
        deploymentCenterPageCtrl.add_app(app2RouteCtrl);
    }
    // deploymentCenterPageCtrl.add_app(app2RouteCtrl);
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
}