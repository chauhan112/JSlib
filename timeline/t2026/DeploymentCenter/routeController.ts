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


export class GRouteController  {
    private info: IApp = {name: "", href: "", subtitle: "", params: []};
    set_info(info: IApp): void {
        this.info = info;
    }
    get_info(): IApp {
        return this.info;
    }
    
}

export class RouteWrapper extends GRouteController implements IRouteController {
    private navs: IRouteController[] = [];
    private current_nav: IRouteController | null = null;
    private current_path: string = "";
    
    matches_path(path: string): boolean {
        this.current_path = path;
        for (const nav of this.navs) {
            if (nav.matches_path(path)) {
                this.current_nav = nav;
                return true;
            }
        }
        return false;
    }
    get_component(params: any): GComponent {
        return this.current_nav!.get_component(params);
    }
}
