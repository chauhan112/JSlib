import { GComponent, IComponent, Tools, Container } from "./GComponent";
import { Trash, EllipsisVertical } from "lucide";
import { Undoers } from "./Array";

export class ListWithCrud implements IComponent {
    s: { [key: string]: any } = {};
    comp: GComponent | null = null;

    constructor() {
        this.s.data = [];
        this.s.funcs = {
            createItem: this.createItem.bind(this),
            operationsMaker: this.operationsMaker.bind(this),
        };
    }

    getProps(): { [key: string]: any } {
        return this.comp!.getProps();
    }
    getElement(): HTMLElement | SVGElement {
        if (this.comp) {
            return this.comp.getElement();
        }
        this.comp = Tools.div({
            class: "w-full flex flex-col p-2 gap-2",
            children: this.s.data.map(this.s.funcs.createItem),
        });
        return this.comp.getElement();
    }

    operationsMaker(item: any) {
        let contextMenu = new ContextMenu();
        contextMenu.getElement();
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
                        contextMenu.show();
                        contextMenu.undoer.add(() => {
                            contextMenu.hide();
                        });
                    },
                },
                { data: item }
            ),
            contextMenu,
        ];
    }
    createItem(item: any) {
        return Tools.div({
            class: "w-full flex items-center justify-between ",
            children: [
                Tools.div({ textContent: item.name }),
                Tools.div({
                    class: "w-fit flex items-center justify-between",
                    children: this.s.funcs.operationsMaker(item),
                }),
            ],
        });
    }
}

export class ContextMenu implements IComponent {
    s: { [key: string]: any } = {};
    placeHolder: Container | null = null;
    comp: GComponent | null = null;
    undoer = new Undoers();
    constructor() {
        this.s.data = [
            {
                name: "View",
            },
            {
                name: "Edit",
            },
            {
                name: "Delete",
            },
        ];
        document.addEventListener("click", this.onDocClick.bind(this));
        this.s.funcs = {
            createItem: this.createItem.bind(this),
        };
        this.undoer.add(() => {
            this.hide();
        });
    }
    onDocClick(e: any) {
        this.undoer.undo();
    }
    getElement(): HTMLElement | SVGElement {
        if (this.placeHolder) {
            return this.placeHolder.getElement();
        }
        this.placeHolder = Tools.container({ class: "relative" });
        this.comp = Tools.div(
            {
                class: "w-24 absolute right-0 top-4 bg-white rounded-sm border border-gray-100 text-black flex flex-col gap-1 ",
                children: this.s.data.map(this.s.funcs.createItem),
            },
            {
                click: (e: any, ls: any) => {
                    e.stopPropagation();
                },
            }
        );
        return this.placeHolder.getElement();
    }
    getProps(): { [key: string]: any } {
        return this.comp!.getProps();
    }
    createItem(item: any) {
        return Tools.comp(
            "button",
            {
                class: "hover:font-medium w-full text-left  text-sm text-gray-700 hover:bg-gray-100 px-4 py-2",
                textContent: item.name,
            },
            {
                click: (e: any, ls: any) => {
                    console.log(item);
                    this.placeHolder!.clear();
                },
            }
        );
    }

    show() {
        this.getElement();
        this.placeHolder!.display(this.comp!);
    }
    hide() {
        this.getElement();
        this.placeHolder!.clear();
    }
}

export class Test {
    static contextMenu() {
        let comp = new ContextMenu();
        comp.s.data = [
            {
                name: "View",
            },
            {
                name: "Edit",
            },
            {
                name: "Delete",
            },
            {
                name: "Copy",
            },
            {
                name: "Paste",
            },
            {
                name: "Cut",
            },
            {
                name: "Select All",
            },
        ];
        comp.show();

        return comp;
    }
    static listWithCrud() {
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
        let list = new ListWithCrud();
        list.s.data = items;
        return list;
    }
}
