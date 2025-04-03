import { createElement, Github, ArrowDown, IconNode } from "lucide";

export class Icon {
    handlers: { [key: string]: (...args: any[]) => void } = {};

    states: { [key: string]: any } = {};

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
        handlers?: { [key: string]: (...args: any[]) => void },
        stateUpdate: boolean = true
    ) {
        if (stateUpdate) {
            this.getElement();
        }
        for (let key in props) {
            this.props[key] = props[key];
            if (stateUpdate) {
                this.updateProp(key, props[key]);
            }
        }
        for (let key in state) {
            this.states[key] = state[key];
        }
        for (let key in handlers) {
            if (stateUpdate) {
                if (this.handlers.hasOwnProperty(key)) {
                    this.component?.removeEventListener(
                        key,
                        this.handlers[key]
                    );
                }
                this.component?.addEventListener(key, handlers[key]);
            }
            this.handlers[key] = handlers[key];
        }
    }
    protected updateState(
        props?: { [key: string]: string },
        handlers?: { [key: string]: (...args: any[]) => void }
    ) {
        for (let key in props) {
            this.updateProp(key, props[key]);
        }
        for (let key in handlers) {
            this.component!.addEventListener(key, handlers[key]);
        }
    }
    getElement(): SVGElement {
        if (!this.component) {
            this.component = createElement(this.icon);
            this.updateState(this.props, this.handlers);
        }
        return this.component;
    }
}

export const iconTest = () => {
    let icon = new Icon(ArrowDown);
    icon.update({
        class: "text-red-500 w-12 h-12 ",
    });
    return icon;
};
