import type { GComponent } from "../../../globalComps/GComponent";
import type { ISComponent } from "../../../globalComps/interface";
import { GRouterController } from "../../DeploymentCenter/interfaces";
import { AdvanceLister } from "../../q1/domOps/pages/search_comp";

export class TaskManager implements ISComponent {
    lister: AdvanceLister | null = null;
    get_comp(): GComponent {
        if (this.lister) return this.lister.get_comp();
        this.lister = new AdvanceLister();
        this.lister.setup();
        return this.lister.get_comp();
    }
}

export class TaskPage extends GRouterController {
    info = {
        name: "Tasks Manager",
        href: "/tasks",
        subtitle: "manage tasks",
        params: [],
    };
    initialized: boolean = true;
    lister: TaskManager = new TaskManager();
    get_component(params: any): GComponent {
        return this.lister.get_comp();
    }
}
