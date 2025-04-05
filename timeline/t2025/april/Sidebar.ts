import { IComponent, Tools } from "./GComponent";
import { Accordion } from "./Accordion";
import { Undoers } from "./Array";
import { lcrud } from "./ListWithCrud";
let undoer = new Undoers();
export class Funcs {
    undoer = new Undoers();
    accordion: Accordion;
    constructor(accordion: Accordion) {
        this.accordion = accordion;
    }
    onArrow(comp: IComponent, value: "open" | "close") {
        let iffComp = comp.s.parent.s.iff;
        if (value === "open") {
            iffComp.display(lcrud);
        } else {
            iffComp.comp.update({
                innerHTML: "",
            });
        }
    }
    onPlus(comp: IComponent, value: "open" | "close") {
        let iffComp = comp.s.parent.s.parent.s.iff;
        if (value === "open") {
            iffComp.display(gform);
        } else {
            iffComp.comp.update({
                innerHTML: "",
            });
        }
    }
    onBtn(e: any, ls: any) {
        let s = ls.s;

        undoer.undo();
        if (undoer.state.current === s) {
            undoer.state.current = null;
            return;
        }
        if (s.s.sarrow) {
            s.s.sarrow = s.s.sarrow === "open" ? "close" : "open";
        } else {
            s.s.sarrow = "open";
        }
        this.accordion.rotateArrow(s.s.td.s.down, s.s.sarrow);
        this.onArrow(s, s.s.sarrow);
        undoer.state.current = s;
        undoer.add(() => {
            s.s.sarrow = s.s.sarrow === "open" ? "close" : "open";
            this.accordion.rotateArrow(s.s.td.s.down, s.s.sarrow);
            this.onArrow(s, s.s.sarrow);
        });
    }
    onPlusFunc(e: any, ls: any) {
        let s = ls.s;
        undoer.undo();
        if (undoer.state.current === s) {
            undoer.state.current = null;
            return;
        }
        if (s.s.splus) {
            s.s.splus = s.s.splus === "open" ? "close" : "open";
        } else {
            s.s.splus = "open";
        }
        this.accordion.rotatePlus(s, s.s.splus);
        this.onPlus(s, s.s.splus);
        undoer.state.current = s;
        undoer.add(() => {
            s.s.splus = s.s.splus === "open" ? "close" : "open";
            this.accordion.rotatePlus(s, s.s.splus);
            this.onPlus(s, s.s.splus);
        });
    }
}
const accordion = new Accordion();
accordion.setData({
    domains: {
        title: "domains",
        content: "domains",
        more: {
            key: "domains",
        },
    },
    operations: {
        title: "operations",
        content: "operations",
        more: {
            key: "operations",
        },
    },
    activities: {
        title: "activities",
        content: "activities",
        more: {
            key: "activities",
        },
    },
});
accordion.getElement();

let funcs = new Funcs(accordion);
accordion.s.funcs.onShow = funcs.onBtn.bind(funcs);
accordion.s.funcs.onPlus = funcs.onPlusFunc.bind(funcs);
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
                class: "w-full p-2 rounded-md bg-blue-500 text-white",
                textContent: "Submit",
                type: "submit",
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
    class: "w-64 bg-gray-700 text-white p-4 h-[100vh] flex flex-col gap-5 ",
    children: [
        Tools.comp("h1", {
            class: "text-lg font-bold",
            textContent: "DOMAIN LOGGER",
        }),
        accordion,
    ],
});
