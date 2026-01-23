import { AlertCircle, Check, Info, X } from "lucide";
import { Tools } from "../tools";
import "./toast.css";
import type { GComponent } from "../GComponent";

export const Toast = (title: string, subtitle: string, type: "success" | "error" | "warning" | "info") => {
    let icons = {
        success: Tools.icon(Check, { class: "w-6 h-6 text-green-500" }),
        error: Tools.icon(X, { class: "w-6 h-6 text-red-500" }),
        warning: Tools.icon(AlertCircle, { class: "w-6 h-6 text-yellow-500" }),
        info: Tools.icon(Info, { class: "w-6 h-6 text-blue-500" }),
    };
    let closeButton = Tools.comp("button", {
        class: "text-gray-400 hover:text-gray-600 transition cursor-pointer",
        children: [Tools.icon(X, { class: "w-6 h-6 text-gray-400" })],
    });
    let toast = Tools.comp("div", {
        class:
            "toast-enter pointer-events-auto bg-white rounded-lg shadow-lg p-4 flex items-start gap-3 transform transition-all duration-300",
        children: [
            Tools.comp("div", {
                class: "flex-shrink-0 pt-0.5",
                children: [icons[type]],
            }),
            Tools.comp("div", {
                class: "flex-1",
                children: [
                    Tools.comp("h3", {
                        class: "font-medium text-gray-900",
                        textContent: title,
                    }),
                    Tools.comp("p", {
                        class: "text-sm text-gray-500 mt-1",
                        textContent: subtitle,
                    }),
                ],
            }),
            closeButton,
        ],
    }, {},{closeButton});

    return toast;

};

export const NotificationComp = () => {
    const toaster = Tools.comp("div", {
        class:
            "fixed top-5 right-5 z-50 flex flex-col gap-3 w-full max-w-xs pointer-events-none",
    });

    return toaster;
};

export class NotificationCompCtrl {
    comp: GComponent;
    time_for_timeout: number = 3000;
    constructor() {
        this.comp = NotificationComp();
    }
    addToast(title: string, subtitle: string, type: "success" | "error" | "warning" | "info") {
        let toast = Toast(title, subtitle, type);
        this.comp.update({
            innerHTML: "",
            child: toast,
        });

        setTimeout(() => {
            toast.getElement().classList.remove('toast-enter');
            toast.getElement().classList.add('toast-exit');
            
            toast.getElement().addEventListener('animationend', () => {
                toast.getElement().remove();
            });
        }, this.time_for_timeout);

        toast.s.closeButton.update({}, { click: () => {
            toast.getElement().remove();
        } });
    }
    set_time_for_timeout(timeInMilliseconds: number) {
        this.time_for_timeout = timeInMilliseconds;
    }
}