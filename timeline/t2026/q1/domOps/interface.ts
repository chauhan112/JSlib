import type { GComponent } from "../../../globalComps/GComponent";
import type { ISComponent } from "../../../globalComps/interface";
import type { IViewComponent } from "../../DeploymentCenter/apps/domOps/crud_list/interface";
import type { IDynamicFormGenerator } from "../dynamicFormGenerator/interface";
import type { IFilterParser } from "../filterComp/interface";
import type { IDatamodel, ILister } from "../lister/interface";

export type Domain = {
    name: string;
    id: string;
    parentId: string | null;
};
export type Operation = Domain;
export type Activity = {
    name: string;
    id: string;
    doms: Domain[];
    op: Operation;
};
export type StructureItem = {
    key: string;
    type: string;
    value: any;
    order: number;
    defaultValue?: any;
};
export type FilterItem = {
    label: string;
    value: any;
    parent: string;
    id: string;
};

export interface IDomOpsModel {
    get_domain_model(): IDatamodel<Domain>;
    get_operation_model(): IDatamodel<Operation>;
    get_activity_model(): IDatamodel<Activity>;
    get_structure_model(): IDatamodel<StructureItem>;
    get_logger_data_model(): IDatamodel<any>;
    get_filter_model(): IDatamodel<FilterItem>;
}

export interface IComponentPage<T> extends ISComponent {
    set_data(data: T[]): void;
    set_parent(parent: string): void;
}
export interface IUILister extends ILister {
    update_component(data_id: string, data: any): void;
    remove_item_component(data_id: string): void;
}
export interface ISearcher extends IFilterParser {
    search(words: any[], data: any[]): Promise<any[]>;
}
export interface IForm extends ISComponent {
    on_saved: (data: any) => void;
}

export interface IFilterSelector {
    set_selected_filter(filter: FilterItem): void;
    get_selected_filter(): FilterItem | null;
}
export interface IAdvanceListerModel {
    get_filter_model(): IDatamodel<FilterItem>;
    get_create_form(): IDynamicFormGenerator;
    get_create_form(): IDynamicFormGenerator;
    get_update_form(): IDynamicFormGenerator;
    get_data_model(): IDatamodel<any>;
    get_view_comp(): IViewComponent;
    get_searcher(): ISearcher;
    get_filter_selector_model(): IFilterSelector;
}
export interface IComponentTools {
    hide(comp: GComponent): void;
    show(comp: GComponent): void;
}

export interface IClickable extends ISComponent {
    on_clicked: () => void;
}
