// npm install uuid
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

export class LinkOpenerTools {
    static show(comp: GComponent) {
        comp.getElement().classList.remove("hidden");
    }
    static hide(comp: GComponent) {
        comp.getElement().classList.add("hidden");
    }
}

export class Handlers {
    instances: any;
    model = new LocalStorageJSONModel(STORE_KEY);
    constructor(instances: any) {
        this.instances = instances;
    }
    readCollections() {
        let loc = ["collections"];
        if (!this.model.exists(loc)) {
            this.model.addEntry(loc, []);
        }
        return this.model.readEntry(loc);
    }
    writeCollections(collections: any[]) {
        let loc = ["collections"];
        this.model.updateEntry(loc, collections);
    }
    renderCollections(collections: any[]) {
        if (collections.length === 0) {
            this.instances.collectionsContainer.update({
                innerHTML: "",
                child: InfoCompCollection(),
            });
            return;
        }
        this.instances.collectionsContainer.update({
            innerHTML: "",
            children: collections.map((collection: any) => {
                return CollectionCard(collection);
            }),
        });
    }
    populateCollectionForm(collection: any) {
        this.instances.collectionModalTitle.update({
            textContent: "Edit Collection",
        });
        this.instances.collectionIdInput.getElement().value = collection.id;
        this.instances.collectionTitleInput.getElement().value = collection.id;
    }
    populateLinkForm(collectionId: string, link: any = null) {
        this.instances.collectionIdInput.getElement().value = collectionId;
        if (link) {
            this.instances.linkModalTitle.update({ textContent: "Edit Link" });
            this.instances.linkIdInput.getElement().value = link.id;
            this.instances.linkTitleInput.getElement().value = link.title;
            this.instances.linkUrlInput.getElement().value = link.url;
        } else {
            this.instances.linkModalTitle.update({
                textContent: "Add Link to Collection",
            });
            this.instances.linkIdInput.getElement().value = ""; // Clear for new link
            this.instances.linkTitleInput.getElement().value = "";
            this.instances.linkUrlInput.getElement().value = "";
        }
    }
    getAsInput(comp: GComponent) {
        return comp.getElement() as HTMLInputElement;
    }
}

export const InfoCompCollection = () => {
    return Tools.comp("p", {
        class: "text-gray-500 col-span-full text-center",
        textContent: `No collections yet. Click "Add New Collection" to get started!`,
    });
};
export const InfoCompLink = () => {
    return Tools.comp("p", {
        class: "text-sm text-gray-500 mb-3",
        textContent: `No links in this collection yet.`,
    });
};

export const CollectionCard = (collection: {
    id: string;
    title: string;
    links: { id: string; title: string; url: string }[];
}) => {
    let titleAndInfo = Tools.comp("div", {
        children: [
            Tools.comp("div", {
                class: "flex justify-between items-center mb-3",
                children: [
                    Tools.comp("h3", {
                        class: "text-2xl font-semibold text-gray-800 truncate",
                        textContent: collection.title,
                        title: collection.title,
                    }),
                    Tools.comp("div", {
                        class: "flex space-x-2 flex-shrink-0",
                        children: [
                            Tools.comp("button", {
                                class: "edit-collection-btn text-yellow-500 hover:text-yellow-700 p-1",
                                textContent: "✏️",
                            }),
                            Tools.comp("button", {
                                class: "delete-collection-btn text-red-500 hover:text-red-700 p-1",
                                textContent: "🗑️",
                            }),
                        ],
                    }),
                ],
            }),
        ],
    });
    const linksList = Tools.comp("ul", {
        class: "space-y-2 mb-3 max-h-60 overflow-y-auto border p-2 rounded-md",
    });

    const opsBtns = Tools.comp("div", {
        class: "mt-4 flex flex-wrap gap-2",
        children: [
            Tools.comp("button", {
                key: "openAll",
                class: "add-link-to-collection-btn bg-teal-500 hover:bg-teal-600 text-white text-sm py-2 px-3 rounded shadow transition duration-150 ease-in-out",
                textContent: `Open All`,
            }),
            Tools.comp("button", {
                class: "add-link-to-collection-btn bg-teal-500 hover:bg-teal-600 text-white text-sm py-2 px-3 rounded shadow transition duration-150 ease-in-out",
                textContent: "+ Add Link",
            }),
        ],
    });

    const lay = Tools.div(
        {
            class: "bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200",
            children: [titleAndInfo, linksList, opsBtns],
        },
        {},
        { id: collection.id, titleAndInfo }
    );
    const setLinks = (links: { id: string; title: string; url: string }[]) => {
        if (links && links.length > 0) {
            linksList.update({
                innerHTML: "",
                children: links.map((link) => SingleLinkComp(link)),
            });
            opsBtns.s.openAll.textContent = `Open All(${links.length})`;
            opsBtns.s.openAll.getElement().disabled = false;
        } else {
            linksList.update({ innerHTML: "", children: [InfoCompLink()] });
            opsBtns.s.openAll.getElement().disabled = true;
            opsBtns.s.openAll
                .getElement()
                .classList.add("opacity-50", "cursor-not-allowed");
        }
    };
    setLinks(collection.links);
    lay.update(
        {},
        {},
        {
            setLinks,
        }
    );
    return lay;
};

