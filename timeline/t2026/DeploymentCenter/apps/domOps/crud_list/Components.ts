import { X } from "lucide";
import type { GComponent } from "../../../../../globalComps/GComponent";
import { Tools } from "../../../../../globalComps/tools";

export const CreateForm = (children: GComponent[], onCancel: () => void, title: string) => {
    const closeBtn = Tools.comp("button", {
        class: "text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full p-2 cursor-pointer",
        child: Tools.icon(X, { class: "w-6 h-6" }),
    }, {
        click: onCancel,
    });
    const titleComp = Tools.comp("h2", {
        class: "text-2xl font-bold text-center pl-4",
        textContent: title,
    });
    return Tools.div({
        class: "bg-gray-100 flex items-center justify-center",
        children: [
            Tools.div({
                class: "max-w-md bg-white p-4 rounded-lg shadow-md w-full",
                children: [
                    Tools.div({
                        class: "flex justify-between items-center mb-6",
                        children: [                            
                            titleComp,
                            closeBtn
                        ],
                    }),
                    
                    ...children,
                ],
            })
        ],
    });
}