import type { GComponent } from "../../../globalComps/GComponent";
import { MainCtrl as RouteWebPageMainCtrl } from "../../../t2025/dec/DomainOpsFrontend/route/controller";

export interface IRouteItem {
    path: string;
    root_comp: GComponent;
    onRouted: (params: any) => GComponent;
    display: (comp: GComponent) => void;
}

export interface IRouteTool {
    prev_url: string;
    route_to(route: string, params: any): void;
    route_back(n: number): void;
    relative_route(route: string, params: any): void;
    get_current_url(): string;
}

export class RouteTool implements IRouteTool {
    prev_url = "";
    route_to(route: string, params: any) {
        this.prev_url = globalThis.location.hash;
        RouteWebPageMainCtrl.navigate(route, params);
    }
    route_back(n: number = 1) {
        this.prev_url = globalThis.location.hash;
        RouteWebPageMainCtrl.go_back(n);
    }
    relative_route(route: string, params: any) {
        this.prev_url = globalThis.location.hash;
        RouteWebPageMainCtrl.relative_navigate(route, params);
    }
    get_current_url() {
        return globalThis.location.hash;
    }
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
    route: IRoute;
    setup(): void;
    get_comp(route: string, params: any): GComponent;
    display_component(comp: GComponent): void;
}
