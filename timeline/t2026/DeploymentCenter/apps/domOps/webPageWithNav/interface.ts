import type { GComponent } from "../../../../../globalComps/GComponent";

export type SideBarItem = {
    label: string;
    relative_route_path: string;
}

export interface ISidebar{
    get_items: () => SideBarItem[];
}

export type {IRoute} from "../crud_list/interface";

export interface IInfoShow{
    info: (msg: string) => void;
    error: (msg: string) => void;
    warning: (msg: string) => void;
    success: (msg: string) => void;
}

export interface IView {
    display_on_body: (comps: GComponent[]) => void;
    show_on_modal: (comp: GComponent) => void;
    get_footer_text: () => string;
    get_title: () => string;
    on_title_clicked: (title: string) => void;
}
