import type { GComponent } from "../../../globalComps/GComponent";
import type { ISComponent } from "../../../globalComps/interface";
import { Tools } from "../../../globalComps/tools";
import {
    type IApp,
    type IRouteController,
    GRouterController,
} from "../../DeploymentCenter/interfaces";
import {
    DirectusTableModel,
    TokenFromLocalStorage,
} from "../lister/data_model";
import type { IDatamodel, ILister, INavigator } from "../lister/interface";
import { Lister } from "../lister/listers";
import { RouteNavigator } from "../lister/navigators";

const SingleExpView = () => {
    return Tools.comp("div", { textContent: "Single Exp View" });
};

export class ExpView implements ISComponent {
    lister: ILister = new Lister();
    model: IDatamodel<any>;
    navigator: INavigator = new RouteNavigator();
    private cur_path: string = "";
    comp: GComponent | null = null;
    constructor() {
        this.model = new DirectusTableModel(
            "raja_tasks",
            new TokenFromLocalStorage("DeploymentCenterSettings"),
        );
        (this.model as DirectusTableModel).columns = ["id", "title"];

        (this.lister as Lister).on_click = (data: any) =>
            this.navigator.navigate("/exp", data);
        this.define_routes();
    }
    define_routes() {
        let nav = this.navigator as RouteNavigator;
        nav.add_route("/exp", SingleExpView());
        nav.add_route("", this._root_path());
    }
    private _root_path() {
        if (this.comp) return this.comp;
        this.comp = this.lister.get_comp();
        this.model.read_all().then((data: any) => this.lister.set_values(data));
        return this.comp;
    }
    get_comp(): GComponent {
        let nav = this.navigator as RouteNavigator;
        let path_to = this.cur_path.trim();
        if (nav.routes[path_to]) return nav.routes[path_to];
        throw new Error("Route not found");
    }
    matches_path(path: string): boolean {
        this.cur_path = path;
        return (this.navigator as RouteNavigator).routes[path] !== undefined;
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
