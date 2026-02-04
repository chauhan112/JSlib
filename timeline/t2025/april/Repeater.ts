import type { IComponent, GComponent } from "../../globalComps/GComponent";
import { Tools } from "../../globalComps/tools";


export class Repeater implements IComponent {
    s: { [key: string]: any; } = {};
    comp: GComponent | null = null;
    itemComp: { [key: string]: IComponent; } = {};
    getElement(): HTMLElement {
        if (!this.comp) {
            this.comp = Tools.comp("div");
        }
        return this.comp.getElement();
    }
    setData(data: { [key: string]: IComponent; }) {
        this.s.data = data;
        this.itemComp = {};
        let crn = [];
        for (let key in data) {
            let val = data[key];
            crn.push(val);
            this.itemComp[key] = val;
        }
        this.getElement();
        this.comp!.update({
            children: crn,
        });
    }
    getProps(): { [key: string]: any; } {
        return this.comp!.getProps();
    }
}
