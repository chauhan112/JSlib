import { GComponent } from "../../globalComps/GComponent";

export interface IApp {
    name: string;
    href: string;
    subtitle: string;
    params?: string[];
}

export interface IRouteController {
    initialized: boolean;
    matches_path(path: string): boolean;
    get_component(params: any): GComponent;
    set_info(info: IApp): void;
    get_info(): IApp;
}

export class GRouterController implements IRouteController {
    info: IApp = { name: "", href: "", subtitle: "", params: [] };
    initialized: boolean = false;
    matches_path(path: string): boolean {
        return path === this.info.href;
    }
    get_component(params: any): GComponent {
        throw new Error("Method not implemented.");
    }
    set_info(info: IApp): void {
        this.info = info;
    }
    get_info(): IApp {
        return this.info;
    }
}
