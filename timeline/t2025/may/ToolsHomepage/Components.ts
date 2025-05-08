import { Tools } from "../../april/tools";

export const Logo = () => {
    return Tools.div({
        class: "text-center flex-grow",
        children: [
            Tools.comp("h1", {
                class: "text-4xl font-bold  mb-2",
                textContent: "RajaDevKit",
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
        href: "/",
    });
};
