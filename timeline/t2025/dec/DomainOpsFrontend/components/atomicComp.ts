import { EllipsisVertical, X } from "lucide";
import { Tools } from "../../../april/tools";

export const InputComp = () => {
    return Tools.comp("input", {
        type: "text",
        class: "w-full px-4 py-3 text-slate-700 placeholder-slate-400 outline-none",
        placeholder: "Type to search...",
    });
}

export const Textarea = () => {
    return Tools.comp("textarea", {
        class: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition",
    });
}

export const CardComp = () => {
    const title = Tools.comp("span", {
        class: "text-slate-700 font-medium text-sm",
        textContent: "Review Quarter Results",
    });
    const ops = Tools.icon(
        EllipsisVertical,
        {
            key: "edit",
            class: "w-6 h-6 text-gray-500 hover:scale-110 transform cursor-pointer",
        },

    )
    return Tools.comp("li", {
        class:
          "flex w-full items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm border-l-4 border-l-indigo-500 hover:shadow-md transition-all",
        children: [
          Tools.comp("div", {
            class: "flex items-center gap-3",
            children: [title],
          }),
          ops,
        ],
      }, {}, { title, ops });
}

export const Dropdown = (options: { value: string; label: string }[]) => {
    return Tools.comp("select", {
        class: "px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
        children: options.map((o: any) =>
            Tools.comp("option", { value: o.value, textContent: o.label })
        ),
    });
}

export const MultiSelectComponent = () => {
    let techInput = Tools.comp("input", { type: "hidden" });

    let selectBox = Tools.comp("div", {
        class: "w-full min-h-[42px] px-2 py-1 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 bg-white cursor-pointer flex flex-wrap items-center gap-2 relative",
    });
    let dropdownMenu = Tools.comp("div", {
        class: "hidden absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto scroller",
    });
    return Tools.div({
        class: "relative",
        children: [techInput, selectBox, dropdownMenu],
    }, {}, { techInput, selectBox, dropdownMenu });
}