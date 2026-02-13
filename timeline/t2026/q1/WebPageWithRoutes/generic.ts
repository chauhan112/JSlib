import { GComponent } from "../../../globalComps/GComponent";
import {
    RouteTool,
    type IPage,
    type IRoute,
    type IRouteItem,
} from "./interface";
import { Tools } from "../../../globalComps/tools";

export class GRoute implements IRoute {
    routes: IRouteItem[] = [];
    matched_route: IRouteItem | null = null;
    tool = new RouteTool();
    add_route(route: IRouteItem): void {
        for (let r of this.routes) {
            if (r.path === route.path) {
                throw new Error("Route already exists");
            }
        }
        this.routes.push(route);
    }
    remove_route(href: string): void {
        this.routes = this.routes.filter((r) => r.path !== href);
    }
    has_route(href: string): boolean {
        for (let r of this.routes) {
            if (r.path === href) {
                this.matched_route = r;
                return true;
            }
        }
        return false;
    }
    get_route_component(): GComponent {
        if (this.matched_route) {
            return this.matched_route.onRouted({});
        }
        throw new Error("Route not found");
    }
    clear_routes(): void {
        this.routes = [];
    }
    get_path_after_matched(): string {
        return "";
    }
    route_to(route: string, params: any): void {
        throw new Error("Method not implemented.");
    }
}

export class WebPageWithRoutes implements IPage {
    route = new GRoute();
    root_comp: GComponent;
    constructor() {
        this.root_comp = Tools.comp("div", {
            class: "flex flex-col gap-4",
        });
    }
    setup() {
        this.route.add_route({
            path: "/",
            onRouted: () => this.root_comp,
            display: () => {},
            root_comp: this.root_comp,
        });
    }
    get_comp(route: string, params: any): GComponent {
        return this.root_comp;
    }
    display_component(comp: GComponent): void {
        throw new Error("Method not implemented.");
    }
}

export class RouteTools {
    static parse_route(path: string): { path: string; params: any } {
        return { path: path, params: {} };
    }
}
