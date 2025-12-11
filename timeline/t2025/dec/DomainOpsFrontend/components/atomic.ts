import { X } from "lucide";
import { Tools } from "../../../april/tools";
import { GlobalStates } from "../../../june/domain-ops/GlobalStates";
import { CardComp, Dropdown, InputComp, Textarea, MultiSelectComponent } from "./atomicComp";

export class InputCompCtrl {
    comp: any;
    set_comp(comp: any) {
        this.comp = comp;
    }
    get_value() {
        return this.comp.getElement().value;
    }
    set_value(value: string) {
        this.comp.getElement().value = value;
    }
    clear_value() {
        this.comp.getElement().value = "";
    }
}

export class DropdownCtrl {
    comp: any;
    placeholder: string = "Select an option";
    has_placeholder: boolean = true;
    set_comp(comp: any) {
        this.comp = comp;
    }
    set_options(options: { value: string; label: string }[]) {
        let opsComp: any[] = [];
        if (this.has_placeholder) {
            opsComp.push(Tools.comp("option", { value: "", textContent: this.placeholder, selected: true, disabled: true }));
        }
        for (const o of options) {
            opsComp.push(Tools.comp("option", { value: o.value, textContent: o.label }));
        }
        this.comp.update({ innerHTML: "", children: opsComp });
    }
    get_value() {
        return this.comp.getElement().value;
    }
    set_value(value: string) {
        this.comp.getElement().value = value;
    }
    clear_value() {
        this.comp.getElement().value = "";
    }
}

export class CardCompCtrl {
    comp: any;
    options: { label: string; }[] = [{ label: "Edit" }, { label: "Delete" }, { label: "View" }];
    onOpsMenuClicked: (data: any, label: string) => void = (data: any, label: string) => {
        console.log(data, label);
    };
    onCardClicked: (data: any) => void = (data: any) => {
        console.log(data);
    };
    set_options(options: { label: string; }[]) {
        this.options = options;
        if (options.length > 0) {
            this.comp.s.ops.getElement().classList.remove("hidden");
        } else {
            this.comp.s.ops.getElement().classList.add("hidden");
        }
    }
    private on_ops_clicked: (e: any, ls: any) => void = (e: any, ls: any) => {
        e.stopPropagation();
        let cm = GlobalStates.getInstance().getState("contextMenu");
        let options = this.options.map((o: any) => ({ label: o.label, info: this.data, onClick: () => this.onOpsMenuClicked(this.data, o.label) }));
        cm.s.setOptions(options);
        cm.s.displayMenu(e, ls);
    };
    data: any;
    title_getter: (info: any) => string = (info: any) => info.title;
    set_comp(comp: any) {
        this.comp = comp;
    }
    set_data(data: any) {
        this.comp.s.title.update({ textContent: this.title_getter(data) });
        this.data = data;
    }
    setup() {
        this.comp.s.ops.update({}, { click: (e: any, ls: any) => this.on_ops_clicked(e, ls) });
        this.comp.update({}, { click: () => this.onCardClicked(this.data) });
    }
}

