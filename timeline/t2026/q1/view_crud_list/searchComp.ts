import type { IRoute } from "../WebPageWithRoutes/interface";
import { GRoute } from "../WebPageWithRoutes/generic";
import type { GComponent } from "../../../globalComps/GComponent";
import { SearchComponentCtrl } from "../../DeploymentCenter/apps/domOps/searchComp/index";
import {
    type IApp,
    GRouterController,
} from "../../DeploymentCenter/interfaces";
import {
    DropdownCtrl,
    type IOptionItem,
} from "../../../t2025/dec/DomainOpsFrontend/components/atomic";

export interface ISearchModel {
    on_search: (words: any[]) => Promise<any[]>;
    parse_chip_value: (value: string) => any;
    on_filter_selected: (value: string) => void;
    on_filter_clicked: () => void;
    on_plus_clicked: () => void;
    get_filter_options: () => IOptionItem[];
}

export interface ISearchView {
    model: ISearchModel;
    route: IRoute;
    get_component(): GComponent;
}

export class GSearchModel implements ISearchModel {
    parent: ISearchView;
    constructor(view: ISearchView) {
        this.parent = view;
    }
    async on_search(words: any[]) {
        return [];
    }
    parse_chip_value(value: string) {
        console.log(value);
        return value;
    }
    on_filter_selected(value: string) {
        console.log(value);
    }
    on_filter_clicked() {
        this.parent.route.tool.relative_route("/filter", {});
    }
    on_plus_clicked() {
        this.parent.route.tool.relative_route("/+", {});
    }
    get_filter_options() {
        return [
            { value: "a", label: "a" },
            { value: "b", label: "b" },
            { value: "c", label: "c" },
        ];
    }
}

export class SearchComponent implements ISearchView {
    model: ISearchModel;
    route: IRoute;
    searchComp: SearchComponentCtrl = new SearchComponentCtrl();
    constructor() {
        this.model = new GSearchModel(this);
        this.route = new GRoute();
    }
    get_component() {
        return this.searchComp.comp;
    }
    setup() {
        this.searchComp.search.handler.on_search = async (words: any[]) =>
            this.model.on_search(words);
        this.searchComp.comp.s.addNewBtn.update(
            {},
            { click: (e: any) => this.model.on_plus_clicked() },
        );
        this.searchComp.comp.s.filterBtn.update(
            {},
            { click: (e: any) => this.model.on_filter_clicked() },
        );
        let filter = this.searchComp.comp.s.filters as DropdownCtrl;
        filter.placeholder = "-select-";
        filter.set_options(this.model.get_filter_options());
        filter.comp.update(
            {},
            {
                change: (e: any) =>
                    this.model.on_filter_selected(e.target.value),
            },
        );
        this.searchComp.search.active_comp.filter = false;
        this.searchComp.search.active_comp.create = false;
        this.searchComp.setup();
    }
}

export class SearchCompAsPage extends GRouterController {
    sc: SearchComponent = new SearchComponent();
    info: IApp = {
        name: "Search",
        href: "/search-v2",
        subtitle: "v2",
        params: [],
    };
    get_component(params: any): GComponent {
        console.log("params", params);
        return this.sc.get_component();
    }
    setup() {
        this.sc.setup();
    }
}
