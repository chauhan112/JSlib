import type { GComponent } from "../../../globalComps/GComponent";
import type { INavigator } from "./interface";

export class RouteNavigator implements INavigator {
    routes: { [key: string]: () => GComponent } = {};
    prev_url = "";
    params: { [key: string]: any } = {};
    add_route(route: string, comp_func: () => GComponent) {
        if (this.routes[route]) throw new Error("Route already exists");
        this.routes[route] = comp_func;
    }

    delete_route(route: string) {
        if (!this.routes[route]) throw new Error("Route not found");
        delete this.routes[route];
    }

    navigate(route: string, params?: any): void {
        this.prev_url = this.get_current_url();
        let newRoute = this.get_next_route(route);
        if (params) this.params[newRoute] = params;
        globalThis.location.hash = newRoute;
    }

    get_current_url(): string {
        return globalThis.location.hash;
    }

    get_next_route(path: string) {
        let new_path = path;
        if (path.startsWith("/")) {
            new_path = path.slice(1);
        }
        let curRoute = this.get_current_url();
        if (curRoute.endsWith("/")) {
            curRoute += new_path;
        } else {
            curRoute += "/" + new_path;
        }
        return curRoute;
    }

    abs_route(route: string) {
        let nro = route;
        if (!nro.startsWith("/")) nro = "/" + nro;
        globalThis.location.hash = nro;
    }
    get_param_for_route(abs_route: string) {
        if (!this.params[abs_route]) return {};
        return this.params[abs_route];
    }
}
