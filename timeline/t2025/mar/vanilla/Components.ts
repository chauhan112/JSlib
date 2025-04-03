import { IComponent } from "./interfaces";

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
                return;
            }
            if (key === "innerHTML") {
                this.component.innerHTML = value;
                return;
            }
            if (key === "children") {
                for (let child of value) {
                    this.component.appendChild(child.getElement());
                }
                return;
            }
            if (key === "child") {
                this.component.appendChild(value.getElement());
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
    private updateState(
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
    getElement(): HTMLElement {
        if (!this.component) {
            this.component = document.createElement(this.typ);
            this.updateState(this.props, this.handlers);
        }
        return this.component;
    }
}

export class Button implements IComponent {
    handlers: { [key: string]: (...args: any[]) => void } = {};
    states: { [key: string]: any } = {};
    props: { [key: string]: string } = {};
    comp: GComponent = new GComponent();
    constructor() {
        this.comp.typ = "button";
        this.comp.props = {
            class: "bg-gray-200 p-3 rounded-lg",
            textContent: "Submit",
        };
    }

    update(
        props?: { [key: string]: string },
        state?: { [key: string]: any },
        handlers?: { [key: string]: (...args: any[]) => void }
    ): void {
        this.comp.update(props, state, handlers);
    }
    getElement(): HTMLElement {
        return this.comp.getElement();
    }
}

export class LinkButton implements IComponent {
    states: { [key: string]: any } = {};
    comp: GComponent = new GComponent();
    constructor() {
        this.comp.typ = "a";
        this.comp.props = {
            class: "bg-purple-800 text-white px-6 py-3 rounded-lg hover:bg-purple-700 mouse-pointer select-none block w-fit",
            textContent: "Submit",
            href: "#",
        };
    }

    getElement(): HTMLElement {
        return this.comp.getElement();
    }
    update(
        props?: { [key: string]: string },
        state?: { [key: string]: any },
        handlers?: { [key: string]: (...args: any[]) => void },
        stateUpdate?: boolean
    ): void {
        this.comp.update(props, state, handlers, stateUpdate);
    }
}

export class Repeater implements IComponent {
    states: { [key: string]: any } = {};
    comp: GComponent = new GComponent();
    itemComp: { [key: string]: IComponent } = {};
    constructor() {
        this.states.data = [];
    }
    createItem(item: any): IComponent {
        let itemComp = new GComponent();
        itemComp.typ = this.states.itemTyp || "div";
        itemComp.props = this.states.itemProps || {
            class: "bg-gray-200 p-3 rounded-lg",
            textContent: "Submit",
        };
        itemComp.update(item, this.states.itemState, this.states.itemHandlers);
        return itemComp;
    }
    private updateItem() {
        for (const item of this.states.data) {
            if (!this.itemComp[item.key]) {
                let itemComp = this.createItem(item);
                this.itemComp[item.key] = itemComp;
                this.getElement().appendChild(itemComp.getElement());
            } else {
                this.updateKey(item.key, item);
            }
        }
    }

    setData(data: any[]) {
        for (const item of data) {
            if (!item.hasOwnProperty("key")) {
                throw new Error("Item does not have key property");
            }
        }
        this.states.data = data;
        this.updateItem();
    }
    updateKey(key: string, ...args: any) {
        this.itemComp[key].update(...args);
    }
    update(
        props?: { [key: string]: string },
        state?: { [key: string]: any },
        handlers?: { [key: string]: (...args: any[]) => void },
        stateUpdate: boolean = true
    ): void {
        this.comp.update(props, state, handlers, stateUpdate);
    }
    getElement(): HTMLElement {
        return this.comp.getElement();
    }
}

export class GenericForm implements IComponent {
    states: { [key: string]: any } = {};
    comp: GComponent | null = null;
    itemsComp: { [key: string]: IComponent } = {};

    constructor() {
        this.states.formStruc = [
            {
                key: "name",
                type: "text",
                value: "John Doe",
                placeholder: "Enter your name",
            },
        ];
    }
    private get_comp() {
        if (!this.comp) {
            this.comp = new GComponent();
            this.comp.typ = "form";
            for (const item of this.states.formStruc) {
                let itemComp = this.createItem(item);
                this.itemsComp[item.key] = itemComp;
                this.getElement().appendChild(itemComp.getElement());
            }
        }
        return this.comp;
    }

    createItem(item: any) {
        let itemComp = new GComponent();
        itemComp.typ = "input";
        itemComp.update(item);
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
        let comp = this.get_comp();
        comp.update(props, state, handlers);
    }

    getFormData() {
        let formData: { [key: string]: any } = {};
        for (const key in this.itemsComp) {
            let getter = this.itemsComp[key].states.valueGetter;
            if (getter)
                formData[key] = getter(this.itemsComp[key].getElement());
        }
        return formData;
    }

    getElement(): HTMLElement {
        let comp = this.get_comp();
        return comp.getElement();
    }
}

export class Dropdown implements IComponent {
    states: { [key: string]: any } = {};
    comp: Grouper | null = null;
    constructor() {
        this.states.data = [];
        this.states.open = false;
    }
    private get_comp() {
        if (!this.comp) {
            this.comp = new Grouper();
            this.makeComp();
        }
        return this.comp;
    }
    private makeComp() {
        let comp = this.get_comp();
        comp.update({
            class: "relative w-64 mb-8 mx-auto",
        });
        let btnComp = new GComponent();
        btnComp.typ = "button";

        btnComp.update(
            {
                class: "w-full px-4 py-2 text-white bg-gray-900 rounded-lg border-2 border-pink-500 neon-glow",
                textContent: "Neon Glow",
            },
            {},
            {
                click: () => {
                    this.states.open = !this.states.open;
                    this.states.comp.conditional.setValue(this.states.open);
                },
            }
        );

        let optionsComp = new Repeater();
        optionsComp.states.itemProps = {
            class: "bg-gray-200 p-3 rounded-lg hover:bg-gray-300",
        };
        optionsComp.update({
            class: "absolute w-full mt-2 bg-gray-900 rounded-lg shadow-lg shadow-pink-500/50",
        });
        optionsComp.setData(this.states.data);

        let conditional = new ConditionalComponent();
        conditional.setConditions([[(value: boolean) => value, optionsComp]]);

        comp.getElement().appendChild(conditional.getElement());

        comp.setChildren([btnComp, conditional]);

        this.states.comp = {
            btnComp: btnComp,
            conditional: conditional,
            optionsComp: optionsComp,
        };
    }
    setOptions(options: any[]) {
        this.states.data = options;
    }
    update(
        props?: { [key: string]: string },
        state?: { [key: string]: any },
        handlers?: { [key: string]: (...args: any[]) => void },
        stateUpdate: boolean = true
    ): void {
        this.get_comp().update(props, state, handlers, stateUpdate);
    }
    getElement(): HTMLElement {
        let comp = this.get_comp();
        return comp.getElement();
    }
}

export class ConditionalComponent implements IComponent {
    states: { [key: string]: any } = {};
    comp: GComponent = new GComponent();
    private isRendered = false;
    constructor() {
        this.states.conditions = [];
    }
    setValue(value: any) {
        this.states.value = value;

        this.comp.update({
            innerHTML: "",
        });
        for (const condition of this.states.conditions) {
            if (condition[0](value)) {
                if (condition[1])
                    this.getElement().appendChild(condition[1].getElement());
                break;
            }
        }
    }
    setConditions(conditions: [(value: any) => boolean, IComponent][]) {
        this.states.conditions = conditions;
    }
    update(
        props?: { [key: string]: string },
        state?: { [key: string]: any },
        handlers?: { [key: string]: (...args: any[]) => void }
    ): void {
        this.comp.update(props, state, handlers);
    }
    getElement(): HTMLElement {
        if (!this.isRendered) {
            this.isRendered = true;
            this.setValue(this.states.defaultValue);
        }
        return this.comp.getElement();
    }
}

export class Grouper implements IComponent {
    handlers: { [key: string]: (...args: any[]) => void } = {};
    states: { [key: string]: any } = {};
    props: { [key: string]: string } = {};
    comp: GComponent = new GComponent();

    update(
        props?: { [key: string]: string },
        state?: { [key: string]: any },
        handlers?: { [key: string]: (...args: any[]) => void },
        stateUpdate: boolean = true
    ): void {
        this.comp.update(props, state, handlers, stateUpdate);
    }
    setChildren(children: IComponent[]) {
        this.states.children = children;
        for (const child of this.states.children) {
            this.comp.getElement().appendChild(child.getElement());
        }
    }
    getElement(): HTMLElement {
        return this.comp.getElement();
    }
}

export class Breadcrumb implements IComponent {
    handlers: { [key: string]: (...args: any[]) => void } = {};
    states: { [key: string]: any } = {};
    props: { [key: string]: string } = {};
    breadcrumbComp: Repeater = new Repeater();

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

export class Header implements IComponent {
    handlers: { [key: string]: (...args: any[]) => void } = {};
    states: { [key: string]: any } = {};
    props: { [key: string]: string } = {};
    headerComp: GComponent = new GComponent();
    constructor() {
        this.headerComp.typ = "div";
    }
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

export class Sidebar implements IComponent {
    handlers: { [key: string]: (...args: any[]) => void } = {};
    states: { [key: string]: any } = {};
    props: { [key: string]: string } = {};
    sidebarComp: GComponent = new GComponent();
    constructor() {
        this.sidebarComp.typ = "div";
    }
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

export class Footer implements IComponent {
    handlers: { [key: string]: (...args: any[]) => void } = {};
    states: { [key: string]: any } = {};
    props: { [key: string]: string } = {};
    footerComp: GComponent = new GComponent();
    constructor() {
        this.footerComp.typ = "div";
    }
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

export class Modal implements IComponent {
    handlers: { [key: string]: (...args: any[]) => void } = {};
    states: { [key: string]: any } = {};
    props: { [key: string]: string } = {};
    modalComp: GComponent = new GComponent();
    constructor() {
        this.modalComp.typ = "div";
    }
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

export class Tab implements IComponent {
    handlers: { [key: string]: (...args: any[]) => void } = {};
    states: { [key: string]: any } = {};
    props: { [key: string]: string } = {};
    tabComp: GComponent = new GComponent();
    constructor() {
        this.tabComp.typ = "div";
    }
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

export class Card implements IComponent {
    handlers: { [key: string]: (...args: any[]) => void } = {};
    states: { [key: string]: any } = {};
    props: { [key: string]: string } = {};
    cardComp: GComponent = new GComponent();
    constructor() {
        this.cardComp.typ = "div";
    }
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

export class HomeTitleSidebar implements IComponent {
    handlers: { [key: string]: (...args: any[]) => void } = {};
    states: { [key: string]: any } = {};
    props: { [key: string]: string } = {};
    homeTitleSidebarComp: GComponent = new GComponent();
    constructor() {
        this.homeTitleSidebarComp.typ = "div";
    }
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
