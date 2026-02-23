import type { ISComponent } from "../../../globalComps/interface";
import type { IDatamodel } from "../lister/interface";

export type FilterItem = {
    label: string;
    value: any;
    id: string;
};

export interface IFilterModel extends IDatamodel<FilterItem> {}

export interface IFilterMiniComponent extends ISComponent {
    on_filter_change(filter: FilterItem): Promise<void>;
    get_selected_filter(): FilterItem;
    set_filters(filters: FilterItem[]): void;
}
export interface IFilterParser {
    parse_chip_value(value: string): any;
    unparse_chip_value(value: any): string;
}
