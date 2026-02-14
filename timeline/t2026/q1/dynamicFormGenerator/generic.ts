import { GComponent } from "../../../globalComps/GComponent";
import { Tools } from "../../../globalComps/tools";
import type { IField } from "./interface";

export class Textarea implements IField<string> {
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
        if (this.comp) return this.comp;
        this.comp = Tools.comp("textarea", {});
        return this.comp;
    }
}

export class Text extends Textarea {
    get_comp(): GComponent {
        if (!this.comp) this.comp = Tools.comp("input", { type: "text" });
        return this.comp;
    }
}

export interface IDropdownOption {
    label: string;
    value: string;
}

export class Dropdown implements IField<string> {
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
        if (!this.comp) this.comp = Tools.comp("select", {});
        return this.comp;
    }
    set_options(options: IDropdownOption[]): void {
        throw new Error("Method not implemented.");
    }
}

export class MultiSelect implements IField<string[]> {
    comp: GComponent | null = null;
    placeholder: string = "";
    get_value() {
        return [];
    }
    set_value(value: string[]): void {
        throw new Error("Method not implemented.");
    }
    set_default_value(value: string[]): void {
        throw new Error("Method not implemented.");
    }
    is_changed(): boolean {
        throw new Error("Method not implemented.");
    }
    get_comp(): GComponent {
        if (!this.comp) this.comp = Tools.comp("multiselect", {});
        return this.comp;
    }
    set_options(options: IDropdownOption[]): void {
        throw new Error("Method not implemented.");
    }
}

export class Checkbox implements IField<boolean> {
    comp: GComponent | null = null;
    private default_value = false;
    value: boolean = false;
    get_value() {
        return false;
    }
    set_value(value: boolean): void {
        this.value = value;
    }
    set_default_value(value: boolean): void {
        this.default_value = value;
    }
    is_changed(): boolean {
        return this.value !== this.default_value;
    }
    get_comp(): GComponent {
        if (!this.comp) this.comp = Tools.comp("checkbox", {});
        return this.comp;
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
}

export class Number implements IField<number> {
    comp: GComponent | null = null;
    placeholder: string = "";
    get_value() {
        return 0;
    }
    set_value(value: number): void {
        throw new Error("Method not implemented.");
    }
    set_default_value(value: number): void {
        throw new Error("Method not implemented.");
    }
    is_changed(): boolean {
        throw new Error("Method not implemented.");
    }
    get_comp(): GComponent {
        if (!this.comp) this.comp = Tools.comp("input", { type: "number" });
        return this.comp;
    }
}

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
                return new Checkbox();
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
}
