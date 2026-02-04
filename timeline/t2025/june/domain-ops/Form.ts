import { GComponent } from "../../../globalComps/GComponent";
import { Tools } from "../../../globalComps/tools";
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
            params?: any;
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
export const JSONComponent = (props: [any?, any?, any?]) => {
    let comp = Tools.comp("textarea", ...props);
    const get = () => {
        const input = comp.getElement() as HTMLTextAreaElement;
        return JSON.parse(input.value);
    };
    const set = (value: any): void => {
        const input = comp.getElement() as HTMLTextAreaElement;
        input.value = JSON.stringify(value, null, 2);
    };
    const clear = () => {
        set("");
    };
    comp.update({}, {}, { handlers: { get, set, clear } });
    return comp;
};
export const Checkbox = (
    name: string,
    params?: { container?: any; label?: any; inp?: any },
    label?: string
) => {
    const currentTimestamp = new Date().getTime().toString();
    let tlabel = label ?? name;
    let forVal = name + currentTimestamp;
    let comp = Tools.div({
        class: "flex items-center gap-1 h-full",
        children: [
            Tools.comp("label", {
                key: "label",
                class: "text-xl cursor-pointer",
                textContent: tlabel,
                for: forVal,
                ...params?.label,
            }),
            Tools.comp("input", {
                key: "inp",
                type: "checkbox",
                class: "bg-gray-200 focus:outline-none flex-1 w-6 h-6 cursor-pointer",
                name: name,
                id: forVal,
                ...params?.inp,
            }),
        ],
        ...params?.container,
    });
    const get = () => {
        const input = comp.s.inp.getElement() as HTMLInputElement;
        return input.checked;
    };
    const set = (value: any): void => {
        const input = comp.s.inp.getElement() as HTMLInputElement;
        input.checked = value;
    };
    const clear = () => {
        set(false);
    };
    comp.update({}, {}, { handlers: { get, set, clear } });
    return comp;
};
export const FormComponents: any = {
    cinput: FormInputComponent,
    multiselect: MultiSelect,
    select: Select,
    textarea: Textarea,
    json: JSONComponent,
    checkbox: Checkbox,
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
                    class: "cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded w-fit self-end",
                    ...params,
                },
                ...args,
            ],
        };
    },
    multi: (key: string, options: { value: string; label: string }[]) => {
        return {
            key,
            type: "multiselect",
            params: options.map((option) => ({
                value: option.value,
                textContent: option.label,
            })),
        };
    },
    select: (key: string, options: { value: string; label: string }[]) => {
        return {
            key,
            type: "select",
            params: options,
        };
    },
    textArea: (key: string, ...args: any) => {
        return {
            key,
            type: "textarea",
            params: [...args],
        };
    },
    date: (key: string, ...args: any) => {
        return {
            key,
            type: "cinput",
            params: [...args, { type: "date" }],
        };
    },
    time: (key: string, ...args: any) => {
        return {
            key,
            type: "cinput",
            params: [...args, { type: "time" }],
        };
    },
    file: (key: string, ...args: any) => {
        return {
            key,
            type: "cinput",
            params: [...args, { type: "file" }],
        };
    },
    datetime: (key: string, ...args: any) => {
        return {
            key,
            type: "cinput",
            params: [...args, { type: "datetime" }],
        };
    },
    checkbox: (key: string, ...args: any) => {
        return {
            key,
            type: "checkbox",
            params: [key, ...args],
        };
    },
    json: (key: string, ...args: any) => {
        return {
            key,
            type: "json",
            params: [...args],
        };
    },
};
