import { GComponent } from "../../../globalComps/GComponent";
import { Tools } from "../../../globalComps/tools";
import type { IField, IDynamicFormGenerator } from "./interface";
import {
    MainCtrl as AtomicMainCtrl,
    DropdownCtrl,
    InputCompCtrl,
    MultiSelectCompCtrl,
} from "../../../t2025/dec/DomainOpsFrontend/components/atomic";
import { Checkbox as Check } from "../../../t2025/june/domain-ops/Form";
export class Textarea implements IField<string> {
    comp: InputCompCtrl | null = null;
    placeholder: string = "";
    default_value: string = "";
    prev_value: string = "";

    get_value() {
        this.get_comp();
        return this.comp?.get_value();
    }
    set_value(value: string): void {
        this.prev_value = value;
        this.get_comp();
        this.comp!.set_value(value);
    }
    set_default_value(value: string): void {
        this.default_value = value;
        this.set_value(value);
    }
    is_changed(): boolean {
        return this.get_value() !== this.prev_value;
    }
    get_comp(): GComponent {
        if (this.comp) return this.comp.comp;
        this.comp = AtomicMainCtrl.textarea();
        this.comp.comp.update({ placeholder: this.placeholder });
        this.comp.comp.getElement().classList.add("h-40");
        return this.comp.comp;
    }
    reset_value() {
        this.set_value(this.default_value);
    }
}

export class Text extends Textarea {
    get_comp(): GComponent {
        if (this.comp) return this.comp.comp;
        this.comp = AtomicMainCtrl.input();
        this.comp.comp.update({ placeholder: this.placeholder });
        return this.comp.comp;
    }
}

export interface IDropdownOption {
    label: string;
    value: string;
}

export class Dropdown implements IField<string> {
    ctrl: DropdownCtrl | null = null;
    placeholder: string = "";
    prev_value: string = "";
    default_value: string = "";
    options: IDropdownOption[] = [];
    get_value() {
        this.get_comp();
        return this.ctrl!.get_value();
    }
    set_value(value: string) {
        this.prev_value = value;
        this.get_comp();
        this.ctrl!.set_value(value);
    }
    set_default_value(value: string) {
        this.default_value = value;
        this.set_value(value);
    }
    is_changed(): boolean {
        return this.get_value() !== this.prev_value;
    }
    get_comp(): GComponent {
        if (this.ctrl) return this.ctrl.comp;
        this.ctrl = AtomicMainCtrl.dropdown([]);
        if (this.placeholder) {
            this.ctrl.has_placeholder = true;
            this.ctrl.placeholder = this.placeholder;
        }
        this.ctrl.set_options(this.options);
        return this.ctrl.comp;
    }
    set_options(options: IDropdownOption[]) {
        this.options = options;
        this.ctrl!.set_options(options);
    }
    reset_value() {
        this.set_value(this.default_value);
    }
}

export class MultiSelect implements IField<string[]> {
    ctrl: MultiSelectCompCtrl | null = null;
    placeholder: string = "";
    default_value: string[] = [];
    prev_value: string[] = [];
    options: IDropdownOption[] = [];
    values: string[] = [];
    get_value() {
        this.get_comp();
        return this.ctrl!.get_value().map((v) => v.value);
    }
    set_value(value: string[]): void {
        this.prev_value = value;
        this.get_comp();
        this.ctrl!.set_value(value.map((v) => ({ value: v })));
    }
    set_default_value(value: string[]): void {
        this.default_value = value;
        this.set_value(value);
    }
    is_changed(): boolean {
        return this.get_value() !== this.prev_value;
    }
    get_comp(): GComponent {
        if (this.ctrl) return this.ctrl.comp;
        this.ctrl = AtomicMainCtrl.multiSelect(
            this.options,
            this.values.map((v) => ({ value: v })),
        );
        if (this.placeholder) {
            this.ctrl.placeholder = this.placeholder;
        }
        this.ctrl.update_ui();
        return this.ctrl.comp;
    }
    set_options(options: IDropdownOption[]): void {
        this.options = options;
        this.ctrl!.set_options(options);
    }
    reset_value() {
        this.set_value(this.default_value);
    }
}

