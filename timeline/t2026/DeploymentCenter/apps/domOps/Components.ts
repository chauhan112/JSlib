import { Check, Filter, Plus, X } from "lucide";
import { Tools } from "../../../../globalComps/tools";
import { InputCompCtrl, MainCtrl as AtomicMainCtrl } from "../../../../t2025/dec/DomainOpsFrontend/components/atomic";
import type { ListItem } from "./crud_list/interface";

export const Chip = (text: string) => {
    return Tools.comp("div", {
        class: "bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center space-x-1",
        children: [
            Tools.comp("span", { textContent: text }),
            Tools.comp("button", {
                key: "delete",
                class: "hover:text-red-900 cursor-pointer",
                children: [Tools.icon(X, { class: "w-3 h-3" })],
            }),
        ],
    });
}

export const SearchComponent = () => {
    const inp_comp = Tools.comp("input", {
        type: "text",
        class: "flex-grow min-w-0 outline-none text-gray-700 px-3 py-2 text-base md:text-sm",
        placeholder: "Type filter (e.g. status:active, price:>100) and hit Enter...",
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
    const addNewBtn = Tools.comp("button", {
        class: "flex justify-center items-center bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded shadow-sm transition-colors font-medium w-full sm:w-auto cursor-pointer",
        children: [Tools.icon(Plus, { class: "w-6 h-6" })],
    });

    const filters = AtomicMainCtrl.dropdown([
        { value: "", label: "--filter--" },
    ]);
    filters.comp.getElement().classList.add("mt-2", "w-full", "sm:w-auto", "sm:mt-0");

    const filterBtn = Tools.icon(Filter, { class: "w-6 h-6 text-gray-500 hover:text-gray-700 active:text-gray-800 cursor-pointer" });
    return Tools.comp("div", {
        class: "flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-2 bg-white rounded-lg border border-gray-200 shadow-sm",
        children: [
            addNewBtn,
            chips,
            Tools.comp("div", {
                class: "flex flex-grow items-center border border-gray-300 rounded focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all",
                children: [inp_comp, okBtn]
            }),
            Tools.div({
                class:"flex gap-2 flex-col sm:flex-row items-center",
                children: [search_button, filters.comp, filterBtn]
            })
        ],
    }, {}, { inp_comp, search_button, chips, okBtn, addNewBtn });
}

export interface ISearchHandler{
    on_search: (words: any[]) => Promise<ListItem[]>;
    parse_chip_value: (value: string) => any;
    set_data: (data: ListItem[]) => void;
}

export interface IDatamodel {
    get_data: () => Promise<ListItem[]>;
}

export interface IResultDisplayer {
    display_data: (data: ListItem[]) => void;
}

export class ResultDisplayer implements IResultDisplayer {
    display_data(data: ListItem[]) {
        console.log("displaying data", data);
    }
}

export class DataModel implements IDatamodel {
    async get_data() {
        return [];
    }
}

export class SearchHandler implements ISearchHandler{
    data: ListItem[] = [];
    set_data(data: ListItem[]) {
        this.data = data;
    }
    async on_search(words: any[]) {
        console.log("parameters of search", words);
        return this.data;
    };
    parse_chip_value(value: string) {
        let query: any = {};
        if (value.includes(':')) {
            const [key, val] = value.split(':');
            
            if (val.startsWith('>')) {
                query[key] = { $gt: Number(val.substring(1)) };
            } else if (val.startsWith('<')) {
                query[key] = { $lt: Number(val.substring(1)) };
            } else {
                query[key] = val;
            }
        } else {
            if (!query.$or) query.$or = [];
            query.$or.push({ description: { $regex: value, $options: 'i' }});
        }
        return query;
    }
}

export class SearchComponentCtrl {
    comp: any;
    search_handler: ISearchHandler = new SearchHandler();
    comps: {[key: string]: any}[] = [];
    inp_comp_ctrl: InputCompCtrl = new InputCompCtrl();
    chipsValue: string[] = [];
    datamodel: IDatamodel = new DataModel();
    resultDisplayer: IResultDisplayer = new ResultDisplayer();
    constructor() {
        this.comp = SearchComponent();
    }
    set_comp(comp: any) {
        this.comp = comp;
    }
    setup() {
        this.inp_comp_ctrl.set_comp(this.comp.s.inp_comp);
        this.comps.push({ inp_comp: this.comp.s.inp_comp, search_button: this.comp.s.search_button, chips: this.comp.s.chips });
        this.comp.s.inp_comp.update({}, {keydown: (e: any) => this.on_keydown(e)},);
        this.comp.s.search_button.update({}, {click: (e: any) => this.on_search(e)}, );
        this.comp.s.okBtn.update({}, {click: (e: any) => this.on_ok_btn(e)}, );
    }
    private on_keydown(e: any) {
        const value = this.inp_comp_ctrl.get_value();
        if (e.key === 'Enter' && value.trim() !== "") {
            let chip = this.get_chip(value.trim());
            this.comp.s.chips.update({ child: chip });
            this.inp_comp_ctrl.clear_value();
            this.chipsValue.push(value.trim());
        }
    }
    private on_ok_btn(e: any) {
        const value = this.inp_comp_ctrl.get_value();
        if (value.trim() !== "") {
            let chip = this.get_chip(value.trim());
            this.comp.s.chips.update({ child: chip });
            this.inp_comp_ctrl.clear_value();
            this.chipsValue.push(value.trim());
        }
    }
    private get_chip(value: string) {
        let chip = Chip(value.trim());
        chip.s.delete.update({},{ click: () => {
            chip.getElement().remove();
            this.chipsValue = this.chipsValue.filter((v: string) => v !== value.trim());
        }});
        return chip;
    }
    private async on_search(e: any) {
        let search_words = this.chipsValue.map((v: string) => this.search_handler.parse_chip_value(v));
        let inp_word = this.inp_comp_ctrl.get_value().trim()
        if (inp_word !== "") {
            search_words.push(this.search_handler.parse_chip_value(inp_word));
        }
        let data = await this.datamodel.get_data();
        this.search_handler.set_data(data);
        let result = await this.search_handler.on_search(search_words);
        this.resultDisplayer.display_data(result);
    }
}

