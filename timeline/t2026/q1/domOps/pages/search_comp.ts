import type { GComponent } from "../../../../globalComps/GComponent";
import type { ISComponent } from "../../../../globalComps/interface";
import { Tools } from "../../../../globalComps/tools";
import type { ISubComponentable } from "../../ui-showcase/interface";
import { Breadcrumb } from "../../breadcrumb/generic";
import { ListerWithContext } from "../../lister/listers";
import { SearchComponent as SearchCompCtrl } from "../../view_crud_list/searchComp";
import { SearchComponent } from "../../../DeploymentCenter/apps/domOps/searchComp";
import type { IOptionItem } from "../../../../t2025/dec/DomainOpsFrontend/components/atomic";
import type { IDatamodel, ILister } from "../../lister/interface";
import type { FilterItem } from "../interface";
import { Factory } from "../../dynamicFormGenerator/generic";
import { Header } from "../../../DeploymentCenter/apps/domOps/webPageWithNav/Header/comp";
import type { IDynamicFormGenerator } from "../../dynamicFormGenerator/interface";
import type { IViewComponent } from "../../../DeploymentCenter/apps/domOps/crud_list/interface";
import { ViewComponent } from "../../../../t2025/dec/DomainOpsFrontend/SingleCrud";
import { FilterComp } from "../../filterComp";
import type { FilterItem as FilterItemComp } from "../../filterComp/interface";

export interface IComponentTools {
    hide(comp: GComponent): void;
    show(comp: GComponent): void;
}

export interface IClickable extends ISComponent {
    on_clicked: () => void;
}
export class Button implements IClickable {
    comp = Tools.comp(
        "button",
        {},
        {
            click: () => {
                this.on_clicked();
            },
        },
    );
    data: any = {};
    set_comp(comp: GComponent) {
        this.comp = comp;
        this.comp.update({}, { click: () => this.on_clicked() });
    }
    on_clicked(): void {
        console.log("clicked");
    }
    get_comp(): GComponent {
        return this.comp;
    }
}

export type SearchSubComps = {
    searchComp: SearchCompCtrl;
    filterComp: {
        selector: {
            get_comp: () => GComponent;
            set_options: (options: IOptionItem[]) => void;
        };
        btn_comp: IClickable;
    };
    new_btn_comp: IClickable;
    tools: IComponentTools;
};

export class SearchComp
    implements ISComponent, ISubComponentable<SearchSubComps>
{
    private comp = SearchComponent();
    private ctrl = new SearchCompCtrl();
    private newBtn = new Button();
    private filterBtn: IClickable;
    constructor() {
        this.ctrl.comp = this.comp;
        this.ctrl.setup();
        this.newBtn.set_comp(this.comp.s.addNewBtn);
        this.filterBtn = {
            get_comp: () => this.comp.s.filterBtn,
            on_clicked: () => {
                console.log("filter clicked");
            },
        };
        this.comp.s.filterBtn.update(
            {},
            { click: () => this.filterBtn.on_clicked() },
        );
    }
    get_comp(): GComponent {
        return this.comp;
    }

    get_subcomponents(): SearchSubComps {
        return {
            searchComp: this.ctrl,
            filterComp: {
                selector: {
                    get_comp: () => this.comp.s.filters.comp,
                    set_options: (options: IOptionItem[]) => {
                        if (options.length === 0) {
                            this.hide(this.comp.s.filters.comp);
                            return;
                        }
                        this.show(this.comp.s.filters.comp);
                        this.comp.s.filters.set_options(options);
                    },
                },
                btn_comp: this.filterBtn,
            },
            new_btn_comp: this.newBtn,
            tools: {
                hide: this.hide,
                show: this.show,
            },
        };
    }
    private hide(comp: GComponent) {
        comp.getElement().classList.add("hidden");
    }
    private show(comp: GComponent) {
        comp.getElement().classList.remove("hidden");
    }
}

type AdvanceListerSubComps = {
    search: SearchComp;
    lister: IUILister;
    breadcrumb: Breadcrumb;
    body: GComponent;
    model: AdvanceListerModel;
    searchHandler: ISearcher;
    default_context_handlers: {
        on_update: (data: any) => void;
        on_delete: (data: any) => void;
        on_view: (data: any) => void;
    };
};

export interface IForm extends ISComponent {
    on_saved: (data: any) => void;
}

export interface IAdvanceListerModel {
    get_filter_model(): IDatamodel<FilterItem>;
    get_create_form(): IDynamicFormGenerator;
    get_create_form(): IDynamicFormGenerator;
    get_update_form(): IDynamicFormGenerator;
    get_data_model(): IDatamodel<any>;
    get_view_comp(): IViewComponent;
}

export class ViewerComp implements IViewComponent {
    comp: GComponent = ViewComponent();

    get_comp(): GComponent {
        return this.comp;
    }
    set_data(data: any) {
        (this.comp.getElement() as HTMLTextAreaElement).value = JSON.stringify(
            data,
            null,
            2,
        );
    }
}

