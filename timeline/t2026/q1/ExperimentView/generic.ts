import type { GComponent } from "../../../globalComps/GComponent";
import type { CrudList } from "../../DeploymentCenter/apps/domOps/crud_list";
import type {
    FormField,
    ListItem,
} from "../../DeploymentCenter/apps/domOps/crud_list/interface";
import { DirectusModel } from "../directus/model";
import { type ITableCrud } from "./interface";

export class TableCrud implements ITableCrud {
    contextMenus: string[] = ["Edit", "Delete"];
    tableName: string = "raja_analysis";
    create_on: boolean = true;
    filter_on: boolean = false;
    model = new DirectusModel();
    crud: CrudList;
    page_size: number = 20;
    read_all_fields: string[] = [
        "id",
        "topic",
        "final_position",
        "content",
        "location",
    ];
    search_fields: string[] = [];
    create_fields: FormField[] = [
        {
            type: "Input",
            key: "title",
            params: { attrs: { placeholder: "Title" } },
        },
        {
            type: "Textarea",
            key: "description",
            params: { attrs: { placeholder: "Description" } },
        },
    ];
    update_fields: FormField[] = [
        {
            type: "Input",
            key: "title",
            params: { attrs: { placeholder: "Title" } },
        },

        {
            type: "Textarea",
            key: "description",
            params: { attrs: { placeholder: "Description" } },
        },
    ];
    constructor(crud: CrudList) {
        this.crud = crud;
    }
    async read_all() {
        return await this._read_all(this.read_all_fields);
    }
    private async _read_all(cols: string[]) {
        if (!this.model.token) return [];
        const data = await this.model.get_all(this.tableName, cols);
        return data.data.map((item: any) =>
            this.convert_any_data_to_list_item(item),
        );
    }
    async read_all_for_search() {
        return await this._read_all(this.search_fields);
    }
    get_create_view(): GComponent | null {
        return null;
    }
    async read(id: string) {
        if (!this.model.token) throw new Error("No token");
        const data = await this.model.get_by_id(this.tableName, id);
        return this.convert_any_data_to_list_item(data.data);
    }
    async clicked(data: any) {
        this.crud.model.route.route_to("/view", { data: data });
    }
    async create(data: any) {
        if (!this.model.token) throw new Error("No token");
        console.log("create", data);
        const resp = await this.model.create(this.tableName, data);
        return this.convert_any_data_to_list_item(resp.data);
    }
    async update(id: string, data: any) {
        if (!this.model.token) throw new Error("No token");
        const resp = await this.model.update(this.tableName, id, data);
        return this.convert_any_data_to_list_item(resp.data);
    }
    async deleteIt(id: string) {
        if (!this.model.token) throw new Error("No token");
        await this.model.delete(this.tableName, id);
    }
    convert_any_data_to_list_item(data: any) {
        return {
            title: data.topic,
            id: data.id,
            original: data,
        } as ListItem;
    }
}
