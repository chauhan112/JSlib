import type { GComponent } from "../../../../../globalComps/GComponent";

export interface ISearchHandler{
    on_search: (words: any[]) => Promise<any[]>;
    parse_chip_value: (value: string) => any;
    set_data: (data: any[]) => void;
}

export interface IDatamodel {
    get_data: () => Promise<any[]>;
}
    
export interface IResultDisplayer {
    display_data: (data: any[]) => void;
}

export interface IFilter {
    get_comp: () => GComponent;
    model: IFilterModel;
    storeLocally(value: boolean): void;
}

export type FilterType = {
    name: string;
    value: any;
}

export interface IFilterModel {
    read_all: () => FilterType[];
    read: (name: string) => FilterType;
    create: (name: string, value: any) => void;
    update: (name: string, value: any) => void;
    delete: (name: string) => void;
}
