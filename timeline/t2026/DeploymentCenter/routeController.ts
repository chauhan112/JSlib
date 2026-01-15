import { GComponent } from "../../t2025/april/GComponent";
import { DefaultPageContent } from "../../t2025/dec/DomainOpsFrontend/route/ui";
export interface IRouteController {
    matches_path(path: string): boolean;
    get_component(params: any): GComponent;
}

export class RouteWrapper implements IRouteController {
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
export class EqualRouteController implements IRouteController {
    private path: string = "";
    private compGetter: (params: any) => GComponent = DefaultPageContent;
    set_path(path: string) {
        this.path = path;
    }
    set_compGetter(compGetter: (params: any) => GComponent) {
        this.compGetter = compGetter;
    }
    matches_path(path: string): boolean {
        return path === this.path;
    }
    get_component(params: any){
        return this.compGetter(params);
    }
}

export class MainRouteController  {
    static route(url: string, compGetter: (params?: any) => GComponent): IRouteController {
        const equalRouteController = new EqualRouteController();
        equalRouteController.set_path(url);
        equalRouteController.set_compGetter(compGetter);
        return equalRouteController;
    }
}