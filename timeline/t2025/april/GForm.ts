import { IComponent, Tools, GComponent } from "./GComponent";

export class GForm implements IComponent {
    s: { [key: string]: any } = {};
    comp: GComponent | null = null;

    constructor() {
        this.s.data = [
            {
                type: "input",
                props: {
                    key: "domain",
                    placeholder: "Enter domain",
                },
            },
            {
                type: "input",
                props: {
                    type: "submit",
                    textContent: "Submit",
                },
            },
        ];
        this.s.values = {};
        this.s.funcs = {
            createItem: this.createItem.bind(this),
            onSubmit: this.onSubmit.bind(this),
        };
    }
    getValues(e?: any, s?: any) {
        const values: { [key: string]: string } = {};
        for (const item of this.s.components) {
            if (item.props.key) {
                values[item.props.key] = item.getElement().value;
            }
        }
        return values;
    }
    setValues(values: { [key: string]: string }) {
        for (const item of this.s.components) {
            if (item.props.key) {
                item.getElement().value = values[item.props.key];
            }
        }
    }
    clearValues() {
        for (const item of this.s.components) {
            if (item.props.key) {
                item.getElement().value = "";
            }
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
        this.s.components = this.s.data.map(this.s.funcs.createItem);
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
        return Tools.comp(item.type, {
            class: "w-full p-2 rounded-md bg-gray-100 text-black",
            ...item.props,
        });
    }
}

export const gformTest = () => {
    let gform = new GForm();
    gform.s.data = [
        {
            type: "input",
            props: {
                key: "domain",
                placeholder: "Enter domain",
            },
        },
        {
            type: "input",
            props: {
                key: "operations",
                placeholder: "Enter operations",
            },
        },
        {
            type: "input",
            props: {
                type: "submit",
                textContent: "Submit",
                class: "w-full p-2 rounded-md bg-blue-500 text-white",
            },
        },
    ];
    gform.getElement();
    return gform;
};
