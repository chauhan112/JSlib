import type { GComponent } from "../../../../globalComps/GComponent";
import { GRouteController, type IRouteController, type IApp } from "../../routeController";
import { SearchComponentCtrl } from "./Components";

export const DomOps = () => {
    const searchComponentCtrl = new SearchComponentCtrl();
    searchComponentCtrl.setup();
    return searchComponentCtrl;
}
export class DomOpsApp extends GRouteController implements IRouteController {
    searchComponentCtrl: SearchComponentCtrl;
    infos: IApp = {
        name: "DomOps",
        href: "/dom-ops",
        subtitle: "advance logger",
        params: [],
    };
    constructor() {
        super();
        this.searchComponentCtrl = DomOps();

    }
    matches_path(path: string): boolean {
        return path === "/dom-ops";
    }
    get_component(params: any): GComponent {
        return this.searchComponentCtrl.comp;
    }
    get_info(): IApp {
        return this.infos;
    }
}