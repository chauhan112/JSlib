import { Keyboard, Search, Sliders, Terminal } from "lucide";
import { Tools } from "../../t2025/april/tools";

const Head = () => {
    return Tools.comp("div", {
        class: "flex items-center gap-2 cursor-pointer",
        children: [
            Tools.comp("div", {
                class:
                    "w-8 h-8 bg-black rounded flex items-center justify-center text-white",
                children: [Tools.icon(Terminal, { class: "w-4 h-4" })],
            }),
            Tools.comp("span", {
                class: "font-bold hidden sm:block",
                textContent: "DevStack",
            }),
        ],
    });
}
export const HeaderWithSearch = () => {
    const setting = Tools.comp("div", {
        class: "flex items-center gap-2",
        children: [
            Tools.comp("button", {
                class: "p-2 hover:bg-gray-100 rounded-full text-gray-600 cursor-pointer",
                children: [Tools.icon(Sliders, { class: "w-4 h-4" })],
            }),
        ],
    })
    const search = SearchBar();
    const title = Head();
    return Tools.comp("header", {
        class: "bg-white border-b px-4 py-3 sticky top-0 z-50",
        children: [
            Tools.comp("div", {
                class: "max-w-7xl mx-auto flex items-center justify-between gap-4",
                children: [
                    title,
                    search,
                    setting,
                ],
            }),
        ],
    }, {}, { title, search, setting });
}
const SearchBar = () => {
    return Tools.comp("div", {
        class: "flex-1 max-w-xl relative group",
        children: [
            // Tools.comp("i", {
            //     class:
            //         "fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black",
            // })
            Tools.icon(Search, { class: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black" }),
            Tools.comp("input", {
                type: "text",
                placeholder: "Search documentation... (Press /)",
                class:
                    "w-full bg-gray-100 border-transparent focus:bg-white focus:border-black focus:ring-0 rounded-lg py-2 pl-10 pr-4 text-sm transition-all",
            }),
            // Tools.comp("kbd", {
            //     class:
            //         "hidden md:block absolute right-3 top-1/2 -translate-y-1/2 border bg-white px-1.5 py-0.5 rounded text-[10px] text-gray-400",
            //     textContent: "/",
            // }),
            Tools.icon(Keyboard, { class: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black" }),
        ],
    })
}