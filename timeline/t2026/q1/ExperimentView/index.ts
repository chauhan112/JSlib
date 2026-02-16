import type { GComponent } from "../../../globalComps/GComponent";
import type { ISComponent } from "../../../globalComps/interface";
import { Tools } from "../../../globalComps/tools";
import {
    type IApp,
    type IRouteController,
    GRouterController,
} from "../../DeploymentCenter/interfaces";
import type { IBreadcrumbItem } from "../breadcrumb/interface";
import {
    DirectusTableModel,
    TokenFromLocalStorage,
} from "../lister/data_model";
import type { IDatamodel, ILister, INavigator } from "../lister/interface";
import { Lister } from "../lister/listers";
import { RouteNavigator } from "../lister/navigators";
import type { IWebPage } from "../WebPageWithRoutes/interface";
import {
    SimpleWebPage,
    WebPageWithBreadcrumb,
} from "../WebPageWithRoutes/webpages";

const SingleExpView = () => {
    return Tools.comp("div", { textContent: "Single Exp View" });
};

export class ExpView implements ISComponent {
    lister: ILister = new Lister();
    model: IDatamodel<any>;
    navigator: INavigator = new RouteNavigator();
    private cur_path: string = "";
    comp: GComponent | null = null;
    page: IWebPage = new WebPageWithBreadcrumb();
    exp_ops_list: ILister = new Lister();
    exp_ops = ["logs", "analysis", "view", "edit"];
    table_name = "raja_experiments";
    constructor() {
        this.model = new DirectusTableModel(
            this.table_name,
            new TokenFromLocalStorage("DeploymentCenterSettings"),
        );
        (this.model as DirectusTableModel).columns = ["id", "title"];
        let page = this.page as WebPageWithBreadcrumb;
        (this.lister as Lister).on_click = (data: any) => {
            this.navigator.navigate("/exp", data);
            page.go_to({
                name: "exp-" + data.id,
                value: data.id,
            });
        };
        page.breadcrumb.on_click = (item: any) =>
            this.on_breadcrumb_item_click(item);
        this.exp_ops_list.set_values(this.exp_ops.map((op) => ({ title: op })));
        (this.exp_ops_list as Lister).on_click = this.on_ops_clicked.bind(this);
        this.define_routes();
    }

    private on_ops_clicked(item: any) {
        (this.navigator as RouteNavigator).abs_route("/exp/" + item.title);
    }
    define_routes() {
        let nav = this.navigator as RouteNavigator;
        nav.add_route("/exp", this.route_to_exp.bind(this));
        nav.add_route("", this.route_to_root.bind(this));
    }

    private route_to_exp() {
        this.page.get_body().display(this.exp_ops_list.get_comp());
        return this._root_path();
    }

    private route_to_root() {
        let page = this.page as WebPageWithBreadcrumb;
        page.set_breadcrumb([{ name: "exps", value: "/exp-view" }]);
        this.page.get_body().display(this.lister.get_comp());
        return this._root_path();
    }

    private on_breadcrumb_item_click(item: IBreadcrumbItem) {
        (this.navigator as RouteNavigator).abs_route(item.value as string);
    }

    private _root_path() {
        if (this.comp) return this.comp;
        let page = this.page as WebPageWithBreadcrumb;
        this.comp = page.get_comp();
        page.set_title("Experiment View");
        (page.comp.s.body as GComponent)
            .getElement()
            .classList.remove("max-w-7xl");
        this.model.read_all().then((data: any) => this.lister.set_values(data));
        return this.comp;
    }

    get_comp(): GComponent {
        let nav = this.navigator as RouteNavigator;
        let path_to = this.cur_path.trim();
        if (nav.routes[path_to]) return nav.routes[path_to]();
        throw new Error("Route not found");
    }

    matches_path(path: string): boolean {
        this.cur_path = path;
        if ((this.navigator as RouteNavigator).routes[path]) return true;
        return false;
    }
}

export class ExpViewPage extends GRouterController {
    info: IApp = {
        name: "Exp-View",
        href: "/exp-view",
        subtitle: "new-interface-way",
        params: [],
    };
    exp_view: ExpView = new ExpView();
    initialized: boolean = true;

    get_component(params: any): GComponent {
        return this.exp_view.get_comp();
    }

    matches_path(path: string): boolean {
        let remPath = path.slice(this.info.href.length).trim();
        return (
            path.startsWith(this.info.href) &&
            this.exp_view.matches_path(remPath)
        );
    }
}
