import { DocumentHandler } from "../Array";
import { GComponent, IComponent } from "../GComponent";
import { Tools } from "../tools";
import { Sidebar } from "./Sidebar";
import { PropertySection } from "./PropertySection";

export class Home implements IComponent {
    s: { [key: string]: any } = {};
    comp: GComponent | null = null;
    sidebar: Sidebar;
    propertySection: PropertySection;
    constructor() {
        this.sidebar = new Sidebar(this);
        this.sidebar.getElement();
        this.propertySection = new PropertySection(this);
        this.propertySection.getElement();
    }
    getElement(): HTMLElement | SVGElement {
        if (this.comp) {
            return this.comp.getElement();
        }
        this.s.comps = {};
        this.s.comps.content = Tools.container({ class: "flex-1" });
        this.comp = Tools.div({
            class: "w-full h-full flex justify-between",
            children: [
                this.sidebar,
                this.s.comps.content,
                this.propertySection,
            ],
        });

        return this.comp.getElement();
    }
    getProps(): { [key: string]: any } {
        return this.comp!.getProps();
    }
}
