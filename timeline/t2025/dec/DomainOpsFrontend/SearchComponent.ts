import { Tools } from "../../april/tools";
import { InputComp, InputCompCtrl } from "./Component";
import { Dropdown, DropdownCtrl } from "./Component";
import { Plus } from "lucide";

export const OptionType = {
    none: "None",
    regex: "Regex",
    case: "Case",
    word: "Word",
}
export const SearchComp = () => {
    const inputCompCtrl = new InputCompCtrl();
    inputCompCtrl.set_comp(InputComp());

    const dropdownCtrl = new DropdownCtrl();
    let comp = Dropdown([
        { value: OptionType.none, label: OptionType.none },
        { value: OptionType.regex, label: OptionType.regex },
        { value: OptionType.case, label: OptionType.case },
        { value: OptionType.word, label: OptionType.word },
    ]);
    comp.update({class: "px-3 py-2 text-gray-700 border rounded-lg focus:outline-none mr-2"})
    dropdownCtrl.set_comp(comp);

    
    let advanceFilterToggle = Tools.comp("button", {
        class:
            "text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center focus:outline-none cursor-pointer",
        children: [
            Tools.comp("span", { textContent: "Advanced Filters" }),
        ],
    });

    const plusIcon = Tools.icon(Plus, {
        class: "w-8 h-8 text-gray-500 hover:rotate-90 duration-300 ease-in-out hover:scale-110 transform cursor-pointer",
    });
    const advancedFilterPanel = Tools.comp("div", {
        class: "bg-slate-50 rounded-lg mt-2",
    });
    const searchButton = Tools.comp("button", {
        class:
            "bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 font-medium transition-colors flex items-center",
        textContent: "Search",
        
    })
    return Tools.comp("div", {
        class:
            "w-full bg-white rounded-xl p-4",
        children: [
            
            Tools.comp("div", {
                class: "relative flex items-center gap-2",
                children: [
                    plusIcon,
                    Tools.comp("div", {
                        class:
                            "flex flex-1 items-center border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all shadow-sm",
                        children: [
                            
                            inputCompCtrl.comp,
                            dropdownCtrl.comp,
                            searchButton
                        ],
                    }),
                ],
            }),
            Tools.comp("div", {
                class: "flex justify-end mt-2",
                children: [advanceFilterToggle],
            }),
            advancedFilterPanel,
        ],
    }, {}, { inputCompCtrl, dropdownCtrl, advancedFilterPanel, advanceFilterToggle ,plusIcon, searchButton});
}

export class SearchComponentCtrl {
    comp: any;
    advancedFilterPanel: any;
    onPlusClicked: (e: any, ls: any) => void = () => {};
    onAdvanceFilterToggle: (e: any, ls: any) => void = () => {};
    onSearch: (e: any, ls: any) => void = () => {};
    set_advancedFilterPanel(comp: any) {
        this.advancedFilterPanel = comp;
    }
    set_comp(comp: any) {
        this.comp = comp;
    }
    setup() {
        this.comp.s.plusIcon.update(
            {},
            {
                click: (e: any, ls: any) => this.onPlusClicked(e, ls),
            }
        );
        this.comp.s.advanceFilterToggle.update(
            {},
            {
                click: (e: any, ls: any) => this.onAdvanceFilterToggle(e, ls),
            }
        );
        this.comp.s.searchButton.update(
            {},
            {
                click: (e: any, ls: any) => this.onSearch(e, ls),
            }
        );
    }
    get_values() {
        return {
            search: this.comp.s.inputCompCtrl.get_value(),
            type: this.comp.s.dropdownCtrl.get_value(),
        };
    }
    set_values(values: { search: string, type: string }) {
        this.comp.s.inputCompCtrl.set_value(values.search);
        this.comp.s.dropdownCtrl.set_value(values.type);
    }
    clear_values() {
        this.comp.s.inputCompCtrl.clear_value();
        this.comp.s.dropdownCtrl.clear_value();
    }
}

export class MainCtrl {
    static searchComponent(onPlusClicked: (e: any, ls: any) => void, onAdvanceFilterToggle: (e: any, ls: any) => void, onSearch: (e: any, ls: any) => void) {
        const searchComponentCtrl = new SearchComponentCtrl();
        const searchComponent = SearchComp();
        searchComponentCtrl.set_comp(searchComponent);
        searchComponentCtrl.onPlusClicked = onPlusClicked;
        searchComponentCtrl.onAdvanceFilterToggle = onAdvanceFilterToggle;
        searchComponentCtrl.onSearch = onSearch;
        searchComponentCtrl.setup();
        return searchComponentCtrl;
    }
}