export const SingleLinkComp = (link: {
    id: string;
    title: string;
    url: string;
}) => {
    return Tools.comp(
        "li",
        {
            class: "flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100",
            children: [
                Tools.div({
                    class: "w-full mr-2",
                    children: [
                        Tools.comp("strong", {
                            class: "text-gray-700 block truncate",
                            title: link.title,
                            textContent: link.title,
                        }),
                        Tools.comp("a", {
                            class: "text-blue-500 hover:text-blue-700 hover:underline break-all text-sm",
                            href: link.url,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            title: link.title,
                            textContent: link.url,
                        }),
                    ],
                }),
                Tools.div({
                    class: "flex space-x-1 flex-shrink-0",
                    children: [
                        Tools.comp("button", {
                            class: "edit-link-btn text-xs text-yellow-500 hover:text-yellow-700 p-1",
                            title: "Edit Link",
                            child: Tools.icon(Pencil, { class: "w-4 h-4" }),
                        }),
                        Tools.comp("button", {
                            class: "delete-link-btn text-xs text-red-500 hover:text-red-700 p-1",
                            title: "Delete Link",
                            child: Tools.icon(Trash, { class: "w-4 h-4" }),
                        }),
                    ],
                }),
            ],
        },
        {},
        { data: link }
    );
};
export const Page = () => {
    const addCollectionBtn = Tools.comp(
        "button",
        {
            class: "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow-md transition duration-150 ease-in-out",
            textContent: "+ Add New Collection",
        },
        {
            click: (e: any, ls: any) => {
                collectionModalTitle.update({ textContent: "Add Collection" });
                handlers.getAsInput(collectionIdInput).value = "";
                (collectionForm.getElement() as HTMLFormElement).reset();
                LinkOpenerTools.show(collectionModal);
                collectionTitleInput.getElement().focus();
            },
        }
    );

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

    const cancelCollectionModal = Tools.comp(
        "button",
        {
            type: "button",
            class: "bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-150 ease-in-out",
            textContent: "Cancel",
        },
        {
            click: (e: any, ls: any) => {
                LinkOpenerTools.hide(collectionModal);
            },
        }
    );

    const collectionForm = Tools.comp(
        "form",
        {
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
        },
        {
            submit: (e: any, ls: any) => {
                e.preventDefault();
                const id = handlers.getAsInput(collectionIdInput).value;
                const title = handlers
                    .getAsInput(collectionTitleInput)
                    .value.trim();

                if (!title) {
                    alert("Collection title cannot be empty.");
                    return;
                }

                if (id) {
                    const collection = collections.find(
                        (c: any) => c.id === id
                    );
                    if (collection) {
                        collection.title = title;
                    }
                } else {
                    const newCollection = {
                        id: uuidv4(), // From store.js content above
                        title: title,
                        links: [],
                    };
                    collections.push(newCollection);
                }
                handlers.writeCollections(collections);
                handlers.renderCollections(collections);
                LinkOpenerTools.hide(collectionModal);
            },
        }
    );

    const collectionModal = Tools.comp(
        "div",
        {
            class: "fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center hidden z-50",
            children: [
                Tools.comp("div", {
                    class: "bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-md mx-4 modal-content",
                    children: [collectionModalTitle, collectionForm],
                }),
            ],
        },
        {
            click: (e: any, ls: any) => {
                if (e.target === collectionModal.getElement()) {
                    LinkOpenerTools.hide(collectionModal);
                }
            },
        }
    );

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

    const cancelLinkModal = Tools.comp(
        "button",
        {
            type: "button",
            class: "bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-150 ease-in-out",
            textContent: "Cancel",
        },
        {
            click: (e: any, ls: any) => {
                LinkOpenerTools.hide(linkModal);
            },
        }
    );

    const linkForm = Tools.comp(
        "form",
        {
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
        },
        {
            submit: (e: any, ls: any) => {
                e.preventDefault();
                const collectionId = handlers.getAsInput(
                    linkCollectionIdInput
                ).value;
                const linkId = handlers.getAsInput(linkIdInput).value;
                const title = handlers.getAsInput(linkTitleInput).value.trim();
                const url = handlers.getAsInput(linkUrlInput).value.trim();

                if (!title || !url) {
                    alert("Link title and URL cannot be empty.");
                    return;
                }
                new URL(url); // Validate URL
                const collection = collections.find(
                    (c: any) => c.id === collectionId
                );
                if (!collection) return; // Should not happen generally

                if (linkId) {
                    // Editing existing link
                    const link = collection.links.find((l) => l.id === linkId);
                    if (link) {
                        link.title = title;
                        link.url = url;
                    }
                } else {
                    // Adding new link
                    const newLink = {
                        id: uuidv4(),
                        title: title,
                        url: url,
                    };
                    if (!collection.links) collection.links = []; // Ensure links array exists
                    collection.links.push(newLink);
                }
                handlers.writeCollections(collections);
                handlers.renderCollections(collections);
                LinkOpenerTools.hide(linkModal);
            },
        }
    );

    const linkModal = Tools.comp(
        "div",
        {
            class: "fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center hidden z-50",
            children: [
                Tools.comp("div", {
                    class: "bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-md mx-4 modal-content",
                    children: [linkModalTitle, linkForm],
                }),
            ],
        },
        {
            click: (e: any, ls: any) => {
                if (e.target === linkModal.getElement()) {
                    LinkOpenerTools.hide(linkModal);
                }
            },
        }
    );

    const handlers = new Handlers({
        collectionsContainer,
        collectionModalTitle,
        collectionIdInput,
        collectionTitleInput,
        linkModal,
        linkModalTitle,
        linkIdInput,
        linkTitleInput,
        linkUrlInput,
    });
    let collections = handlers.readCollections();
    handlers.renderCollections(collections);
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
