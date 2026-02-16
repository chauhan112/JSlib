import { CrudList } from "../../../DeploymentCenter/apps/domOps/crud_list";
import {
    type IRouteController,
    type IApp,
    GRouterController,
} from "../../../DeploymentCenter/interfaces";
import type { GComponent } from "../../../../globalComps/GComponent";
import type { ITableCrud } from "./interface";
import { TableCrud } from "./generic";
import type { IRoute } from "../../WebPageWithRoutes/interface";
import { GRoute } from "../../WebPageWithRoutes/generic";

export class DirectusTableCrud
    extends GRouterController
    implements IRouteController
{
    route: IRoute = new GRoute();
    crud = new CrudList();
    initialized: boolean = false;
    info: IApp = {
        name: "Exp-View-Old",
        href: "/exp-view-old",
        subtitle: "made using crud list",
        params: ["directus-url", "directus-token"],
    };
    inp: ITableCrud = new TableCrud(this.crud);
    fetched: boolean = false;
    private selected_router: IRoute | CrudList | null = null;

    setup() {
        this.crud.base_path = "";
        this.crud.model.model.read_all = this.inp.read_all.bind(this.inp);
        this.crud.model.searchCtrl.search.data.get_data =
            this.inp.read_all_for_search.bind(this.inp);
        this.crud.model.model.read = this.inp.read.bind(this.inp);
        this.crud.model.searchCtrl.search.active_comp.create =
            this.inp.create_on;
        this.crud.model.searchCtrl.search.active_comp.filter =
            this.inp.filter_on;
        this.crud.model.contextMenuOptions.get_options = () =>
            this.inp.contextMenus;
        this.crud.model.contextMenuOptions.clicked =
            this.inp.clicked.bind(this);
        this.crud.model.createFormFields.fields = this.inp.create_fields;
        this.crud.model.updateFormFields.fields = this.inp.update_fields;
        this.crud.model.model.create = this.inp.create.bind(this.inp);
        this.crud.model.model.update = this.inp.update.bind(this.inp);
        this.crud.model.model.deleteIt = this.inp.deleteIt.bind(this.inp);
        this.crud.model.get_page_size = () => this.inp.page_size;
        this.crud.setup();
        this.initialized = true;
    }
    matches_path(path: string): boolean {
        let after = path.slice(this.info.href.length).trim();
        if (!this.initialized) this.setup();
        if (path.startsWith(this.info.href)) {
            if (this.route.has_route(after)) {
                this.selected_router = this.route;
                return true;
            } else if (this.crud.matches_path(after)) {
                this.selected_router = this.crud;
                return true;
            }
        }
        return false;
    }

    get_component(params: any): GComponent {
        if (!this.fetched) {
            let url = params["directus-url"];
            let token = params["directus-token"];
            if (url && url.endsWith("/")) url = url.slice(0, -1);
            this.inp.model.set_url_and_token(url, token);
            this.crud.fetch_data_and_update();
            this.fetched = true;
        }
        if (this.selected_router) {
            if (this.selected_router === this.crud)
                return this.crud.get_component(params);
            return (this.selected_router as IRoute).get_route_component();
        }
        throw new Error("Route not found");
    }
}
