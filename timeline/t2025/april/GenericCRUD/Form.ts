import { Tools } from "../tools";
import { ListWithCrud } from "../ListWithCrud";
import { Eye, Trash, Pencil } from "lucide";
import { GForm, Input } from "../GForm";

export const compCreator = (props: any) => {
    return new Input(props, "input");
};
type FormCompType = "dropdown" | "input" | "textarea";
type FormCompProps = { type: FormCompType; props: any; key?: string };

export const dropdownComp = (props: any) => {
    let comp = Tools.comp("select", {
        class: "w-full p-2 rounded-md bg-gray-100 text-black",
        ...props?.selectProps,
        children: props?.options.map((option: any) => {
            return Tools.comp("option", option);
        }),
    });
    const setOptions = (options: any[]) => {
        comp.update({
            innerHTML: "",
            children: options.map((option: any) => {
                return Tools.comp("option", option);
            }),
        });
    };
    const getElement = () => comp.getElement();
    const getProps = () => comp.getProps();
    const get = () => {
        const c = getElement() as HTMLSelectElement;
        return c.value;
    };
    const set = (value: any) => {
        const c = getElement() as HTMLSelectElement;
        c.value = value;
    };
    const clear = () => {
        const c = getElement() as HTMLSelectElement;
        c.value = "";
    };
    const s = {};
    return { comp, setOptions, getElement, getProps, get, set, clear, s };
};

export const NewForm = (strucs: FormCompProps[]) => {
    let form = new GForm();
    form.s.funcs.createItem = (item: FormCompProps) => {
        if (item?.type === "input") {
            return new Input({
                class: "w-full p-2 rounded-md bg-gray-100 text-black",
                ...item?.props,
            });
        } else if (item?.type === "dropdown") {
            return Tools.dropdown(
                item?.props?.options,
                null,
                item?.props.selectProps
            );
        } else if (item?.type === "textarea") {
            return new Input(item?.props, "textarea");
        }
    };
    form.s.data = strucs;
    form.getElement();
    return form;
};

export const CRUDForm = () => {
    const lc = new ListWithCrud();
    lc.s.funcs.createItem = (item: any) => {
        return Tools.div({
            class: "w-full flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300",
            children: [
                Tools.div({ textContent: item.name }, {}, { data: item }),
                Tools.div({
                    class: "w-fit flex items-center justify-between",
                    children: lc.s.funcs.operationsMaker(item),
                }),
            ],
        });
    };
    lc.s.funcs.operationsMaker = (item: any) => {
        return [
            Tools.icon(
                Eye,
                {
                    class: "hover:transform hover:scale-110 hover:cursor-pointer",
                },
                {
                    click: (e: any, ls: any) => {
                        lc.s.funcs.contextMenuClick(e, {
                            ops: "read",
                            data: item,
                        });
                    },
                },
                { data: item }
            ),
            Tools.icon(
                Trash,
                {
                    class: "hover:transform hover:scale-110 mx-4 hover:cursor-pointer",
                },
                {
                    click: (e: any, ls: any) => {
                        lc.s.funcs.contextMenuClick(e, {
                            ops: "delete",
                            data: item,
                        });
                    },
                },
                { data: item }
            ),
            Tools.icon(
                Pencil,
                {
                    class: "hover:transform hover:scale-110 hover:cursor-pointer",
                },
                {
                    click: (e: any, ls: any) => {
                        lc.s.funcs.contextMenuClick(e, {
                            ops: "edit",
                            data: item,
                        });
                    },
                },
                { data: item }
            ),
        ];
    };
    lc.getElement();
    const formProps: FormCompProps[] = [
        {
            type: "input",
            key: "keyName",
            props: {
                type: "text",
                placeholder: "set key",
            },
        },
        {
            type: "dropdown",
            key: "fieldType",
            props: {
                selectProps: {},
                options: [
                    {
                        textContent: "Input",
                        value: "Input",
                    },
                    {
                        textContent: "Textarea",
                        value: "Textarea",
                    },
                    {
                        textContent: "More Options",
                        value: "JSON",
                    },
                    {
                        textContent: "Dropdown",
                        value: "Dropdown",
                    },
                    {
                        textContent: "Checkbox",
                        value: "Checkbox",
                    },
                ],
            },
        },
        {
            type: "textarea",
            key: "moreOps",
            props: {
                placeholder: "enter json formatter more options",
                class: "w-full p-2 rounded-md bg-gray-100 text-black",
            },
        },
        {
            type: "input",
            key: "order",
            props: {
                type: "number",
                placeholder: "set order",
                class: "w-fit p-2",
            },
        },
        {
            type: "input",
            props: {
                type: "submit",
                textContent: "Submit",
                class: "w-fit p-1 ml-8 px-4 rounded-md bg-blue-500 text-white",
            },
        },
    ];
    const form = NewForm(formProps);
    const onCancel = (e: any, ls: any) => {
        state.formArea.clear();
        state.formArea.display(createBtn);
    };
    const cancelBtn = Tools.comp(
        "button",
        {
            textContent: "Cancel",
            class: "w-fit p-2 px-4 rounded-md bg-red-500 text-white hover:shadow-lg hover:cursor-pointer",
        },
        {
            click: onCancel,
        }
    );
    let formWithCancel = Tools.div({
        class: "w-full flex items-center justify-between p-2",
        children: [form, cancelBtn],
    });

    const createBtn = Tools.comp(
        "button",
        {
            textContent: "Create",
            class: "w-fit p-4 m-4 px-8 rounded-md bg-blue-500 text-white hover:shadow-lg hover:cursor-pointer",
        },
        {
            click: (e: any, ls: any) => {
                state.formArea.clear();
                state.formArea.display(state.formWithCancel);
            },
        }
    );

    const formArea = Tools.container({
        class: "w-full flex flex-col ",
        children: [createBtn],
    });
    const lay = Tools.div({
        class: "w-full flex flex-col items-center justify-center",
        children: [formArea, lc],
    });
    const state = {
        lc,
        layout: lay,
        formArea,
        formWithCancel,
        createBtn,
        cancelBtn,
        form,
        onCancel,
        formProps,
    };

    return state;
};
