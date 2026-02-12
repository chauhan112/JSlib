import type { GComponent } from "../../../globalComps/GComponent";
import { MainCtrl as RouteWebPageMainCtrl } from "../../../t2025/dec/DomainOpsFrontend/route/controller";

export interface IRouteItem {
    path: string;
    onRouted: (params: any) => GComponent
}

export interface IRouteTool{
    route_to(route: string, params: any): void
    route_back(n: number): void
    relative_route(route: string, params: any): void
    get_current_url(): string
}

export class RouteTool implements IRouteTool{
    route_to(route: string, params: any){
        RouteWebPageMainCtrl.navigate(route, params);
    }
    route_back(n: number = 1){
        RouteWebPageMainCtrl.go_back(n);
    }
    relative_route(route: string, params: any){
        RouteWebPageMainCtrl.relative_navigate(route, params);
    }
    get_current_url(){ 
        return globalThis.location.hash
    }
}

export interface IRoute{
    tool: IRouteTool;
    matched_route: IRouteItem | null;
    add_route(route: IRouteItem): void;
    remove_route(route: IRouteItem): void;
    has_route(route: IRouteItem): boolean;
    get_route_component(): GComponent | null;
    clear_routes(): void;
    get_path_after_matched(): string;
}

export interface IPage{
    route: IRoute;
    root_comp: GComponent;
    setup(): void
    get_component(route: string, params: any): GComponent
    display_component(comp: GComponent): void
}