export class MultiSelectCompCtrl {
    comp: any;
    selected_values: { value: string; label: string }[] = [];
    options: { value: string; label: string }[] = [];
    is_open: boolean = false;
    set_comp(comp: any) { // MultiSelectComponent
        this.comp = comp;
    }
    set_options(options: { value: string; label: string }[]) {
        this.options = options;
    }
    set_value(value: string[]) {
        this.selected_values = this.options.filter(o => value.includes(o.value)).map(o => ({ value: o.value, label: o.label }));
    }
    get_values() {
        return this.selected_values.map(v => v.value);
    }
    clear_value() {
        this.selected_values = [];
        this.render_tags();
    }
    render_tags() {
        this.comp.s.selectBox.update({ innerHTML: "", children: this.selected_values.map(v => this.create_tag(v.value, v.label)) });
    }
    setup() {
        this.comp.s.selectBox.update({}, { click: (e: any, ls: any) => this.on_select_box_clicked(e, ls) });
    }
    private on_select_box_clicked(e: any, ls: any) {
        e.stopPropagation();
        if (this.is_open) {
            this.hide_dropdown_menu();
        } else {
            this.show_dropdown_menu();
        }
        this.is_open = !this.is_open;
    }
    show_dropdown_menu() {
        this.comp.s.dropdownMenu.getElement().classList.remove("hidden");
        this.comp.s.dropdownMenu.update({ innerHTML: "", children: this.options.map(o => this.create_option(o.value, o.label)) });
    }
    hide_dropdown_menu() {
        this.comp.s.dropdownMenu.getElement().classList.add("hidden");
    }
    remove_tag(param: { value: string; label: string }) {
        this.selected_values = this.selected_values.filter(v => v.value !== param.value);
        this.render_tags();
        if (this.is_open) {
            this.show_dropdown_menu();
        }
    }
    private on_close_tag_clicked(e: any, ls: any) {
        e.stopPropagation();
        this.remove_tag({ value: ls.s.value, label: ls.s.label });
    }
    private on_option_clicked(e: any, ls: any) {
        e.stopPropagation();
        this.toggle_selection({ value: ls.s.value, label: ls.s.label });
    }
    create_tag(value: string, label: string) {
        return Tools.comp("div", {
            class: "tag bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center gap-1",
            children: [
                Tools.comp("span", { textContent: label },{},{ label ,value}),
                Tools.icon(X, { class: "cursor-pointer" },{ click: (e: any, ls: any) => this.on_close_tag_clicked(e, ls) },{ value, label }),
            ],
        });
    }
    create_option(value: string, label: string) {
        let isSelected = this.selected_values.some(v => v.value === value);
        let cssSelected = {
            true: "px-4 py-2 cursor-pointer hover:bg-blue-50 transition bg-blue-100 text-blue-700 font-medium",
            false: "px-4 py-2 cursor-pointer hover:bg-blue-50 transition text-gray-700",
        }
        return Tools.comp("div", {
            class: cssSelected[isSelected ? "true" : "false"],
        },{ click: (e: any, ls: any) => this.on_option_clicked(e, ls) },{ value, label });
    }
    toggle_selection(param: { value: string; label: string }) {
        if (this.selected_values.some(v => v.value === param.value)) {
            this.selected_values = this.selected_values.filter(v => v.value !== param.value);
        } else {
            this.selected_values.push(param);
        }
        this.render_tags();
    }
}

export class MainCtrl {
    static cardComp(data: any, title_getter?: (info: any) => string) {
        const cardCompCtrl = new CardCompCtrl();
        cardCompCtrl.set_comp(CardComp());
        if (title_getter) {
            cardCompCtrl.title_getter = title_getter;
        }
        cardCompCtrl.set_data(data);
        cardCompCtrl.setup();
        return cardCompCtrl;
    }
    static dropdown(options: { value: string; label: string }[]) {
        const dropdownCtrl = new DropdownCtrl();
        dropdownCtrl.set_comp(Dropdown(options));
        return dropdownCtrl;
    }
    static multiSelect(options: { value: string; label: string }[], selected_values: { value: string; label?: string }[]) {
        const multiSelectCtrl = new MultiSelectCompCtrl();
        multiSelectCtrl.set_comp(MultiSelectComponent());
        multiSelectCtrl.set_options(options);
        multiSelectCtrl.set_value(selected_values.map(v => v.value));
        return multiSelectCtrl;
    }
    static input(attrs?: { [key: string]: string }, handlers?: { [key: string]: (e: any, ls: any) => void }) {
        const inputCtrl = new InputCompCtrl();
        const comp = InputComp();
        if (attrs) {
            comp.update(attrs);
        }
        if (handlers) {
            comp.update({}, handlers);
        }
        inputCtrl.set_comp(comp);
        return inputCtrl;
    }

    static textarea(attrs?: { [key: string]: string }, handlers?: { [key: string]: (e: any, ls: any) => void }) {
        const textareaCtrl = new InputCompCtrl();
        const comp = Textarea();
        if (attrs) {
            comp.update(attrs);
        }
        if (handlers) {
            comp.update({}, handlers);
        }
        textareaCtrl.set_comp(comp);
        return textareaCtrl;
    }
}