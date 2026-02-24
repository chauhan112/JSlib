import { Pencil, Trash } from "lucide";
import type { GComponent } from "../../../globalComps/GComponent";
import type { ISComponent } from "../../../globalComps/interface";
import { Tools } from "../../../globalComps/tools";
import { EnumCtrl, EnumeratedLister } from "../lister/listers";
import { SearchComponent } from "../view_crud_list/searchComp";
import type { FilterItem, IFilterModel, IFilterParser } from "./interface";
import { SimpleForm, Text } from "../dynamicFormGenerator/generic";
import type {
    IDynamicFormGenerator,
    IField,
} from "../dynamicFormGenerator/interface";
import { InMemoryDataModel } from "../lister/data_model";
import { ViewerComp } from "../domOps/pages/ViewerComp";
import type { IViewComponent } from "../../DeploymentCenter/apps/domOps/crud_list/interface";
import type { ILister } from "../lister/interface";
import type { ISubComponentable } from "../ui-showcase/interface";

export class DefaultParser implements IFilterParser {
    parse_chip_value(value: string): any {
        if (value.includes(":")) {
            const [key, val] = value.split(":");
            return { [key]: val };
        }
        return value;
    }
    unparse_chip_value(value: any): string {
        if (typeof value === "object") {
            return Object.keys(value)[0] + ":" + value[Object.keys(value)[0]];
        }
        return value;
    }
}

export class SearchInputComponent implements IField<any[]> {
    ctrl = new SearchComponent();
    prev_value = "";
    constructor() {
        this.ctrl.comp.update({ class: "flex flex-col gap-2" });
        this.ctrl.comp.s.okBtn.getElement().classList.remove("sm:hidden");
        this.ctrl.comp.s.search_button.getElement().remove();

        this.ctrl.parse_chip_value = (value: string) =>
            this.parse_chip_value(value);

        this.ctrl.inp_comp_ctrl.set_comp(this.ctrl.comp.s.inp_comp);
        this.ctrl.comp.s.okBtn.update(
            {},
            {
                click: () => {
                    this.ctrl.set_values([this.ctrl.inp_comp_ctrl.get_value()]);
                },
            },
        );
    }
    set_default_value(value: any[]): void {
        let new_vals = value.map((v) => this.unparse_chip_value(v));
        this.prev_value = JSON.stringify(new_vals);
        this.ctrl.set_values(new_vals);
    }
    is_changed(): boolean {
        return JSON.stringify(this.ctrl.get_values()) !== this.prev_value;
    }
    get_comp(): GComponent {
        return this.ctrl.get_comp();
    }
    reset_value(): void {
        this.ctrl.clear();
        if (this.prev_value === "") this.ctrl.set_values([]);
        else this.ctrl.set_values(JSON.parse(this.prev_value));
    }

    get_value() {
        return this.ctrl.get_values();
    }
    set_value(value: any[]): void {
        this.ctrl.set_values(value.map((v) => this.unparse_chip_value(v)));
    }
    unparse_chip_value(value: any): string {
        if (typeof value === "string") return value;
        return JSON.stringify(value);
    }
    parse_chip_value(value: string): any {
        return value;
    }
}

export type FilterSubComps = {
    viewer: IViewComponent;
    lister: ILister;
    model: IFilterModel;
    parser: IFilterParser;
};

export interface IFilterForm extends IDynamicFormGenerator {
    set_submit_btn_text(text: string): void;
}

export class SimpleFilterForm extends SimpleForm implements IFilterForm {
    set_submit_btn_text(text: string): void {
        let comp = this.get_comp();
        comp.s.submit.set_props({ textContent: text });
    }
}

export class FilterComp
    implements ISComponent, ISubComponentable<FilterSubComps>
{
    comp: GComponent;
    viewer = new ViewerComp();
    lister: ILister;
    form: IFilterForm;
    parser: IFilterParser = new DefaultParser();
    model: IFilterModel;
    private current_item: FilterItem | null = null;
    private changed = false;
    constructor() {
        this.comp = Tools.comp("div", {
            class: "flex flex-col gap-2",
            children: [
                Tools.div({ textContent: "Form Area", key: "form" }),

                Tools.div({ textContent: "List Area", key: "list" }),
                this.viewer.get_comp(),
            ],
        });
        let model = new InMemoryDataModel();
        model.data = [];
        this.model = model as unknown as IFilterModel;
        let lister = new EnumeratedLister();

        lister.cardCompCreator = this.on_comp_creator.bind(this);
        this.form = new SimpleFilterForm();
        this.form_setup();

        this.comp.s.form.update({
            innerHTML: "",
            children: [this.form.get_comp()],
        });
        this.lister = lister;
        this.comp.s.list.update({
            innerHTML: "",
            children: [this.lister.get_comp()],
        });
    }

    init() {
        this.model.read_all().then((data) => {
            this.lister.set_values(data);
        });
    }

    private form_setup() {
        let nameField = new Text();
        nameField.placeholder = "enter name";
        let valField = new SearchInputComponent();
        valField.parse_chip_value = (value: string) =>
            this.parser.parse_chip_value(value);
        valField.unparse_chip_value = (value: any) =>
            this.parser.unparse_chip_value(value);
        this.form.set_fields({
            label: nameField,
            value: valField,
        });
        this.form.set_submit_btn_text("add");
        this.form.on_submit = () => this.on_save();
    }

    private async on_save() {
        await this.model.create(this.form.get_all_values());
        this.changed = true;
        this.form.reset_fields();
        let data = await this.model.read_all();
        this.lister.set_values(data);
    }

    get_comp(): GComponent {
        this.changed = false;
        return this.comp;
    }

    form_reset_and_create() {
        this.form.reset_fields();
        this.form.on_submit = () => this.on_save();
        this.form.set_submit_btn_text("add");
    }

    private on_comp_creator(data: any, idx: number) {
        let ctrl = new EnumCtrl(idx + 1, data, [
            { key: "edit", icon: Pencil },
            { key: "delete", icon: Trash },
        ]);
        ctrl.on_icons_clicked = (key: string, data: any) =>
            this.on_context_menus_clicked(data, key);
        ctrl.on_click = (data: any) => this.viewer.set_data(data);
        ctrl.comp.s.titleComp.set_props({
            textContent: data.label,
        });
        return ctrl;
    }

    private on_context_menus_clicked(data: any, label: string) {
        switch (label) {
            case "edit":
                this.form.set_submit_btn_text("update");
                this.current_item = data;
                this.form.on_submit = () => this.on_update();
                this.form.reset_fields();
                this.form.set_values(data);
                break;
            case "delete":
                if (confirm("Are you sure?")) this.on_delete(data.id);
                break;
        }
    }
    private on_update() {
        if (this.current_item === null) return;
        this.model.update(this.current_item.id, this.form.get_changed_values());
        this.changed = true;
        this.form_reset_and_create();
        this.model.read_all().then((data) => this.lister.set_values(data));
    }
    private async on_delete(data_id: string) {
        await this.model.deleteIt(data_id);
        this.changed = true;
        let data = await this.model.read_all();
        this.lister.set_values(data);
    }
    get_subcomponents(): FilterSubComps {
        return {
            viewer: this.viewer,
            lister: this.lister,
            model: this.model,
            parser: this.parser,
        };
    }
    is_changed(): boolean {
        return this.changed;
    }
}
