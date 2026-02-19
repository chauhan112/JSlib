import type { ISComponent } from "../../../globalComps/interface";

export type FilterItem = {
    label: string;
    value: string;
};

export interface IFilterModel {
    read_all(): Promise<any[]>;
    apply_filter(filter: FilterItem): Promise<any>;
}

export interface IFilterMiniComponent extends ISComponent {
    on_filter_change(filter: FilterItem): Promise<void>;
    get_selected_filter(): FilterItem;
    set_filters(filters: FilterItem[]): void;
}
