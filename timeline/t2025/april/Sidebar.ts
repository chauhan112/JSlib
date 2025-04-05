import { IComponent, Tools } from "./GComponent";
import { accordionTest } from "./Accordion";
import { Undoers } from "./Array";
import { gformTest } from "./GForm";

const accordion = accordionTest();
accordion.getElement();
const gform = gformTest();

export const sidebar = Tools.div({
    class: "w-64 bg-gray-700 text-white p-4 h-[100vh] flex flex-col gap-5 ",
    children: [
        Tools.comp("h1", {
            class: "text-lg font-bold",
            textContent: "DOMAIN LOGGER",
        }),
        accordion,
    ],
});
