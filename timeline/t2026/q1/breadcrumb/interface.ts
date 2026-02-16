import type { GComponent } from "../../../globalComps/GComponent";
import type { ISComponent } from "../../../globalComps/interface";

export interface IBreadcrumbItem {
    name: string;
    value: string | number;
}

export interface IHandler {
    get_breadcrumb_items: () => IBreadcrumbItem[];
    get_component_for_item: (item: IBreadcrumbItem) => GComponent;
}

export interface IDisplayer {
    display_breadcrumb: (items: IBreadcrumbItem[]) => void;
    display_item: (comp: GComponent) => void;
}

export interface IBreadcrumbComp extends ISComponent {
    set_values(items: IBreadcrumbItem[]): void;
    on_click(item: IBreadcrumbItem): void;
}
