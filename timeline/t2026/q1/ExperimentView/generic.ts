import type { GComponent } from "../../../globalComps/GComponent";
import { DirectusModel } from "../directus/model";
import { type ITableCrud } from "./interface";

export class TableCrud implements ITableCrud {
    contextMenus: string[] = ["Edit", "Delete"];
    tableName: string = "raja_experiments";
    create_on: boolean = true;
    filter_on: boolean = false;
    model = new DirectusModel();
    async read_all() {
        return await this._read_all([]);
    }
    private async _read_all(cols: string[]) {
        if (!this.model.token) return [];
        const data = await this.model.get_all(this.tableName, cols);
        return data.data.map((item: any) => ({
            title: item.title,
            id: item.id,
            original: item,
        }));
    }
    async read_all_for_search() {
        return await this._read_all([]);
    }

    get_create_view(): GComponent | null {
        return null;
    }
    async read(id: string) {
        if (!this.model.token) throw new Error("No token");
        const data = await this.model.get_by_id(this.tableName, id);
        return {
            title: data.data.title,
            id: data.data.id,
            original: data.data,
        };
    }
}
