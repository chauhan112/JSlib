import type { GComponent } from "../../../globalComps/GComponent";
import {
    GRouterController,
    type IApp,
} from "../../DeploymentCenter/interfaces";
import { DirectusTableModel, TokenFromLocalStorage } from "./data_model";
import type { IDatamodel, ILister } from "./interface";
import { ListerWithContext, Lister } from "./listers";

export class ListerPage extends GRouterController {
    initialized: boolean = false;
    lister: ILister = new Lister();
    model: IDatamodel<any> | null = null;
    info: IApp = {
        name: "lister",
        href: "/lister",
        subtitle: "lister test",
        params: [],
    };
    setup() {
        this.model = new DirectusTableModel(
            "raja_tasks",
            new TokenFromLocalStorage("DeploymentCenterSettings"),
        );
        (this.model as DirectusTableModel).columns = ["id", "title"];
        this.initialized = true;
    }
    get_component(params: any): GComponent {
        this.model!.read_all().then((data) => this.lister.set_values(data));
        return this.lister.get_comp();
    }
}
