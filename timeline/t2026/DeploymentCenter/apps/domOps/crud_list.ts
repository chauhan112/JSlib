import type { GComponent } from "../../../../globalComps/GComponent";

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

export type FormFields = {
    type: string;
    key: string;
    params: any;
}

export interface ICreateFormFields {
    get_fields: () => FormFields[];
    get_title: (data: any) => string;
    save: (data: any) => Promise<void>;
}

export interface IUpdateFormFields {
    get_fields: () => FormFields[];
    get_title: (data: any) => string;
    save: (data: any) => Promise<void>;
}

export interface IContextMenuOptions {
    get_options: () => string[];
    clicked: (label: string, data: any) => void;
}

export interface IRoute {
    route_to: (path: string) => void;
    route_back: () => void;
}

export interface IView {
    display_on_body: (comps: GComponent[]) => void;
}

export class CrudList {
    model: ICRUDModel;
    
}