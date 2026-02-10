import { HeaderCtrl } from "../../DeploymentCenter/apps/domOps/webPageWithNav/Header";
import { BreadcrumbCtrl } from "./breadcrumb";
import { Tools } from "../../../globalComps/tools";
import type { GComponent } from "../../../globalComps/GComponent";
import { TestButtons } from "../directus";

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
        const testButtons = new TestButtons();
        return Tools.comp("div", {
            class: "flex flex-col gap-4",
            children: [
                this.headerCtrl.comp,
                this.breadcrumbCtrl.input.displayer.comp,
                testButtons.get_component(),
            ],
        });
    }
}
