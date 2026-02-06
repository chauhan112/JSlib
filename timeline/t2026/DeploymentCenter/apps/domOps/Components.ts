import { Check, Plus, X } from "lucide";
import { Tools } from "../../../../globalComps/tools";
import { InputCompCtrl } from "../../../../t2025/dec/DomainOpsFrontend/components/atomic";

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
    return Tools.comp("div", {
        class: "flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-2 bg-white rounded-lg border border-gray-200 shadow-sm",
        children: [
            addNewBtn,
            chips,
            Tools.comp("div", {
                class: "flex flex-grow items-center border border-gray-300 rounded focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all",
                children: [inp_comp, okBtn]
            }),
            search_button
        ],
    }, {}, { inp_comp, search_button, chips, okBtn, addNewBtn });
}

export interface ISearchHandler{
    on_search: (words: any[], comps: {[key: string]: any}[]) => void;
    parse_chip_value: (value: string) => any;
}

export class SearchHandler implements ISearchHandler{
    on_search(words: any[], comps: {[key: string]: any}[]) {
        console.log(words);
        return [];
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
    private on_search(e: any) {
        let search_words = this.chipsValue.map((v: string) => this.search_handler.parse_chip_value(v));
        let inp_word = this.inp_comp_ctrl.get_value().trim()
        if (inp_word !== "") {
            search_words.push(this.search_handler.parse_chip_value(inp_word));
        }
        this.search_handler.on_search(search_words, this.comps);
    }
}

