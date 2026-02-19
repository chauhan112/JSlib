import type { IconNode } from "lucide";
import type { ISComponent } from "../../../globalComps/interface";
import type { GComponent } from "../../../globalComps/GComponent";

export interface IGroupComponent extends ISComponent {
    set_name(name: string): void;
    set_icon(icon: IconNode): void;
}

export interface IElement {
    get_element(): HTMLElement;
}

export interface IComponent extends IElement {
    set_attrs(attrs: { [key: string]: any }): void;
    set_events(events: { [key: string]: any }): void;
}

export interface ISubComponentable<T> {
    get_subcomponents(): T;
}

export interface IContainer {
    display(comp: GComponent): void;
}

export type LabelValueItem = { label: string; value: string };
export interface IBreadcrumb extends IComponent {
    set_items(items: LabelValueItem[]): void;
    on_clicked(item: LabelValueItem): void;
}

export interface ITreeComponent extends IElement {
    set_items(folders: LabelValueItem[], files: LabelValueItem[]): void;
    on_folder_clicked(folder: LabelValueItem): void;
    on_file_clicked(file: LabelValueItem): void;
}

export interface ILister extends IElement {
    set_items(items: any[]): void;
    list_item_creator(item: any): IComponent;
}

export interface ITreeModel {
    list_dir(): Promise<{ folders: any[]; files: any[] }>;
    cd(folder: any): Promise<void>;
    goto_root(): Promise<void>;
    goback(): Promise<void>;
    get_location(): Promise<any[]>;
    goto_location(location: any[]): Promise<void>;
}
