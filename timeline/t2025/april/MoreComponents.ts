import { Tools } from "./tools";

export const ToggleButton = () => {
    return Tools.comp("label", {
        class: "relative inline-flex items-center cursor-pointer",
        children: [
            Tools.comp("input", {
                key: "toggle",
                type: "checkbox",
                class: "sr-only peer",
            }),
            Tools.div({
                key: "toggleDiv",
                class: "w-11 h-6 bg-gray-300 peer-checked:bg-green-500 rounded-full transition-colors duration-300",
            }),
            Tools.div({
                key: "eye",
                class: "absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 peer-checked:translate-x-5",
            }),
        ],
    });
};
