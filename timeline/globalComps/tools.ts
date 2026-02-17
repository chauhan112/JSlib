import { GComponent, Container } from "./GComponent";
import { type IconNode } from "lucide";
import { Icon } from "./icons";

export class Tools {
    static comp(
        typ: string,
        props?: { [key: string]: any },
        handlers?: { [key: string]: (...args: any[]) => void },
        state?: { [key: string]: any },
    ) {
        const c = new GComponent();
        c.typ = typ;
        c.update(props, handlers, state);
        return c;
    }

    static div(
        props?: { [key: string]: any },
        handlers?: { [key: string]: (...args: any[]) => void },
        state?: { [key: string]: any },
    ) {
        return Tools.comp("div", props, handlers, state);
    }
    static icon(
        icon: IconNode,
        props: Record<string, any> = {},
        handlers: Record<string, any> = {},
        states: Record<string, any> = {},
    ) {
        let comp = new Icon(icon);
        comp.update(props, handlers, states);
        return comp;
    }

    static container(
        props?: { [key: string]: any },
        handlers?: { [key: string]: (...args: any[]) => void },
        typ: string = "div",
    ) {
        let comp = new Container(typ);
        comp.comp.update(props, handlers);
        return comp;
    }

    static url_params(pattern: string, path: string) {
        if (pattern === "*") return { params: {}, remaining: "" };

        const isPrefixMatch = pattern !== "/" && pattern.endsWith("/");
        const cleanPattern = isPrefixMatch ? pattern.slice(0, -1) : pattern;

        const patternSegments = cleanPattern.split("/").filter((s) => s !== "");
        const pathSegments = path.split("/").filter((s) => s !== "");

        if (!isPrefixMatch && patternSegments.length !== pathSegments.length) {
            return null;
        }

        if (isPrefixMatch && pathSegments.length < patternSegments.length) {
            return null;
        }

        const params: any = {};
        for (let i = 0; i < patternSegments.length; i++) {
            const pSeg = patternSegments[i];
            const uSeg = pathSegments[i];

            if (pSeg.startsWith("{") && pSeg.endsWith("}")) {
                const paramName = pSeg.slice(1, -1);
                params[paramName] = uSeg || "";
            } else if (pSeg !== uSeg) {
                return null;
            }
        }

        const remaining =
            "/" + pathSegments.slice(patternSegments.length).join("/");
        return { params, remaining };
    }
}
