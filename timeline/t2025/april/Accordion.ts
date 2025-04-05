import { Tools, IComponent, Repeater, GComponent } from "./GComponent";
import { ChevronDown, Plus } from "lucide";
import { Undoers } from "./Array";

export class Accordion implements IComponent {
    s: { [key: string]: any } = {};
    comp: Repeater | null = null;
    undoer = new Undoers();
    constructor() {
        this.s.data = {};
        this.s.funcs = {
            onPlus: this.onPlusFunc.bind(this),
            onShow: this.onBtn.bind(this),
            ifCreator: this.ifCreator.bind(this),
            creator: this.creator.bind(this),
            contentCreator: this.contentCreator.bind(this),
            formCreator: this.formCreator.bind(this),
        };
    }
    private onBtn(e: any, ls: any) {
        e.stopPropagation();
        let s = ls.s;

        this.undoer.undo();
        if (this.undoer.state.current === s) {
            this.undoer.state.current = null;
            return;
        }
        if (s.s.sarrow) {
            s.s.sarrow = s.s.sarrow === "open" ? "close" : "open";
        } else {
            s.s.sarrow = "open";
        }
        this.rotateArrow(s.s.td.s.down, s.s.sarrow);
        this.onArrow(s, s.s.sarrow);
        this.undoer.state.current = s;
        this.undoer.add(() => {
            s.s.sarrow = s.s.sarrow === "open" ? "close" : "open";
            this.rotateArrow(s.s.td.s.down, s.s.sarrow);
            this.onArrow(s, s.s.sarrow);
        });
    }
    onArrow(comp: IComponent, value: "open" | "close") {
        let iffComp = comp.s.parent.s.iff;
        if (value === "open") {
            iffComp.display(this.s.funcs.contentCreator(comp.s.data));
        } else {
            iffComp.comp.update({
                innerHTML: "",
            });
        }
    }
    onPlus(comp: IComponent, value: "open" | "close") {
        let iffComp = comp.s.parent.s.parent.s.iff;
        if (value === "open") {
            iffComp.display(this.s.funcs.formCreator(comp.s.data));
        } else {
            iffComp.comp.update({
                innerHTML: "",
            });
        }
    }
    private onPlusFunc(e: any, ls: any) {
        e.stopPropagation();
        let s = ls.s;
        this.undoer.undo();
        if (this.undoer.state.current === s) {
            this.undoer.state.current = null;
            return;
        }
        if (s.s.splus) {
            s.s.splus = s.s.splus === "open" ? "close" : "open";
        } else {
            s.s.splus = "open";
        }
        this.rotatePlus(s, s.s.splus);
        this.onPlus(s, s.s.splus);
        this.undoer.state.current = s;
        this.undoer.add(() => {
            s.s.splus = s.s.splus === "open" ? "close" : "open";
            this.rotatePlus(s, s.s.splus);
            this.onPlus(s, s.s.splus);
        });
    }
    getElement(): HTMLElement | SVGElement {
        if (this.comp) {
            return this.comp.getElement();
        }
        this.comp = Tools.rep(this.getData(this.s.data));
        return this.comp.getElement();
    }
    setData(data: { [key: string]: any }) {
        this.s.data = data;
        if (this.comp) {
            this.comp.setData(this.getData(this.s.data));
        }
    }
    getProps() {
        return this.comp!.getProps();
    }
    private getData(rawData: { [key: string]: any }) {
        let data: { [key: string]: IComponent } = {};
        for (const key in rawData) {
            data[key] = this.s.funcs.creator(rawData[key]);
        }
        return data;
    }
    rotateArrow(down: GComponent, value: "open" | "close" = "open") {
        if (value === "open") {
            down.update({
                class: down.props.class.replace("rotate-0", "rotate-180"),
            });
        } else {
            down.update({
                class: down.props.class.replace("rotate-180", "rotate-0"),
            });
        }
    }
    rotatePlus(comp: GComponent, value: "open" | "close" = "close") {
        comp.update({
            class: comp.s.def.class + " " + comp.s[value].class,
        });
    }
    showContent(key: string, value: IComponent) {
        this.comp!.itemComp[key].s.iff.display(value);
    }
    hideContent(key: string) {
        this.comp!.itemComp[key].s.iff.setValue(false);
    }
    private ifCreator(item: { title: string; content: string; more?: any }) {
        return Tools.ifComp(
            [
                {
                    func: (value: any) => value,
                    comp: Tools.div({
                        textContent: item.content,
                    }),
                },
            ],
            false,
            {
                key: "iff",
            }
        );
    }
    private creator(item: { title: string; content: string; more?: any }) {
        const ifComp = this.s.funcs.ifCreator(item);
        const children = [
            Tools.comp(
                "button",
                {
                    class: "w-full text-left p-2 bg-green-500 text-white hover:bg-green-600 rounded-t-lg flex justify-between items-center mt-2",
                    children: [
                        Tools.div({
                            class: "flex items-center gap-2",
                            children: [
                                Tools.icon(
                                    ChevronDown,
                                    {
                                        key: "down",
                                        class: "transition-transform duration-300 rotate-0",
                                    },
                                    {},
                                    { cs: "open" }
                                ),
                                Tools.div({
                                    textContent: item.title,
                                    key: "title",
                                }),
                            ],
                            key: "td",
                        }),
                        Tools.icon(
                            Plus,
                            {
                                key: "plus",
                            },
                            {
                                click: (e: any, s: any) => {
                                    this.s.funcs.onPlus(e, {
                                        s,
                                        accordion: this,
                                        item,
                                    });
                                },
                            },
                            {
                                cs: "close",
                                close: {
                                    class: "rotate-0",
                                },
                                open: {
                                    class: "rotate-315",
                                },
                                def: {
                                    class: "transition-transform duration-300",
                                },
                            }
                        ),
                    ],
                    key: "btn",
                },
                {
                    click: (e: any, s: any) => {
                        this.s.funcs.onShow(e, { s, accordion: this, item });
                    },
                },
                {
                    data: item,
                }
            ),
            ifComp,
        ];

        return Tools.div({
            children,
        });
    }
    private formCreator(item: { title: string; content: string; more?: any }) {
        return Tools.comp("form", {
            class: "w-full flex flex-col gap-2",
            children: [
                Tools.comp("input", {
                    class: "w-full p-2 rounded-md bg-gray-100 text-black",
                    placeholder: "Enter domain",
                    key: "domain",
                }),
                Tools.comp("input", {
                    class: "w-full p-2 rounded-md bg-gray-100 text-black",
                    placeholder: "Enter operations",
                    key: "operations",
                }),
                Tools.comp("input", {
                    class: "w-full p-2 rounded-md bg-blue-500 text-white",
                    textContent: "Submit",
                    type: "submit",
                }),
            ],
        });
    }
    private contentCreator(item: {
        title: string;
        content: string;
        more?: any;
    }) {
        return Tools.div({
            class: "w-full",
            textContent: item.content,
        });
    }
}

export const accordionTest = () => {
    const accordion = new Accordion();
    accordion.setData({
        "1": {
            title: "domain",
            content: "content 1",
            more: "1",
        },
        "2": {
            title: "operations",
            content: "content 2",
            more: "2",
        },
        "3": {
            title: "logger",
            content: "content 3",
            more: "3",
        },
    });
    return accordion;
};
