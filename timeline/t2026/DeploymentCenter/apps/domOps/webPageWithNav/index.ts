import { RouteWebPage } from "../../../../../t2025/dec/DomainOpsFrontend/route/ui";
import type { GComponent } from "../../../../../globalComps/GComponent";
import { type IRouteController, type IApp } from "../../../routeController";
import { HeaderCtrl } from "./Header";
import  { RouteWebPageController, MainCtrl as RouteWebPageMainCtrl } from "../../../../../t2025/dec/DomainOpsFrontend/route/controller";
import  { GenericModel } from "./generic_impl";

export class WebPageWithNavCtrl implements IRouteController {
    comp: any = RouteWebPage();
    infos: IApp = {
        name: "Web Page",
        href: "/web-page",
        subtitle: "Web Page With Nav",
        params: [],
    };
    headerCtrl: HeaderCtrl = new HeaderCtrl();;
    routeWebPageCtrl: RouteWebPageController = new RouteWebPageController();
    model: GenericModel;
    constructor() {
        this.model = new GenericModel(this.routeWebPageCtrl);
    }
    setup() {
        this.routeWebPageCtrl.set_comp(this.comp);
        this.routeWebPageCtrl.setup();
        this.comp.s.mainBody.update({ innerHTML: "", child: this.headerCtrl.get_comp() });
        this.headerCtrl.update();
        this.model.setup();
        this.routeWebPageCtrl.sidebar_ctrl.comp.s.header.s.title.update({}, { click: () => RouteWebPageMainCtrl.relative_navigate("/") });
    }
    
    matches_path(path: string): boolean {
        return path === "/web-page";
    }
    get_component(params: any): GComponent {
        return this.comp;
    }
    set_info(infos: IApp) {
        this.infos = infos;
    }
    get_info(): IApp {
        return this.infos;
    }
    
}