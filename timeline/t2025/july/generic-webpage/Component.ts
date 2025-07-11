import {
    AudioLines,
    BarChart,
    ChevronDown,
    History,
    Key,
    MessageSquareDot,
    MessageSquareMore,
    PanelLeftOpen,
} from "lucide";
import { Tools } from "../../april/tools";

export const Sidebar = () => {
    const panelOpen = Tools.comp("button", {
        class: "lg:block p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 right-0 bottom-0 hidden",
        children: [Tools.icon(PanelLeftOpen, { class: "w-6 h-6" })],
    });

    const msgIcon = Tools.icon(MessageSquareMore, { class: "w-6 h-6" });

    const histIcon = Tools.icon(History, { class: "w-6 h-6" });

    const var_depth_5 = Tools.comp("button", {
        class: "accordion-header flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hover:bg-[#dde3ea] dark:hover:bg-[#282a2c]",
        children: [
            Tools.comp("span", { class: "nav-text", textContent: "Studio" }),
            Tools.icon(ChevronDown, { class: "w-6 h-6" }),
        ],
    });

    const var_depth_6 = Tools.comp("div", {
        class: "accordion-content hidden overflow-hidden transition-all duration-300",
        children: [
            Tools.comp("div", {
                class: "pt-1 pl-5",
                children: [
                    Tools.comp("a", {
                        href: "#",
                        class: "flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-[#dde3ea] dark:hover:bg-[#282a2c]",
                        children: [
                            Tools.icon(MessageSquareDot, { class: "w-6 h-6" }),
                            Tools.comp("span", {
                                class: "nav-text",
                                textContent: "Chat",
                            }),
                        ],
                    }),
                    Tools.comp("a", {
                        href: "#",
                        class: "flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-[#dde3ea] dark:hover:bg-[#282a2c]",
                        children: [
                            Tools.icon(AudioLines, { class: "w-6 h-6" }),
                            Tools.comp("span", {
                                class: "nav-text",
                                textContent: "Stream",
                            }),
                        ],
                    }),
                ],
            }),
        ],
    });

    const var_depth_7 = Tools.comp("button", {
        class: "accordion-header flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hover:bg-[#dde3ea] dark:hover:bg-[#282a2c]",
        children: [
            Tools.comp("span", { class: "nav-text", textContent: "Dashboard" }),
            Tools.icon(ChevronDown, { class: "w-6 h-6" }),
        ],
    });

    const var_depth_8 = Tools.comp("div", {
        class: "accordion-content hidden overflow-hidden transition-all duration-300",
        children: [
            Tools.comp("div", {
                class: "pt-1 pl-5",
                children: [
                    Tools.comp("a", {
                        href: "#",
                        class: "flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-[#dde3ea] dark:hover:bg-[#282a2c]",
                        children: [
                            Tools.icon(Key, { class: "w-6 h-6" }),
                            Tools.comp("span", {
                                class: "nav-text",
                                textContent: "API Keys",
                            }),
                        ],
                    }),
                    Tools.comp("a", {
                        href: "#",
                        class: "flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-[#dde3ea] dark:hover:bg-[#282a2c]",
                        children: [
                            Tools.icon(BarChart, { class: "w-6 h-6" }),
                            Tools.comp("span", {
                                class: "nav-text",
                                textContent: "Usage",
                            }),
                        ],
                    }),
                ],
            }),
        ],
    });

    const var_theme_toggle = Tools.comp("button", {
        class: "flex w-full items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-[#dde3ea] dark:hover:bg-[#282a2c]",
        children: [
            Tools.comp("span", { class: "material-symbols-outlined" }),
            Tools.comp("span", {
                class: "nav-text",
                textContent: "Toggle Theme",
            }),
        ],
    });

    const var_depth_9 = Tools.comp("img", { class: "h-6 w-6 rounded-full" });

    const var_depth_10 = Tools.comp("span", {
        class: "nav-text",
        textContent: "My Account",
    });

    const var_sidebar = Tools.comp("aside", {
        class: "left-0 z-10 fixed flex h-screen flex-col overflow-y-auto dark:bg-[#1e1f20] bg-[#f3f6fc] transition-all duration-300 ease-in-out -translate-x-full lg:translate-x-0 w-64",
        children: [
            Tools.comp("div", {
                class: "flex items-center justify-between gap-2 px-4 py-5",
                children: [
                    Tools.comp("a", {
                        href: "#",
                        class: "flex items-center gap-2",
                        textContent: "Company Icon",
                        children: [
                            Tools.comp("h1", {
                                class: "text-xl font-semibold nav-text",
                                textContent: "AI Studio",
                            }),
                        ],
                    }),
                    panelOpen,
                ],
            }),
            Tools.comp("div", {
                class: "flex flex-1 flex-col justify-between px-2",
                children: [
                    Tools.comp("nav", {
                        class: "flex flex-col gap-1",
                        children: [
                            Tools.comp("a", {
                                href: "#",
                                class: "flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium bg-[#dde3ea] dark:bg-[#282a2c] text-blue-600 dark:text-blue-400 hover:bg-[#d5dce6] dark:hover:bg-[#3c3f43]",
                                children: [
                                    msgIcon,
                                    Tools.comp("span", {
                                        class: "nav-text",
                                        textContent: "New chat",
                                    }),
                                ],
                            }),
                            Tools.comp("a", {
                                href: "#",
                                class: "flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-[#dde3ea] dark:hover:bg-[#282a2c]",
                                children: [
                                    histIcon,
                                    Tools.comp("span", {
                                        class: "nav-text",
                                        textContent: "History",
                                    }),
                                ],
                            }),
                            Tools.comp("hr", {
                                class: "my-2 border-gray-300 dark:border-gray-600",
                            }),
                            Tools.comp("div", {
                                class: "accordion-item",
                                children: [var_depth_5, var_depth_6],
                            }),
                            Tools.comp("div", {
                                class: "accordion-item",
                                children: [var_depth_7, var_depth_8],
                            }),
                        ],
                    }),
                    Tools.comp("div", {
                        class: "pb-4 px-2",
                        children: [
                            Tools.comp("hr", {
                                class: "my-2 border-gray-300 dark:border-gray-600",
                            }),
                            var_theme_toggle,
                            Tools.comp("a", {
                                href: "#",
                                class: "flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium mt-1 hover:bg-[#dde3ea] dark:hover:bg-[#282a2c]",
                                children: [var_depth_9, var_depth_10],
                            }),
                        ],
                    }),
                ],
            }),
        ],
    });

    return var_sidebar;
};
