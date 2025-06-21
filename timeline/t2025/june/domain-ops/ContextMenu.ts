import { DocumentHandler } from "../../april/Array";
import { Tools } from "../../april/tools";
export const ContextMenu = (items: { label: string; info?: any }[]) => {
    const docHandler = DocumentHandler.getInstance();
    const onMenuItemClick = (e: any, ls: any) => {};
    const createMenuItem = (item: { label: string; info?: any }) => {
        return Tools.comp(
            "button",
            {
                class: "hover:font-medium w-full text-left  text-sm text-gray-700 hover:bg-gray-100 px-4 py-2",
                textContent: item.label,
            },
            {
                click: (e: any, ls: any) => {
                    state.onMenuItemClick(e, ls);
                },
            },
            { data: item }
        );
    };
    const setOptions = (newItems: { label: string; info?: any }[]) => {
        menu.update({
            innerHTML: "",
            children: newItems.map(state.createMenuItem),
        });
    };
    const displayMenu = (e: MouseEvent, ls?: any) => {
        let element = menu.getElement();
        element.classList.remove("hidden");
        let eRect = ls.getElement().getBoundingClientRect();
        let x = eRect.x + eRect.width / 2;
        let y = eRect.y + eRect.height / 2;

        if (x + element.offsetWidth > window.innerWidth) {
            x = window.innerWidth - element.offsetWidth - 10; // 10px padding
        }
        if (y + element.offsetHeight > window.innerHeight) {
            y = window.innerHeight - element.offsetHeight - 10;
        }
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        element.classList.remove("hidden");
        docHandler.undoer.add(() => {
            element.classList.add("hidden");
        });
        e.stopPropagation();
    };
    const setMenuClickHandler = (handler: (e: MouseEvent, ls: any) => void) => {
        state.onMenuItemClick = handler;
    };
    let state = { onMenuItemClick, createMenuItem, setOptions };
    const menu = Tools.div(
        {
            class: "w-24 fixed bg-white rounded-sm border border-gray-100 text-black flex flex-col gap-1 z-10 hidden",
            children: items.map(state.createMenuItem),
        },
        {},
        {
            onMenuItemClick,
            createMenuItem,
            setOptions,
            displayMenu,
            setMenuClickHandler,
            state,
            insts: { docHandler },
        }
    );

    return menu;
};
