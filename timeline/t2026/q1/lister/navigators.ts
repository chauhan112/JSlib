import type { GComponent } from "../../../globalComps/GComponent";
import { GenericModal } from "../../../globalComps/GlobalStates/Modal";
import { StringTool } from "../../../t2025/may/FileSearch/tools";
import type { INavigator, IRouter, IRouterPath } from "./interface";

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

export class ArrayMatcher {
    is_var(str: string) {
        return str.startsWith("{") && str.endsWith("}");
    }
    get_var_name(str: string) {
        return str.slice(1, -1);
    }
    single_matches(pattern: string, value: string) {
        if (this.is_var(pattern)) return true;
        return pattern === value;
    }
    startsWith(patterns: string[], values: string[]) {
        for (let i = 0; i < patterns.length; i++) {
            if (!this.single_matches(patterns[i], values[i])) return false;
        }
        return true;
    }
    get_params(pattern: string[], value: string[]) {
        if (!this.matches(pattern, value)) throw new Error("Not matched");
        let params: { [key: string]: string } = {};
        for (let i = 0; i < pattern.length; i++) {
            if (this.is_var(pattern[i])) {
                params[this.get_var_name(pattern[i])] = value[i];
            }
        }
        return params;
    }
    split(str: string, to_remove: string[] = ["/", "#", "/"]) {
        for (let i = 0; i < to_remove.length; i++) {
            str = StringTool.strip(str, to_remove[i]);
        }
        return str.split("/").filter((s) => s !== "");
    }
    separate_matched_unmatched(pattern: string[], value: string[]) {
        if (value.length < pattern.length)
            throw new Error(
                "can't match because value is shorter than pattern",
            );

        let matched: string[] = [];
        let unmatched: string[] = [];

        for (let i = 0; i < pattern.length; i++) {
            if (this.single_matches(pattern[i], value[i]))
                matched.push(value[i]);
            else throw new Error("Not matched. Make sure the pattern matches");
        }
        for (let i = pattern.length; i < value.length; i++) {
            unmatched.push(value[i]);
        }
        return { matched, unmatched };
    }
    matches(pattern: string[], value: string[]) {
        if (pattern.length !== value.length) return false;
        for (let i = 0; i < pattern.length; i++) {
            if (!this.single_matches(pattern[i], value[i])) return false;
        }
        return true;
    }
    string_matches_and_parse(pattern: string, value: string) {
        let pat = this.split(pattern);
        let val = this.split(value);
        if (!this.matches(pat, val)) return null;
        return this.get_params(pat, val);
    }
    string_starts_with_and_parse(pattern: string, value: string) {
        let pat = this.split(pattern);
        let val = this.split(value);
        if (!this.startsWith(pat, val)) return null;

        let { matched, unmatched } = this.separate_matched_unmatched(pat, val);
        let params = this.get_params(pat, matched);
        return { params, remaining: unmatched.join("/") };
    }
}

export class SimpleRouter implements IRouterPath {
    comps: { [key: string]: (params: any) => GComponent } = {};
    prev_url = "";
    params: { [key: string]: any } = {};
    routers: { [key: string]: IRouter } = {};
    array_tools: ArrayMatcher = new ArrayMatcher();
    get_element(path: string, params?: any): GComponent | null {
        for (const key in this.comps) {
            let res = this.array_tools.string_matches_and_parse(key, path);
            if (res)
                return this.comps[key](params ? { ...res, ...params } : res);
        }
        for (const key in this.routers) {
            let res = this.array_tools.string_starts_with_and_parse(key, path);
            if (res)
                return this.routers[key].get_element(res.remaining, res.params);
        }
        return null;
    }

    add_path(path: string, comp_func: (params: any) => GComponent) {
        this.comps[path] = comp_func;
    }

    relative_route(route: string, params?: any) {
        this.prev_url = this.get_current_url();
        let newRoute = this.get_next_route(route);
        if (params) this.params[newRoute] = params;
        this.set_route(newRoute);
    }

    set_route(route: string) {
        globalThis.location.hash = route;
    }

    abs_route(route: string) {
        let nro = route;
        if (!nro.startsWith("/")) nro = "/" + nro;
        this.set_route(nro);
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
    add_router(path: string, router: IRouter) {
        this.routers[path] = router;
    }
    get_current_params() {
        return this.params[this.get_current_url()];
    }

    step_back(n: number = 1) {
        let cur_url = this.get_current_url();
        this.set_route(
            this.array_tools.split(cur_url, []).slice(0, -n).join("/"),
        );
    }
}

export class Locations {
    history: string[] = [];
    current_url = "";
    modal = GenericModal("");
    private constructor() {
        document.body.appendChild(this.modal.getElement());
    }
    static instance: Locations | null = null;
    static get_instance() {
        Locations.instance ??= new Locations();
        return Locations.instance;
    }
    set_current_url(url: string) {
        this.current_url = url;
        let prev = this.history[this.history.length - 1];
        if (prev !== url) {
            this.history.push(url);
        }
    }

    display(comp: GComponent) {
        this.modal.s.handlers.close();
        this.modal.s.handlers.show();
        this.modal.s.handlers.display(comp);
    }
}

export class PopupRouter extends SimpleRouter {
    name = "popup";
    constructor(name: string) {
        super();
        let loc = Locations.get_instance();
        loc.modal.update({}, { click: (e: any, ls: any) => this.on_go_back() });

        loc.modal.s.xIcon.update(
            {},
            { click: (e: any, ls: any) => this.on_go_back() },
        );
        this.name = name;
    }

    set_route(route: string) {
        let loc = Locations.get_instance();
        loc.set_current_url(route);
        this.on_routed();
    }
    get_current_url(): string {
        return Locations.get_instance().current_url;
    }

    on_routed() {
        let params = this.get_current_params();
        let loc = Locations.get_instance();
        loc.display(this.get_element(this.get_current_url(), params)!);
    }

    on_go_back() {
        let loc = Locations.get_instance();
        if (loc.history.length <= 1) {
            loc.modal.s.handlers.close();
            return;
        }
        loc.history.pop();
        let newRoute = loc.history.pop()!;
        this.set_route(newRoute);
    }
}

export class ArrayMatcherTestscases {
    static am = new ArrayMatcher();
    static case1() {
        let pattern1 = "/{a}/b/{c}/d/{e}/f/{g}";
        let value1 = "/k/b/2/d/3/f/4";
        let pattern2 = "/{var}/b";
        let am = ArrayMatcherTestscases.am;

        console.log("is_var", am.is_var(pattern1));
        let pm1 = am.split(pattern1);
        let pm2 = am.split(pattern2);
        let vm1 = am.split(value1);
        console.log("pattern-splitted", pm1);
        console.log("value-splitted", vm1);
        console.log("match", am.matches(pm1, vm1));
        console.log("get_params", am.get_params(pm1, vm1));
        console.log("startsWith", am.startsWith(pm2, vm1));
        console.log(
            "matched unmatched",
            am.separate_matched_unmatched(pm2, vm1),
        );
    }

    static test() {
        ArrayMatcherTestscases.case1();
        // ArrayMatcherTestscases.case2();
    }
}
