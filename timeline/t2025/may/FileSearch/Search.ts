import { Tools, MoreTools } from "../../april/tools";
import { LabeledInput } from "./LabeledInput";
// npm install lucide
import { Cog, RotateCcw, Plus, X } from "lucide";
import { GenericModal } from "./Modal";
// npm install uuid
import { v4 as uuidv4 } from "uuid";

export const SimpleSearch = () => {
    let inpComp = Tools.comp("input", {
        class: "w-full p-2 border border-gray-300 rounded-md",
        placeholder: "word to search",
        name: "search",
    });
    let caseInp = LabeledInput(
        "case",
        {
            class: "flex items-center gap-2 flex-row-reverse",
        },
        { type: "checkbox", class: "w-6 h-6", value: "true" }
    );
    let regInp = LabeledInput(
        "reg",
        {
            class: "flex items-center gap-2 flex-row-reverse",
        },
        { type: "checkbox", class: "w-6 h-6", value: "true" }
    );
    let searchBtn = Tools.comp("button", {
        class: "flex items-center justify-center p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer w-24",
        textContent: "search",
    });

    let activate = (active: boolean) => {
        (inpComp.getElement() as HTMLInputElement).disabled = !active;
        caseInp.s.inpComp.getElement().disabled = !active;
        regInp.s.inpComp.getElement().disabled = !active;
    };
    const getValues = () => {
        return {
            word: (inpComp.getElement() as HTMLInputElement).value,
            caseSensitive: caseInp.s.inpComp.getElement().checked,
            reg: regInp.s.inpComp.getElement().checked,
        };
    };
    return Tools.div(
        {
            class: "flex w-full items-center gap-2 rounded-md bg-white p-2 ",
            children: [inpComp, caseInp, regInp, searchBtn],
        },
        {},
        {
            comps: { inpComp, caseInp, regInp, searchBtn },
            handlers: { getValues, activate },
        }
    );
};
export const SearchComponent = () => {
    let settingComp = Tools.icon(
        Cog,
        {
            class: "w-12 h-12 text-gray-500 cursor-pointer hover:text-gray-700",
        },
        {
            click: (e: any, ls: any) => {
                modal.s.handlers.display(concSearch);
                modal.s.handlers.show();
            },
        }
    );
    let simpleSearch = SimpleSearch();
    let modal = GenericModal("Search Settings");
    modal.s.wrap.getElement().classList.add("h-full", "w-full");
    const getSearchParams = () => {
        const isActive = concSearch.s.handlers.isActive();
        if (isActive) {
            return {
                type: "concat",
                params: concSearch.s.handlers.getFilters(),
            };
        }
        return {
            type: "simple",
            params: simpleSearch.s.handlers.getValues(),
        };
    };

    let lay = Tools.div(
        {
            class: "flex w-full items-center gap-2 rounded-md border border-gray-300 bg-white p-2 shadow-sm",
            children: [settingComp, simpleSearch, modal],
        },
        {},
        {
            comps: { settingComp, simpleSearch, ...simpleSearch.s.comps },
            handlers: { ...simpleSearch.s.handlers, getSearchParams },
        }
    );
    let concSearch = ConcatenatedSearch();
    const toggleSimpleSearch = (active: boolean) => {
        if (active) {
            simpleSearch.s.handlers.activate(active);
            simpleSearch.s.comps.inpComp.update({
                placeholder: "word to search",
                value: "",
            });
        } else {
            simpleSearch.s.handlers.activate(active);
            simpleSearch.s.comps.inpComp.update({
                placeholder:
                    "concat search is active so simple search is disabled",
            });
        }
    };

    const onDoneClicked = (e: any, ls: any) => {
        const isActive = concSearch.s.handlers.isActive();
        if (isActive) {
            toggleSimpleSearch(false);
        } else {
            toggleSimpleSearch(true);
        }
        modal.s.handlers.hide();
    };
    concSearch.s.comps.doneBtn.update({}, { click: onDoneClicked });

    return lay;
};
const SearchCompCrud = () => {
    const uuid = uuidv4();
    const ss = SimpleSearch();
    let closeBtn = Tools.icon(X, {
        class: "w-6 h-6 text-red-500 cursor-pointer hover:text-red-700",
    });
    let lay = Tools.div(
        {
            class: "flex items-center gap-2 rounded-md ",
            children: [closeBtn, ss],
        },
        {},
        { id: uuid, searchComp: ss, closeBtn }
    );
    return lay;
};
export const ConcatenatedSearch = () => {
    let searchComps: any = [];

    const onAdd = () => {
        const newSearchComp = SearchCompCrud();
        newSearchComp.s.closeBtn.update(
            {},
            {
                click: (e: any, ls: any) => {
                    searchComps = searchComps.filter(
                        (comp: any) => comp.s.id !== newSearchComp.s.id
                    );
                    filters.update({
                        innerHTML: "",
                        children: searchComps,
                    });
                },
            }
        );
        searchComps.push(newSearchComp);
        MoreTools.removeLastElement(newSearchComp.s.searchComp);
        filters.update({
            child: newSearchComp,
        });
    };

    const onReset = () => {
        searchComps = [];
        filters.update({
            innerHTML: "",
        });
    };
    const filters = Tools.div({
        class: "flex flex-col gap-2 flex-1 overflow-y-auto min-h-0",
    });
    const resetBtn = Tools.icon(
        RotateCcw,
        {
            class: "flex items-center justify-center cursor-pointer w-12 h-12 text-gray-500 hover:text-gray-700",
        },
        {
            click: (e: any, ls: any) => {
                onReset();
            },
        }
    );
    let doneBtn = Tools.comp(
        "button",
        {
            class: "flex items-center justify-center p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer w-24",
            textContent: "done",
        },
        {
            click: (e: any, ls: any) => {
                const values = getFilters();
                console.log("Search Values:", values);
            },
        }
    );
    const plusIcon = Tools.icon(
        Plus,
        {
            class: "flex items-center justify-center cursor-pointer w-12 h-12 text-gray-500 hover:text-gray-700",
        },
        {
            click: (e: any, ls: any) => {
                onAdd();
            },
        }
    );
    const getFilters = () => {
        return searchComps
            .map((comp: any) => {
                return comp.s.searchComp.s.handlers.getValues();
            })
            .filter((val: any) => val.word && val.word.trim() !== "");
    };
    const isActive = () => {
        return searchComps.length > 0 && getFilters().length > 0;
    };
    return Tools.div(
        {
            class: "w-full flex flex-1 flex-col",
            children: [
                Tools.div({
                    class: "flex w-full items-center justify-between",
                    children: [resetBtn, plusIcon, doneBtn],
                }),
                filters,
            ],
        },
        {},
        {
            handlers: { getFilters, onReset, onAdd, isActive },
            comps: { resetBtn, plusIcon, doneBtn },
        }
    );
};