export const CheckBoxComp = (label: string) => {
    let inpCom = Tools.comp("input", {
        type: "checkbox",
        class: "sr-only peer",
    });
    return Tools.comp(
        "label",
        {
            class: "flex items-center justify-between p-4 bg-white border rounded-xl cursor-pointer",
            children: [
                Tools.comp("span", {
                    class: "font-medium",
                    textContent: label,
                }),
                Tools.comp("div", {
                    class: "relative inline-flex items-center cursor-pointer",
                    children: [
                        inpCom,
                        Tools.comp("div", {
                            class: "w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600",
                        }),
                    ],
                }),
            ],
        },
        {},
        { comp: inpCom },
    );
};

export class Checkbox implements IField<boolean> {
    comp: GComponent | null = null;
    private default_value = false;
    prev_value: boolean = false;
    label: string = "";
    get_value() {
        this.get_comp();
        let elem = this.comp!.s.comp.getElement() as HTMLInputElement;
        if (elem) return elem.checked;
        return false;
    }
    set_value(value: boolean): void {
        this.prev_value = value;
        this.get_comp();
        let elem = this.comp!.s.comp.getElement();
        elem.checked = value;
        console.log(elem.checked, value);
    }
    set_default_value(value: boolean): void {
        this.default_value = value;
        this.set_value(value);
    }
    is_changed(): boolean {
        return this.get_value() !== this.prev_value;
    }
    get_comp(): GComponent {
        if (this.comp) this.comp;
        this.comp = CheckBoxComp(this.label);
        return this.comp;
    }
    reset_value() {
        this.set_value(this.default_value);
    }
}

export class Checkbox2 implements IField<boolean> {
    ctrl: any = null;
    default_value: boolean = false;
    label: string = "";
    prev_value: boolean = false;
    get_value(): boolean {
        this.get_comp();
        let handlers = this.ctrl.s.handlers;
        return handlers.get();
    }
    set_value(value: boolean): void {
        this.get_comp();
        let handlers = this.ctrl.s.handlers;
        this.prev_value = value;
        handlers.set(value);
    }
    set_default_value(value: boolean): void {
        this.default_value = value;
        this.set_value(value);
    }
    is_changed(): boolean {
        return this.get_value() !== this.prev_value;
    }
    get_comp(): GComponent {
        if (this.ctrl) return this.ctrl;
        this.ctrl = Check(this.label || "Checkbox");
        return this.ctrl;
    }
    reset_value(): void {
        this.set_value(this.default_value);
    }
}

export class Date implements IField<string> {
    comp: GComponent | null = null;
    placeholder: string = "";
    get_value() {
        return "";
    }
    set_value(value: string): void {
        throw new Error("Method not implemented.");
    }
    set_default_value(value: string): void {
        throw new Error("Method not implemented.");
    }
    is_changed(): boolean {
        throw new Error("Method not implemented.");
    }
    get_comp(): GComponent {
        if (!this.comp) this.comp = Tools.comp("input", { type: "date" });
        return this.comp;
    }
    reset_value() {
        throw new Error("Method not implemented.");
    }
}

export class Time implements IField<string> {
    comp: GComponent | null = null;
    placeholder: string = "";
    get_value() {
        return "";
    }
    set_value(value: string): void {
        throw new Error("Method not implemented.");
    }
    set_default_value(value: string): void {
        throw new Error("Method not implemented.");
    }
    is_changed(): boolean {
        throw new Error("Method not implemented.");
    }
    get_comp(): GComponent {
        if (!this.comp) this.comp = Tools.comp("input", { type: "time" });
        return this.comp;
    }
    reset_value() {
        throw new Error("Method not implemented.");
    }
}

export class Datetime implements IField<string> {
    comp: GComponent | null = null;
    placeholder: string = "";
    get_value() {
        return "";
    }
    set_value(value: string): void {
        throw new Error("Method not implemented.");
    }
    set_default_value(value: string): void {
        throw new Error("Method not implemented.");
    }
    is_changed(): boolean {
        throw new Error("Method not implemented.");
    }
    get_comp(): GComponent {
        if (!this.comp)
            this.comp = Tools.comp("input", { type: "datetime-local" });
        return this.comp;
    }
    reset_value() {
        throw new Error("Method not implemented.");
    }
}

