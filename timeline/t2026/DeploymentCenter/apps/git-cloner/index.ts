import { GComponent } from "../../../../globalComps/GComponent";
import { Tools } from "../../../../globalComps/tools";
import { type IApp, type IRouteController } from "../../interfaces";
import { GRouteController } from "../../routeController";
import {
    WebPageWithNav,
    MainCtrl as WebPageWithNavMainCtrl,
} from "../../Components";
import { MainCtrl as RouteWebPageMainCtrl } from "../../../../t2025/dec/DomainOpsFrontend/route/controller";
import { ManagePageCtrl } from "./ui";
import {
    MainCtrl as SearchWithListMainCtrl,
    SearchWithList,
} from "./search_with_list";
import { SimpleCodeViewCtrl } from "./simple_code_view";
import { ArrowLeft } from "lucide";
import { add_url, backendCall } from "../../backend_call";
import {
    DropdownCtrl,
    MainCtrl as AtomicMainCtrl,
} from "../../../../t2025/dec/DomainOpsFrontend/components/atomic";
import { SearchType } from "../../../../t2025/july/generic-crud/search/model";

// git@github.com:chauhan112/apps-center.git

class GitUtils {
    static extensions = [".py", ".ts", ".js", ".jsx", ".tsx"];
    static async list_repos(params: any) {
        let url = add_url(params["backend-url"], "api/github/list_repos");
        const response = await backendCall(url, {}, params["api-key"]);
        return response.data.response.map((repo: any) => ({
            name: repo.local_path,
            url: repo.repo_url,
        }));
    }
}

export class GitRepoManagePageCtrl
    extends GRouteController
    implements IRouteController
{
    initialized: boolean = false;
    ctrl: ManagePageCtrl | undefined;
    params: any;
    matches_path(path: string): boolean {
        return path === "/manage";
    }
    get_component(params: any): GComponent {
        this.params = params.params;
        if (!this.ctrl) {
            this.ctrl = new ManagePageCtrl();
            this.ctrl.fetch_repos_list = async () =>
                await GitUtils.list_repos(this.params);
            this.ctrl.git_clone = this.git_clone.bind(this);
            this.ctrl.delete_all = this.git_delete_all.bind(this);
            this.ctrl.git_pull = this.git_pull.bind(this);
            this.ctrl.git_delete = this.git_delete.bind(this);
            this.ctrl.setup();
            this.initialized = true;
        }
        return this.ctrl.comp;
    }
    async git_clone(gitUrl_or_sshlink: string) {
        let url = add_url(this.params["backend-url"], "api/github/clone");
        const response = await backendCall(
            url,
            { repo: gitUrl_or_sshlink },
            this.params["api-key"],
        );
        return response.data;
    }
    async git_delete_all() {
        let url = add_url(this.params["backend-url"], "api/github/clean");
        const response = await backendCall(url, {}, this.params["api-key"]);
        return response.data;
    }
    async git_pull(data: { name: string; url: string }) {
        let url = add_url(this.params["backend-url"], "api/github/pull");
        const response = await backendCall(
            url,
            { repo: data.name },
            this.params["api-key"],
        );
        return response.data;
    }
    async git_delete(data: { name: string; url: string }) {
        let url = add_url(this.params["backend-url"], "api/github/delete");
        const response = await backendCall(
            url,
            { repo: data.name },
            this.params["api-key"],
        );
        return response.data;
    }
}

export class GitRepoSearchPageCtrl
    extends GRouteController
    implements IRouteController
{
    initialized: boolean = false;
    ctrl: SearchWithList = SearchWithListMainCtrl.searchWithList();
    dropdownCtrl: DropdownCtrl = AtomicMainCtrl.dropdown([]);
    private readonly infos: any = {
        selector: { value: null, label: "-- Select Repo --" },
    };
    comp: any | undefined;
    params: any;
    matches_path(path: string): boolean {
        return path === "/search";
    }

    get_component(params: any): GComponent {
        this.params = params.params;
        if (!this.comp) {
            this.dropdownCtrl.placeholder = "-- select a repo --";
            this.comp = Tools.div({
                class: "w-full flex-col flex gap-2 p-2",
                children: [this.dropdownCtrl.comp, this.ctrl.comp],
            });
            GitUtils.list_repos(this.params).then((repos: any[]) => {
                let options = repos.map((repo: any) => ({
                    value: repo.url,
                    label: repo.name,
                }));
                this.dropdownCtrl.set_options(options);
            });
            this.ctrl.get_result_data = this.search.bind(this);
            this.initialized = true;
        }

        return this.comp;
    }
    private async search(search_params: { type: SearchType; params: any }[]) {
        let repo_url = this.dropdownCtrl.get_value();
        let url = add_url(this.params["backend-url"], "api/github/search");
        let params = search_params[0].params as {
            search: string;
            case: boolean;
            reg: boolean;
        };
        let payload = {
            repo: repo_url,
            word: params.search,
            case: params.case,
            reg: params.reg,
            extensions: [".py", ".ts", ".js", ".jsx", ".tsx"],
        };
        const response = await backendCall(
            url,
            payload,
            this.params["api-key"],
        );
        let res = response.data.response.map(
            (item: { name: string; line: number }) => ({
                title: item.name,
                data: { ...item, repo_url: repo_url },
            }),
        );
        return res;
    }
}

