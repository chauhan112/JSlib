import { Tools } from "../../april/tools";

export const Page = () => {
    const var_info_input = Tools.comp("input", {
        type: "text",
        placeholder: "Add new information...",
        class: "flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
        required: "",
    });

    const var_info_form = Tools.comp("form", {
        class: "flex gap-4 mb-6",
        children: [
            var_info_input,
            Tools.comp("button", {
                type: "submit",
                class: "bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors",
                textContent: "Add",
            }),
        ],
    });

    const var_info_list = Tools.comp("div", {
        class: "space-y-3",
        children: [
            Tools.comp("p", {
                class: "text-gray-500",
                textContent: "Loading your list...",
            }),
        ],
    });

    return Tools.comp("div", {
        class: "container mx-auto max-w-2xl p-8",
        children: [
            Tools.comp("div", {
                class: "bg-white rounded-lg shadow-lg p-6",
                children: [
                    Tools.comp("h1", {
                        class: "text-3xl font-bold text-gray-800 mb-6",
                        textContent: "My Info List",
                    }),
                    var_info_form,
                    var_info_list,
                ],
            }),
        ],
    });
};
