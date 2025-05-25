import { Tools } from "../../april/tools";
import { LabeledInput } from "./LabeledInput";
import { Cog } from "lucide";
export const SearchComponent = () => {
    let settingComp = Tools.icon(Cog, {
        class: "w-12 h-12 text-gray-500 cursor-pointer hover:text-gray-700",
    });
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
            class: "flex w-full items-center gap-2 rounded-md border border-gray-300 bg-white p-2 shadow-sm",
            children: [settingComp, inpComp, caseInp, regInp, searchBtn],
        },
        {},
        {
            comps: { inpComp, caseInp, regInp, searchBtn, settingComp },
            handlers: { getValues, activate },
        }
    );
};
