import { Tools } from "./GComponent";
import { accordionTest } from "./Accordion";

const accordion = accordionTest();
console.log(accordion.getElement());
let showText = Tools.div({
    textContent: "show",
});
const clearFuncs = {
    showFunc: () => {},
    plusFunc: () => {},
    s: null,
};
accordion.s.funcs.onShow = (e: any, ls: any) => {
    let [s, _] = ls;

    clearFuncs.plusFunc();
    if (clearFuncs.s !== s) {
        clearFuncs.showFunc();
    }

    clearFuncs.showFunc = () => {};
    clearFuncs.plusFunc = () => {};
    let iffComp = s.s.parent.s.iff;
    if (iffComp.s.compDisplay !== "text") {
        iffComp.display(showText);
        iffComp.s.compDisplay = "text";
        clearFuncs.showFunc = () => {
            iffComp.comp.update({
                innerHTML: "",
            });
            iffComp.s.compDisplay = "none";
            s.s.td.s.down.update({
                class: s.s.td.s.down.props.class.replace(
                    "rotate-180",
                    "rotate-0"
                ),
            });
        };
    } else {
        iffComp.comp.update({
            innerHTML: "",
        });
        iffComp.s.compDisplay = "none";
    }
    clearFuncs.s = s;
};
accordion.s.funcs.onPlus = (e: any, ls: any) => {
    let [s, _] = ls;
    clearFuncs.showFunc();
    if (clearFuncs.s !== s) {
        clearFuncs.plusFunc();
    }
    clearFuncs.plusFunc = () => {};
    clearFuncs.showFunc = () => {};

    let iffComp = s.s.parent.s.parent.s.iff;

    if (iffComp.s.compDisplay !== "form") {
        iffComp.display(gform);
        iffComp.s.compDisplay = "form";
        clearFuncs.plusFunc = () => {
            s.update({
                class: s.s.def.class + " " + s.s[s.s.cs].class,
            });
            s.s.cs = !s.s.cs;
            iffComp.s.compDisplay = "none";
        };
    } else {
        iffComp.comp.update({
            innerHTML: "",
        });
        iffComp.s.compDisplay = "none";
    }
    clearFuncs.s = s;
};
export const gform = Tools.comp(
    "form",
    {
        class: "w-full flex flex-col gap-2 ",
        children: [
            Tools.comp("input", {
                class: "w-full p-2 rounded-md bg-gray-100 text-black",
                placeholder: "Enter domain",
                key: "domain",
            }),
            Tools.comp("input", {
                class: "w-full p-2 rounded-md bg-gray-100 text-black",
                placeholder: "Operation",
                key: "operation",
            }),
            Tools.comp("input", {
                class: "text-white border-2 border-white rounded-md p-2",
                placeholder: "password",
                key: "password",
                type: "password",
            }),

            Tools.comp("button", {
                class: "w-full p-2 rounded-md bg-blue-500 text-white",
                textContent: "Submit",
            }),
        ],
    },
    {
        submit: (e: any, s: any) => {
            e.preventDefault();
            console.log("submit", s);
        },
    }
);

export const sidebar = Tools.div({
    class: "w-64 bg-gray-700 text-white p-4 h-[100vh] flex flex-col gap-5 overflow-y-auto",
    children: [
        Tools.comp("h1", {
            class: "text-lg font-bold",
            textContent: "DOMAIN LOGGER",
        }),
        accordion,
    ],
});
