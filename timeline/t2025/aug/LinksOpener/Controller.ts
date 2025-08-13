import { NewPage, LinkForm, CollectionForm } from "./Page";
import { CollectionCard } from "../../may/LinksOpener/collectionCard";
import { GComponent } from "../../april/GComponent";
import { LocalStorageJSONModel } from "../../april/LocalStorage";
// npm install uuid
import { v4 as uuidv4 } from "uuid";
import { GlobalStates } from "../../june/domain-ops/GlobalStates";
import { InfoCompCollection } from "../../may/LinksOpener/Page";
import { GraphApiCalls, APILoc } from "./graphql_api";
export async function isUrlAvailable(url: string) {
    try {
        const response = await fetch(url, { method: "GET" });
        if (response.ok) return true;

        // Treat Method Not Allowed as available
        if (response.status === 405) return true;

        return false;
    } catch (error: any) {
        return false; // Network error or unreachable
    }
}

export type CRUDsTypeForController = {
    createCollection: any;
    deleteCollection: any;
    updateCollection: any;
    readAllCollections: any;
    createLink: any;
    deleteLink: any;
    updateLink: any;
    readLink: any;
    readAllLinks: any;

    state?: any;
};
export async function isUrlAvailable(url: string) {
    try {
        const response = await fetch(url, { method: "GET" });
        if (response.ok) return true;

        // Treat Method Not Allowed as available
        if (response.status === 405) return true;

        return false;
    } catch (error: any) {
        return false; // Network error or unreachable
    }
}

export type CRUDsTypeForController = {
    createCollection: any;
    deleteCollection: any;
    updateCollection: any;
    readAllCollections: any;
    createLink: any;
    deleteLink: any;
    updateLink: any;
    readLink: any;
    readAllLinks: any;

    state?: any;
};
export const CRUDs = () => {
    const STORE_KEY = "linkCollectionsApp";
    let state: any = {
        model: new LocalStorageJSONModel(STORE_KEY),
        collectionKey: "collections",
        linkKey: "links",
    };
    const readCollection = async (collections: any[], id: any) => {
        return collections.find((c: any) => c.id === id);
    };
    const createLink = async (
        collectionId: any,
        link: {
            title: string;
            url: string;
        }
    ) => {
        const newLink = {
            id: uuidv4(),
            title: link.title,
            url: link.url,
        };
        let collections = await readAllCollections();
        const collection = await readCollection(collections, collectionId);
        collection.links.push(newLink);
        state.model.updateEntry([state.collectionKey], collections);
    };
    const deleteLink = async (collectionId: any, id: any) => {
        let collections = await readAllCollections();
        const collection = await readCollection(collections, collectionId);
        collection.links = collection.links.filter((l: any) => l.id !== id);
        state.model.updateEntry([state.collectionKey], collections);
    };
    const updateLink = async (
        collectionId: any,
        params: {
            title: string;
            url: string;
            id: any;
        }
    ) => {
        const { title, url, id } = params;
        const collections = await readAllCollections();
        const collection = await readCollection(collections, collectionId);
        const link = collection.links.find((l: any) => l.id === id);
        if (link) {
            link.title = title;
            link.url = url;
        }
        state.model.updateEntry([state.collectionKey], collections);
    };
    const readLink = async (collectionId: any, linkId: any) => {
        let collections = await readAllCollections();
        return collections
            .find((c: any) => c.id === collectionId)
            .links.find((l: any) => l.id === linkId);
    };
    const readAllLinks = async (collectionId: any) => {
        let collections = await readAllCollections();
        const collection = await readCollection(collections, collectionId);
        return collection.links;
    };
    const createCollection = async (name: string) => {
        const newCollection = {
            id: uuidv4(),
            name: name,
            links: [],
        };
        const collections = await readAllCollections();
        collections.push(newCollection);
        state.model.updateEntry([state.collectionKey], collections);
    };
    const deleteCollection = async (id: any) => {
        let collections = await readAllCollections();
        collections = collections.filter((c: any) => c.id !== id);
        state.model.updateEntry([state.collectionKey], collections);
    };
    const updateCollection = async (params: { name: string; id: any }) => {
        const { name, id } = params;
        let collections = await readAllCollections();
        let collection = await readCollection(collections, id);
        if (collection) {
            collection.name = name;
        }
        state.model.updateEntry([state.collectionKey], collections);
    };
    const readAllCollections = async () => {
        let loc = [state.collectionKey];
        if (!state.model.exists(loc)) {
            state.model.addEntry(loc, []);
        }
        return state.model.readEntry(loc);
    };
    let res: CRUDsTypeForController = {
        createCollection,
        deleteCollection,
        updateCollection,
        readAllCollections,
        createLink,
        deleteLink,
        updateLink,
        readLink,
        readAllLinks,

        state,
    };
    return res;
};
const getAsInput = (comp: GComponent) => comp.getElement() as HTMLInputElement;

