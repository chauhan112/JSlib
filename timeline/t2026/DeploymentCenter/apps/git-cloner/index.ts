import { GComponent } from "../../../../t2025/april/GComponent";
import { Tools } from "../../../../t2025/april/tools";
import { GRouteController, type IApp, type IRouteController } from "../../routeController";
import { WebPageWithNav, MainCtrl as WebPageWithNavMainCtrl } from "../../Components";
import { MainCtrl as RouteWebPageMainCtrl } from "../../../../t2025/dec/DomainOpsFrontend/route/controller";
import { ManagePage, ManagePageCtrl } from "./ui";
import { MainCtrl as SearchWithListMainCtrl, SearchWithList } from "./search_with_list";
import { SimpleCodeView, SimpleCodeViewCtrl } from "./simple_code_view";


export class GitRepoManagePageCtrl extends GRouteController implements IRouteController {
    ctrl: ManagePageCtrl | undefined;
    matches_path(path: string): boolean {
        return path === "/manage";
    }
    get_component(params: any): GComponent {
        if (!this.ctrl) {
            this.ctrl = new ManagePageCtrl();
            this.ctrl.setup();
        }
        return this.ctrl.comp;
    }
}

export class GitRepoSearchPageCtrl extends GRouteController implements IRouteController {
    ctrl: SearchWithList | undefined;
    matches_path(path: string): boolean {
        return path === "/search";
    }
    get_component(params: any): GComponent {
        if (!this.ctrl) {
            this.ctrl = SearchWithListMainCtrl.searchWithList();
        }
        return this.ctrl.comp;
    }

}

export class GitRepoCodeViewPageCtrl extends GRouteController implements IRouteController {
    ctrl: SimpleCodeViewCtrl | undefined;
    matches_path(path: string): boolean {
        return path.startsWith("/search/view/");
    }
    get_component(params: any): GComponent {
        if (!this.ctrl) {
            this.ctrl = new SimpleCodeViewCtrl();
            this.ctrl.setup();
        }
        return this.ctrl.comp;
    }

}



export class GitRepoPageCtrl implements IRouteController {
    ctrl: WebPageWithNav = WebPageWithNavMainCtrl.webPageWithNav();
    private current_path: string = "";
    infos: IApp;
    routes: IRouteController[] = [];
    constructor() {
        this.infos = {
            name: "Git Repo", href: "/git-repo", subtitle: "search in files of git repos",
            params: ["backend-url", "api-key"]
        }

        this.ctrl.comp.s.sidebar.s.header.s.title.update({}, { click: () => RouteWebPageMainCtrl.navigate(this.infos.href) });
        this.ctrl.comp.s.header.s.title.update({}, { click: () => RouteWebPageMainCtrl.navigate(this.infos.href) });
        this.ctrl.set_app_name(this.infos.name);
        this.ctrl.sidebar_ctrl.add_menu_item("Manage Repos", this.infos.href + "/manage");
        this.ctrl.sidebar_ctrl.add_menu_item("Search in Repos", this.infos.href + "/search");
        this.routes.push(new GitRepoManagePageCtrl());
        this.routes.push(new GitRepoSearchPageCtrl());
        this.routes.push(new GitRepoCodeViewPageCtrl());
    }

    get_component(params: any): GComponent {
        console.log("get_component", params);

        let path = this.current_path.slice(this.get_info().href.length);
        for (const route of this.routes) {
            if (route.matches_path(path)) {
                let comp = route.get_component(params);
                this.ctrl.comp.s.mainBody.update({ innerHTML: "", child: comp });
                this.ctrl.sidebar_ctrl.select_menu_item(this.infos.href + path);
                return this.ctrl.comp;
            }
        }
        this.ctrl.sidebar_ctrl.select_menu_item(this.infos.href);
        this.ctrl.comp.s.mainBody.update({
            innerHTML: "", child: Tools.comp("div", {
                textContent: "404 Not Found",
            })
        });
        return this.ctrl.comp;
    }
    set_info(infos: IApp) {
        this.infos = infos;
    }
    get_info(): IApp {
        return this.infos;
    }
    matches_path(path: string): boolean {
        this.current_path = path;
        return path.startsWith(this.get_info().href);
    }
}

