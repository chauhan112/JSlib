import { BreadCrumbInput } from "./generic";

export class BreadcrumbCtrl {
    input: BreadCrumbInput;

    constructor() {
        this.input = new BreadCrumbInput();
    }
    set_comp(comp: any) {
        this.input.displayer.set_comp(comp);
    }
    setup() {
        this.input.displayer.display_breadcrumb(
            this.input.handler.get_breadcrumb_items(),
        );
    }
}
