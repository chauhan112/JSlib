import { GComponent } from "../../../../globalComps/GComponent";
import { Tools } from "../../../../globalComps/tools";
import { GRouteController, type IApp, type IRouteController } from "../../routeController";
import { WebPageWithNav, MainCtrl as WebPageWithNavMainCtrl } from "../../Components";
import { MainCtrl as RouteWebPageMainCtrl } from "../../../../t2025/dec/DomainOpsFrontend/route/controller";
import { ManagePageCtrl } from "./ui";
import { MainCtrl as SearchWithListMainCtrl, SearchWithList } from "./search_with_list";
import { SimpleCodeViewCtrl } from "./simple_code_view";
import { ArrowLeft } from "lucide";
import { add_url, backendCall } from "../../backend_call";
import { GlobalStates } from "../../../../globalComps/GlobalStates";
// git@github.com:chauhan112/apps-center.git
export class GitRepoManagePageCtrl extends GRouteController implements IRouteController {
    ctrl: ManagePageCtrl | undefined;
    params: any;
    matches_path(path: string): boolean {
        return path === "/manage";
    }
    get_component(params: any): GComponent {
        this.params = params.params;
        if (!this.ctrl) {
            this.ctrl = new ManagePageCtrl();
            this.ctrl.fetch_repos_list = this.list_repos.bind(this);
            this.ctrl.git_clone = this.git_clone.bind(this);
            this.ctrl.delete_all = this.git_delete_all.bind(this);
            this.ctrl.setup();
        }
        return this.ctrl.comp;
    }
    
    async list_repos() {
        let url = add_url(this.params["backend-url"], "api/github/list_repos");
        const response = await backendCall(url, {}, this.params["api-key"]);
        return response.data.response.map((repo: any) => ({name: repo.local_path, url: repo.repo_url}));
    }
    async git_clone(gitUrl_or_sshlink: string) {
        let url = add_url(this.params["backend-url"], "api/github/clone");
        const response = await backendCall(url, {repo: gitUrl_or_sshlink}, this.params["api-key"]);
        return response.data
    }
    async git_delete_all() {
        let url = add_url(this.params["backend-url"], "api/github/clean");
        const response = await backendCall(url, {}, this.params["api-key"]);
        console.log("git_delete_all response", response.data.response);
        return response.data
    }
    async git_pull(repo_name: string) {
        let url = add_url(this.params["backend-url"], "api/github/pull");
        const response = await backendCall(url, {repo: repo_name}, this.params["api-key"]);
        return response.data
    }
    async git_delete(repo_name: string) {
        let url = add_url(this.params["backend-url"], "api/github/delete");
        const response = await backendCall(url, {repo: repo_name}, this.params["api-key"]);
        return response.data
    }
}

export class GitRepoSearchPageCtrl extends GRouteController implements IRouteController {
    ctrl: SearchWithList | undefined;
    matches_path(path: string): boolean {
        return path === "/search";
    }
    get_component(params: any): GComponent {
        this.ctrl ??= SearchWithListMainCtrl.searchWithList();
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
    sub_ctrls: { [key: string]: IRouteController } = {};
    constructor() {
        this.infos = {
            name: "Git Repo", href: "/git-repo", subtitle: "search in files of git repos",
            params: ["backend-url", "api-key"]
        }
    }
    setup() {
        this.ctrl.comp.s.sidebar.s.header.s.title.update({}, { click: () => RouteWebPageMainCtrl.navigate(this.infos.href) });
        this.ctrl.comp.s.header.s.title.update({}, { click: () => RouteWebPageMainCtrl.navigate(this.infos.href) });
        this.ctrl.set_app_name(this.infos.name);
        this.ctrl.sidebar_ctrl.add_menu_item("Manage Repos", this.infos.href + "/manage");
        this.ctrl.sidebar_ctrl.add_menu_item("Search in Repos", this.infos.href + "/search");
        this.set_up_sub_ctrls();
    }
    set_up_sub_ctrls() {
        this.sub_ctrls["manage"] = new GitRepoManagePageCtrl();
        this.sub_ctrls["search"] = new GitRepoSearchPageCtrl();
        this.sub_ctrls["code_view"] = new GitRepoCodeViewPageCtrl();
        this.routes.push(this.sub_ctrls["manage"]);
        this.routes.push(this.sub_ctrls["search"]);
        this.routes.push(this.sub_ctrls["code_view"]);
    }

    get_component(params: any): GComponent {
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
                children: [
                    Tools.comp("h1", {
                        textContent: "404 Not Found",
                        class: "text-2xl font-bold",
                    }),
                    Tools.comp("a",{
                        href: "#/",
                        class: "text-blue-500 hover:text-blue-600 flex items-center gap-2",
                        children:[
                            Tools.icon(ArrowLeft, { class: "w-4 h-4" }),
                            Tools.comp("span", {
                                href: "#/",
                                textContent: "Go to Home",
                            })
                        ]
                    }),
                ]
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

export class MainCtrl{
    static gitRepoPage() {
        const gitRepoPageCtrl = new GitRepoPageCtrl();
        gitRepoPageCtrl.setup();
        return gitRepoPageCtrl;
    }
}