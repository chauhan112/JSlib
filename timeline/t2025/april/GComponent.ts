import { Tools } from "./tools";

export interface IComponent {
    s: { [key: string]: any };
    getElement(): HTMLElement | SVGElement;
    getProps(): { [key: string]: any };
}
export class GComponent implements IComponent {
    handlers: { [key: string]: (...args: any[]) => void } = {};
    s: { [key: string]: any } = {};
    props: { [key: string]: string } = {};
    typ: string = "div";
    private component: HTMLElement | null = null;
    protected updateProp(key: string, value: any) {
        if (!this.component) {
            this.getElement();
        }
        if (key === "textContent") {
            this.component!.textContent = value;
        } else if (key === "innerHTML") {
            this.component!.innerHTML = value;
        } else if (key === "children") {
            for (let child of value) {
                this.updateChild(child);
            }
        } else if (key === "key") {
            return;
        } else if (key === "child") {
            this.updateChild(value);
            return;
        } else if (key === "style") {
            for (let style in value) {
                this.component!.style.setProperty(style, value[style]);
            }
        } else {
            this.component!.setAttribute(key, value);
        }
    }

    private updateChild(value: GComponent | Text) {
        if (value instanceof Text) {
            this.component!.appendChild(value);
            return;
        }
        if (value.getProps().key) {
            this.s[value.getProps().key] = value;
        }
        this.component!.appendChild(value.getElement());
        value.s.parent = this;
    }
    update(
        props?: { [key: string]: any },
        handlers?: { [key: string]: (...args: any[]) => void },
        state?: { [key: string]: any }
    ) {
        for (let key in props) {
            this.props[key] = props[key];
            this.updateProp(key, props[key]);
        }
        for (let key in state) {
            this.s[key] = state[key];
        }
        for (let key in handlers) {
            if (this.handlers.hasOwnProperty(key)) {
                this.component?.removeEventListener(key, this.handlers[key]);
            }
            this.addHandler(key, handlers[key]);
        }
    }
    private addHandler(key: string, handler: (...args: any[]) => void) {
        const newFunc = (e: any) => handler(e, this);
        this.component?.addEventListener(key, newFunc);
        this.handlers[key] = newFunc;
    }
    private updateState(
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
    getElement(): HTMLElement {
        if (!this.component) {
            this.component = document.createElement(this.typ);
            this.updateState(this.props, this.handlers);
        }
        return this.component;
    }
    getProps() {
        return this.props;
    }
}

export class Container implements IComponent {
    s: { [key: string]: any } = {};
    comp: GComponent = new GComponent();
    constructor(typ: string = "div") {
        this.comp.typ = typ;
    }
    getProps(): { [key: string]: any } {
        return this.comp.getProps();
    }
    getElement(): HTMLElement {
        return this.comp.getElement();
    }
    display(comp: IComponent) {
        this.comp.update({
            child: comp,
        });
    }
    clear() {
        this.comp.update({
            innerHTML: "",
        });
    }
}

export class Repeater implements IComponent {
    s: { [key: string]: any } = {};
    comp: GComponent | null = null;
    itemComp: { [key: string]: IComponent } = {};
    getElement(): HTMLElement {
        if (!this.comp) {
            this.comp = Tools.comp("div");
        }
        return this.comp.getElement();
    }
    setData(data: { [key: string]: IComponent }) {
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
    getProps(): { [key: string]: any } {
        return this.comp!.getProps();
    }
}

export class ConditionalComponent implements IComponent {
    s: { [key: string]: any } = {};
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
        conditions: { func: (value: any) => boolean; comp: IComponent }[]
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

export class Test {
    static repeater() {
        let repeater = new Repeater();
        repeater.setData({
            "1": Tools.comp("div", {
                textContent: "hello",
            }),
            "2": Tools.comp("div", {
                textContent: "world",
            }),
        });
        return repeater;
    }
}
