import type { GComponent } from "../../../globalComps/GComponent";
import {
    GRouterController,
    type IApp,
} from "../../DeploymentCenter/interfaces";

import { MainPage } from "./pages";

export class DomOpsPage extends GRouterController {
    info: IApp = {
        name: "DomOps",
        href: "/dom-ops",
        subtitle: "dom ops",
        params: [],
    };
    initialized: boolean = false;
    main_page = new MainPage();
    setup() {
        this.main_page.setup();
        this.initialized = true;
    }

    get_component(params: any): GComponent {
        return this.main_page.get_comp();
    }
}
