import { Tools } from "../../../april/tools";
import { MainCtrl as AtomicMainCtrl, type IInputCompCtrl } from "./atomic";

export const NewDynamicForm = () => {
    return Tools.comp(
        "form",
        {
            class: "w-full flex flex-col p-2 gap-2",
        }
    );
}
export const FormElementType: { [key: string]: (...params: any[]) => IInputCompCtrl } = {
    Input: ({ attrs, handlers }: {
        attrs?: { [key: string]: string },
        handlers?: { [key: string]: (e: any, ls: any) => void }
    }) => AtomicMainCtrl.input(attrs, handlers),
    Select: ({ options = [] }: { options: { value: string; label: string }[] }) => AtomicMainCtrl.dropdown(options),
    Textarea: ({ attrs, handlers }: {
        attrs?: { [key: string]: string },
        handlers?: { [key: string]: (e: any, ls: any) => void }
    }) => AtomicMainCtrl.textarea(attrs, handlers),
    MultiSelect: ({ options = [], selected_values = [], placeholder = "Select options..." }: {
        options: { value: string; label: string }[],
        selected_values: { value: string; label?: string }[],
        placeholder?: string
    }) => AtomicMainCtrl.multiSelect(options, selected_values, placeholder),
}
export class NewDynamicFormCtrl implements IInputCompCtrl {
    comp: any;
    formElementCtrls: { [key: string]: any } = {};
    current_infos: any;
    onSubmit: (data: any) => void = () => {
        console.log(this.get_value());
    };
    get_value() {
        let values: { [key: string]: any } = {};
        for (const key in this.formElementCtrls) {
            values[key] = this.formElementCtrls[key].get_value();
        }
        return values;
    }
    set_comp(comp: any) {
        this.comp = comp;
    }
    setup() {
        this.comp.update({}, { submit: (e: any,) => this.def_submit(e) });
    }
    private def_submit(e: any,) {
        e.preventDefault();
        this.onSubmit(this.get_value());
    }
    add_field(key: string, compCtrl: IInputCompCtrl) {
        this.formElementCtrls[key] = compCtrl;
        this.comp.update({ child: compCtrl.comp });
    }
    clear_comps() {
        this.formElementCtrls = {};
        this.comp.update({ innerHTML: "" });
    }
    clear_value() {
        for (const key in this.formElementCtrls) {
            this.formElementCtrls[key].clear_value();
        }
    }
    set_value(values: { [key: string]: any }) {
        for (const key in values) {
            if (this.formElementCtrls[key]) {
                this.formElementCtrls[key].set_value(values[key]);
            }
        }
    }
    add_field_with_type(key: string, type: any, params?: any) {
        if (params) {
            this.add_field(key, FormElementType[type](params));
        } else {
            this.add_field(key, FormElementType[type]());
        }
    }
    add_submit_button(text?: string) {
        this.comp.update({ child: Tools.comp("button", { textContent: text || "Submit", class: "cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded w-fit self-end" }) });
    }
    set_fields(fields: { key: string, type: any, params?: any }[]) {
        for (const field of fields) {
            this.add_field_with_type(field.key, field.type, field.params);
        }
    }
}

export class MainCtrl {
    static dynamicForm(fields: { key: string, type: any, params?: any }[], submitBtnText?: string) {
        const formCtrl = new NewDynamicFormCtrl();
        const form = NewDynamicForm();
        formCtrl.set_comp(form);
        for (const field of fields) {
            formCtrl.add_field_with_type(field.key, field.type, field.params);
        }
        formCtrl.add_submit_button(submitBtnText);
        formCtrl.setup();
        return formCtrl;
    }
}

// example usage
const formCtrl = MainCtrl.dynamicForm([
    { key: "name", type: "Input", params: { attrs: { placeholder: "Enter name", type: "text" } } },
    { key: "email", type: "Input", params: { attrs: { placeholder: "Enter email", type: "email" } } },
    { key: "password", type: "Input", params: { attrs: { placeholder: "Enter password", type: "password" } } },
    { key: "date", type: "Input", params: { attrs: { placeholder: "Enter date", type: "date" } } },
    { key: "time", type: "Input", params: { attrs: { placeholder: "Enter time", type: "time" } } },
    { key: "datetime", type: "Input", params: { attrs: { placeholder: "Enter datetime", type: "datetime" } } },
    { key: "file", type: "Input", params: { attrs: { placeholder: "Enter file", type: "file" }, handlers: { change: (e: any, ls: any) => { console.log(e.target.files); } } } },
    { key: "description", type: "Textarea", params: { attrs: { placeholder: "Enter description" } } },
    {
        key: "domains", type: "MultiSelect", params: {
            options: [{ value: "1", label: "Option 1" }, { value: "2", label: "Option 2" }, { value: "3", label: "Option 3" }],
            selected_values: [{ value: "1", label: "Option 1" }, { value: "2", label: "Option 2" }], placeholder: "Select domains"
        }

    },
    {
        key: "operation", type: "Select", params: {
            options: [{ value: "1", label: "Option 1" }, { value: "2", label: "Option 2" }, { value: "3", label: "Option 3" }]
        }
    },
]);
