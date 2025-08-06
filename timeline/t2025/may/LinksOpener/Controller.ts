import {
    NewPage,
    LinkOpenerTools,
    InfoCompCollection,
    LinkForm,
    CollectionForm,
} from "./Page";
import { CollectionCard } from "./collectionCard";
import { GComponent } from "../../april/GComponent";
import { LocalStorageJSONModel } from "../../april/LocalStorage";
// npm install uuid
import { v4 as uuidv4 } from "uuid";
import { GlobalStates } from "../../june/domain-ops/GlobalStates";

export const LinksCrud = () => {
    let state: any = {};
    const create = async (title: string, url: string, collectionId: any) => {
        const newLink = {
            id: uuidv4(),
            title: title,
            url: url,
        };
        const collection = await state.parent.collection.read(collectionId);
        collection.links.push(newLink);
        state.model.updateEntry(
            ["collections"],
            state.parent.collection.state.collections
        );
    };
    const deleteLink = async (collectionId: any, id: any) => {
        const collection = await state.parent.collection.read(collectionId);
        collection.links = collection.links.filter((l: any) => l.id !== id);
        state.model.updateEntry(
            ["collections"],
            state.parent.collection.state.collections
        );
    };
    const update = async (
        collectionId: any,
        params: {
            title: string;
            url: string;
            id: any;
        }
    ) => {
        const { title, url, id } = params;
        const link = await read(collectionId, id);
        if (link) {
            link.title = title;
            link.url = url;
        }
        state.model.updateEntry(["collections"], state.parent.collections);
    };
    const read = async (collectionId: any, linkId: any) => {
        return state.parent.collections
            .find((c: any) => c.id === collectionId)
            .links.find((l: any) => l.id === linkId);
    };
    return { create, deleteLink, update, read, state };
};

export const CollectionsCrud = () => {
    let state: any = {};
    const create = async (name: string) => {
        const newCollection = {
            id: uuidv4(),
            name: name,
            links: [],
        };
        state.collections.push(newCollection);
        state.model.updateEntry(["collections"], state.collections);
    };
    const deleteCollection = async (id: any) => {
        state.collections = state.collections.filter((c: any) => c.id !== id);
        state.model.updateEntry(["collections"], state.collections);
    };
    const update = async (params: { name: string; id: any }) => {
        const { name, id } = params;
        const collection = state.collections.find((c: any) => c.id === id);
        if (collection) {
            collection.name = name;
        }
        state.model.updateEntry(["collections"], state.collections);
    };
    const readAll = async () => {
        let loc = ["collections"];
        if (!state.model.exists(loc)) {
            state.model.addEntry(loc, []);
        }
        return state.model.readEntry(loc);
    };
    return { create, deleteCollection, update, readAll, state };
};
const getAsInput = (comp: GComponent) => comp.getElement() as HTMLInputElement;
export const CollectionsHandler = () => {
    const STORE_KEY = "linkCollectionsApp";
    let model = new LocalStorageJSONModel(STORE_KEY);
    let state: any = {
        getHandler: () => LinksHandler(),
        form: CollectionForm(),
        linkForm: LinkForm(),
    };
    let cruds = {
        collection: CollectionsCrud(),
        link: LinksCrud(),
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
            cruds.collection.deleteCollection(ls.s.id).then(renderCollections);
    };
    const renderCollections = () => {
        cruds.collection
            .readAll()
            .then((collections: { name: string; id: any }[]) => {
                console.log(collections);
                state.container.update({ innerHTML: "rendering" });
                if (collections.length === 0) {
                    state.container.update({
                        innerHTML: "",
                        child: InfoCompCollection(),
                    });
                    return;
                }
                state.container.update({
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
                        let linksHandler = state.getHandler();
                        linksHandler.setup(cc, state.linkForm, cruds.link);
                        cc.update({}, {}, { linksHandler });
                        return cc;
                    }),
                });
            });
    };
    const onSubmit = (e: any, ls: any) => {
        e.preventDefault();
        const id = state.form.s.collection?.id;
        const title = getAsInput(state.form.s.title).value.trim();
        if (!title) {
            alert("Collection title cannot be empty.");
            return;
        }

        if (id) {
            cruds.collection
                .update({ name: title, id: id })
                .then(renderCollections);
        } else {
            cruds.collection.create(title).then(renderCollections);
        }
        let modal = GlobalStates.getInstance().getState("compactModal");
        modal.hide();
    };
    const setup = (c: any, addBtn: any, container: any) => {
        addBtn.update({}, { click: onAddClick });
        state.container = container;
        state.form.update({}, { submit: onSubmit });
        cruds.collection.state.model = model;
        cruds.link.state.model = model;
        cruds.link.state.parent = cruds;
        cruds.collection.state.collections = model.readEntry(["collections"]);
        renderCollections();
    };
    return {
        setup,
        onAddClick,
        cruds,
        state,
        model,
        renderCollections,
        onSubmit,
        onEditCollection,
        onDeleteCollection,
    };
};

export const LinksHandler = () => {
    let state: any = {};
    const populateLinkForm = (collectionId: any, link: any = null) => {
        state.form.s.collectionId = collectionId;
        let modal = GlobalStates.getInstance().getState("compactModal");
        modal.display(state.form);
        modal.show();

        (state.form.getElement() as HTMLFormElement).reset();
        if (link) {
            // this.instances.linkModalTitle.update({ textContent: "Edit Link" });
            // this.instances.linkTitleInput.getElement().value = link.title;
            // this.instances.linkUrlInput.getElement().value = link.url;
            // this.instances.linkForm.s.linkId = link.id;
        } else {
            modal.setTitle("Add Link to Collection");
        }
        state.form.s.title.getElement().focus();
    };
    const onAddLink = (e: any, ls: any) => {
        populateLinkForm(ls.s.id);
    };
    const onSubmit = (e: any, ls: any) => {
        e.preventDefault();
        const collectionId = state.form.s.collectionId;
        const linkId = state.form.s.linkId;
        const title = getAsInput(state.form.s.title).value.trim();
        const url = getAsInput(state.form.s.url).value.trim();
        if (!title || !url) {
            alert("Link title and URL cannot be empty.");
            return;
        }
        new URL(url);

        if (linkId) {
            state.crud
                .update(collectionId, { title, url, id: linkId })
                .then(state.parent.renderCollections);
        } else {
            state.crud
                .create(collectionId, { title, url })
                .then(state.parent.renderCollections);
        }
        let modal = GlobalStates.getInstance().getState("compactModal");
        modal.hide();
    };
    const onEditLink = (e: any, ls: any) => {};
    const onDeleteLink = (e: any, ls: any) => {};
    const onOpenAllLinks = (e: any, ls: any) => {};
    const setup = (card: any, form: any, crud: any) => {
        card.s.addLinkBtn.update(
            {},
            {
                click: onAddLink,
            }
        );
        card.s.openAllLinksBtn.update(
            {},
            {
                click: onOpenAllLinks,
            }
        );
        card.s.callbacks.onEdit = onEditLink;
        card.s.callbacks.onDelete = onDeleteLink;
        state.form = form;
        state.crud = crud;
    };
    return { onAddLink, onEditLink, onDeleteLink, onOpenAllLinks, setup };
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
