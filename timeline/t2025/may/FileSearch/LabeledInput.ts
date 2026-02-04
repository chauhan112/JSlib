import { Tools } from "../../../globalComps/tools";
import { LocalStorageJSONModel } from "../../april/LocalStorage";

export const InputWithLabel = (
    label: string,
    inp: any = {},
    key?: string,
    loc?: string
) => {
    let fnc = {};

    if (loc) {
        let model = new LocalStorageJSONModel(loc);

        if (model.exists([loc])) {
            inp = {
                ...inp,
                value: model.readEntry([loc]),
            };
        }

        fnc = {
            change: (e: any) => {
                model.updateEntry([loc], e.target.value);
            },
        };
    }
    let inpComp = Tools.comp(
        "input",
        {
            key: "input",
            class: "block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500",
            type: "text",
            ...inp,
        },
        fnc
    );
    const activate = (active: boolean) => {
        (inpComp.getElement() as HTMLInputElement).disabled = !active;
    };
    const getValue = () => {
        return (inpComp.getElement() as HTMLInputElement).value;
    };
    return Tools.div(
        {
            key: key || "w",
            children: [
                Tools.comp("label", {
                    for: label,
                    class: "block text-sm font-medium text-gray-700 mb-1",
                    textContent: label,
                }),
                inpComp,
            ],
        },
        {},
        { activate, getValue }
    );
};

export const LabeledInput = (
    label: string,
    props: { [key: string]: any } = {},
    inpProps: { [key: string]: any } = {}
) => {
    let inpComp = Tools.comp("input", {
        key: "input",
        class: "block w-full p-2 border border-gray-300 rounded-md",
        type: "text",
        ...inpProps,
    });
    let labelComp = Tools.comp("label", {
        class: "block text-sm md:text-base lg:text-lg font-medium text-gray-700 mb-1",
        textContent: label,
    });
    const activate = (active: boolean) => {
        (inpComp.getElement() as HTMLInputElement).disabled = !active;
    };
    let lay = Tools.div(
        {
            children: [labelComp, inpComp],
            ...props,
        },
        {},
        {
            inpComp,
            labelComp,
            activate,
        }
    );

    return lay;
};
