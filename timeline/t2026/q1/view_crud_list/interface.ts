import { type ISearchView } from "./searchComp";
import { GComponent } from "../../../globalComps/GComponent";
import type { ICRUDModel } from "../../DeploymentCenter/apps/domOps/crud_list/interface";
import type { IRoute } from "../WebPageWithRoutes/interface";

export interface IComponent {
    get_comp(): GComponent;
    setup(): void;
}

export interface IListModel {
    contextMenus: string[];
    data: any;
    on_click: (data: any) => void;
    on_menu_clicked: (label: string) => void;
}
export interface IListItem extends IComponent {
    model: IListModel;
    label: string;
}

export interface IPagination extends IComponent {
    current_page: number;
    total: number;
    page_size: number;
    goto(page: number): void;
    update_for_page(page: number): void;
    update_ui(): void;
    set_total(total: number): void;
}

export interface IListDisplayer extends IComponent {
    pagination: IPagination;
    list: IListItem[];
    component_creator(label: string, data: any): IListItem;
    update_list(): void;
}

export interface IView extends IComponent {
    searchComp: ISearchView;
    lister: IListDisplayer;
    model: ICRUDModel;
    route: IRoute;
}
