import {
    IComponent,
    Repeater,
    GComponent,
    ConditionalComponent,
    Container,
} from "./GComponent";
import { IconNode } from "lucide";
import { Icon } from "./icons";
import { IFormComponent, Input } from "./GForm";

import { MultiSelect, DropdownMenu } from "./Select";

export class Tools {
    static comp(
        typ: string,
        props?: { [key: string]: any },
        handlers?: { [key: string]: (...args: any[]) => void },
        state?: { [key: string]: any }
    ) {
        const c = new GComponent();
        c.typ = typ;
        c.update(props, handlers, state);
        return c;
    }
    static rep(data: { [key: string]: IComponent }) {
        let repeater = new Repeater();
        repeater.setData(data);
        return repeater;
    }
    static div(
        props?: { [key: string]: any },
        handlers?: { [key: string]: (...args: any[]) => void },
        state?: { [key: string]: any }
    ) {
        return Tools.comp("div", props, handlers, state);
    }
    static icon(
        icon: IconNode,
        props: Record<string, any> = {},
        handlers: Record<string, any> = {},
        states: Record<string, any> = {}
    ) {
        let comp = new Icon(icon);
        comp.update(props, states, handlers);
        return comp;
    }
    static ifComp(
        conditions: { func: (value: any) => boolean; comp: IComponent }[],
        defaultValue: any = null,
        props?: { [key: string]: any }
    ) {
        let comp = new ConditionalComponent();
        comp.s.defaultValue = defaultValue;
        comp.setConditions(conditions);
        comp.getElement();
        comp.comp!.update(props);
        return comp;
    }
    static container(
        props?: { [key: string]: any },
        handlers?: { [key: string]: (...args: any[]) => void }
    ) {
        let comp = new Container();
        comp.comp.update(props, handlers);
        return comp;
    }
    static input(props: { [key: string]: any }) {
        let comp = new Input(props);
        return comp;
    }
    static dropdown(options: any[]) {
        let comp = new DropdownMenu(options);
        comp.getElement();
        return comp;
    }
    static multiSelect(options: any[], placeholder?: string) {
        let comp = new MultiSelect(options, undefined, placeholder);
        comp.getElement();
        return comp;
    }
}
