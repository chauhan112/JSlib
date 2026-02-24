import type { GComponent } from "../../../globalComps/GComponent";
import {
    GRouterController,
    type IApp,
} from "../../DeploymentCenter/interfaces";
import { DirectusTableModel, TokenFromLocalStorage } from "./data_model";
import type { IDatamodel, ILister } from "./interface";
import { PaginateLister } from "./listers/paginated_lister";
import { Lister } from "./listers/simple";

export class ListerPage extends GRouterController {
    initialized: boolean = false;
    lister: ILister | null = null;
    model: IDatamodel<any> | null = null;
    info: IApp = {
        name: "lister",
        href: "/lister",
        subtitle: "lister test",
        params: [],
    };
    setup() {
        // this.model = new DirectusTableModel(
        //     "raja_tasks",
        //     new TokenFromLocalStorage("DeploymentCenterSettings"),
        // );
        // (this.model as DirectusTableModel).columns = ["id", "title"];
        let paginator = new PaginateLister();
        paginator.update();
        this.lister = paginator;
        this.initialized = true;
    }
    get_component(params: any): GComponent {
        console.log("params", params);
        return this.lister!.get_comp();
    }
}