export class GitRepoCodeViewPageCtrl
    extends GRouteController
    implements IRouteController
{
    initialized: boolean = false;
    ctrl: SimpleCodeViewCtrl | undefined;
    params: any;
    matches_path(path: string): boolean {
        return path.startsWith("/search/view/");
    }
    get_component(params: any): GComponent {
        this.params = params.params;
        if (!this.ctrl) {
            this.ctrl = new SimpleCodeViewCtrl();
            this.ctrl.setup();
            this.initialized = true;
        }
        let data = RouteWebPageMainCtrl.get_params();
        // let repo = data.
        console.log(data);
        if (!data.data) {
            RouteWebPageMainCtrl.go_back(2);
            return this.ctrl.comp;
        }

        let line = data.data.line;
        this.get_code(data.data).then(
            (code: { help: any; response: { content: string } }) => {
                this.ctrl!.set_code(code.response.content, line);
            },
        );
        return this.ctrl.comp;
    }

    async get_code(data: { repo_url: string; name: string }) {
        let url = add_url(
            this.params["backend-url"],
            "api/github/get_file_content",
        );
        let payload = { repo: data.repo_url, file: data.name };
        console.log(url, payload);
        const response = await backendCall(
            url,
            { repo: data.repo_url, file: data.name },
            this.params["api-key"],
        );
        return response.data;
    }
}

export class GitRepoPageCtrl implements IRouteController {
    ctrl: WebPageWithNav = WebPageWithNavMainCtrl.webPageWithNav();
    private current_path: string = "";
    infos: IApp;
    routes: IRouteController[] = [];
    sub_ctrls: { [key: string]: IRouteController } = {};
    initialized: boolean = false;
    constructor() {
        this.infos = {
            name: "Git Repo",
            href: "/git-repo",
            subtitle: "search in files of git repos",
            params: ["backend-url", "api-key"],
        };
    }
    setup() {
        this.ctrl.comp.s.sidebar.s.header.s.title.update(
            {},
            { click: () => RouteWebPageMainCtrl.navigate(this.infos.href) },
        );
        this.ctrl.comp.s.header.s.title.update(
            {},
            { click: () => RouteWebPageMainCtrl.navigate(this.infos.href) },
        );
        this.ctrl.set_app_name(this.infos.name);
        this.ctrl.sidebar_ctrl.add_menu_item(
            "Manage Repos",
            this.infos.href + "/manage",
        );
        this.ctrl.sidebar_ctrl.add_menu_item(
            "Search in Repos",
            this.infos.href + "/search",
        );
        this.set_up_sub_ctrls();
        this.initialized = true;
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
                this.ctrl.comp.s.mainBody.update({
                    innerHTML: "",
                    child: comp,
                });
                this.ctrl.sidebar_ctrl.select_menu_item(this.infos.href + path);
                return this.ctrl.comp;
            }
        }
        this.ctrl.sidebar_ctrl.select_menu_item(this.infos.href);
        this.ctrl.comp.s.mainBody.update({
            innerHTML: "",
            child: Tools.comp("div", {
                children: [
                    Tools.comp("h1", {
                        textContent: "404 Not Found",
                        class: "text-2xl font-bold",
                    }),
                    Tools.comp("a", {
                        href: "#/",
                        class: "text-blue-500 hover:text-blue-600 flex items-center gap-2",
                        children: [
                            Tools.icon(ArrowLeft, { class: "w-4 h-4" }),
                            Tools.comp("span", {
                                href: "#/",
                                textContent: "Go to Home",
                            }),
                        ],
                    }),
                ],
            }),
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

export class MainCtrl {
    static gitRepoPage() {
        const gitRepoPageCtrl = new GitRepoPageCtrl();
        gitRepoPageCtrl.setup();
        return gitRepoPageCtrl;
    }
}
