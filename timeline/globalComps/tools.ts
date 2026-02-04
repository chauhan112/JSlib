import { GComponent, Container } from "./GComponent";
import {type IconNode } from "lucide";
import { Icon } from "./icons";

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
        comp.update(props, handlers, states);
        return comp;
    }
    
    static container(
        props?: { [key: string]: any },
        handlers?: { [key: string]: (...args: any[]) => void },
        typ: string = "div"
    ) {
        let comp = new Container(typ);
        comp.comp.update(props, handlers);
        return comp;
    }
    
}
