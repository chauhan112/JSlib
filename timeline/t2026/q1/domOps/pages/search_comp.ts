import type { GComponent } from "../../../../globalComps/GComponent";
import type { ISComponent } from "../../../../globalComps/interface";
import { Tools } from "../../../../globalComps/tools";
import type { ISubComponentable } from "../../ui-showcase/interface";
import { ListerWithContext } from "../../lister/listers/simple";
import type { IDatamodel, ILister } from "../../lister/interface";
import type {
    FilterItem,
    IAdvanceListerModel,
    IFilterSelector,
    ISearcher,
    IUILister,
} from "../interface";
import { Factory } from "../../dynamicFormGenerator/generic";
import type { IDynamicFormGenerator } from "../../dynamicFormGenerator/interface";
import type { IViewComponent } from "../../../DeploymentCenter/apps/domOps/crud_list/interface";
import { DefaultParser, FilterComp } from "../../filterComp";
import type { FilterItem as FilterItemComp } from "../../filterComp/interface";
import { ViewerComp } from "./ViewerComp";
import {
    LocalStorageDataModel,
    RandomDataSampleGenerator,
} from "../../lister/data_model";
import { PageWithGoBackComp } from "./PageWithGoBackComp";
import { SearchComp } from "./SearchComp";
import { LocalStorageJSONModel } from "../../../../t2025/april/LocalStorage";

export class DefaultSearcher extends DefaultParser implements ISearcher {
    async search(words: any[], data: any[]) {
        if (words.length === 0) {
            return data;
        }
        let res: any[] = [];
        for (let val of data) {
            let match = true;
            for (let word of words) {
                if (!this.match_word(word, val)) {
                    match = false;
                    break;
                }
            }
            if (match) {
                res.push(val);
            }
        }
        return res;
    }
    private match_word(word: any, val: any) {
        if (typeof word === "string") {
            return JSON.stringify(val).includes(word);
        }
        if (typeof word === "object") {
            for (let key in word) {
                if (
                    val[key] !== undefined &&
                    JSON.stringify(val[key]).includes(word[key])
                ) {
                    return true;
                }
            }
            return false;
        }
        return false;
    }
}
export class DefaultAdvanceListerModel implements IAdvanceListerModel {
    filter_model: IDatamodel<FilterItem>;
    data_model: IDatamodel<any>;
    create_form: IDynamicFormGenerator;
    update_form: IDynamicFormGenerator;
    viewer = new ViewerComp();
    searcher = new DefaultSearcher();
    filter_selector_model = new LocalStorageJSONModel("domOps-filter-selector");
    constructor() {
        let act = new RandomDataSampleGenerator();
        let fil = new LocalStorageDataModel("domOps-filter");
        act.set_fields([{ key: "name", type: "string" }]);

        act.generate();

        this.filter_model = fil as unknown as IDatamodel<FilterItem>;
        this.data_model = act as IDatamodel<any>;
        this.create_form = Factory.simple_create_form([
            { key: "name", type: "text", placeholder: "what you did" },
        ]);
        this.update_form = Factory.simple_create_form([
            { key: "name", type: "text", placeholder: "what you did" },
        ]);
    }
    get_searcher(): ISearcher {
        return this.searcher;
    }
    get_filter_model(): IDatamodel<FilterItem> {
        return this.filter_model;
    }

    get_create_form(): IDynamicFormGenerator {
        return this.create_form;
    }

    get_update_form(): IDynamicFormGenerator {
        return this.update_form;
    }

    get_data_model(): IDatamodel<any> {
        return this.data_model;
    }

    get_view_comp(): IViewComponent {
        return this.viewer;
    }
    get_filter_selector_model(): IFilterSelector {
        return {
            set_selected_filter: (filter: FilterItem) => {
                if (this.filter_selector_model.exists(["selected"])) {
                    this.filter_selector_model.updateEntry(
                        ["selected"],
                        filter,
                    );
                } else {
                    this.filter_selector_model.addEntry(["selected"], filter);
                }
            },
            get_selected_filter: () => {
                if (!this.filter_selector_model.exists(["selected"])) {
                    return null;
                }
                return this.filter_selector_model.readEntry(["selected"]);
            },
        };
    }
}
export class UIListerWithContext
    extends ListerWithContext
    implements IUILister
{
    add_item_component(data: any): void {
        let newComp = this.cardCompCreator(data);
        this.listComps.push(newComp);
        this.comp.update({
            child: newComp.comp,
        });
    }
    update_component(data_id: string, data: any): void {
        let ctrl = this.listComps.find((c) => c.data.id === data_id);
        ctrl?.set_data({ ...ctrl.data, ...data });
    }
    remove_item_component(data_id: string): void {
        let ctrl = this.listComps.find((c) => c.data.id === data_id);
        ctrl?.comp.getElement().remove();
    }
}

type AdvanceListerSubComps = {
    search: SearchComp;
    lister: ILister;
    body: GComponent;
    model: DefaultAdvanceListerModel;
    default_context_handlers: {
        on_update: (data: any) => void;
        on_delete: (data: any) => void;
        on_view: (data: any) => void;
    };
};

