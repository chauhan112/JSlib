import { Tools } from "../../../globalComps/tools";

export const CollectionForm = () => {
    const title = Tools.comp("input", {
        type: "text",
        required: "",
        class: "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
    });

    return Tools.comp(
        "form",
        {
            class: "flex flex-col space-y-4 w-full",
            children: [
                Tools.comp("div", {
                    children: [
                        Tools.comp("label", {
                            for: "collectionTitleInput",
                            class: "block text-sm font-medium text-gray-700 mb-1",
                            textContent: "Collection Title:",
                        }),
                        title,
                    ],
                }),
                Tools.comp("button", {
                    type: "submit",
                    class: "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out",
                    textContent: "Save Collection",
                }),
            ],
        },
        {},
        { title }
    );
};
export const LinkForm = () => {
    const title = Tools.comp("input", {
        type: "text",
        required: "",
        class: "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
    });

    const url = Tools.comp("input", {
        type: "url",
        required: "",
        placeholder: "https://example.com",
        class: "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
    });

    return Tools.comp(
        "form",
        {
            class: "flex flex-col space-y-4 w-full",
            children: [
                Tools.comp("div", {
                    class: "mb-4",
                    children: [
                        Tools.comp("label", {
                            for: "linkTitleInput",
                            class: "block text-sm font-medium text-gray-700 mb-1",
                            textContent: "Link Title (Key):",
                        }),
                        title,
                    ],
                }),
                Tools.comp("div", {
                    children: [
                        Tools.comp("label", {
                            for: "linkUrlInput",
                            class: "block text-sm font-medium text-gray-700 mb-1",
                            textContent: "Link URL (Value):",
                        }),
                        url,
                    ],
                }),
                Tools.comp("div", {
                    class: "mt-6 flex justify-end space-x-3",
                    children: [
                        Tools.comp("button", {
                            type: "submit",
                            class: "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out cursor-pointer",
                            textContent: "Save Link",
                        }),
                    ],
                }),
            ],
        },
        {},
        { title, url }
    );
};
export const CollectionModal = () => {
    const title = Tools.comp("h2", {
        class: "text-2xl font-semibold mb-4 text-gray-800",
        textContent: "Add Collection",
    });
    const form = CollectionForm();
    return Tools.comp(
        "div",
        {
            class: "fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center hidden z-50",
            children: [
                Tools.comp("div", {
                    class: "bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-md mx-4 modal-content",
                    children: [title, form],
                }),
            ],
        },
        {},
        { form, title }
    );
};
export const LinkModal = () => {
    const title = Tools.comp("h2", {
        class: "text-2xl font-semibold mb-4 text-gray-800",
        textContent: "Add Link",
    });
    const form = LinkForm();
    const modal = Tools.comp(
        "div",
        {
            class: "fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center hidden z-50",
            children: [
                Tools.comp("div", {
                    class: "bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-md mx-4 modal-content",
                    children: [title, form],
                }),
            ],
        },
        {},
        { form, title }
    );
    return modal;
};
export const NewPage = () => {
    const addCollectionBtn = Tools.comp("button", {
        class: "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow-md transition duration-150 ease-in-out cursor-pointer",
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

    return Tools.comp(
        "div",
        {
            children: [
                Tools.comp("div", {
                    class: "mx-auto p-4 md:p-8",
                    children: [
                        Tools.comp("div", {
                            class: "mb-6",
                            children: [addCollectionBtn],
                        }),
                        collectionsContainer,
                    ],
                }),
            ],
        },
        {},
        { addCollectionBtn, collectionsContainer }
    );
};
