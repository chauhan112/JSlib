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

export const Page = () => {
    return Tools.comp("div", {
        children: [
            Tools.comp("div", {
                class: "container mx-auto p-4 md:p-8",
                children: [
                    Tools.comp("header", {
                        class: "mb-8 text-center",
                        children: [
                            Tools.comp("h1", {
                                class: "text-4xl font-bold text-blue-600",
                                textContent: "Link Collections",
                            }),
                        ],
                    }),
                    Tools.comp("div", {
                        class: "mb-6",
                        children: [
                            Tools.comp("button", {
                                class: "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow-md transition duration-150 ease-in-out",
                                textContent: "+ Add New Collection",
                            }),
                        ],
                    }),
                    Tools.comp("div", {
                        class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                        children: [
                            Tools.comp("p", {
                                class: "text-gray-500 col-span-full text-center",
                                textContent: "Loading collections...",
                            }),
                        ],
                    }),
                ],
            }),
            Tools.comp("div", {
                class: "fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center hidden z-50",
                children: [
                    Tools.comp("div", {
                        class: "bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-md mx-4 modal-content",
                        children: [
                            Tools.comp("h2", {
                                class: "text-2xl font-semibold mb-4 text-gray-800",
                                textContent: "Add Collection",
                            }),
                            Tools.comp("form", {
                                children: [
                                    Tools.comp("input", { type: "hidden" }),
                                    Tools.comp("div", {
                                        children: [
                                            Tools.comp("label", {
                                                for: "collectionTitleInput",
                                                class: "block text-sm font-medium text-gray-700 mb-1",
                                                textContent:
                                                    "Collection Title:",
                                            }),
                                            Tools.comp("input", {
                                                type: "text",
                                                required: "",
                                                class: "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                                            }),
                                        ],
                                    }),
                                    Tools.comp("div", {
                                        class: "mt-6 flex justify-end space-x-3",
                                        children: [
                                            Tools.comp("button", {
                                                type: "button",
                                                class: "bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-150 ease-in-out",
                                                textContent: "Cancel",
                                            }),
                                            Tools.comp("button", {
                                                type: "submit",
                                                class: "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out",
                                                textContent: "Save Collection",
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            }),
            Tools.comp("div", {
                class: "fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center hidden z-50",
                children: [
                    Tools.comp("div", {
                        class: "bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-md mx-4 modal-content",
                        children: [
                            Tools.comp("h2", {
                                class: "text-2xl font-semibold mb-4 text-gray-800",
                                textContent: "Add Link",
                            }),
                            Tools.comp("form", {
                                children: [
                                    Tools.comp("input", { type: "hidden" }),
                                    Tools.comp("input", { type: "hidden" }),
                                    Tools.comp("div", {
                                        class: "mb-4",
                                        children: [
                                            Tools.comp("label", {
                                                for: "linkTitleInput",
                                                class: "block text-sm font-medium text-gray-700 mb-1",
                                                textContent:
                                                    "Link Title (Key):",
                                            }),
                                            Tools.comp("input", {
                                                type: "text",
                                                required: "",
                                                class: "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                                            }),
                                        ],
                                    }),
                                    Tools.comp("div", {
                                        children: [
                                            Tools.comp("label", {
                                                for: "linkUrlInput",
                                                class: "block text-sm font-medium text-gray-700 mb-1",
                                                textContent:
                                                    "Link URL (Value):",
                                            }),
                                            Tools.comp("input", {
                                                type: "url",
                                                required: "",
                                                placeholder:
                                                    "https://example.com",
                                                class: "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                                            }),
                                        ],
                                    }),
                                    Tools.comp("div", {
                                        class: "mt-6 flex justify-end space-x-3",
                                        children: [
                                            Tools.comp("button", {
                                                type: "button",
                                                class: "bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-150 ease-in-out",
                                                textContent: "Cancel",
                                            }),
                                            Tools.comp("button", {
                                                type: "submit",
                                                class: "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out",
                                                textContent: "Save Link",
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            }),
        ],
    });
};
