import type { IComponent, GComponent } from "../../globalComps/GComponent";
import { Tools } from "../../globalComps/tools";


export class ConditionalComponent implements IComponent {
    s: { [key: string]: any; } = {};
    comp: GComponent | null = null;
    constructor() {
        this.s.conditions = [];
        this.s.defaultValue = null;
    }
    setValue(value: any) {
        this.s.value = value;
        this.comp!.update({
            innerHTML: "",
        });
        for (const condition of this.s.conditions) {
            if (condition.func(value)) {
                if (condition.comp)
                    this.comp!.update({
                        child: condition.comp,
                    });
                break;
            }
        }
    }
    setConditions(
        conditions: { func: (value: any) => boolean; comp: IComponent; }[]
    ) {
        this.s.conditions = conditions;
    }

    getElement(): HTMLElement {
        if (!this.comp) {
            this.comp = Tools.div();
            this.setValue(this.s.defaultValue);
        }
        return this.comp.getElement();
    }
    display(comp: IComponent) {
        this.comp!.update({
            innerHTML: "",
            child: comp,
        });
    }
    clear() {
        this.comp!.update({
            innerHTML: "",
        });
    }
    getProps() {
        return this.comp!.getProps();
    }
}
