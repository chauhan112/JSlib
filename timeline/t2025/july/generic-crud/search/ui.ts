import { Trash, X } from "lucide";
import { Tools } from "../../../april/tools";
import {
    GenericForm,
    Params,
    FormInputComponent,
    Checkbox,
    Textarea,
} from "../../../june/domain-ops/Form";

export const SimpleSearchUI2 = () => {
    let form = GenericForm();
    form.s.handlers.setComponents([
        Params.inp("search", {
            placeholder: "Search...",
            name: "search",
            class: "bg-gray-200 py-2 px-4 focus:outline-none flex-1",
        }),
        Params.checkbox("caseSensitive"),
        Params.checkbox("regex"),
    ]);
    const focus = () => {};

    form.update({}, {}, { focus });
    return form;
};

export const LocSearchUI = () => {
    let locComp = FormInputComponent([
        {
            key: "loc",
            class: "bg-gray-200 py-2 px-4 focus:outline-none flex-1",
            name: "loc",
            placeholder: `pass loc as list like ["title", "content"]`,
        },
    ]);
    let textComp = SimpleSearchUI();
    const focus = () => locComp.getElement().focus();
    const get = () => {
        let loc = locComp.s.handlers.get();
        let par = textComp.s.handlers.get();
        if (loc === "") loc = [];
        else loc = JSON.parse(loc);
        return { loc, params: par };
    };
    const set = (val: { loc: any; params: any }) => {
        locComp.s.handlers.set(JSON.stringify(val.loc));
        textComp.s.handlers.set(val.params);
    };
    const clear = () => {
        locComp.s.handlers.set("");
        textComp.s.handlers.set({});
    };
    return Tools.comp(
        "div",
        {
            class: "flex w-full gap-1 flex-wrap items-center",
            children: [locComp, textComp],
        },
        {},
        { focus, locComp, textComp, handlers: { get, set, clear } }
    );
};
export const KeyValSearchUI = () => {
    let keyComp = FormInputComponent([
        {
            key: "key",
            class: "bg-gray-200 py-2 px-4 focus:outline-none flex-1",
            name: "key",
            placeholder: `enter key`,
        },
    ]);
    let textComp = SimpleSearchUI();

    const focus = () => keyComp.getElement().focus();
    const get = () => {
        let key = keyComp.s.handlers.get();
        let par = textComp.s.handlers.get();
        return { key, params: par };
    };
    const set = (val: { key: string; params: any }) => {
        keyComp.s.handlers.set(val.key);
        textComp.s.handlers.set(val.params);
    };
    const clear = () => {
        keyComp.s.handlers.set("");
        textComp.s.handlers.set({});
    };
    return Tools.comp(
        "div",
        {
            class: "flex w-full gap-1 flex-wrap items-center",
            children: [keyComp, textComp],
        },
        {},
        { focus, keyComp, textComp, handlers: { get, set, clear } }
    );
};
export const SiftUI = () => {
    let comp = Textarea([
        {
            name: "params",
            class: "bg-gray-200 py-2 px-4 w-full",
            placeholder:
                "pass params json parsable \n" +
                JSON.stringify({
                    age: {
                        $eq: 12,
                    },
                }),
        },
    ]);
    const prevHandlers = { ...comp.s.handlers };

    const get = () => {
        let val = prevHandlers.get();
        if (val === "") return {};
        return JSON.parse(val);
    };
    const set = (val: any) => prevHandlers.set(JSON.stringify(val));
    const clear = () => prevHandlers.set("");
    comp.update({}, {}, { handlers: { get, set, clear } });

    return comp;
};
export const SortUI = () => {
    let locComp = FormInputComponent([
        {
            key: "loc",
            class: "bg-gray-200 py-2 px-4 focus:outline-none flex-1",
            name: "loc",
            placeholder: `pass loc as list like ["title", "content"]`,
        },
    ]);
    let defValueComp = FormInputComponent([
        {
            key: "defValue",
            class: "bg-gray-200 py-2 px-4 focus:outline-none",
            name: "defValue",
            placeholder: `enter value json parsable`,
        },
    ]);
    let descComp = Checkbox("desc");

    const focus = () => locComp.getElement().focus();
    const get = () => {
        let loc = locComp.s.handlers.get();
        if (loc === "") loc = [];
        else loc = JSON.parse(loc);
        let defValue = defValueComp.s.handlers.get();
        if (defValue === "") defValue = "";
        else defValue = JSON.parse(defValue);
        let desc = descComp.s.handlers.get();
        return { loc, defValue, desc };
    };
    const set = (val: { loc: any; defValue?: any; asc?: boolean }) => {
        locComp.s.handlers.set(JSON.stringify(val.loc));
        if (val.defValue)
            defValueComp.s.handlers.set(JSON.stringify(val.defValue));
        descComp.s.handlers.set(val.asc);
    };
    const clear = () => {
        set({ loc: [], defValue: "", asc: false });
    };

    return Tools.comp(
        "div",
        {
            class: "flex gap-2 items-center",
            children: [locComp, defValueComp, descComp],
        },
        {},
        {
            focus,
            locComp,
            defValueComp,
            descComp,
            handlers: { get, set, clear },
        }
    );
};
export const SingleFilterUI = () => {
    const uis: any = {
        ValStringSearch: SimpleSearchUI(),
        Mongo: SiftUI(),
        LocSearch: LocSearchUI(),
        KeyValSearch: KeyValSearchUI(),
        Sort: SortUI(),
    };
    const typeOfOp = Tools.comp(
        "select",
        {
            key: "typeOfOp",
            class: "bg-gray-200 py-2 px-4 focus:outline-none",
            name: "typeOfOp",
            children: Object.keys(uis).map((k: string) =>
                Tools.comp("option", { value: k, textContent: k })
            ),
        },
        {
            change: (e: any, ls: any) => {
                let val = e.target.value;
                onChange(val);
            },
        }
    );
    const onChange = (val: string) => {
        let ui = uis[val];
        wraper.update({ innerHTML: "", children: [ui] });
    };
    const wraper = Tools.div({
        key: "wraper",
        children: [uis.ValStringSearch],
    });
    const get = () => {
        let val = (typeOfOp.getElement() as HTMLSelectElement).value;
        let ui = uis[val];
        return { type: val, params: ui.s.handlers.get() };
    };
    const set = (val: { type: string; params: any }) => {
        setTyp(val.type);
        let key = (typeOfOp.getElement() as HTMLSelectElement).value;
        let ui = uis[key];
        ui.s.handlers.set(val.params);
    };
    const clear = () => {
        let key = (typeOfOp.getElement() as HTMLSelectElement).value;
        let ui = uis[key];
        ui.s.handlers.clear();
    };
    const focus = () => {
        getCurForm().s.focus();
    };
    const setTyp = (type: any) => {
        let el = typeOfOp.getElement() as HTMLSelectElement;
        el.value = type;
        onChange(type);
    };

    const getCurForm = () => {
        let key = (typeOfOp.getElement() as HTMLSelectElement).value;
        return uis[key];
    };

    return Tools.div(
        {
            class: "flex flex-col gap-2 w-full",
            children: [typeOfOp, wraper],
        },
        {},
        { focus, handlers: { get, set, clear, setTyp } }
    );
};
export const SimpleSearchUI = () => {
    let caseSensitive = Checkbox("case");
    let reg = Checkbox("regex");
    let searchComp = FormInputComponent([
        {
            key: "search",
            class: "bg-gray-200 py-2 px-4 focus:outline-none flex-1",
            name: "search",
            placeholder: "Search...",
        },
    ]);
    let comp = Tools.comp("div", {
        class: "flex w-full gap-2 md:gap-4 flex-wrap items-center",
        children: [searchComp, caseSensitive, reg],
    });

    const focus = () => searchComp.getElement().focus();
    const get = () => ({
        search: searchComp.s.handlers.get(),
        case: caseSensitive.s.handlers.get(),
        reg: reg.s.handlers.get(),
    });
    const set = (value: any) => {
        searchComp.s.handlers.set(value.search);
        caseSensitive.s.handlers.set(value.case);
        reg.s.handlers.set(value.reg);
    };
    const clear = () => {
        searchComp.s.handlers.clear();
        caseSensitive.s.handlers.clear();
        reg.s.handlers.clear();
    };

    comp.update({}, {}, { focus, handlers: { get, set, clear } });
    return comp;
};
export const FilterUI = () => {
    const filterCon = Tools.div({
        class: "w-full flex flex-col items-center gap-2",
    });

    const addBtn = Tools.comp("button", {
        key: "addBtn",
        class: "px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 cursor-pointer",
        textContent: "Add Filter Layer",
    });
    const submitBtn = Tools.comp("button", {
        key: "submitBtn",
        class: "px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 cursor-pointer",
        textContent: "search",
    });
    const clearAll = Tools.comp("button", {
        class: "px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 cursor-pointer",
        child: Tools.icon(Trash, { class: "w-4 h-4" }),
    });

    const saveFilter = Tools.comp("button", {
        key: "addBtn",
        class: "px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 cursor-pointer",
        textContent: "save filter",
    });
    let comp = Tools.comp(
        "div",
        {
            class: "flex flex-col gap-2 w-full items-center",
            children: [
                Tools.div({
                    class: "flex w-full px-2 gap-2 items-center justify-between sticky top-0 z-10",
                    children: [
                        Tools.div({
                            class: "flex w-full px-2 gap-2 items-center ",
                            children: [addBtn, clearAll, saveFilter],
                        }),
                        submitBtn,
                    ],
                }),
                filterCon,
            ],
        },
        {},
        {
            filterCon,
            addBtn,
            clearAll,
            saveFilter,
            submitBtn,
        }
    );
    return comp;
};
export const FilterUICtrl = () => {
    let comp = FilterUI();
    let states: any = {
        onSearch: (params: any[]) => {
            console.log(params);
        },
        comps: {},
        onSaveFilter: () => {},
    };
    const addFilter = () => {
        let fil = SingleFilterUI();
        let timestamp = new Date().getTime().toString();

        let el = Tools.div({
            class: "flex items-center p-2 w-full rounded-md border",
            children: [fil],
        });
        let rem = Tools.icon(
            X,
            {
                class: "w-6 h-6 text-red-500 cursor-pointer hover:text-red-700",
            },
            {
                click: (e: any, ls: any) => {
                    let idx = ls.s.id;
                    delete states.comps[idx];
                    wrap.getElement().classList.add("hidden");
                },
            },
            { id: timestamp }
        );
        let wrap = Tools.div({
            class: "flex items-center gap-2 w-full",
            children: [el, rem],
        });
        states.comps[timestamp] = fil;
        comp.s.filterCon.update({
            child: wrap,
        });
    };
    const onSearch = (e: any, ls: any) => {
        let params = Object.values(states.comps).map((el: any) =>
            el.s.handlers.get()
        );
        states.onSearch(params);
    };
    const onClearAll = () => {
        states.comps = {};
        comp.s.filterCon.update({ innerHTML: "" });
    };
    const setup = () => {
        comp.s.submitBtn.update({}, { click: onSearch });
        comp.s.addBtn.update({}, { click: addFilter });
        comp.s.clearAll.update({}, { click: onClearAll });
    };
    return { states, setup, onSearch, addFilter, comp };
};
