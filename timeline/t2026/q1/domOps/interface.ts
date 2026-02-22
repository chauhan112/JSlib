import type { ISComponent } from "../../../globalComps/interface";
import type { IDatamodel } from "../lister/interface";

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
