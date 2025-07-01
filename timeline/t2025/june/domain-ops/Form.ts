import { GComponent } from "../../april/GComponent";
import { Tools } from "../../april/tools";
import { MultiSelectComponent, SelectComponent } from "./Component";

export const FormInputComponent = (props: [any?, any?, any?]) => {
    const comp = Tools.comp("input", ...props);
    const get = () => {
        const input = comp.getElement() as HTMLInputElement;
        return input.value;
    };
    const set = (value: any): void => {
        const input = comp.getElement() as HTMLInputElement;
        input.value = value;
    };
    const clear = () => {
        set("");
    };
    comp.update({}, {}, { handlers: { get, set, clear } });
    return comp;
};

export const GenericForm = () => {
    const formElements: { [key: string]: any } = {};

    const getValues = () => {
        const values: { [key: string]: string } = {};
        for (const key in formElements) {
            values[key] = formElements[key].s.handlers.get();
        }
        return values;
    };
    const setValues = (values: { [key: string]: string }) => {
        for (const key in formElements) {
            formElements[key].s.handlers.set(values[key]);
        }
    };
    const clearValues = () => {
        for (const key in formElements) {
            formElements[key].s.handlers.clear();
        }
    };
    const createItem = (type: string, item: any) => {
        return FormComponents[type](item);
    };

    const setComponents = (
        components: {
            type: string;
            key: string;
            params: any;
        }[]
    ) => {
        let children: GComponent[] = [];
        for (const component of components) {
            let comp = handlers.createItem(component.type, component.params);
            if (component.key) {
                formElements[component.key] = comp;
            }
            children.push(comp);
        }
        comp.update({ innerHTML: "", children: children });
        return formElements;
    };
    const submit = (e: any, ls: any) => {
        e.preventDefault();
        console.log(ls.s.handlers.getValues());
    };
    const handlers: any = {
        getValues,
        setValues,
        clearValues,
        createItem,
        setComponents,
        submit,
    };
    const comp = Tools.comp(
        "form",
        {
            class: "w-full flex flex-col p-2 gap-2",
        },
        {
            submit: (e: any, ls: any) => {
                handlers.submit(e, ls);
            },
        },
        {
            handlers,
            formElements,
        }
    );

    return comp;
};

export const MultiSelect = (
    options: { value: string; textContent: string }[]
) => {
    const comp = MultiSelectComponent([]);
    comp.update(
        {},
        {},
        {
            handlers: {
                set: (values: string[]) => comp.s.setValue(values),
                get: () => comp.s.getValue(),
                clear: () => comp.s.setValue([]),
            },
        }
    );
    comp.s.setOptions(options);
    return comp;
};

export const Select = (options: { value: string; textContent: string }[]) => {
    const comp = SelectComponent(options);
    comp.update(
        {},
        {},
        {
            handlers: {
                set: (values: string[]) => comp.s.setValue(values),
                get: () => comp.s.getValue(),
                clear: () => {},
            },
        }
    );
    return comp;
};
export const Textarea = (props: [any?, any?, any?]) => {
    let comp = Tools.comp("textarea", ...props);
    const get = () => {
        const input = comp.getElement() as HTMLTextAreaElement;
        return input.value;
    };
    const set = (value: any): void => {
        const input = comp.getElement() as HTMLTextAreaElement;
        input.value = value;
    };
    const clear = () => {
        set("");
    };
    comp.update({}, {}, { handlers: { get, set, clear } });
    return comp;
};
export const FormComponents: any = {
    cinput: FormInputComponent,
    multiselect: MultiSelect,
    select: Select,
};
export const Params = {
    inp: (key: string, ...args: any) => {
        return {
            key,
            type: "cinput",
            params: [...args],
        };
    },
    inpSubmit: (params?: any, ...args: any) => {
        return {
            type: "cinput",
            params: [
                {
                    type: "submit",
                    ...params,
                },
                ...args,
            ],
        };
    },
    multi: (key: string, options: [string, string][]) => {
        return {
            key,
            type: "multiselect",
            params: options.map((option) => ({
                value: option[0],
                textContent: option[1],
            })),
        };
    },
    select: (key: string, options: [string, string][]) => {
        return {
            key,
            type: "select",
            params: options.map((option) => ({
                value: option[0],
                label: option[1],
            })),
        };
    },
};
