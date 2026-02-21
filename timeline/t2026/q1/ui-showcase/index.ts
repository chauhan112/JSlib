import type { GComponent } from "../../../globalComps/GComponent";
import {
    GRouterController,
    type IApp,
} from "../../DeploymentCenter/interfaces";
import { UIShowcase } from "./ui_showcase";

export class UIShowcasePage extends GRouterController {
    info: IApp = {
        name: "UI Showcase",
        href: "/ui-showcase",
        subtitle: "",
        params: [],
    };
    initialized: boolean = false;
    webpage = new UIShowcase();
    setup() {
        this.webpage.setup();
        this.initialized = true;
    }

    get_component(params: any): GComponent {
        return this.webpage.get_comp();
    }
}
