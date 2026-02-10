import { Tools } from "../../../../../globalComps/tools";
import {
    ListDisplayer,
    NewListDisplayerCtrl,
} from "../../../../../t2025/dec/DomainOpsFrontend/components/ListDisplayer";
import type {
    IDatamodel,
    ISearchHandler,
    IResultDisplayer,
    IFilter,
} from "../searchComp/interface";
import type {
    CrudListModel,
    IContextMenuOptions,
    ICreateFormFields,
    ICRUDModel,
    IRoute,
    IUpdateFormFields,
    IView,
    IViewComponent,
    ListItem,
} from "./interface";
import {
    GenericUpdateFormFields,
    GenericRoute,
    GenericView,
    GenericCreateFormFields,
    GenericCrudModel,
    GenericCrudContextMenuOptions,
    GenericViewComponent,
} from "./generic_interface";
import type { GComponent } from "../../../../../globalComps/GComponent";
import type { IRouteController, IApp } from "../../../interfaces";
import { GenericFilter } from "../searchComp/generic";
import { SearchComponent, SearchComponentCtrl } from "../searchComp";

export class CrudListSearchHandler implements ISearchHandler {
    data: ListItem[] = [];
    async on_search(words: any[]) {
        if (words.length === 0) {
            return this.data;
        }
        let res: ListItem[] = [];
        for (let val of this.data) {
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
    set_data(data: ListItem[]) {
        this.data = data;
    }
    parse_chip_value(value: string) {
        if (value.includes(":")) {
            const [key, val] = value.split(":");
            return { [key]: val };
        }
        return value;
    }
    private match_word(word: any, val: ListItem) {
        if (typeof word === "string") {
            return val.title.includes(word);
        }
        if (typeof word === "object") {
            for (let key in word) {
                if (
                    val.original[key] &&
                    JSON.stringify(val.original[key]).includes(word[key])
                ) {
                    return true;
                }
            }
            return false;
        }
        return false;
    }
}
export class GenericDataModel implements IDatamodel, IResultDisplayer {
    view: IView;
    model: ICRUDModel;
    constructor(view: IView, model: ICRUDModel) {
        this.view = view;
        this.model = model;
    }
    async get_data() {
        return this.model.read_all();
    }
    display_data(data: ListItem[]) {
        this.view.set_data(data);
    }
}
export class GenericCrudListCtrl implements CrudListModel {
    dataModel: GenericDataModel;
    model: ICRUDModel = new GenericCrudModel();
    createFormFields: ICreateFormFields;
    updateFormFields: IUpdateFormFields;
    view: IView;
    route: IRoute = new GenericRoute();
    contextMenuOptions: IContextMenuOptions;
    viewComponent: IViewComponent;
    filter: IFilter;
    searchCtrl: SearchComponentCtrl;
    constructor(listComp: any) {
        this.createFormFields = new GenericCreateFormFields(this);
        this.updateFormFields = new GenericUpdateFormFields(this);
        let contextMenuOptions = new GenericCrudContextMenuOptions(this);
        this.contextMenuOptions = contextMenuOptions;
        this.view = new GenericView(listComp);
        this.viewComponent = new GenericViewComponent(this);
        this.filter = new GenericFilter();
        this.searchCtrl = new SearchComponentCtrl();
        this.searchCtrl.search.handler = new CrudListSearchHandler();
        this.dataModel = new GenericDataModel(this.view, this.model);
        this.searchCtrl.search.data = this.dataModel;
        this.searchCtrl.search.resultDisplayer = this.dataModel;
    }

    get_page_size() {
        return 10;
    }
}

export const SearchCrudList = () => {
    const searchComp = SearchComponent();
    const listDisplayer = ListDisplayer();
    return Tools.div(
        {
            class: "flex flex-col gap-2",
            children: [searchComp, listDisplayer],
        },
        {},
        { searchComp, listDisplayer },
    );
};

export class CrudList {
    comp: any = SearchCrudList();
    listDisplayerCtrl: NewListDisplayerCtrl = new NewListDisplayerCtrl();
    model: GenericCrudListCtrl;
    base_path: string = "/dom-ops";
    constructor() {
        this.model = new GenericCrudListCtrl(this.listDisplayerCtrl);
    }
    setup() {
        this.model.searchCtrl.set_comp(this.comp.s.searchComp);
        this.model.searchCtrl.setup();
        this.listDisplayerCtrl.set_comp(this.comp.s.listDisplayer);
        this.listDisplayerCtrl.setup();
        this.listDisplayerCtrl.contextMenuOptions =
            this.model.contextMenuOptions
                .get_options()
                .map((option: string) => ({ label: option }));
        this.listDisplayerCtrl.title_getter = this.title_getter;
        this.listDisplayerCtrl.paginationCtrl.model.pageSize =
            this.model.get_page_size();
        this.listDisplayerCtrl.on_more_ops_clicked =
            this.on_more_ops_clicked.bind(this);
        this.listDisplayerCtrl.on_card_clicked =
            this.on_card_clicked.bind(this);
        this.comp.s.searchComp.s.addNewBtn.update(
            {},
            { click: () => this.model.route.route_to("/create") },
        );

        this.define_routes();
    }
    private define_routes() {
        this.model.route.define_route("", () => this.comp);
        this.model.route.define_route("/", () => this.comp);
        this.model.route.define_route("/create", () =>
            this.model.createFormFields.get_form(),
        );
        this.model.route.define_route("/edit", () =>
            this.model.updateFormFields.get_form(),
        );
        this.model.route.define_route("/view", () =>
            this.model.viewComponent.get_comp(),
        );

        this.model.model.read_all().then((data: any[]) => {
            this.model.view.set_data(data);
        });
    }
    private on_more_ops_clicked(data: any, label: string) {
        this.model.contextMenuOptions.more_ops_clicked(label, data);
    }
    private on_card_clicked(data: any) {
        this.model.contextMenuOptions.clicked(data);
    }
    update() {
        this.comp.s.listDisplayerCtrl.update();
    }

    title_getter(data: ListItem) {
        return data.title;
    }
    matches_path(path: string): boolean {
        let after_base_path = path.slice(this.base_path.length).trim();
        return (
            path.startsWith(this.base_path) &&
            this.model.route.match_route(after_base_path)
        );
    }
    get_component(params: any): GComponent {
        return Tools.div({
            class: "flex flex-col gap-2 p-2",
            children: [this.model.route.get_matched_route()],
        });
    }
}

export class CrudListAsPage implements IRouteController {
    comp: any;
    infos: IApp = {
        name: "CrudList",
        href: "/crud-list",
        subtitle: "CrudList",
        params: [],
    };
    constructor() {
        this.comp = new CrudList();
    }
    setup() {
        this.comp.setup();
    }
    matches_path(path: string): boolean {
        return path === "/crud-list";
    }
    get_component(params: any): GComponent {
        return this.comp.comp;
    }
    set_info(info: IApp): void {
        this.infos = info;
    }
    get_info(): IApp {
        return this.infos;
    }
}
