import type { IRoute } from "../WebPageWithRoutes/interface";
import type { GComponent } from "../../../globalComps/GComponent";
import { Chip } from "../../DeploymentCenter/apps/domOps/searchComp/index";
import {
    type IApp,
    GRouterController,
} from "../../DeploymentCenter/interfaces";
import {
    InputCompCtrl,
    type IOptionItem,
} from "../../../t2025/dec/DomainOpsFrontend/components/atomic";
import { Tools } from "../../../globalComps/tools";
import { Check } from "lucide";
import type { ISComponent } from "../../../globalComps/interface";

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

export const SearchComponentComp = () => {
    const inp_comp = Tools.comp("input", {
        type: "text",
        class: "flex-grow min-w-0 outline-none text-gray-700 px-3 py-2 text-base md:text-sm",
        placeholder:
            "Type filter (e.g. status:active, price:>100) and hit Enter...",
    });

    const search_button = Tools.comp("button", {
        class: "px-6 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded shadow-sm transition-colors font-medium w-full sm:w-auto cursor-pointer",
        textContent: "Search",
    });

    const chips = Tools.comp("div", {
        class: "flex flex-wrap gap-2 items-center",
    });
    const okBtn = Tools.icon(Check, {
        // hidden by default display when opening in mobile
        class: "block sm:hidden w-6 h-6 text-green-500 hover:text-green-700 active:text-green-800 cursor-pointer ",
    });

    const inp_with_ok_btn = Tools.comp("div", {
        class: "flex flex-grow items-center border border-gray-300 rounded focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all",
        children: [inp_comp, okBtn],
    });

    return Tools.comp(
        "div",
        {
            class: "flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-2 bg-white rounded-lg border border-gray-200 shadow-sm",
            children: [chips, inp_with_ok_btn, search_button],
        },
        {},
        {
            inp_comp,
            search_button,
            chips,
            okBtn,
            inp_with_ok_btn,
        },
    );
};

export class SearchComponent implements ISComponent {
    chipsValue: string[] = [];
    inp_comp_ctrl: InputCompCtrl = new InputCompCtrl();
    comp = SearchComponentComp();

    get_comp() {
        return this.comp;
    }

    setup() {
        this.inp_comp_ctrl.set_comp(this.comp.s.inp_comp);

        this.comp.s.inp_comp.update(
            {},
            {
                keydown: (e: any) => {
                    e.key === "Enter" &&
                        this.set_values([this.inp_comp_ctrl.get_value()]);
                },
            },
        );
        this.comp.s.search_button.update(
            {},
            { click: () => this.on_search(this.get_values()) },
        );
        this.comp.s.okBtn.update(
            {},
            {
                click: () => {
                    this.set_values([this.inp_comp_ctrl.get_value()]);
                },
            },
        );
    }

    set_values(values: string[]) {
        for (let value of values) {
            if (value.trim() === "") continue;
            let chip = this.get_chip(value.trim());
            this.comp.s.chips.update({ child: chip });
            this.inp_comp_ctrl.clear_value();
            this.chipsValue.push(value.trim());
        }
    }

    clear() {
        this.chipsValue = [];
        this.comp.s.chips.update({ innerHTML: "", children: [] });
        this.inp_comp_ctrl.clear_value();
    }
    get_chip(value: string) {
        let chip = Chip(value.trim());
        chip.s.delete.update(
            {},
            {
                click: () => {
                    chip.getElement().remove();
                    this.chipsValue = this.chipsValue.filter(
                        (v: string) => v !== value.trim(),
                    );
                },
            },
        );
        return chip;
    }

    parse_chip_value(value: string) {
        let query: any = {};
        if (value.includes(":")) {
            const [key, val] = value.split(":");

            if (val.startsWith(">")) {
                query[key] = { $gt: Number(val.substring(1)) };
            } else if (val.startsWith("<")) {
                query[key] = { $lt: Number(val.substring(1)) };
            } else {
                query[key] = val;
            }
            return query;
        }
        return value;
    }

    async on_search(words: any[]) {
        console.log("searching ", words);
    }
    get_values(): any[] {
        let search_words = this.chipsValue.map((v: string) =>
            this.parse_chip_value(v),
        );
        let inp_word = this.inp_comp_ctrl.get_value().trim();
        if (inp_word !== "") {
            search_words.push(this.parse_chip_value(inp_word));
        }
        return search_words;
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
        return this.sc.get_comp();
    }
    setup() {
        this.sc.setup();
    }
}
