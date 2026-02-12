import { CrudList } from "../../../t2026/DeploymentCenter/apps/domOps/crud_list";
import type {
    IRouteController,
    IApp,
} from "../../../t2026/DeploymentCenter/interfaces";
import type { GComponent } from "../../../globalComps/GComponent";
import type { ITableCrud } from "./interface";
import { TableCrud } from "./generic";

export class DirectusTableCrud implements IRouteController {
    crud = new CrudList();
    initialized: boolean = false;
    infos: IApp = {
        name: "TableCrud",
        href: "/table-crud",
        subtitle: "crud table",
        params: ["directus-url", "directus-token"],
    };
    inp: ITableCrud = new TableCrud();

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
        this.crud.setup();
    }
    matches_path(path: string): boolean {
        let after = path.slice(this.infos.href.length).trim();
        if (!this.initialized) this.setup();
        console.log(after);
        return (
            path.startsWith(this.infos.href) && this.crud.matches_path(after)
        );
    }

    get_component(params: any): GComponent {
        if (!this.initialized) {
            let url = params["directus-url"];
            let token = params["directus-token"];
            if (url && url.endsWith("/")) url = url.slice(0, -1);

            this.inp.model.set_url_and_token(url, token);
            this.initialized = true;
            this.crud.fetch_data_and_update();
        }
        return this.crud.comp;
    }
    set_info(info: IApp): void {
        this.infos = info;
    }
    get_info(): IApp {
        return this.infos;
    }
}
