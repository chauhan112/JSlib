import { type IconNode } from "lucide";
import { ConditionalComponent, GComponent, Grouper } from "./Components";
import { Icon } from "../../../globalComps/icons";
import { type IComponent } from "./interfaces";

export class CITTools {
    static readonly removeKeys = (obj: Record<string, any>, keys: string[]) => {
        let newObj = { ...obj };
        for (const key of keys) {
            if (newObj.hasOwnProperty(key)) {
                delete newObj[key];
            }
        }
        return newObj;
    };
    static updateObject(obj1: Record<string, any>, obj2: Record<string, any>) {
        for (let key in obj2) {
            if (!obj1.hasOwnProperty(key)) {
                obj1[key] = obj2[key];
                continue;
            }
            if (Array.isArray(obj1[key])) {
                if (Array.isArray(obj2[key])) {
                    obj1[key] = obj2[key];
                } else {
                    CITTools.updateObject(obj1[key], obj2[key]);
                }
                continue;
            }

            if (
                typeof obj1[key] === "object" &&
                typeof obj2[key] === "object" &&
                obj1[key] !== null &&
                obj2[key] !== null
            ) {
                CITTools.updateObject(obj1[key], obj2[key]);
            } else {
                obj1[key] = obj2[key];
            }
        }
        return { ...obj1 };
    }
    static groupComponents(...components: IComponent[]) {
        let group = new Grouper();
        group.setChildren(components);
        return group;
    }

    static conditionalComponent(
        defValue: any,
        ...conditions: [(value: any) => boolean, IComponent][]
    ) {
        let cond = new ConditionalComponent();
        cond.setConditions(conditions);
        cond.states.defaultValue = defValue;

        return cond;
    }
    static comp(
        typ: string,
        props: Record<string, any>,
        states: Record<string, any> = {},
        handlers: Record<string, any> = {}
    ) {
        let comp = new GComponent();
        comp.typ = typ;
        comp.props = props;
        comp.states = states;
        comp.handlers = handlers;
        return comp;
    }
    static icon(
        icon: IconNode,
        props: Record<string, any> = {},
        states: Record<string, any> = {},
        handlers: Record<string, any> = {}
    ) {
        let comp = new Icon(icon);
        comp.update(props, states, handlers);
        return comp;
    }
}
