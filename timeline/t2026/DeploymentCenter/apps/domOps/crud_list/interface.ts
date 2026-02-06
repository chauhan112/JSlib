import type { GComponent } from "../../../../../globalComps/GComponent";

export type ListItem = {
    title: string;
    id: string;
    original: any;
}

export interface ICRUDModel {
    read_all: () => Promise<ListItem[]>;
    read: (id: string) => Promise<ListItem>;
    create: (data: any) => Promise<ListItem>;
    update: (id: string, data: any) => Promise<ListItem>;
    deleteIt: (id: string) => Promise<void>;
    search: (word: string, case_sensitive: boolean, regex: boolean) => Promise<ListItem[]>;
}

export type InputParams = {
    attrs?: { [key: string]: string };
    handlers?: { [key: string]: (e: any, ls: any) => void };
}

export type SelectParams = {
    options: { value: string; label: string }[];
}

export type TextareaParams = {
    attrs?: { [key: string]: string };
    handlers?: { [key: string]: (e: any, ls: any) => void };
}

export type MultiSelectParams = {
    options: { value: string; label: string }[];
    selected_values: { value: string; label?: string }[];
    placeholder?: string;
}

export type FormField =
    | { type: "Input"; key: string; params: InputParams }
    | { type: "Select"; key: string; params: SelectParams }
    | { type: "Textarea"; key: string; params: TextareaParams }
    | { type: "MultiSelect"; key: string; params: MultiSelectParams };

export interface ICreateFormFields {
    get_fields: () => FormField[];
    get_title: (data: any) => string;
    save: (data: any) => Promise<void>;
    get_form: () => GComponent;
}

export interface IUpdateFormFields {
    get_fields: () => FormField[];
    get_title: (data: any) => string;
    save: (data: any) => Promise<void>;
    get_form: () => GComponent;
}

export interface IViewComponent {
    get_comp: () => GComponent;
    set_data: (data: any) => void;
}

export interface IContextMenuOptions {
    get_options: () => string[];
    more_ops_clicked: (label: string, item: ListItem) => Promise<void>;
    clicked: (data: any) => Promise<void>;
}

export interface IRoute {
    route_to: (path: string, params?: any) => void;
    route_back: () => void;
    define_route: (path: string, componentFunction: () => GComponent) => void;
    match_route: (path: string) => boolean;
    get_matched_route: () => GComponent;
    get_params: () => any;
}

export interface IView {
    set_data: (data: ListItem[]) => void;
    update_one: (data: ListItem) => void;
    delete_one: (id: string) => void;
    create_one: (data: any) => void;
}

export interface CrudListModel {
    model: ICRUDModel;
    createFormFields: ICreateFormFields;
    updateFormFields: IUpdateFormFields;
    contextMenuOptions: IContextMenuOptions;
    view: IView;
    viewComponent: IViewComponent;
    route: IRoute;

    get_page_size: () => number;
}