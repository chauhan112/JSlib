import type { GComponent } from "../../../globalComps/GComponent";
import type {
    FormField,
    ListItem,
} from "../../DeploymentCenter/apps/domOps/crud_list/interface";
import type { DirectusModel } from "../directus/model";

export interface ITableCrud {
    contextMenus: string[];
    tableName: string;
    create_on: boolean;
    filter_on: boolean;
    model: DirectusModel;
    create_fields: FormField[];
    update_fields: FormField[];
    page_size: number;
    read_all(): Promise<ListItem[]>;
    read_all_for_search(): Promise<any[]>;
    get_create_view(): GComponent | null;
    read(id: string): Promise<ListItem>;
    clicked(data: any): Promise<void>;
    create(data: any): Promise<ListItem>;
    update(id: string, data: any): Promise<ListItem>;
    deleteIt(id: string): Promise<void>;
}
