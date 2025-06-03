import { Tools } from "../../april/tools";
import { LocalStorageJSONModel } from "../../april/LocalStorage";
import { v4 as uuidv4 } from "uuid";
import { GComponent } from "../../april/GComponent";
import { Pencil, Trash } from "lucide";
const STORE_KEY = "linkCollectionsApp";
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
    let model = new LocalStorageJSONModel(STORE_KEY);

    const addCollectionBtn = Tools.comp("button", {
        class: "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow-md transition duration-150 ease-in-out",
        textContent: "+ Add New Collection",
    });

    const collectionsContainer = Tools.comp("div", {
        class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        children: [
            Tools.comp("p", {
                class: "text-gray-500 col-span-full text-center",
                textContent: "Loading collections...",
            }),
        ],
    });

    const collectionModalTitle = Tools.comp("h2", {
        class: "text-2xl font-semibold mb-4 text-gray-800",
        textContent: "Add Collection",
    });

    const collectionIdInput = Tools.comp("input", { type: "hidden" });

    const collectionTitleInput = Tools.comp("input", {
        type: "text",
        required: "",
        class: "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
    });

    const cancelCollectionModal = Tools.comp("button", {
        type: "button",
        class: "bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-150 ease-in-out",
        textContent: "Cancel",
    });

    const collectionForm = Tools.comp("form", {
        children: [
            collectionIdInput,
            Tools.comp("div", {
                children: [
                    Tools.comp("label", {
                        for: "collectionTitleInput",
                        class: "block text-sm font-medium text-gray-700 mb-1",
                        textContent: "Collection Title:",
                    }),
                    collectionTitleInput,
                ],
            }),
            Tools.comp("div", {
                class: "mt-6 flex justify-end space-x-3",
                children: [
                    cancelCollectionModal,
                    Tools.comp("button", {
                        type: "submit",
                        class: "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out",
                        textContent: "Save Collection",
                    }),
                ],
            }),
        ],
    });

    const collectionModal = Tools.comp("div", {
        class: "fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center hidden z-50",
        children: [
            Tools.comp("div", {
                class: "bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-md mx-4 modal-content",
                children: [collectionModalTitle, collectionForm],
            }),
        ],
    });

    const linkModalTitle = Tools.comp("h2", {
        class: "text-2xl font-semibold mb-4 text-gray-800",
        textContent: "Add Link",
    });

    const linkCollectionIdInput = Tools.comp("input", { type: "hidden" });

    const linkIdInput = Tools.comp("input", { type: "hidden" });

    const linkTitleInput = Tools.comp("input", {
        type: "text",
        required: "",
        class: "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
    });

    const linkUrlInput = Tools.comp("input", {
        type: "url",
        required: "",
        placeholder: "https://example.com",
        class: "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
    });

    const cancelLinkModal = Tools.comp("button", {
        type: "button",
        class: "bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-150 ease-in-out",
        textContent: "Cancel",
    });

    const linkForm = Tools.comp("form", {
        children: [
            linkCollectionIdInput,
            linkIdInput,
            Tools.comp("div", {
                class: "mb-4",
                children: [
                    Tools.comp("label", {
                        for: "linkTitleInput",
                        class: "block text-sm font-medium text-gray-700 mb-1",
                        textContent: "Link Title (Key):",
                    }),
                    linkTitleInput,
                ],
            }),
            Tools.comp("div", {
                children: [
                    Tools.comp("label", {
                        for: "linkUrlInput",
                        class: "block text-sm font-medium text-gray-700 mb-1",
                        textContent: "Link URL (Value):",
                    }),
                    linkUrlInput,
                ],
            }),
            Tools.comp("div", {
                class: "mt-6 flex justify-end space-x-3",
                children: [
                    cancelLinkModal,
                    Tools.comp("button", {
                        type: "submit",
                        class: "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out",
                        textContent: "Save Link",
                    }),
                ],
            }),
        ],
    });

    const linkModal = Tools.comp("div", {
        class: "fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center hidden z-50",
        children: [
            Tools.comp("div", {
                class: "bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-md mx-4 modal-content",
                children: [linkModalTitle, linkForm],
            }),
        ],
    });

    return Tools.comp("div", {
        children: [
            Tools.comp("div", {
                class: "mx-auto p-4 md:p-8",
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
                        children: [addCollectionBtn],
                    }),
                    collectionsContainer,
                ],
            }),
            collectionModal,
            linkModal,
        ],
    });
};
