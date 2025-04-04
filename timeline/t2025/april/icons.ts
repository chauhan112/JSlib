import { createElement, Github, ArrowDown, IconNode } from "lucide";
import { IComponent } from "./GComponent";

export class Icon implements IComponent {
    handlers: { [key: string]: (...args: any[]) => void } = {};

    s: { [key: string]: any } = {};

    props: { [key: string]: string } = {};
    icon: IconNode;
    constructor(icon: IconNode) {
        this.icon = icon;
    }

    protected component: SVGElement | null = null;

    private updateProp(key: string, value: any) {
        if (this.component) {
            if (key === "textContent") {
                this.component.textContent = value;
                return;
            }
            this.component.setAttribute(key, value);
        }
    }

    update(
        props?: { [key: string]: string },
        state?: { [key: string]: any },
        handlers?: { [key: string]: (...args: any[]) => void }
    ) {
        if (this.component) {
            this.getElement();
        }
        for (let key in props) {
            this.props[key] = props[key];
            if (this.component) {
                this.updateProp(key, props[key]);
            }
        }
        for (let key in state) {
            this.s[key] = state[key];
        }
        for (let key in handlers) {
            if (this.component) {
                if (this.handlers.hasOwnProperty(key)) {
                    this.component?.removeEventListener(
                        key,
                        this.handlers[key]
                    );
                }
                this.addHandler(key, handlers[key]);
            } else {
                this.handlers[key] = handlers[key];
            }
        }
    }
    private addHandler(key: string, handler: (...args: any[]) => void) {
        const newFunc = (e: any) => handler(e, this);
        this.component?.addEventListener(key, newFunc);
        this.handlers[key] = newFunc;
    }
    protected updateState(
        props?: { [key: string]: string },
        handlers?: { [key: string]: (...args: any[]) => void }
    ) {
        for (let key in props) {
            this.updateProp(key, props[key]);
        }
        for (let key in handlers) {
            this.addHandler(key, handlers[key]);
        }
    }
    getElement(): SVGElement {
        if (!this.component) {
            this.component = createElement(this.icon);
            this.updateState(this.props, this.handlers);
        }
        return this.component;
    }
    getProps() {
        return this.props;
    }
}

export const iconTest = () => {
    let icon = new Icon(ArrowDown);
    icon.update({
        class: "text-red-500 w-12 h-12 ",
    });
    return icon;
};
