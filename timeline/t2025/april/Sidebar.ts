import { Tools } from "./GComponent";
import { AccordionShowMany } from "./Accordion";

import { gformTest } from "./GForm";
import { Test } from "./ListWithCrud";

const accordion = new AccordionShowMany();

accordion.s.funcs.onPlusHandlerOnShow = (e: any, s: any) => {
    if (s.item.title === "Domains") {
        domainContent.s.formArea.display(domainForm);
    } else if (s.item.title === "Operations") {
        operationsContent.s.formArea.display(operationsForm);
    } else if (s.item.title === "Activities") {
        activitiesContent.s.formArea.display(activitiesForm);
    }
};
accordion.s.funcs.onPlusHandlerOnHide = (e: any, s: any) => {
    if (s.item.title === "Domains") {
        domainContent.s.formArea.clear();
    } else if (s.item.title === "Operations") {
        operationsContent.s.formArea.clear();
    } else if (s.item.title === "Activities") {
        activitiesContent.s.formArea.clear();
    }
};

accordion.getElement();
const domainContent = Tools.div({
    class: "w-full h-full",
    children: [
        Tools.container({
            key: "formArea",
        }),
        Test.listWithCrud(),
    ],
});
const operationsContent = Tools.div({
    class: "w-full h-full",
    children: [
        Tools.container({
            key: "formArea",
        }),
        Test.listWithCrud(),
    ],
});
const activitiesContent = Tools.div({
    class: "w-full h-full",
    children: [
        Tools.container({
            key: "formArea",
        }),
        Test.listWithCrud(),
    ],
});
const domainForm = gformTest();
const operationsForm = gformTest();
const activitiesForm = gformTest();
accordion.setData([
    {
        title: "Domains",
        content: domainContent,
        open: true,
    },
    {
        title: "Operations",
        content: operationsContent,
        open: true,
    },
    {
        title: "Activities",
        content: activitiesContent,
        open: false,
    },
]);

export const sidebar = Tools.div({
    class: "w-64 bg-gray-700 text-white p-4 min-h-[100vh] flex flex-col gap-5 overflow-y-auto",
    children: [
        Tools.comp("h1", {
            class: "text-lg font-bold",
            textContent: "DOMAIN LOGGER",
        }),
        accordion,
    ],
});
