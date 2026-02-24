import type { GComponent } from "../../../../globalComps/GComponent";
import type { ISComponent } from "../../../../globalComps/interface";
import { Tools } from "../../../../globalComps/tools";
import { Header } from "../../../DeploymentCenter/apps/domOps/webPageWithNav/Header/comp";

export const PageWithGoBack = () => {
    let header = Header();
    return Tools.div(
        {
            class: "flex flex-col",
            children: [header, Tools.div({ key: "body" })],
        },
        {},
        { header },
    );
};

export class PageWithGoBackComp implements ISComponent {
    comp = PageWithGoBack();
    constructor() {
        this.comp.s.header.s.back_button.update(
            {},
            { click: () => this.on_go_back() },
        );
    }
    set_title(title: string) {
        this.comp.s.header.s.title.update({ textContent: title });
    }
    display(comp: GComponent) {
        this.comp.s.body.update({ innerHTML: "", children: [comp] });
    }
    get_comp(): GComponent {
        return this.comp;
    }
    on_go_back() {}
}