export type StateTypeCollectionsHandler = {
    form: any;
    container?: GComponent;
    cruds: CRUDsTypeForController;
};
export const CollectionsHandler = () => {
    let state: StateTypeCollectionsHandler = {
        form: CollectionForm(),
        cruds: CRUDs(),
    };
    let linksHandler = LinksHandler();

    const readAndRender = async () => {
        let collections = await state.cruds.readAllCollections();
        renderCollections(collections);
    };
    const onAddClick = (e: any, ls: any) => {
        let modal = GlobalStates.getInstance().getState("compactModal");
        modal.display(state.form);
        modal.show();
        modal.setTitle("Add Collection");
        (state.form.getElement() as HTMLFormElement).reset();
        state.form.s.collection = null;
        state.form.s.title.getElement().focus();
    };
    const onEditCollection = (e: any, ls: any) => {
        let modal = GlobalStates.getInstance().getState("compactModal");
        modal.display(state.form);
        modal.show();
        modal.setTitle("Edit Collection");
        state.form.s.collection = ls.s.collection;
        state.form.s.title.getElement().value = ls.s.collection.name;
    };
    const onDeleteCollection = (e: any, ls: any) => {
        if (confirm("Are you sure?"))
            state.cruds.deleteCollection(ls.s.id).then(readAndRender);
    };
    const renderCollections = (collections: any) => {
        if (collections.length === 0) {
            state.container!.update({
                innerHTML: "",
                child: InfoCompCollection(),
            });
            return;
        }
        state.container!.update({
            innerHTML: "",
            children: collections.map((collection: any) => {
                const cc = CollectionCard({
                    title: collection.name,
                    id: collection.id,
                    links: collection.links,
                });
                cc.s.editBtn.update(
                    {},
                    {
                        click: onEditCollection,
                    },
                    { collection }
                );
                cc.s.deleteBtn.update(
                    {},
                    {
                        click: onDeleteCollection,
                    },
                    { collection }
                );
                cc.s.addLinkBtn.update(
                    {},
                    {
                        click: (e: any, ls: any) => {
                            linksHandler.onAddLink(e, ls);
                        },
                    }
                );
                cc.s.callbacks.onDelete = linksHandler.onDeleteLink;
                cc.s.callbacks.onEdit = linksHandler.onEditLink;
                cc.s.setLinks(collection.links);
                return cc;
            }),
        });
    };
    const onSubmit = async (e: any, ls: any) => {
        e.preventDefault();
        const id = state.form.s.collection?.id;
        const title = getAsInput(state.form.s.title).value.trim();
        if (!title) {
            alert("Collection title cannot be empty.");
            return;
        }

        if (id) {
            await state.cruds.updateCollection({ name: title, id: id });
        } else {
            await state.cruds.createCollection(title);
        }
        await readAndRender();
        let modal = GlobalStates.getInstance().getState("compactModal");
        modal.hide();
    };

    const setCruds = (c: CRUDsTypeForController) => {
        state.cruds = c;
        linksHandler.state.crud = {
            create: c.createLink,
            delete: c.deleteLink,
            update: c.updateLink,
            read: c.readLink,
            readAll: c.readAllLinks,
        };
    };

    const setup = (c: any, addBtn: any, container: any) => {
        addBtn.update({}, { click: onAddClick });
        state.container = container;
        state.form.update({}, { submit: onSubmit });

        readAndRender();

        setCruds(state.cruds);

        linksHandler.state.parent = {
            renderCollections: readAndRender,
        };
        linksHandler.form.update({}, { submit: linksHandler.onSubmit });
    };
    return {
        setup,
        onAddClick,
        state,
        renderCollections,
        onSubmit,
        onEditCollection,
        onDeleteCollection,
    };
};

export const LinksHandler = () => {
    let form = LinkForm();
    let state: { parent?: { renderCollections?: any }; crud?: any } = {};
    const populateLinkForm = (collectionId: string, link: any = null) => {
        form.s.collectionId = collectionId;

        let modal = GlobalStates.getInstance().getState("compactModal");
        modal.display(form);
        modal.show();

        (form.getElement() as HTMLFormElement).reset();
        if (link) {
            modal.setTitle("Edit Link");
            form.s.title.getElement().value = link.title;
            form.s.url.getElement().value = link.url;
            form.s.linkId = link.id;
        } else {
            form.s.linkId = null;
            modal.setTitle("Add Link to Collection");
        }
        form.s.title.getElement().focus();
    };
    const onAddLink = (e: any, ls: any) => {
        populateLinkForm(ls.s.id);
    };
    const onSubmit = (e: any, ls: any) => {
        e.preventDefault();
        const collectionId = form.s.collectionId;
        const linkId = form.s.linkId;
        const title = getAsInput(form.s.title).value.trim();
        const url = getAsInput(form.s.url).value.trim();
        if (!title || !url) {
            alert("Link title and URL cannot be empty.");
            return;
        }
        new URL(url);

        if (linkId) {
            state.crud
                .update(collectionId, { title, url, id: linkId })
                .then(state.parent!.renderCollections);
        } else {
            state.crud
                .create(collectionId, { title, url })
                .then(state.parent!.renderCollections);
        }
        let modal = GlobalStates.getInstance().getState("compactModal");
        modal.hide();
    };
    const onEditLink = (e: any, ls: any) => {
        populateLinkForm(ls.s.collectionId, ls.s.link);
    };
    const onDeleteLink = (e: any, ls: any) => {
        if (confirm("Are you sure?"))
            state.crud
                .delete(ls.s.collectionId, ls.s.link.id)
                .then(state.parent!.renderCollections);
    };

    return { onAddLink, onEditLink, onDeleteLink, onSubmit, state, form };
};

export const Controller = () => {
    let comp = NewPage();
    let collections = CollectionsHandler();
    let links = LinksHandler();
    collections.setup(
        comp.s.collectionModal,
        comp.s.addCollectionBtn,
        comp.s.collectionsContainer
    );
    return { comp, collections, links };
};
