import type { GComponent } from "../../../globalComps/GComponent";

export interface IRouteItem {
    onRouted: (params: any) => GComponent;
    display: (comp: GComponent) => void;
}

export interface IRouteTool {
    get_prev_url(): string;
    route_to(route: string, params?: any): void;
    route_back(n: number): void;
    relative_route(route: string, params?: any): void;
    get_current_url(): string;
}

export interface IRoute {
    tool: IRouteTool;
    matched_route: IRouteItem | null;
    add_route(route: IRouteItem): void;
    remove_route(href: string): void;
    has_route(href: string): boolean;
    get_route_component(): GComponent;
    clear_routes(): void;
    get_path_after_matched(): string;
}

export interface IPage {
    setup(): void;
    get_comp(route: string, params: any): GComponent;
}
