import { CITTools } from "./tools";

interface IComponent {
    handlers: { [key: string]: (...args: any[]) => void };

    states: { [key: string]: any };

    props: { [key: string]: string };

    render(): HTMLElement;

    update(
        props?: { [key: string]: string },
        state?: { [key: string]: any },
        handlers?: { [key: string]: (...args: any[]) => void }
    ): void;
    getElement(): HTMLElement | null;
}

export class GComponent implements IComponent {
    handlers: { [key: string]: (...args: any[]) => void } = {};

    states: { [key: string]: any } = {};

    props: { [key: string]: string } = {};

    typ: string = "div";
    private component: HTMLElement | null = null;

    private updateProp(key: string, value: any) {
        if (this.component) {
            if (key === "textContent") {
                this.component.textContent = value;
            }
            if (key === "innerHTML") {
                this.component.innerHTML = value;
            }
            this.component.setAttribute(key, value);
        }
    }
    render(): HTMLElement {
        if (!this.component) {
            this.component = document.createElement(this.typ);
        }
        for (let key in this.props) {
            this.updateProp(key, this.props[key]);
        }
        for (let key in this.handlers) {
            this.component.addEventListener(key, this.handlers[key]);
        }
        return this.component;
    }

    update(
        props?: { [key: string]: string },
        state?: { [key: string]: any },
        handlers?: { [key: string]: (...args: any[]) => void }
    ) {
        if (!this.component) {
            this.component = document.createElement(this.typ);
        }
        for (let key in props) {
            this.props[key] = props[key];
            this.updateProp(key, props[key]);
        }
        for (let key in state) {
            this.states[key] = state[key];
        }
        for (let key in handlers) {
            if (this.handlers.hasOwnProperty(key)) {
                this.component?.removeEventListener(key, this.handlers[key]);
            }
            this.handlers[key] = handlers[key];
            this.component?.addEventListener(key, handlers[key]);
        }
    }
    getElement(): HTMLElement | null {
        return this.component;
    }
}

export class Button extends GComponent {
    private readonly btnComp: GComponent = new GComponent();
    constructor() {
        super();
        this.typ = "button";
        this.props = {
            class: "bg-gray-200 p-3 rounded-lg",
            textContent: "Submit",
        };
        this.btnComp.typ = this.typ;
        this.btnComp.props = this.props;
        this.btnComp.handlers = this.handlers;
        this.btnComp.states = this.states;
    }
}

export class LinkButton extends GComponent {
    private readonly btnComp: GComponent = new GComponent();
    constructor() {
        super();
        this.typ = "a";
        this.props = {
            class: "bg-purple-800 text-white px-6 py-3 rounded-lg hover:bg-purple-700 mouse-pointer select-none block w-fit",
            textContent: "Submit",
        };
        this.btnComp.typ = this.typ;
        this.btnComp.props = this.props;
        this.btnComp.handlers = this.handlers;
        this.btnComp.states = this.states;
    }
}

export class Repeater implements IComponent {
    handlers: { [key: string]: (...args: any[]) => void } = {};
    states: { [key: string]: any } = {};
    props: { [key: string]: string } = {};

    repeaterComp: GComponent = new GComponent();
    itemComp: { [key: string]: GComponent } = {};
    render(): HTMLElement {
        this.repeaterComp.typ = "div";

        for (const item of this.states.data) {
            let itemComp = this.createItem(item);
            this.itemComp[item.key] = itemComp;
            this.repeaterComp.getElement()?.appendChild(itemComp.getElement()!);
        }
        return this.repeaterComp.render();
    }

    createItem(item: any) {
        let itemComp = new GComponent();
        itemComp.typ = "div";
        itemComp.props = {
            class: "bg-gray-200 p-3 rounded-lg",
            textContent: "Submit",
        };
        itemComp.update(item);
        itemComp.render();
        return itemComp;
    }

