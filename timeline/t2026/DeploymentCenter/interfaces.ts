import { GComponent } from "../../globalComps/GComponent";

export interface IApp {
    name: string;
    href: string;
    subtitle: string;
    params?: string[];
}

export interface IRouteController {
    matches_path(path: string): boolean;
    get_component(params: any): GComponent;
    set_info(info: IApp): void;
    get_info(): IApp;
}