import { Tools } from "../../april/tools";

export const CardComponent = (title: string, description: string) => {
    return Tools.div({
        class: "tool-card bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center h-[fit-content]",
        children: [
            Tools.comp("h2", {
                key: "title",
                class: "text-xl font-semibold mb-2",
                textContent: title,
            }),
            Tools.comp("p", {
                key: "description",
                class: "text-gray-600 text-sm mb-4 flex-grow",
                textContent: description,
            }),
            Tools.comp("button", {
                key: "btn",
                class: "mt-auto bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300",
                textContent: "Open",
            }),
        ],
    });
};

export const Page = () => {};
