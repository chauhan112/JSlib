import type { GComponent } from "../../../globalComps/GComponent";
import  { type IApp,  GRouterController } from "../../DeploymentCenter/interfaces";
import {GView} from "./generics";

export class CrudPage extends GRouterController {
    info: IApp = {name: "Crud", href: "/crud", subtitle: "v2", params: []};
    view: GView = new GView();
    setup() {
        this.view.setup();
    }
    get_component(params: any): GComponent {
        return this.view.get_comp();
    }
}