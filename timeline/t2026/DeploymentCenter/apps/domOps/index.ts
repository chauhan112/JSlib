import { WebPageWithNavCtrl } from "./webPageWithNav";
import { CrudList } from "./crud_list";
import type { IApp, IRouteController } from "../../interfaces";
import type { GComponent } from "../../../../globalComps/GComponent";
import { NAVS } from "./interface";

export class DomOpsCtrl implements IRouteController {
    comp: any;
    infos: IApp = {
        name: "DomOps",
        href: "/dom-ops",
        subtitle: "advance logger",
        params: [],
    };
    crudList: CrudList;
    webPageWithNav: WebPageWithNavCtrl;
    initialized: boolean = false;
    constructor() {
        this.crudList = new CrudList();
        this.webPageWithNav = new WebPageWithNavCtrl();
    }
    setup() {
        this.crudList.model.get_page_size = () => 20;
        this.crudList.setup();
        this.webPageWithNav.model.sidebar.get_items = () => NAVS;
        this.webPageWithNav.setup();
        this.crudList.model.contextMenuOptions.clicked = async (data: any) => {
            this.webPageWithNav.model.show.info(data.title);
        };
        this.initialized = true;
    }
    matches_path(path: string): boolean {
        return this.crudList.matches_path(path);
    }
    get_component(params: any): GComponent {
        const comp = this.crudList.get_component(params);
        this.webPageWithNav.comp.s.mainBody.update({
            innerHTML: "",
            child: comp,
        });
        return this.webPageWithNav.comp;
    }
    set_info(infos: IApp) {
        this.infos = infos;
    }
    get_info(): IApp {
        return this.infos;
    }
}
