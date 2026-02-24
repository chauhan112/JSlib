import type { GComponent } from "../../../globalComps/GComponent";
import type { ISComponent } from "../../../globalComps/interface";
import {
    type IApp,
    GRouterController,
} from "../../DeploymentCenter/interfaces";
import {
    DirectusTableModel,
    TokenFromLocalStorage,
} from "../lister/data_model";
import type { IDatamodel, ILister } from "../lister/interface";
import { Lister } from "../lister/listers/simple";
import { SimpleRouter } from "../lister/navigators";
import { ClickableHeader } from "../WebPageWithRoutes/headers";
import type { IWebPage } from "../WebPageWithRoutes/interface";
import { SimpleWebPage } from "../WebPageWithRoutes/webpages";
import { LogsPage } from "./logsPage";

const ROOT_URL = "/exp-view";
const ROOT_TITLE = "Experiment View";
export class ExpView implements ISComponent {
    lister: ILister = new Lister();
    model: IDatamodel<any>;
    private path_comp: GComponent | null = null;
    comp: GComponent | null = null;
    page: IWebPage = new SimpleWebPage();
    navigator: SimpleRouter = new SimpleRouter();
    exp_ops_list: ILister = new Lister();
    exp_ops = ["logs", "analysis", "view", "edit"];
    table_name = "raja_experiments";
    header: ClickableHeader = new ClickableHeader();
    logPage: LogsPage = new LogsPage();
    private page_setup_done = false;
    constructor() {
        this.model = new DirectusTableModel(
            this.table_name,
            new TokenFromLocalStorage("DeploymentCenterSettings"),
        );
        (this.model as DirectusTableModel).columns = ["id", "title"];

        (this.lister as Lister).on_click = (data: any) => {
            this.navigator.relative_route("/exp/" + data.id, data);
        };

        this.exp_ops_list.set_values(this.exp_ops.map((op) => ({ title: op })));
        (this.exp_ops_list as Lister).on_click = (item: any) => {
            this.navigator.relative_route(item.title);
        };
        this.logPage.set_web_page(this.page);
        this.logPage.set_header_setup(this.page_setup.bind(this));
        this.define_routes();
    }

    define_routes() {
        this.navigator.add_path("/exp/{exp_id}", this.route_to_exp.bind(this));
        this.navigator.add_path("", this.route_to_root.bind(this));
        this.navigator.add_router("/exp/{exp_id}/logs", this.logPage);
    }

    private route_to_exp(params: any) {
        let cur_params = this.navigator.get_current_params();
        if (cur_params) this.header.set_title(cur_params.title);
        else
            this.model.read(params.exp_id).then((data: any) => {
                this.header.set_title(data.title);
            });
        this.page.get_body().display(this.exp_ops_list.get_comp());
        return this._root_path();
    }

    private route_to_root() {
        this.header.set_title(ROOT_TITLE);
        this.page.get_body().display(this.lister.get_comp());
        return this._root_path();
    }

    page_setup() {
        if (this.page_setup_done) return;
        this.page_setup_done = true;
        this.page.get_header().display(this.header.get_comp());
        this.header.set_title(ROOT_TITLE);
        this.header.on_click = () => this.navigator.abs_route(ROOT_URL);
        this.page
            .get_body()
            .get_comp()
            .getElement()
            .classList.remove("max-w-7xl");
    }

    private _root_path(): GComponent {
        if (this.comp) return this.comp;
        this.comp = this.page.get_comp();
        this.page_setup();
        this.model.read_all().then((data: any) => this.lister.set_values(data));
        return this.comp;
    }

    get_comp(): GComponent {
        if (this.path_comp) {
            let comp = this.path_comp as GComponent;
            this.path_comp = null;
            return comp;
        }
        throw new Error("comp not found");
    }

    matches_path(path: string): boolean {
        this.path_comp = this.navigator.get_element(path);
        if (this.path_comp) return true;
        return false;
    }
}

export class ExpViewPage extends GRouterController {
    info: IApp = {
        name: "Exp-View",
        href: ROOT_URL,
        subtitle: "new-interface-way",
        params: [],
    };
    exp_view: ExpView | null = null;
    initialized: boolean = false;

    get_component(params: any): GComponent {
        return this.get_exp_view().get_comp();
    }

    setup() {
        this.exp_view = new ExpView();
        this.initialized = true;
    }
    get_exp_view(): ExpView {
        if (!this.initialized) this.setup();
        return this.exp_view!;
    }
    matches_path(path: string): boolean {
        let remPath = path.slice(this.info.href.length).trim();
        return (
            path.startsWith(this.info.href) &&
            this.get_exp_view()!.matches_path(remPath)
        );
    }
}
