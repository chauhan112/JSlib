import type { GComponent } from "../../../../globalComps/GComponent";
import { ViewComponent } from "../../../../t2025/dec/DomainOpsFrontend/SingleCrud";
import type { IViewComponent } from "../../../DeploymentCenter/apps/domOps/crud_list/interface";

export class ViewerComp implements IViewComponent {
    comp: GComponent = ViewComponent();

    get_comp(): GComponent {
        return this.comp;
    }
    set_data(data: any) {
        (this.comp.getElement() as HTMLTextAreaElement).value = JSON.stringify(
            data,
            null,
            2,
        );
    }
}
