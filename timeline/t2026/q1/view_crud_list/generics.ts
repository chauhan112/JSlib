import type { GComponent } from "../../../globalComps/GComponent";
import type {
    IView,
    IListDisplayer,
    IListItem,
    IListModel,
    IPagination,
} from "./interface";
import { type ISearchView, SearchComponent } from "./searchComp";
import { GenericCrudModel } from "../../DeploymentCenter/apps/domOps/crud_list/generic_interface";
import { Pagination } from "../../../t2025/july/generic-crud/page";
import { CardCompCtrl } from "../../../t2025/dec/DomainOpsFrontend/components/atomic";
import { CardComp } from "../../../t2025/dec/DomainOpsFrontend/components/atomicComp";
import { Tools } from "../../../globalComps/tools";
import type { ListItem } from "../../DeploymentCenter/apps/domOps/crud_list/interface";
import { PaginationCtrl } from "../../../t2025/dec/DomainOpsFrontend/components/ListDisplayer";
import type { IRoute } from "../WebPageWithRoutes/interface";
import { GRoute } from "../WebPageWithRoutes/generic";

export class GPagination implements IPagination {
    comp = Pagination();
    private ctrl = new PaginationCtrl();
    current_page: number = 1;
    total: number = 0;
    page_size: number = 10;

    set_total(total: number) {
        this.total = total;
        this.ctrl.model.maxPage = Math.ceil(this.total / this.page_size);
    }
    get_comp(): GComponent {
        return this.comp;
    }

    goto(page: number) {
        this.current_page = page;
        this.update_ui();
    }

    update_ui() {
        this.ctrl.model.currentPage = this.current_page;
        this.ctrl.default_update();
        this.update_for_page(this.current_page);
    }

    update_for_page(page: number) {
        console.log(page);
    }

    setup() {
        this.ctrl.set_comp(this.comp);
        this.ctrl.update = () => {
            this.sync_update_with_model();
        };
        this.ctrl.setup();
    }

    private sync_update_with_model() {
        this.current_page = this.ctrl.model.currentPage;
        this.update_for_page(this.current_page);
    }
}

export class GListModel implements IListModel {
    contextMenus: string[] = [];
    data: any;
    on_click(data: any) {
        console.log(data);
    }
    on_menu_clicked(value: string) {
        console.log(value);
    }
}

export class GListItem implements IListItem {
    model: IListModel = new GListModel();
    label: string = "";
    comp = CardComp();
    ctrl = new CardCompCtrl();

    get_comp(): GComponent {
        return this.comp;
    }
    setup() {
        this.comp.getElement().classList.add("cursor-pointer");
        this.ctrl.set_comp(this.comp);
        this.ctrl.title_getter = (data: any) => this.label;
        this.ctrl.onCardClicked = (data: any) => this.model.on_click(data);
        this.ctrl.onOpsMenuClicked = (data: any, label: string) =>
            this.model.on_menu_clicked(label);
        this.ctrl.set_options(
            this.model.contextMenus.map((m) => ({ label: m })),
        );
        this.ctrl.set_data(this.model.data);
        this.ctrl.setup();
    }
}

export class GListDisplayer implements IListDisplayer {
    pagination: IPagination;
    list: IListItem[] = [];
    comp: any;
    listDiv: GComponent = Tools.comp("ul", {
        class: "flex flex-col gap-2 w-full",
    });
    constructor() {
        this.pagination = new GPagination();
    }
    get_comp(): GComponent {
        return this.comp;
    }
    setup() {
        this.pagination.setup();
        this.comp = Tools.div({
            class: "flex flex-col w-full items-start gap-4",
            children: [this.pagination.get_comp(), this.listDiv],
        });
    }
    component_creator(label: string, data: any): IListItem {
        let item = new GListItem();
        item.label = label;
        item.model.data = data;
        item.setup();
        return item;
    }

    update_list() {
        this.listDiv.update({
            innerHTML: "",
            children: this.list.map((item: IListItem) => item.get_comp()),
        });
    }
}

export class GView implements IView {
    route: IRoute = new GRoute();
    searchComp: ISearchView = new SearchComponent();
    lister: IListDisplayer = new GListDisplayer();
    model: GenericCrudModel = new GenericCrudModel();
    comp: any;
    temp_data: any[] = [];

    get_comp(): GComponent {
        return this.comp;
    }

    setup() {
        let sc = this.searchComp as SearchComponent;
        sc.setup();
        sc.searchComp.search.active_comp.create = true;
        sc.searchComp.setup();
        this.lister.setup();
        this.comp = Tools.div({
            class: "flex flex-col w-full items-start gap-4",
            children: [this.searchComp.get_component(), this.lister.get_comp()],
        });
        this.fetch_data().then(() => this.update_page());
        this.lister.pagination.update_for_page = (page: number) =>
            this.update_page();
    }

    private async fetch_data() {
        this.model.read_all().then((data) => {
            this.temp_data = data;
            this.lister.pagination.set_total(data.length);
            this.lister.pagination.update_ui();
        });
    }

    private get_current_page_data() {
        return this.temp_data.slice(
            (this.lister.pagination.current_page - 1) *
                this.lister.pagination.page_size,
            this.lister.pagination.current_page *
                this.lister.pagination.page_size,
        );
    }

    async update_page() {
        let data = this.get_current_page_data();
        this.lister.list = data.map((d: ListItem) =>
            this.lister.component_creator(d.title, d),
        );
        this.lister.update_list();
    }
}
