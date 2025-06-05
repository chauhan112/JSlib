import { Pencil, Trash } from "lucide";
import { Tools } from "../../april/tools";

export const SingleLinkComp = (link: {
    id: string;
    title: string;
    url: string;
}) => {
    const editLinkBtn = Tools.comp(
        "button",
        {
            class: "edit-link-btn text-xs text-yellow-500 hover:text-yellow-700 p-1 cursor-pointer",
            title: "Edit Link",
            child: Tools.icon(Pencil, { class: "w-4 h-4" }),
        },
        {},
        { id: link.id }
    );
    const deleteLinkBtn = Tools.comp(
        "button",
        {
            class: "delete-link-btn text-xs text-red-500 hover:text-red-700 p-1 cursor-pointer",
            title: "Delete Link",
            child: Tools.icon(Trash, { class: "w-4 h-4" }),
        },
        {},
        { id: link.id }
    );
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
                    children: [editLinkBtn, deleteLinkBtn],
                }),
            ],
        },
        {},
        { data: link, editBtn: editLinkBtn, deleteBtn: deleteLinkBtn }
    );
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
    const editBtn = Tools.comp(
        "button",
        {
            class: "edit-collection-btn text-yellow-500 hover:text-yellow-700 p-1 cursor-pointer",
            textContent: "✏️",
        },
        {},
        { id: collection.id }
    );
    const deleteBtn = Tools.comp(
        "button",
        {
            class: "delete-collection-btn text-red-500 hover:text-red-700 p-1 cursor-pointer",
            textContent: "🗑️",
        },
        {},
        { id: collection.id }
    );
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
                        children: [editBtn, deleteBtn],
                    }),
                ],
            }),
        ],
    });
    const linksList = Tools.comp("ul", {
        class: "space-y-2 mb-3 max-h-60 overflow-y-auto border p-2 rounded-md",
    });

    const openAllLinksBtn = Tools.comp(
        "button",
        {
            key: "openAll",
            class: "add-link-to-collection-btn bg-teal-500 hover:bg-teal-600 text-white text-sm py-2 px-3 rounded shadow transition duration-150 ease-in-out",
            textContent: `Open All`,
        },
        {},
        { id: collection.id }
    );
    const addLinkBtn = Tools.comp(
        "button",
        {
            class: "add-link-to-collection-btn bg-teal-500 hover:bg-teal-600 text-white text-sm py-2 px-3 rounded shadow transition duration-150 ease-in-out",
            textContent: "+ Add Link",
        },
        {},
        { id: collection.id }
    );

    const opsBtns = Tools.comp("div", {
        class: "mt-4 flex flex-wrap gap-2",
        children: [openAllLinksBtn, addLinkBtn],
    });
    const callbacks = {
        onDelete: (e: any, ls: any) => {},
        onEdit: (e: any, ls: any) => {},
    };
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
                children: links.map((link: any) => {
                    let slc = SingleLinkComp(link);
                    slc.s.deleteBtn.update(
                        {},
                        {
                            click: (e: any, ls: any) =>
                                callbacks.onDelete(e, ls),
                        },
                        {
                            collectionId: collection.id,
                        }
                    );
                    slc.s.editBtn.update(
                        {},
                        {
                            click: (e: any, ls: any) => callbacks.onEdit(e, ls),
                        },
                        {
                            collectionId: collection.id,
                        }
                    );
                    return slc;
                }),
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
            editBtn,
            deleteBtn,
            openAllLinksBtn,
            addLinkBtn,
            callbacks,
        }
    );
    return lay;
};
