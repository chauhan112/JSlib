import { Tools } from "./GComponent";
import { Trash, EllipsisVertical } from "lucide";
import { Undoers } from "./Array";
let items = [
    {
        name: "Item 1",
        key: "item1",
    },
    {
        name: "Item 2",
        key: "item2",
    },
];

let undoer = new Undoers();

const onDocClick = (e: any) => {
    undoer.undo();
};

document.addEventListener("click", onDocClick);

const operations = (item: any) => {
    let contextMenu = Tools.ifComp([], false, { class: "relative" });
    return [
        Tools.icon(
            Trash,
            { class: "hover:text-yellow-200" },
            {
                click: (e: any, ls: any) => {
                    console.log("delete", ls.s.data);
                },
            },
            {
                data: item,
            }
        ),
        Tools.icon(
            EllipsisVertical,
            { class: "hover:text-yellow-200" },
            {
                click: (e: any, ls: any) => {
                    e.stopPropagation();
                    contextMenu.display(moreOperations({ item, contextMenu }));
                    undoer.add(() => {
                        contextMenu.clear();
                    });
                },
            },
            { data: item }
        ),
        contextMenu,
    ];
};

const moreOperations = (item: any) => {
    return Tools.div(
        {
            class: "w-24 absolute right-0 top-4 bg-white rounded-sm border border-gray-100 text-black flex flex-col gap-1 ",
            children: [
                Tools.comp(
                    "button",
                    {
                        class: "hover:font-medium w-full text-left  text-sm text-gray-700 hover:bg-gray-100 px-4 py-2",
                        textContent: "view",
                    },
                    {
                        click: (e: any, ls: any) => {
                            console.log("view", item);
                            item.contextMenu.clear();
                        },
                    }
                ),
                Tools.comp(
                    "button",
                    {
                        class: "hover:font-medium w-full text-left text-sm text-gray-700 hover:bg-gray-100  px-4 py-2",
                        textContent: "edit",
                    },
                    {
                        click: (e: any, ls: any) => {
                            console.log("edit", item);
                            item.contextMenu.clear();
                        },
                    }
                ),
                Tools.comp(
                    "button",
                    {
                        class: "hover:font-medium w-full text-left  text-sm text-gray-700 hover:bg-gray-100 px-4 py-2",
                        textContent: "delete",
                    },
                    {
                        click: (e: any, ls: any) => {
                            console.log("delete", item);
                            item.contextMenu.clear();
                        },
                    }
                ),
            ],
        },
        {
            click: (e: any, ls: any) => {
                e.stopPropagation();
            },
        }
    );
};

export const createItem = (item: any) => {
    return Tools.div({
        class: "w-full flex items-center justify-between ",
        children: [
            Tools.div({ textContent: item.name }),
            Tools.div({
                class: "w-fit flex items-center justify-between",
                children: operations(item),
            }),
        ],
    });
};

export const lcrud = Tools.div({
    class: "w-full flex flex-col p-2 gap-2",
    children: items.map(createItem),
});
