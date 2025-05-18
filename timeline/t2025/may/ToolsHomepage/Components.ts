import { Tools } from "../../april/tools";
export const DEF_TITLE = "RajaDevKit";
export const Logo = () => {
    return Tools.div({
        key: "title",
        class: "text-center flex-grow",
        children: [
            Tools.comp("h1", {
                key: "header",
                class: "text-xl md:text-2xl lg:text-3xl font-bold mb-2",
                textContent: DEF_TITLE,
            }),
        ],
    });
};
export const MainBody = () => {
    return Tools.comp("main", {
        class: "container mx-auto p-4",
        children: [
            Tools.comp("p", {
                textContent: "Page content goes here...",
            }),
        ],
    });
};
export const GoBackOrHome = () => {
    return Tools.comp("a", {
        key: "goBack",
        class: "flex items-center hover:underline",
        children: [
            Tools.comp("img", {
                key: "img",
                class: "w-8 h-8",
                alt: "Logo",
            }),
        ],
        href: "#/",
    });
};
