import { Trash } from "lucide";
import type { GComponent } from "../../../globalComps/GComponent";
import type { ISComponent } from "../../../globalComps/interface";
import { Tools } from "../../../globalComps/tools";
import { EnumCtrl, EnumeratedLister } from "../lister/listers";
import { SearchComponent } from "../view_crud_list/searchComp";
import type { FilterItem, IFilterModel, IFilterParser } from "./interface";
import { OneLineForm, SimpleForm, Text } from "../dynamicFormGenerator/generic";
import type { IField } from "../dynamicFormGenerator/interface";
import { InMemoryDataModel } from "../lister/data_model";

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

export class FilterComp implements ISComponent {
    comp = Tools.comp("div", {
        class: "flex flex-col gap-2",
        children: [
            Tools.div({ textContent: "Form Area", key: "form" }),
            Tools.div({ textContent: "List Area", key: "list" }),
        ],
    });
    lister: EnumeratedLister<FilterItem>;
    form: OneLineForm;
    parser: IFilterParser = new DefaultParser();
    model: IFilterModel;
    constructor() {
        let model = new InMemoryDataModel();
        model.data = [];
        this.model = model as unknown as IFilterModel;
        this.lister = new EnumeratedLister();
        this.lister.cardCompCreator = this.on_comp_creator.bind(this);
        this.form = new SimpleForm();
        this.form_setup();

        this.comp.s.form.update({
            innerHTML: "",
            children: [this.form.get_comp()],
        });
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
        this.form.submit_text = "add";

        this.form.on_submit = () => this.on_save();
    }
    async on_save() {
        await this.model.create(this.form.get_all_values());
        this.form.reset_fields();
        let data = await this.model.read_all();
        this.lister.set_values(data);
    }
    get_comp(): GComponent {
        return this.comp;
    }
    private on_comp_creator(data: any, idx: number) {
        let ctrl = new EnumCtrl(idx + 1, data, [
            { key: "delete", icon: Trash },
        ]);
        ctrl.on_icons_clicked = (key: string, data: any) => {
            if (key === "delete") this.on_delete(data.id);
            else console.log(key, data);
        };
        ctrl.comp.s.titleComp.set_props({
            textContent: data.label,
        });
        return ctrl;
    }

    async on_delete(data_id: string) {
        await this.model.deleteIt(data_id);
        let data = await this.model.read_all();
        this.lister.set_values(data);
    }
}
