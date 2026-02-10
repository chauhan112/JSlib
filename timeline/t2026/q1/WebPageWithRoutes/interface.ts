import type { GComponent } from "../../../globalComps/GComponent";

export interface IRoutable {
    matches_path(path: string): boolean;
    get_component(params: any): GComponent;
}

export interface IChildApp {
    route: IRoutable;
}
