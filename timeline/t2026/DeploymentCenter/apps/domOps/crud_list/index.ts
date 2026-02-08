import { Tools } from "../../../../../globalComps/tools";
import {
    ListDisplayer,
    NewListDisplayerCtrl,
} from "../../../../../t2025/dec/DomainOpsFrontend/components/ListDisplayer";
import {
    SearchComponent,
    SearchComponentCtrl,
    type IDatamodel,
    type ISearchHandler,
    type IResultDisplayer,
} from "../Components";
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
    IFilter,
} from "./interface";
import {
    GenericUpdateFormFields,
    GenericRoute,
    GenericView,
    GenericCreateFormFields,
    GenericCrudModel,
    GenericCrudContextMenuOptions,
    GenericViewComponent,
    GenericFilter,
} from "./generic_interface";
import type { GComponent } from "../../../../../globalComps/GComponent";

export class GenericCrudListCtrl implements CrudListModel, ISearchHandler {
    model: ICRUDModel = new GenericCrudModel();
    createFormFields: ICreateFormFields;
    updateFormFields: IUpdateFormFields;
    view: IView;
    route: IRoute = new GenericRoute();
    contextMenuOptions: IContextMenuOptions;
    viewComponent: IViewComponent;
    constructor(listComp: any) {
        this.createFormFields = new GenericCreateFormFields(this);
        this.updateFormFields = new GenericUpdateFormFields(this);
        let contextMenuOptions = new GenericCrudContextMenuOptions(this);
        this.contextMenuOptions = contextMenuOptions;
        this.view = new GenericView(listComp);
        this.viewComponent = new GenericViewComponent(this);
    }
    on_search(words: any[]) {
        if (words.length === 0) {
            this.model.read_all().then((vals: ListItem[]) => {
                this.view.set_data(vals);
            });
            return;
        }
        this.model.read_all().then((vals: ListItem[]) => {
            let res: ListItem[] = [];
            for (let val of vals) {
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
            this.view.set_data(res);
        });
    };

    private match_word(word: any, val: ListItem) {
        if (typeof word === 'string') {
            return val.title.includes(word);
        }
        if (typeof word === 'object') {
            for (let key in word) {
                if (val.original[key]  && JSON.stringify(val.original[key]).includes(word[key])) {
                    return true;
                }
            }
            return false;
        }
        return false;
    }

    get_page_size(){
        return 10;
    };
    parse_chip_value(value: string) {
        if (value.includes(':')) {
            const [key, val] = value.split(':');
            return { [key]: val };
        }
        return value;
    }
    
}
export const SearchCrudList = () => {
    const searchComp = SearchComponent();
    const listDisplayer = ListDisplayer();
    return Tools.div({
        class: "flex flex-col gap-2",
        children: [searchComp, listDisplayer],
    }, {}, { searchComp, listDisplayer });
}
export class CrudList  {
    comp: any = SearchCrudList();
    searchComponentCtrl: SearchComponentCtrl = new SearchComponentCtrl();
    listDisplayerCtrl: NewListDisplayerCtrl = new NewListDisplayerCtrl();
    model: GenericCrudListCtrl
    base_path: string = "/dom-ops";
    constructor() {
        this.model = new GenericCrudListCtrl(this.listDisplayerCtrl);
    }
    setup() {
        this.searchComponentCtrl.set_comp(this.comp.s.searchComp);
        this.searchComponentCtrl.setup();
        this.listDisplayerCtrl.set_comp(this.comp.s.listDisplayer);
        this.listDisplayerCtrl.setup();
        this.searchComponentCtrl.search_handler = (this.model as unknown as ISearchHandler);
        this.listDisplayerCtrl.contextMenuOptions = this.model.contextMenuOptions.get_options().map((option: string) => ({ label: option }));
        this.listDisplayerCtrl.title_getter = this.title_getter;
        this.listDisplayerCtrl.paginationCtrl.model.pageSize = this.model.get_page_size();
        this.listDisplayerCtrl.on_more_ops_clicked = this.on_more_ops_clicked.bind(this);
        this.listDisplayerCtrl.on_card_clicked = this.on_card_clicked.bind(this);
        this.comp.s.searchComp.s.addNewBtn.update({}, { click: () => this.model.route.route_to("/create") });
        this.model.route.define_route("", () => this.comp);
        this.model.route.define_route("/", () => this.comp);
        this.model.route.define_route("/create", () => this.model.createFormFields.get_form());
        this.model.route.define_route("/edit", () => this.model.updateFormFields.get_form());
        this.model.route.define_route("/view", () => this.model.viewComponent.get_comp());

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
        return path.startsWith(this.base_path) && this.model.route.match_route(after_base_path);
    }
    get_component(params: any): GComponent {
        return Tools.div({
            class: "flex flex-col gap-2 p-2",
            children: [this.model.route.get_matched_route()],
        });
    }
}