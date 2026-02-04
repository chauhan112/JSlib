import { HeaderWithSearch, HeaderController } from "../Components";
import { Tools } from "../../../globalComps/tools";
import { MainCtrl as ListDisplayerMainCtrl, ListDisplayerCtrl } from "../../../t2025/dec/DomainOpsFrontend/components/ListDisplayer";
import { DefaultPageContent } from "../../../t2025/dec/DomainOpsFrontend/route/ui";
import { MainCtrl as SettingsPageMainCtrl } from "../settings";
import type { IRouteController, IApp } from "../routeController";
import type { GComponent } from "../../../globalComps/GComponent";
import { GRouteController } from "../routeController";


export class EqualRouteController extends GRouteController implements IRouteController {
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
export class DefaultPageSkeleton extends GRouteController implements IRouteController {
    private path: string = "";
    header_ctrl: HeaderController = new HeaderController();
    body_comp: any;
    body_comp_func: (params: any) => GComponent = this._get_component.bind(this);
    infos: {[key: string]: any} = {};
    constructor(path: string) {
        super();
        this.path = path;
    }
    setup() {
        this.header_ctrl.set_comp(HeaderWithSearch());
        this.header_ctrl.setup();
        this.header_ctrl.comp.s.search.update({class: "hidden"});
        this.body_comp = DefaultPageContent();
    }
    matches_path(path: string): boolean {
        return path === this.path;
    }
    set_body_comp(body_comp: any) {
        this.body_comp = body_comp;
    }
    private _get_component(params: any): GComponent {
        return Tools.comp("div", {
            children: [this.header_ctrl.comp, this.body_comp],
        });
    }
    set_body_comp_func(body_comp_func: (params: any) => GComponent) {
        this.body_comp_func = body_comp_func;
    }
    get_component(params: any): GComponent {
        return Tools.comp("div", {
            children: [this.header_ctrl.comp, this.body_comp_func(params)],
        });
    }
}
export class HomeRouteController extends GRouteController implements IRouteController {
    private readonly header_ctrl: HeaderController = new HeaderController();
    private app_list_ctrl: ListDisplayerCtrl | undefined;
    private apps: IApp[] = [];
    private header_comp: any;
    constructor() {
        super();
        this.header_comp = HeaderWithSearch();
    }

    setup() {
        this.header_ctrl.set_comp(this.header_comp);
        this.header_ctrl.setup();
        this.header_ctrl.comp.s.search.update({}, { submit: this.on_search.bind(this) });
        this.app_list_ctrl = ListDisplayerMainCtrl.listDisplayer(this.apps, 20);
        this.app_list_ctrl.cardCompCreator = this.card_comp_creator
        this.app_list_ctrl.comp.s.list.update({class: "w-full grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-6 overflow-auto"});
        this.app_list_ctrl.update();
    }
    on_search(e: any) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const values = Object.fromEntries(formData.entries());
        let search = values.search as string;
        
        let apps = []
        for (const app of this.apps) {
            if (app.name.toLowerCase().includes(search.toString().toLowerCase())) {
                apps.push(app);
            }
        }
        this.app_list_ctrl?.set_data(apps);
        this.app_list_ctrl?.update();
    }

    private card_comp_creator(app: IApp) {
        return SettingsPageMainCtrl.appCard({name: app.name, subtitle: app.subtitle || app.name, href: app.href});
    }
    matches_path(path: string): boolean {
        return path === "" || path === "/";
    }
    get_component(params: any): GComponent {
        this.app_list_ctrl?.set_data(this.apps);
        this.app_list_ctrl?.update();
        return Tools.comp("div", {
            children: [this.header_comp, Tools.comp("div", {
                class: "p-8",
                children: [this.app_list_ctrl?.comp ],
            })],
        });
    }
    add_app(app: IApp) {
        this.apps.push(app);
    }
}
export class MainCtrl  {
    static homeRouteController() {
        const homeRouteController = new HomeRouteController();
        homeRouteController.setup();
        return homeRouteController;
    }
    static route(url: string, compGetter: (params?: any) => GComponent): IRouteController {
        const equalRouteController = new EqualRouteController();
        equalRouteController.set_path(url);
        equalRouteController.set_compGetter(compGetter);
        return equalRouteController;
    }
    static defaultPageSkeleton(path: string, info: IApp, body_comp_func?: (params: any) => GComponent): DefaultPageSkeleton {
        const defaultPageSkeleton = new DefaultPageSkeleton(path);
        defaultPageSkeleton.set_info(info);
        if (body_comp_func) {
            defaultPageSkeleton.set_body_comp_func(body_comp_func);
        }
        defaultPageSkeleton.setup();
        return defaultPageSkeleton;
    }
}