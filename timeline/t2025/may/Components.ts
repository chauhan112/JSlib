import { Tools } from "../april/tools";
import "./styles.css";
export const Overlay = () => {
    return Tools.div({
        class: "fixed inset-0 bg-black bg-opacity-50 z-30 hidden md:hidden",
    });
};
export const Sidebar = (secs: { title: string; href: string }[]) => {
    return Tools.comp("aside", {
        class: "sidebar-transition fixed md:relative top-0 left-0 h-full md:h-auto w-64 md:w-1/4 lg:w-1/5 bg-gray-800 text-white p-5 shadow-lg md:shadow-none transform -translate-x-full md:translate-x-0 z-40 md:z-10 md:mr-4 rounded-r-lg md:rounded-lg overflow-y-auto",
        children: [
            Tools.div({
                key: "hwrap",
                class: "flex justify-between items-center md:hidden mb-4",
                children: [
                    Tools.comp("h2", {
                        key: "title",
                        class: "text-xl font-semibold",
                        textContent: "Navigation",
                    }),
                    Tools.comp("button", {
                        key: "btn",
                        class: "p-1 text-gray-300 hover:text-white",
                        textContent: "X",
                    }),
                ],
            }),
            Tools.comp("nav", {
                children: [
                    Tools.comp("ul", {
                        chilren: secs.map((sec) => {
                            return Tools.comp("li", {
                                class: "mb-3",
                                children: [
                                    Tools.comp("a", {
                                        class: "block py-2 px-3 rounded hover:bg-indigo-500 hover:text-white transition-colors",
                                        textContent: sec.title,
                                        href: sec.href,
                                    }),
                                ],
                            });
                        }),
                    }),
                ],
            }),
            Tools.comp("div", {
                class: "mt-auto pt-4 border-t border-gray-700",
                children: [
                    Tools.comp("p", {
                        class: "text-sm text-gray-400",
                        textContent: "Left Sidebar Footer",
                    }),
                ],
            }),
        ],
    });
};

export const Header = (title: string) => {
    return Tools.comp("header", {
        class: "bg-indigo-600 text-white p-4 shadow-md sticky top-0 z-20",
        children: [
            Tools.comp("h1", {
                key: "title",
                class: "text-2xl font-bold",
                textContent: title,
            }),
        ],
    });
};

export const MainBody = () => {
    return Tools.comp("main", {
        class: "flex-grow bg-white p-6 shadow-lg rounded-lg w-full md:w-auto overflow-y-auto",
        children: [
            Tools.comp("h2", {
                class: "text-3xl font-semibold mb-6 text-gray-700",
                textContent: "Main Content Area",
            }),
            Tools.comp("p", {
                class: "mb-4 ",
                textContent: `Welcome to the main content section. This area will hold the
                    primary information for each page. It is designed to be
                    flexible and responsive.`,
            }),
            Tools.div({ key: "content", class: "space-y-4" }),
        ],
    });
};
