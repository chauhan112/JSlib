import { CrudList } from "../../../t2026/DeploymentCenter/apps/domOps/crud_list";
import type {
    IRouteController,
    IApp,
} from "../../../t2026/DeploymentCenter/interfaces";
import type { GComponent } from "../../../globalComps/GComponent";
import { DirectusModel } from "../directus/model";
import { GenericCrudModel } from "../../DeploymentCenter/apps/domOps/crud_list/generic_interface";
export class AIChatModel extends GenericCrudModel {
    model = new DirectusModel();
    tableName = "ai_chats";
    async read_all() {
        if (!this.model.token) return [];
        const data = await this.model.get_all(this.tableName);
        this.data = data.data;
        return this.data.map((item: any) => ({
            title: item.title,
            id: item.id,
            original: item,
        }));
    }
    async read(id: string) {
        if (!this.model.token) throw new Error("No token");
        console.log(id);
        const data = await this.model.get_by_id(this.tableName, id);
        return {
            title: data.data.title,
            id: data.data.id,
            original: data.data,
        };
    }
}

export class AIChats implements IRouteController {
    crud = new CrudList();
    initialized: boolean = false;
    infos: IApp = {
        name: "AIChats",
        href: "/ai-chats",
        subtitle: "conv with ai",
        params: ["directus-url", "directus-token"],
    };

    model = new AIChatModel();
    setup() {
        this.crud.model.model = this.model;
        this.crud.model.searchCtrl.search.active_comp.create = false;
        this.crud.model.searchCtrl.search.active_comp.filter = false;
        this.crud.model.contextMenuOptions.get_options = () => [];
        this.crud.setup();
    }
    matches_path(path: string): boolean {
        return path === this.infos.href;
    }

    get_component(params: any): GComponent {
        if (!this.initialized) {
            let url = params["directus-url"];
            let token = params["directus-token"];
            if (url.endsWith("/")) url = url.slice(0, -1);
            this.model.model.set_url_and_token(url, token);
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
