import { Check, Filter, Plus, X } from "lucide";
import { Tools } from "../../../../../globalComps/tools";
import { InputCompCtrl, MainCtrl as AtomicMainCtrl } from "../../../../../t2025/dec/DomainOpsFrontend/components/atomic";
import type { ISearchInput } from "./interface";
import { SearchInput } from "./generic";
import type { IApp, IRouteController } from "../../../routeController";
import type { GComponent } from "../../../../../globalComps/GComponent";
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
    const inp_with_ok_btn = Tools.comp("div", {
        class: "flex flex-grow items-center border border-gray-300 rounded focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all",
        children: [inp_comp, okBtn]
    })
    const filterBtn = Tools.icon(Filter, { class: "w-6 h-6 text-gray-500 hover:text-gray-700 active:text-gray-800 cursor-pointer" });
    return Tools.comp("div", {
        class: "flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-2 bg-white rounded-lg border border-gray-200 shadow-sm",
        children: [
            addNewBtn,
            chips,
            inp_with_ok_btn,
            Tools.div({
                class:"flex gap-2 flex-col sm:flex-row items-center",
                children: [search_button, filters.comp, filterBtn]
            })
        ],
    }, {}, { inp_comp, search_button, chips, okBtn, addNewBtn, filters, filterBtn, inp_with_ok_btn });
}

export class SearchComponentCtrl {
    comp: any;
    search: ISearchInput = new SearchInput();
    inp_comp_ctrl: InputCompCtrl = new InputCompCtrl();
    chipsValue: string[] = []
    constructor() {
        this.comp = SearchComponent();
    }
    set_comp(comp: any) {
        this.comp = comp;
    }
    setup() {
        this.inp_comp_ctrl.set_comp(this.comp.s.inp_comp);
        
        if (this.search.active_comp.filter) {
            this.show_comp(this.comp.s.filters.comp);
            this.show_comp(this.comp.s.filterBtn);
        }else{
            this.hide_comp(this.comp.s.filters.comp);
            this.hide_comp(this.comp.s.filterBtn);
        }
        if (this.search.active_comp.create) {
            this.show_comp(this.comp.s.addNewBtn);
        }else{
            this.hide_comp(this.comp.s.addNewBtn);
        }
        if (this.search.active_comp.search) {
            this.show_comp(this.comp.s.inp_with_ok_btn);
            this.show_comp(this.comp.s.search_button);
            this.show_comp(this.comp.s.chips);
            this.comp.s.inp_comp.update({}, {keydown: (e: any) => this.on_keydown(e)},);
            this.comp.s.search_button.update({}, {click: (e: any) => this.on_search(e)}, );
            this.comp.s.okBtn.update({}, {click: (e: any) => this.on_ok_btn(e)}, );
        }else{
            this.hide_comp(this.comp.s.search_button);
            this.hide_comp(this.comp.s.inp_with_ok_btn);
            this.hide_comp(this.comp.s.chips);
        }



    }
    private hide_comp(comp: any) {
        comp.getElement().classList.add("hidden");
    }
    private show_comp(comp: any) {
        comp.getElement().classList.remove("hidden");
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
        let search_words = this.chipsValue.map((v: string) => this.search.handler.parse_chip_value(v));
        let inp_word = this.inp_comp_ctrl.get_value().trim()
        if (inp_word !== "") {
            search_words.push(this.search.handler.parse_chip_value(inp_word));
        }
        let data = await this.search.data.get_data();
        this.search.handler.set_data(data);
        let result = await this.search.handler.on_search(search_words);
        this.search.resultDisplayer.display_data(result);
    }
}

