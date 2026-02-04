import { type IComponent } from "../GComponent";
import { Tools } from "../tools";
import { X } from "lucide";
export const CompactModal = () => {
    const title = Tools.comp("h2", {
        key: "title",
        class: "text-2xl font-semibold text-gray-800",
        textContent: "Modal Title",
    });
    const header = Tools.div({
        class: "flex items-center justify-between p-4 border-b border-gray-200",
        children: [
            title,
            Tools.comp("button", {
                key: "close",
                class: "text-gray-500 hover:text-gray-800 text-2xl font-bold px-2 py-1 cursor-pointer hover:bg-gray-200",
                child: Tools.icon(X, { class: "w-8 h-8" }),
            }),
        ],
    });
    const contentArea = Tools.div({
        class: "flex flex-col overflow-auto w-full p-2 md:p-4 items-center",
    });

    return Tools.comp(
        "div",
        {
            class: "fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center hidden z-50",
            children: [
                Tools.comp("div", {
                    class: "bg-white rounded-lg shadow-xl w-full max-w-md mx-4",
                    children: [header, contentArea],
                }),
            ],
        },
        {},
        { contentArea, header }
    );
};

export type CompactModalStruc = {
    modal: IComponent;
    setTitle: (title: string) => void;
    clear: () => void;
    hide: () => void;
    show: () => void;
    display: (comp: IComponent) => void;
};

export const CompactModalCtrl = () => {
    let modal = CompactModal();

    const setTitle = (title: string) =>
        modal.s.header.s.title.update({ textContent: title });
    const clear = () => modal.s.contentArea.update({ innerHTML: "" });
    const hide = () => modal.getElement().classList.add("hidden");
    const show = () => modal.getElement().classList.remove("hidden");
    const display = (comp: IComponent) =>
        modal.s.contentArea.update({ innerHTML: "", child: comp });

    const onCloseClick = (e: any, ls: any) => hide();

    modal.s.header.s.close.update({}, { click: onCloseClick });
    modal.s.contentArea.update(
        {},
        { click: (e: any, ls: any) => e.stopPropagation() }
    );
    modal.update({}, { click: (e: any, ls: any) => hide() });
    return { modal, setTitle, clear, hide, show, display };
};
