import { HeaderCtrl } from "../../DeploymentCenter/apps/domOps/webPageWithNav/Header";
import { BreadcrumbCtrl } from "../breadcrumb";
import { Tools } from "../../../globalComps/tools";
import type { GComponent } from "../../../globalComps/GComponent";
import {
    GRouterController,
    type IApp,
} from "../../DeploymentCenter/interfaces";
import { WebPageWithBreadcrumb, SimpleWebPage } from "./webpages";
import { FormMainCtrl } from "../dynamicFormGenerator";
import { Breadcrumb, BreadcrumbMainCtrl } from "../breadcrumb/generic";
import type { IWebPage } from "./interface";

export class WebPageWithRoutesCtrl {
    headerCtrl: HeaderCtrl = new HeaderCtrl();
    breadcrumbCtrl: BreadcrumbCtrl = new BreadcrumbCtrl();

    constructor() {
        this.headerCtrl = new HeaderCtrl();
        this.breadcrumbCtrl = new BreadcrumbCtrl();
    }

    setup() {
        this.headerCtrl.header.header = "Web Page With Routes";
        this.headerCtrl.update();
        this.breadcrumbCtrl.setup();
    }

    get_comp(): GComponent {
        return Tools.comp("div", {
            class: "flex flex-col gap-4",
            children: [
                this.headerCtrl.comp,
                this.breadcrumbCtrl.input.displayer.comp,
            ],
        });
    }
}

export class HeaderBodyOldPage extends GRouterController {
    info: IApp = {
        name: "Header Body Old",
        href: "/header-body-old",
        subtitle: "header and breadcrumbs",
        params: [],
    };
    ctrl: WebPageWithRoutesCtrl = new WebPageWithRoutesCtrl();
    initialized: boolean = false;
    setup() {
        this.ctrl.setup();
    }
    get_component(params: any): GComponent {
        return this.ctrl.get_comp();
    }
}

export class SimpleNewPage extends GRouterController {
    info: IApp = {
        name: "Header Body",
        href: "/header-body",
        subtitle: "webpage with header and body",
        params: [],
    };
    webpage: SimpleWebPage = new SimpleWebPage();
    form = FormMainCtrl.testForm();
    breadcrumb: Breadcrumb = new Breadcrumb();
    initialized: boolean = true;
    constructor() {
        super();
        this.breadcrumb.set_values(BreadcrumbMainCtrl.test_items());
        this.webpage.get_body().display(
            Tools.comp("div", {
                class: "flex flex-col gap-4 w-full",
                children: [this.breadcrumb.get_comp(), this.form.get_comp()],
            }),
        );
    }
    get_component(params: any): GComponent {
        return this.webpage.get_comp();
    }
}
export class HeaderBodyNewPage extends GRouterController {
    info: IApp = {
        name: "Header Body",
        href: "/header-body",
        subtitle: "webpage with header and body",
        params: [],
    };
    webpage: IWebPage = new WebPageWithBreadcrumb();
    initialized: boolean = true;

    get_component(params: any): GComponent {
        return this.webpage.get_comp();
    }
}
