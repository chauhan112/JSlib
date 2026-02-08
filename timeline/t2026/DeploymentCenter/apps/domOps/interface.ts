import type { GComponent } from "../../../../globalComps/GComponent";
import type { SideBarItem } from "./webPageWithNav/interface";



export interface IDomOps {
    app_name: string;
    footer_text: string;
    get_dom_component: (activity_id: string | null) => GComponent;
    get_operation_component: (activity_id: string | null) => GComponent;
    get_activity_component: (activity_id: string | null) => GComponent;
    get_breadcrumb: (activity_id: string | null) => GComponent;
}

export const NAVS: SideBarItem[] = [
    {label: "Domains", relative_route_path: "/domains"}, 
    {label: "Operations", relative_route_path: "/operations"}, 
    {label: "Activity", relative_route_path: "/activity"}, 
] as const;