    setData(data: any[]) {
        for (const item of data) {
            if (!item.hasOwnProperty("key")) {
                throw new Error("Item does not have key property");
            }
        }
        this.states.data = data;
    }

    updateKey(key: string, ...args: any) {
        this.itemComp[key].update(...args);
    }

    update(
        props?: { [key: string]: string },
        state?: { [key: string]: any },
        handlers?: { [key: string]: (...args: any[]) => void }
    ): void {
        this.repeaterComp.update(props, state, handlers);
    }
    getElement(): HTMLElement {
        return this.repeaterComp.getElement()!;
    }
}

export class GenericForm implements IComponent {
    handlers: { [key: string]: (...args: any[]) => void } = {};
    states: { [key: string]: any } = {};
    props: { [key: string]: string } = {};
    formComp: GComponent = new GComponent();
    itemsComp: { [key: string]: GComponent } = {};
    constructor() {
        this.formComp.typ = "form";
    }
    render(): HTMLElement {
        for (const item of this.states.formStruc) {
            let itemComp = this.createItem(item);
            this.itemsComp[item.key] = itemComp;
            this.formComp.getElement()?.appendChild(itemComp.getElement()!);
        }
        return this.formComp.render();
    }

    createItem(item: any) {
        let itemComp = new GComponent();
        itemComp.typ = "input";
        itemComp.update(item);
        itemComp.render();
        return itemComp;
    }

    setFormStruc(formStruc: any[]) {
        this.states.formStruc = formStruc;
    }

    update(
        props?: { [key: string]: string },
        state?: { [key: string]: any },
        handlers?: { [key: string]: (...args: any[]) => void }
    ): void {
        this.formComp.update(props, state, handlers);
    }

    getFormData() {
        let formData: { [key: string]: any } = {};
        for (const key in this.itemsComp) {
            let getter = this.itemsComp[key].states.valueGetter;
            if (getter)
                formData[key] = getter(this.itemsComp[key].getElement()!);
        }
        return formData;
    }

    getElement(): HTMLElement | null {
        return this.formComp.getElement();
    }
}

export class Accordion implements IComponent {
    handlers: { [key: string]: (...args: any[]) => void } = {};
    states: { [key: string]: any } = {};
    props: { [key: string]: string } = {};
    accordionComp: GComponent = new GComponent();

    render(): HTMLElement {
        throw new Error("Method not implemented.");
    }
    update(
        props?: { [key: string]: string },
        state?: { [key: string]: any },
        handlers?: { [key: string]: (...args: any[]) => void }
    ): void {
        throw new Error("Method not implemented.");
    }
    getElement(): HTMLElement | null {
        throw new Error("Method not implemented.");
    }
}

export class ContextMenu implements IComponent {
    handlers: { [key: string]: (...args: any[]) => void } = {};
    states: { [key: string]: any } = {};
    props: { [key: string]: string } = {};
    contextMenuComp: GComponent = new GComponent();
    render(): HTMLElement {
        throw new Error("Method not implemented.");
    }
    update(
        props?: { [key: string]: string },
        state?: { [key: string]: any },
        handlers?: { [key: string]: (...args: any[]) => void }
    ): void {
        throw new Error("Method not implemented.");
    }
    getElement(): HTMLElement | null {
        throw new Error("Method not implemented.");
    }
}

export class Dropdown implements IComponent {
    handlers: { [key: string]: (...args: any[]) => void } = {};
    states: { [key: string]: any } = {};
    props: { [key: string]: string } = {};
    dropdownComp: GComponent = new GComponent();
    render(): HTMLElement {
        throw new Error("Method not implemented.");
    }
    update(
        props?: { [key: string]: string },
        state?: { [key: string]: any },
        handlers?: { [key: string]: (...args: any[]) => void }
    ): void {
        throw new Error("Method not implemented.");
    }
    getElement(): HTMLElement | null {
        throw new Error("Method not implemented.");
    }
}
