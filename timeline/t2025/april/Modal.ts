import { type IComponent, Container } from "../../globalComps/GComponent";
import { Tools } from "../../globalComps/tools";

export class Modal implements IComponent {
    s: { [key: string]: any } = {};
    comp: Container | null = null;
    constructor(root?: any) {
        this.s.root = root;
    }
    getElement(): HTMLElement | SVGElement {
        if (this.comp) {
            return this.comp.getElement();
        }
        const content = Tools.container({
            class: "fixed xl:w-1/2 lg:w-2/3 md:w-3/4 w-11/12 z-6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        });
        this.s.comp = {};

        this.s.comp.background = Tools.div({
            class: "fixed top-0 left-0 w-full h-full bg-black z-5 opacity-50",
        });
        this.s.comp.mainComp = Tools.div({
            children: [this.s.comp.background, content],
        });
        this.s.comp.content = content;
        this.comp = Tools.container({});
        this.comp.getElement();
        return this.comp.getElement();
    }
    getProps(): { [key: string]: any } {
        return this.comp!.getProps();
    }
    display(comp: IComponent) {
        this.s.comp.content.display(comp);
        this.comp!.display(this.s.comp.mainComp);
    }
    hide() {
        this.comp!.clear();
        this.s.comp.content.clear();
    }
}

export class Main {
    static modal(root?: any) {
        let m = new Modal(root);
        m.getElement();
        return m;
    }
}
