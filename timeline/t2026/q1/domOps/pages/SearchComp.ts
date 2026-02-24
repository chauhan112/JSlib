import type { GComponent } from "../../../../globalComps/GComponent";
import type { ISComponent } from "../../../../globalComps/interface";
import { Tools } from "../../../../globalComps/tools";
import type {
    IOptionItem,
    DropdownCtrl,
} from "../../../../t2025/dec/DomainOpsFrontend/components/atomic";
import { SearchComponent } from "../../../DeploymentCenter/apps/domOps/searchComp";
import { DefaultParser } from "../../filterComp";
import type { IFilterParser } from "../../filterComp/interface";
import type { ISubComponentable } from "../../ui-showcase/interface";
import { SearchComponent as SearchCompCtrl } from "../../view_crud_list/searchComp";
import type { IClickable, IComponentTools } from "../interface";

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
            ctrl: DropdownCtrl;
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
    model: IFilterParser = new DefaultParser();
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
        this.ctrl.parse_chip_value = (value: string) =>
            this.model.parse_chip_value(value);
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
                    ctrl: this.comp.s.filters,
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
    set_values(values: any[]) {
        this.ctrl.set_values(
            values.map((v) => this.model.unparse_chip_value(v)),
        );
    }
}
