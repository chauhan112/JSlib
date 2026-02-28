import type { GComponent } from "../../../../globalComps/GComponent";
import type { ISComponent } from "../../../../globalComps/interface";
import { Tools } from "../../../../globalComps/tools";
import type { MultiSelectCompCtrl } from "../../../../t2025/dec/DomainOpsFrontend/components/atomic";
import { AppCard } from "../../../DeploymentCenter/Components";
import { MainCtrl } from "../../../DeploymentCenter/settings";
import {
    Dropdown,
    Factory,
    MultiSelect,
    SimpleForm,
} from "../../dynamicFormGenerator/generic";
import type { IDatamodel } from "../../lister/interface";
import type { Activity, Domain, Operation } from "../interface";
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
    model: IDatamodel<Activity> | null = null;
    get_domains: () => Promise<Domain[]> = () => Promise.resolve([]);
    get_operations: () => Promise<Operation[]> = () => Promise.resolve([]);
    set_up() {
        this.activity.get_subcomponents().model.create_form =
            Factory.simple_create_form([
                { key: "name", type: "text", placeholder: "what you did" },
                { key: "operation", type: "dropdown", options: [] },
                {
                    key: "domains",
                    type: "multiselect",
                    options: [],
                },
            ]);
        this.activity.get_subcomponents().model.update_form =
            Factory.simple_create_form([
                { key: "name", type: "text", placeholder: "what you did" },
                { key: "operation", type: "dropdown", options: [] },
                {
                    key: "domains",
                    type: "multiselect",
                    options: [],
                },
            ]);
        this.activity.get_subcomponents().model.data_model = this.model!;
        this.activity.get_subcomponents().model.filter_model =
            this.filterModel!;

        this.activity.setup();

        this.activity
            .get_subcomponents()
            .search.get_subcomponents().new_btn_comp.on_clicked = () =>
            this.on_new_btn_click();
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

    private async update() {
        let form = this.activity.get_subcomponents().model
            .create_form as SimpleForm;
        let all_doms = this.get_domains();
        let all_ops = this.get_operations();
        Promise.all([all_doms, all_ops]).then(
            ([doms, ops]: [Domain[], Operation[]]) => {
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
            },
        );
    }
    on_edited(data: any) {
        console.log(data);
    }
    on_deleted(data: any) {
        this.model?.deleteIt(data.id).then(() => {
            this.activity.get_comp();
        });
    }
    get_comp(): GComponent {
        return this.activity.get_comp();
    }
}
