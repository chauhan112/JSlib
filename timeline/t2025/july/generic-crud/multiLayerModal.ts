import { IComponent } from "../../april/GComponent";
import { Tools } from "../../april/tools";
import { X } from "lucide";

export const GenericMultiLayerModal = (title: string) => {
    const modalTitle = Tools.comp("h3", {
        class: "text-lg font-semibold text-gray-800 break-all",
        textContent: title,
    });

    const codeSec = Tools.div(
        {
            class: "flex items-center justify-between p-4 border-b border-gray-200",
            children: [
                modalTitle,
                Tools.comp("button", {
                    key: "close",
                    class: "text-gray-500 hover:text-gray-800 text-2xl font-bold px-2 py-1 cursor-pointer hover:bg-gray-200",
                    child: Tools.icon(X, { class: "w-8 h-8" }),
                }),
            ],
        },
        {
            click: (e: any, ls: any) => {
                e.stopPropagation();
            },
        }
    );
    const contentArea = Tools.div(
        { class: "flex flex-1 p-2 min-h-0" },
        {
            click: (e: any, ls: any) => {
                e.stopPropagation();
            },
        }
    );
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
            codeSec,
        }
    );

    return wid;
};

export type MultiLayerModel = {
    modal: IComponent;
    addLayer: (layer: IComponent, title: string) => void;
    closeLayer: () => void;
    showLayer: (layer: IComponent, title: string) => void;
};

export const MultiLayerModalCtrl = () => {
    let modal = GenericMultiLayerModal("");
    let stack: { comp: IComponent; title: string }[] = [];
    const show = () => {
        modal.getElement().classList.remove("hidden");
    };
    const hide = () => {
        modal.getElement().classList.add("hidden");
    };
    const showLayer = (layer: IComponent, title: string) => {
        modal.s.modalTitle.update({ textContent: title });
        modal.s.contentArea.update({
            innerHTML: "",
            child: layer,
        });
        show();
    };

    const addLayer = (layer: IComponent, title: string) => {
        stack.push({ comp: layer, title });
        showLayer(layer, title);
    };
    const closeLayer = () => {
        stack.pop();
        if (stack.length === 0) return hide();
        showLayer(stack[stack.length - 1].comp, stack[stack.length - 1].title);
    };
    modal.s.codeSec.s.close.update(
        {},
        { click: (e: any, ls: any) => closeLayer() }
    );

    modal.s.contentArea.update(
        {},
        { click: (e: any, ls: any) => e.stopPropagation() }
    );
    modal.update({}, { click: (e: any, ls: any) => closeLayer() });

    return {
        modal,
        addLayer,
        closeLayer,
        showLayer,
    };
};
