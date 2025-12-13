import { Tools } from "../../../april/tools";
import {  MainCtrl as AtomicMainCtrl,  type IInputCompCtrl } from "./atomic";

export const NewDynamicForm = () => {
    return Tools.comp(
        "form",
        {
            class: "w-full flex flex-col p-2 gap-2",
        }
    );
}
export const FormElementType: { [key: string]: (...params: any[]) => IInputCompCtrl } = {
    Input: ({attrs, handlers}: {attrs?: { [key: string]: string }, 
        handlers?: { [key: string]: (e: any, ls: any) => void }}) => AtomicMainCtrl.input(attrs, handlers),
    Select: ({options = []}: {options: { value: string; label: string }[] }) => AtomicMainCtrl.dropdown(options),
    Textarea: ({attrs, handlers}: {attrs?: { [key: string]: string }, 
        handlers?: { [key: string]: (e: any, ls: any) => void }}) => AtomicMainCtrl.textarea(attrs, handlers),
    MultiSelect: ({options = [], selected_values = [], placeholder = "Select options..."}: {options: { value: string; label: string }[], 
        selected_values: { value: string; label?: string }[], 
        placeholder?: string}) => AtomicMainCtrl.multiSelect(options, selected_values, placeholder),
}
export class NewDynamicFormCtrl implements IInputCompCtrl {
    comp: any;
    formElementCtrls: { [key: string]: any } = {};
    onSubmit: (e: any, ls: any) => void = () => {
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
        this.comp.update({}, { submit: (e: any, ls: any) => this.def_submit(e, ls) });
    }
    private def_submit(e: any, ls: any) {
        e.preventDefault();
        this.onSubmit(e, ls);
    }
    add_field(key: string, compCtrl: IInputCompCtrl) {
        this.formElementCtrls[key] = compCtrl;
        this.comp.update({ child: compCtrl.comp});
    }
    clear_comps() {
        this.formElementCtrls = {};
        this.comp.update({ innerHTML: ""});
    }
    clear_value() {
        for (const key in this.formElementCtrls) {
            this.formElementCtrls[key].clear_value();
        }
    }
    set_value(values: { [key: string]: any }) {
        for (const key in values) {
            this.formElementCtrls[key].set_value(values[key]);
        }
    }
    add_field_with_type(key: string, type: any, params?: any) {
        if(params) {
            this.add_field(key, FormElementType[type](params));
        } else {
            this.add_field(key, FormElementType[type]());
        }
    }
}

export class MainCtrl {
    static dynamicForm(fields: { key: string, type: any, params?: any }[]) {
        const formCtrl = new NewDynamicFormCtrl();
        const form = NewDynamicForm();
        formCtrl.set_comp(form);
        for (const field of fields) {
            formCtrl.add_field_with_type(field.key, field.type, field.params);
        }
        formCtrl.setup();
        return formCtrl;
    }
}