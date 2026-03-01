import type { GComponent } from "../../../../globalComps/GComponent";
import type { ISComponent } from "../../../../globalComps/interface";
import { Tools } from "../../../../globalComps/tools";
import { AppCard } from "../../../DeploymentCenter/Components";
import { MainCtrl } from "../../../DeploymentCenter/settings";
import {
    Dropdown,
    Factory,
    MultiSelect,
    SimpleForm,
} from "../../dynamicFormGenerator/generic";
import type { IDatamodel } from "../../lister/interface";
import type {
    Activity,
    Domain,
    IFilterSelector,
    Operation,
} from "../interface";
import { AdvanceLister, UIListerWithContext } from "./search_comp";

export const OpCard = (name: string, subtitle?: string) => {
    return Tools.comp("div", {
        class: "bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group",
        children: [
            Tools.comp("h3", {
                class: "text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors",
                textContent: name,
            }),
            Tools.comp("span", {
                class: "text-sm text-gray-500",
                textContent: subtitle || "",
            }),
        ],
    });
};
export class ActivityLister extends UIListerWithContext {
    comp: GComponent = Tools.div({
        class: "w-full grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-6 overflow-auto",
        textContent: "Activity Lister",
    });
    set_values(data: Activity[]): void {
        let comps = [];
        for (let act of data) {
            let card = AppCard({
                icon: MainCtrl.get_icon_from_name(act.name),
                name: act?.op?.name,
                status: act?.doms?.map((dom) => dom.name).join(", "),
            });
            comps.push(card);
            card.set_events({ click: () => this.on_click(act) });
        }
        this.comp.set_props({ innerHTML: "", children: comps });
    }
    get_comp(): GComponent {
        return this.comp;
    }
    on_click(data: any): void {}
}

export class OpsLister implements ISComponent {
    ops = Tools.comp("div", {
        class: "w-full grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-6 overflow-auto",
    });
    data: any;
    set_ops(data: string[]) {
        this.ops.set_props({ children: data.map((op) => this.get_card(op)) });
    }

    get_card(data: string): GComponent {
        let oc = OpCard(data);
        oc.set_events({ click: () => this.on_click(data) });
        return oc;
    }
    on_click(data: any): void {
        console.log(data, this.data);
    }
    get_comp(): GComponent {
        return this.ops;
    }
}

export class ActivityPage implements ISComponent {
    activity = new AdvanceLister();
    filterModel: IDatamodel<any> | null = null;
    selectorModel: IFilterSelector | null = null;
    model: IDatamodel<Activity> | null = null;
    get_domains: () => Promise<Domain[]> = () => Promise.resolve([]);
    get_operations: () => Promise<Operation[]> = () => Promise.resolve([]);
    set_up() {
        let comps = this.activity.get_subcomponents();
        comps.model.create_form = Factory.simple_create_form([
            { key: "name", type: "text", placeholder: "what you did" },
            { key: "operation", type: "dropdown", options: [] },
            {
                key: "domains",
                type: "multiselect",
                options: [],
            },
        ]);
        comps.model.update_form = Factory.simple_create_form([
            { key: "name", type: "text", placeholder: "what you did" },
            { key: "operation", type: "dropdown", options: [] },
            {
                key: "domains",
                type: "multiselect",
                options: [],
            },
        ]);
        comps.model.data_model = this.model!;
        comps.model.filter_model = this.filterModel!;
        comps.model.get_filter_selector_model = () => this.selectorModel!;
        let lister = comps.lister as UIListerWithContext;
        lister.contextMenuOptions = [
            { label: "Structure" },
            { label: "Edit" },
            { label: "View" },
            { label: "Delete" },
        ];
        this.activity.setup();

        comps = this.activity.get_subcomponents();
        comps.search.get_subcomponents().new_btn_comp.on_clicked = () =>
            this.on_new_btn_click();
        lister.on_context_clicked = (data: any, label: string) => {
            this.on_context_click(data, label);
        };
    }

    private on_context_click(data: any, label: string) {
        switch (label) {
            case "Edit":
                this.on_edit_clicked(data);
                break;
            case "Logs":
                // comps.default_context_handlers.on_update(data);
                break;
            case "Structure":
                console.log(data);
                break;
            default:
                this.activity.on_context_menus_clicked(data, label);
                break;
        }
    }
    private on_edit_clicked(data: any) {
        let comps = this.activity.get_subcomponents();
        let form = comps.model.get_update_form();
        form.reset_fields();
        let lister = this.activity.lister as UIListerWithContext;
        this.update_form_values(form as SimpleForm).then(() => {
            this.activity.display_new_page("Edit Item", form.get_comp());
            console.log(data);
            form.set_values(data);
            form.on_submit = async () => {
                let changed_vals = this.activity
                    .get_subcomponents()
                    .model!.get_update_form()
                    .get_changed_values();
                if (Object.keys(changed_vals).length !== 0) {
                    await this.model!.update(data.id, changed_vals);
                    lister!.update_component(data.id, changed_vals);
                }
                this.activity.get_comp();
            };
        });
    }
    private on_new_btn_click() {
        let form = this.activity.get_subcomponents().model
            .create_form as SimpleForm;
        this.update().then(() => {
            this.activity.display_new_page(
                "Create New Activity",
                form.get_comp(),
            );
        });
    }

    private async update_form_values(form: SimpleForm) {
        let all_doms = this.get_domains();
        let all_ops = this.get_operations();

        let [doms, ops] = await Promise.all([all_doms, all_ops]);
        let domsComp = form.fields.domains as MultiSelect;
        let options = doms.map((dom: Domain) => ({
            value: dom.id,
            label: dom.name,
        }));

        let opsCtrl = form.fields.operation as Dropdown;

        domsComp.set_options(options);
        opsCtrl.set_options(
            ops.map((op) => ({
                value: op.id,
                label: op.name,
            })),
        );
    }

    private async update() {
        this.update_form_values(
            this.activity.get_subcomponents().model.create_form as SimpleForm,
        );
    }

    on_deleted(data: any) {
        this.model?.deleteIt(data.id).then(() => {
            this.activity.get_comp();
        });
    }
    get_comp(): GComponent {
        return this.activity.get_comp();
    }
    update_ui() {
        this.model
            ?.read_all()
            .then((data) => this.activity.lister!.set_values(data));
        console.log("updating ui");
        // this.activity.get_subcomponents().search.set_values([]);
        this.activity.get_subcomponents().search.clear_values();
        this.activity.update_filter_selector();
    }
}
