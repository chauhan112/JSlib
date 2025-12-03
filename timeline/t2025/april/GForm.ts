import { type IComponent, GComponent } from "./GComponent";
import { Tools } from "./tools";

export interface IFormComponent {
    get(): any;
    set(value: any): void;
    clear(): void;
}

export class Input implements IFormComponent, IComponent {
    comp: GComponent;
    s: { [key: string]: any } = {};
    typ: string;
    constructor(props: any, typ: string = "input") {
        this.typ = typ;
        this.comp = Tools.comp(this.typ, {
            ...props,
        });
    }

    getElement(): HTMLElement | SVGElement {
        return this.comp.getElement();
    }
    getProps(): { [key: string]: any } {
        return this.comp.getProps();
    }
    get(): any {
        const input = this.comp.getElement() as HTMLInputElement;
        return input.value;
    }
    set(value: any): void {
        const input = this.comp.getElement() as HTMLInputElement;
        input.value = value;
    }
    clear(): void {
        this.set("");
    }
}

export class GForm implements IComponent {
    s: { [key: string]: any } = {};
    comp: GComponent | null = null;
    formElements: { [key: string]: IFormComponent } = {};
    constructor() {
        this.s.data = [];
        this.s.values = {};
        this.s.funcs = {
            createItem: this.createItem.bind(this),
            onSubmit: this.onSubmit.bind(this),
        };
    }
    getValues() {
        const values: { [key: string]: string } = {};
        for (const key in this.formElements) {
            values[key] = this.formElements[key].get();
        }
        return values;
    }
    setValues(values: { [key: string]: string }) {
        for (const key in values) {
            this.formElements[key].set(values[key]);
        }
    }
    clearValues() {
        for (const key in this.formElements) {
            this.formElements[key].clear();
        }
    }
    onSubmit(e: any, s: any) {
        e.preventDefault();
        console.log(s.values);
    }
    getProps(): { [key: string]: any } {
        return this.comp!.getProps();
    }
    getElement(): HTMLElement | SVGElement {
        if (this.comp) {
            return this.comp.getElement();
        }
        this.s.components = this.s.data.map((item: any) => {
            let comp = this.s.funcs.createItem(item);
            if (item.key) {
                this.formElements[item.key] = comp;
            }
            return comp;
        });
        this.comp = Tools.comp(
            "form",
            {
                class: "w-full flex flex-col p-2 gap-2",
                children: this.s.components,
            },
            {
                submit: (e: any) =>
                    this.s.funcs.onSubmit(e, {
                        values: this.getValues(),
                        form: this,
                    }),
            }
        );
        return this.comp.getElement();
    }
    createItem(item: any) {
        return new Input({
            class: "w-full p-2 rounded-md bg-gray-100 text-black",
            ...item,
        });
    }
}

export class Main {
    static form(structs: any[]) {
        const formm = new GForm();
        formm.s.data = structs;
        formm.getElement();
        return formm;
    }
}
export const gformTest = () => {
    let gform = new GForm();
    gform.s.data = [
        {
            type: "text",
            key: "domain",
            placeholder: "Enter domain",
        },
        {
            type: "text",
            key: "operations",
            placeholder: "Enter operations",
        },
        {
            type: "submit",
            textContent: "Submit",
            class: "w-full p-1 rounded-md bg-blue-500 text-white",
        },
    ];

    gform.getElement();
    return gform;
};