export class AdvanceListerModel implements IAdvanceListerModel {
    filter_model: IDatamodel<FilterItem>;
    data_model: IDatamodel<any>;
    create_form: IDynamicFormGenerator;
    update_form: IDynamicFormGenerator;
    viewer = new ViewerComp();
    constructor() {
        this.filter_model = {} as IDatamodel<FilterItem>;
        this.data_model = {} as IDatamodel<any>;
        this.create_form = Factory.simple_create_form([
            { key: "name", type: "text", placeholder: "what you did" },
        ]);
        this.update_form = Factory.simple_create_form([
            { key: "name", type: "text", placeholder: "what you did" },
        ]);
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
}

export const PageWithGoBack = () => {
    let header = Header();
    return Tools.div(
        {
            class: "flex flex-col",
            children: [header, Tools.div({ key: "body" })],
        },
        {},
        { header },
    );
};

export class PageWithGoBackComp implements ISComponent {
    comp = PageWithGoBack();
    constructor() {
        this.comp.s.header.s.back_button.update(
            {},
            { click: () => this.on_go_back() },
        );
    }
    set_title(title: string) {
        this.comp.s.header.s.title.update({ textContent: title });
    }
    display(comp: GComponent) {
        this.comp.s.body.update({ innerHTML: "", children: [comp] });
    }
    get_comp(): GComponent {
        return this.comp;
    }
    on_go_back() {}
}

export interface ISearcher {
    search(words: any[], data: any[]): Promise<any[]>;
}
export class DefaultSearcher implements ISearcher {
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
                if (val[key] && JSON.stringify(val[key]).includes(word[key])) {
                    return true;
                }
            }
            return false;
        }
        return false;
    }
}

export interface IUILister extends ILister {
    update_component(data_id: string, data: any): void;
    remove_item_component(data_id: string): void;
}

export class UIListerWithContext
    extends ListerWithContext
    implements IUILister
{
    update_component(data_id: string, data: any): void {
        let ctrl = this.listComps.find((c) => c.data.id === data_id);
        ctrl?.set_data({ ...ctrl.data, ...data });
    }
    remove_item_component(data_id: string): void {
        let ctrl = this.listComps.find((c) => c.data.id === data_id);
        ctrl?.comp.getElement().remove();
    }
}

export class AdvanceLister
    implements ISComponent, ISubComponentable<AdvanceListerSubComps>
{
    private breadcrumb = new Breadcrumb();
    private searchComp = new SearchComp();
    private lister: IUILister | null = null;
    private listWrapper = Tools.div({
        class: "flex flex-col gap-4 w-full overflow-auto flex-1",
    });
    private model = new AdvanceListerModel();
    private form_body = new PageWithGoBackComp();
    private body = Tools.div({ class: "flex flex-col gap-4 h-full" });
    private searchHandler = new DefaultSearcher();
    private filterComp = new FilterComp();
    setup() {
        let lister = new UIListerWithContext();
        this.searchComp.get_subcomponents().filterComp.selector.set_options([]); // hiding filters because of no data
        lister.set_title_func((data: any) => data.name);
        this.model
            .get_data_model()
            .read_all()
            .then((data) => {
                this.lister!.set_values(data);
            });
        this.searchComp.get_subcomponents().searchComp.on_search = async (
            words,
        ) => this.on_search_clicked(words);
        this.searchComp.get_subcomponents().new_btn_comp.on_clicked = () => {
            this.display_new_page(
                "Create New Item",
                this.model.get_create_form().get_comp(),
            );
        };
        this.model.get_create_form().on_submit = () => {
            this.model
                .get_data_model()
                .create(this.model.get_create_form().get_all_values())
                .then(() => {
                    this.model.get_create_form().reset_fields();
                    this.on_search_clicked([]);
                    this.get_comp();
                });
        };
        lister.on_context_clicked = (data: any, label: string) => {
            this.on_context_menus_clicked(data, label);
        };
        this.lister = lister;
        this.filterComp.model = this.model.get_filter_model();
        this.filterComp.init();
        this.filterComp.model.read_all().then((data: FilterItemComp[]) => {
            console.log(data);
            this.searchComp.get_subcomponents().filterComp.selector.set_options(
                data.map((f: FilterItemComp) => ({
                    label: f.label,
                    value: f.value,
                })),
            );
        });
        this.searchComp.get_subcomponents().filterComp.btn_comp.on_clicked =
            () => {
                this.display_new_page(
                    "Filter Items",
                    this.filterComp.get_comp(),
                );
            };
    }

    private display_new_page(
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
        console.log(data, label);
    }

    private async on_deleted(data: any) {
        if (confirm("Are you sure?")) {
            await this.model.get_data_model().deleteIt(data.id);
            this.lister!.remove_item_component(data.id);
        }
    }
    private on_edited(data: any) {
        let form = this.model.get_update_form();
        this.display_new_page("Edit Item", form.get_comp());
        form.set_values(data);
        form.on_submit = async () => {
            let changed_vals = this.model
                .get_update_form()
                .get_changed_values();
            await this.model.get_data_model().update(data.id, changed_vals);
            this.lister!.update_component(data.id, changed_vals);
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
                this.searchHandler.search(words, data).then((resp) => {
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
            children: [
                this.breadcrumb.get_comp(),
                this.searchComp.get_comp(),
                this.listWrapper,
            ],
        });
        return this.body;
    }
    get_subcomponents(): AdvanceListerSubComps {
        return {
            search: this.searchComp,
            lister: this.lister!,
            breadcrumb: this.breadcrumb,
            body: this.body,
            model: this.model,
            searchHandler: this.searchHandler,
            default_context_handlers: {
                on_update: (data: any) => this.on_edited(data),
                on_delete: (data: any) => this.on_deleted(data),
                on_view: (data: any) => this.on_viewed(data),
            },
        };
    }
}
