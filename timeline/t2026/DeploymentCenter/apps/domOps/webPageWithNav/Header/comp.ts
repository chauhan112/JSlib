import { Tools } from "../../../../../../globalComps/tools";
import { ArrowLeft, Bell, MessageSquare, type IconNode } from "lucide";

export const MiddleLinkItem = (label: string) => {
    return Tools.comp("button", {
        class: "group relative text-gray-600 hover:text-gray-900 transition-colors cursor-pointer",
        textContent: label,
        children: [Tools.comp("span", { class: "absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 transition-all group-hover:w-full" })],
    });
}

export const IconWithBadge = (icon: IconNode, badge: string) => {
    const badge_comp = Tools.comp("span", { 
        class: "absolute -top-2 -right-2 w-4 h-4 bg-gray-900 text-white text-xs rounded-full flex items-center justify-center", 
        textContent: badge,
    });
    return Tools.comp("div", {
        class: "relative cursor-pointer",
        children: [Tools.icon(icon, { key: "icon", class: "w-6 h-6 hover:text-gray-500"  }), badge_comp],
    }, {}, { badge_comp });
}

export const Header = () => {
    const back_button = Tools.comp("button", {
        class: "text-gray-600 hover:text-gray-900 transition-colors cursor-pointer sm:mr-4",
        children: [Tools.icon(ArrowLeft, { class: "w-6 h-6" })],
    });
    const title = Tools.comp("span", {
        class: "text-2xl font-light tracking-widest text-gray-900",
        textContent: "MINIMAL",
    });
    const middle_links = Tools.comp("div", {
        class: "hidden md:flex items-center gap-10",
        children: [],
    });
    const right_links = Tools.comp("div", {
        class: "hidden md:flex items-center gap-6",
        children: [],
    });
    return Tools.comp("header", {
        class: "bg-white border-b border-gray-100 flex items-center justify-between",
        children: [
            back_button,
            Tools.comp("div", {
                class: "flex flex-row items-center justify-center sm:justify-between pr-6 py-6 pl-2 w-full",
                children: [title, middle_links, right_links],
            })
        ],
    }, {}, { back_button, title, middle_links, right_links });
}