export class SimpleForm implements IDynamicFormGenerator {
    fields: { [key: string]: IField<any> } = {};
    comp: GComponent | null = null;
    submit_text: string = "";
    set_fields(fields: { [key: string]: IField<any> }): void {
        this.fields = fields;
    }
    get_comp(): GComponent {
        if (this.comp) return this.comp;
        let children = [];
        for (const key in this.fields) {
            children.push(this.get_field(key, this.fields[key]));
        }
        children.push(
            Tools.comp("button", {
                textContent: this.submit_text || "Submit",
                class: "cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded w-fit self-end",
            }),
        );
        this.comp = Tools.comp(
            "form",
            {
                class: "w-full flex flex-col p-2 gap-2",
                children: children,
            },
            {
                submit: (e: any) => {
                    e.preventDefault();
                    this.on_submit();
                },
            },
        );

        return this.comp;
    }
    get_field(key: string, field: IField<any>): GComponent {
        return Tools.comp("div", {
            class: "flex flex-col gap-1",
            children: [
                Tools.comp("label", { textContent: key }),
                field.get_comp(),
            ],
        });
    }
    reset_fields(): void {
        for (const key in this.fields) {
            this.fields[key].reset_value();
        }
    }
    is_changed(): boolean {
        for (const key in this.fields) {
            if (this.fields[key].is_changed()) return true;
        }
        return false;
    }
    get_changed_values(): { [key: string]: any } {
        const values: { [key: string]: any } = {};
        for (const key in this.fields) {
            if (this.fields[key].is_changed()) {
                values[key] = this.fields[key].get_value();
            }
        }
        return values;
    }
    get_all_values(): { [key: string]: any } {
        const values: { [key: string]: any } = {};
        for (const key in this.fields) {
            values[key] = this.fields[key].get_value();
        }
        return values;
    }
    set_values(values: { [key: string]: any }): void {
        for (const key in this.fields) {
            this.fields[key].set_value(values[key]);
        }
    }
    on_submit(): void {
        console.log(this.get_changed_values());
    }
}

export class OneLineForm extends SimpleForm {
    get_field(key: string, field: IField<any>): GComponent {
        let comp = super.get_field(key, field);
        comp.getElement().classList.remove("flex-col");
        comp.getElement().classList.add("items-center", "flex-1");
        return comp;
    }
    get_comp(): GComponent {
        let comp = super.get_comp();
        comp.getElement().classList.remove("flex-col");
        comp.getElement().classList.add("items-center", "w-full", "gap-4");
        return comp;
    }
}

export type IFormSimpleFormElement =
    | {
          type: "text" | "textarea";
          key: string;
          defaultValue?: string;
          placeholder?: string;
      }
    | {
          type: "multiselect";
          key: string;
          options: IDropdownOption[];
          selected_values?: { value: string; label?: string }[];
          placeholder?: string;
          defaultValue?: string[];
      }
    | {
          type: "checkbox";
          key: string;
          label: string;
          defaultValue?: boolean;
      }
    | {
          type: "dropdown";
          key: string;
          options: IDropdownOption[];
          defaultValue?: string;
      };

export class Factory {
    static create(type: string) {
        switch (type) {
            case "text":
                return new Text();
            case "textarea":
                return new Textarea();
            case "dropdown":
                return new Dropdown();
            case "multiselect":
                return new MultiSelect();
            case "checkbox":
                return new Checkbox2();
            case "date":
                return new Date();
            case "time":
                return new Time();
            case "datetime":
                return new Datetime();
            case "number":
                return new Number();
        }
    }

    static simple_create_form(fields: IFormSimpleFormElement[]) {
        return Factory._create_form(
            fields,
            () => new SimpleForm(),
        ) as SimpleForm;
    }

    static one_line_create_form(fields: IFormSimpleFormElement[]) {
        return Factory._create_form(
            fields,
            () => new OneLineForm(),
        ) as OneLineForm;
    }
    private static _create_form(
        fields: IFormSimpleFormElement[],
        form_factory: () => IDynamicFormGenerator,
    ) {
        let form = form_factory();
        let form_fields: { [key: string]: any } = {};
        for (const field of fields) {
            if (!field.key) continue;
            form_fields[field.key] = Factory.create(field.type);
            if (field.defaultValue)
                form_fields[field.key].set_default_value(field.defaultValue);

            if (
                field.type === "text" ||
                field.type === "textarea" ||
                field.type === "multiselect"
            )
                form_fields[field.key].placeholder =
                    field.placeholder || "Enter " + field.key;
            if (field.type === "checkbox")
                form_fields[field.key].label = field.label || field.key;
            if (field.type === "dropdown" || field.type === "multiselect")
                form_fields[field.key].options = field.options;
            if (field.type === "multiselect" && field.selected_values)
                form_fields[field.key].values = field.selected_values;
        }
        form.set_fields(form_fields);
        return form;
    }
}