export class AdvanceLister
    implements ISComponent, ISubComponentable<AdvanceListerSubComps>
{
    private searchComp = new SearchComp();
    lister: ILister | null = null;
    private listWrapper = Tools.div({
        class: "flex flex-col gap-4 w-full overflow-auto flex-1",
    });
    private model = new DefaultAdvanceListerModel();
    private form_body = new PageWithGoBackComp();
    private body = Tools.div({ class: "flex flex-col gap-4 h-full" });
    private filterComp = new FilterComp();
    constructor() {
        let lister = new UIListerWithContext();
        lister.set_title_func((data: any) => data.name);

        lister.on_context_clicked = (data: any, label: string) => {
            this.on_context_menus_clicked(data, label);
        };
        this.lister = lister;
    }
    setup() {
        let create_form = this.model.get_create_form();
        this.searchComp.model = this.model.get_searcher();
        this.searchComp.get_subcomponents().searchComp.on_search = async (
            words,
        ) => this.on_search_clicked(words);
        this.searchComp.get_subcomponents().new_btn_comp.on_clicked = () => {
            this.display_new_page("Create New Item", create_form.get_comp());
        };
        create_form.on_submit = () => {
            let vals = create_form.get_all_values();
            this.model
                .get_data_model()
                .create(vals)
                .then(() => {
                    (this.lister as UIListerWithContext).add_item_component(
                        vals,
                    );
                    create_form.reset_fields();
                    this.get_comp();
                });
        };

        this.model
            .get_data_model()
            .read_all()
            .then((data) => {
                this.lister!.set_values(data);
            });
        this.filterCompSetup();
        this.update_filter_selector();
    }

    private update_filter_selector() {
        let comps = this.searchComp.get_subcomponents();

        this.filterComp.model.read_all().then((data: FilterItemComp[]) => {
            comps.filterComp.selector.set_options(
                data.map((f: FilterItemComp) => ({
                    label: f.label,
                    value: f.id,
                })),
            );
            let selected_filter = this.model.get_filter_selector_model();
            let fil =
                selected_filter.get_selected_filter() as FilterItem | null;
            if (fil) {
                comps.filterComp.selector.ctrl.set_value(fil.id);
                this.searchComp.get_subcomponents().searchComp.clear();
                this.searchComp.set_values(fil.value);
            }
        });
    }

    private filterCompSetup() {
        let comps = this.searchComp.get_subcomponents();

        this.filterComp.model = this.model.get_filter_model();
        comps.filterComp.btn_comp.on_clicked = () => {
            this.filterComp.init();
            this.filterComp.form_reset_and_create();
            this.display_new_page(
                "Filter Items",
                this.filterComp.get_comp(),
                () => {
                    this.get_comp();
                    if (!this.filterComp.is_changed()) return;
                    this.update_filter_selector();
                },
            );
        };
        let selected_filter = this.model.get_filter_selector_model();

        comps.filterComp.selector.ctrl.comp.set_events({
            change: () => {
                let fil_id = comps.filterComp.selector.ctrl.get_value();
                this.model
                    .get_filter_model()
                    .read(fil_id)
                    .then((data) => {
                        this.searchComp.get_subcomponents().searchComp.clear();
                        selected_filter.set_selected_filter(data as FilterItem);
                        this.searchComp.set_values(data?.value);
                    });
            },
        });
    }
    display_new_page(
        title: string,
        comp: GComponent,
        on_go_back: (() => void) | null = null,
    ) {
        this.form_body.set_title(title);
        this.form_body.display(comp);
        if (on_go_back) this.form_body.on_go_back = on_go_back;
        else this.form_body.on_go_back = () => this.get_comp();
        this.body.set_props({
            innerHTML: "",
            child: this.form_body.get_comp(),
        });
    }

    private on_context_menus_clicked(data: any, label: string) {
        switch (label) {
            case "Edit":
                this.on_edited(data);
                break;
            case "Delete":
                this.on_deleted(data);
                break;
            case "View":
                this.on_viewed(data);
                break;
            default:
                console.log("Unknown label");
                break;
        }
    }

    private async on_deleted(data: any) {
        let lister = this.lister as UIListerWithContext;
        if (confirm("Are you sure?")) {
            await this.model.get_data_model().deleteIt(data.id);
            lister!.remove_item_component(data.id);
        }
    }
    private on_edited(data: any) {
        let lister = this.lister as UIListerWithContext;
        let form = this.model.get_update_form();
        this.display_new_page("Edit Item", form.get_comp());
        form.set_values(data);
        form.on_submit = async () => {
            let changed_vals = this.model
                .get_update_form()
                .get_changed_values();
            await this.model.get_data_model().update(data.id, changed_vals);
            lister!.update_component(data.id, changed_vals);
            this.get_comp();
        };
    }
    private on_viewed(data: any) {
        this.display_new_page(
            "View Item",
            this.model.get_view_comp().get_comp(),
        );
        this.model.get_view_comp().set_data(data);
    }
    private on_search_clicked(words: any[]) {
        this.model
            .get_data_model()
            .read_all()
            .then((data) => {
                this.model
                    .get_searcher()
                    .search(words, data)
                    .then((resp) => {
                        this.lister!.set_values(resp);
                    });
            });
    }
    get_comp(): GComponent {
        this.listWrapper.set_props({
            innerHTML: "",
            children: [this.lister!.get_comp()],
        });
        this.body.set_props({
            innerHTML: "",
            children: [this.searchComp.get_comp(), this.listWrapper],
        });
        return this.body;
    }
    get_subcomponents(): AdvanceListerSubComps {
        return {
            search: this.searchComp,
            lister: this.lister!,
            body: this.body,
            model: this.model,
            default_context_handlers: {
                on_update: (data: any) => this.on_edited(data),
                on_delete: (data: any) => this.on_deleted(data),
                on_view: (data: any) => this.on_viewed(data),
            },
        };
    }
}
