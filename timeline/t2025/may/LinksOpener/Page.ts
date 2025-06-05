// npm install uuid
import { Tools } from "../../april/tools";
import { LocalStorageJSONModel } from "../../april/LocalStorage";
import { v4 as uuidv4 } from "uuid";
import { GComponent } from "../../april/GComponent";
import { CollectionCard } from "./collectionCard";

const STORE_KEY = "linkCollectionsApp";

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
    colHandler: CollectionCrudHandlers;
    linkHandler: LinkCrudHandlers;
    constructor(instances: any) {
        this.instances = instances;
        this.colHandler = new CollectionCrudHandlers({ parent: this });
        this.linkHandler = new LinkCrudHandlers({ parent: this });
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
                const cc = CollectionCard(collection);
                cc.s.editBtn.update(
                    {},
                    {
                        click: (e: any, ls: any) => {
                            this.colHandler.onEditCollection(e, ls);
                        },
                    }
                );
                cc.s.deleteBtn.update(
                    {},
                    {
                        click: (e: any, ls: any) => {
                            this.colHandler.onDeleteCollection(e, ls);
                        },
                    }
                );
                cc.s.addLinkBtn.update(
                    {},
                    {
                        click: (e: any, ls: any) => {
                            this.linkHandler.onAddLink(e, ls);
                        },
                    }
                );
                cc.s.openAllLinksBtn.update(
                    {},
                    {
                        click: (e: any, ls: any) => {
                            this.linkHandler.onOpenAllLinks(e, ls);
                        },
                    }
                );
                return cc;
            }),
        });
    }
    populateCollectionForm(collection: any) {
        this.instances.collectionModalTitle.update({
            textContent: "Edit Collection",
        });

        this.instances.collectionForm.s.collectionId = collection.id;
        this.instances.collectionTitleInput.getElement().value =
            collection.title;
    }
    populateLinkForm(collectionId: string, link: any = null) {
        console.log(collectionId, link);
        this.instances.linkForm.s.collectionId = collectionId;
        if (link) {
            this.instances.linkModalTitle.update({ textContent: "Edit Link" });
            this.instances.linkTitleInput.getElement().value = link.title;
            this.instances.linkUrlInput.getElement().value = link.url;
            this.instances.linkForm.s.linkId = link.id;
        } else {
            this.instances.linkModalTitle.update({
                textContent: "Add Link to Collection",
            });
            this.instances.linkTitleInput.getElement().value = "";
            this.instances.linkUrlInput.getElement().value = "";
        }
    }
    getAsInput(comp: GComponent) {
        return comp.getElement() as HTMLInputElement;
    }
}

export class CollectionCrudHandlers {
    states: any;
    constructor(states: any) {
        this.states = states;
    }
    private getCollection(collectionId: string) {
        return this.states.parent.instances.collections.find(
            (c: any) => c.id === collectionId
        );
    }
    onEditCollection(e: any, ls: any) {
        let collection = this.getCollection(ls.s.id);
        console.log(collection);
        this.states.parent.populateCollectionForm(collection); // From ui.js content above
        LinkOpenerTools.show(this.states.parent.instances.collectionModal);
        this.states.parent.instances.collectionTitleInput.getElement().focus();
    }
    onDeleteCollection(e: any, ls: any) {
        let collection = this.getCollection(ls.s.id);
        if (
            confirm(
                `Are you sure you want to delete the collection "${collection.title}"?`
            )
        ) {
            this.states.parent.instances.collections =
                this.states.parent.instances.collections.filter(
                    (c: any) => c.id !== ls.s.id
                );
            this.states.parent.writeCollections(
                this.states.parent.instances.collections
            );
            this.states.parent.renderCollections(
                this.states.parent.instances.collections
            );
        }
    }
}

export class LinkCrudHandlers {
    states: any;
    constructor(states: any) {
        this.states = states;
    }
    onEditLink(e: any, ls: any) {}
    onDeleteLink(e: any, ls: any) {}
    onAddLink(e: any, ls: any) {
        console.log(ls.s.id);
        this.states.parent.populateLinkForm(ls.s.id);
        LinkOpenerTools.show(this.states.parent.instances.linkModal);
        this.states.parent.instances.linkTitleInput.getElement().focus();
    }
    onOpenAllLinks(e: any, ls: any) {}
}

export const InfoCompCollection = () => {
    return Tools.comp("p", {
        class: "text-gray-500 col-span-full text-center",
        textContent: `No collections yet. Click "Add New Collection" to get started!`,
    });
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
