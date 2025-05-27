import { GComponent } from "../../april/GComponent";
import { Tools } from "../../april/tools";
import { X } from "lucide";

export const GenericModal = (title: string) => {
    const modalTitle = Tools.comp("h3", {
        class: "text-lg font-semibold text-gray-800 break-all",
        textContent: title,
    });

    const codeSec = Tools.div({
        class: "flex items-center justify-between p-4 border-b border-gray-200",
        children: [
            modalTitle,
            Tools.comp(
                "button",
                {
                    class: "text-gray-500 hover:text-gray-800 text-2xl font-bold px-2 py-1 cursor-pointer hover:bg-gray-200",
                    child: Tools.icon(X, { class: "w-8 h-8" }),
                },
                {
                    click: (e: any, ls: any) => {
                        close();
                    },
                }
            ),
        ],
    });
    const contentArea = Tools.div({ class: "flex flex-1 p-2" });
    let wid = Tools.div(
        {
            class: "fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50 hidden",
            child: Tools.div({
                key: "wrap",
                class: "bg-white rounded-lg shadow-xl w-full max-h-[90vh] flex flex-col",
                children: [codeSec, contentArea],
            }),
        },
        {},
        {
            modalTitle,
            contentArea,
        }
    );
    const close = () => {
        wid.getElement().classList.add("hidden");
    };
    const show = () => {
        wid.getElement().classList.remove("hidden");
    };
    const toggle = () => {
        wid.getElement().classList.remove("hidden");
    };
    const display = (content: GComponent) => {
        contentArea.update({
            innerHTML: "",
            child: content,
        });
    };
    wid.update(
        {},
        {},
        {
            handlers: { close, show, display, toggle },
        }
    );
    return wid;
};
