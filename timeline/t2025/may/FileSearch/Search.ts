import { Tools, MoreTools } from "../../april/tools";
import { LabeledInput } from "./LabeledInput";
import { Cog, RotateCcw, Plus, X } from "lucide";
import { GenericModal } from "./Modal";
import { v4 as uuidv4 } from "uuid";

export const SimpleSearch = () => {
    let inpComp = Tools.comp("input", {
        class: "w-full p-2 border border-gray-300 rounded-md",
        placeholder: "search simply",
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
    let lay = Tools.div(
        {
            class: "flex w-full items-center gap-2 rounded-md border border-gray-300 bg-white p-2 shadow-sm",
            children: [settingComp, simpleSearch, modal],
        },
        {},
        {
            comps: { settingComp, simpleSearch, ...simpleSearch.s.comps },
            handlers: { ...simpleSearch.s.handlers },
        }
    );
    let concSearch = ConcatenatedSearch();

    return lay;
};

export const ConcatenatedSearch = () => {
    let searchComps: any = [];
    const SearchCompCrud = () => {
        const uuid = uuidv4();
        const ss = SimpleSearch();
        let closeBtn = Tools.icon(
            X,
            {
            class: "w-6 h-6 text-red-500 cursor-pointer hover:text-red-700",
            },
            {
                click: (e: any, ls: any) => {
                    searchComps = searchComps.filter(
                        (comp: any) => comp.s.id !== uuid
                    );
                    filters.update({
                        innerHTML: "",
                        children: searchComps,
                    });
                },
            }
        );
        let lay = Tools.div(
            {
                class: "flex items-center gap-2 rounded-md ",
                children: [closeBtn, ss],
            },
            {},
            { id: uuid, searchComp: ss }
        );
        return lay;
    };
    const onAdd = () => {
        const newSearchComp = SearchCompCrud();
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
    const filters = Tools.div({ class: "flex flex-col gap-2" });
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
    let searchBtn = Tools.comp("button", {
        class: "flex items-center justify-center p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer w-24",
        textContent: "done",
    });

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
    return Tools.div({
        class: "w-full",
        children: [
            Tools.div({
                class: "flex w-full items-center justify-between",
                children: [resetBtn, plusIcon, searchBtn],
            }),
            filters,
        ],
    });
};
