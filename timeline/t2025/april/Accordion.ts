import { type IComponent, GComponent, Container } from "../../globalComps/GComponent";
import { ConditionalComponent } from "./ConditionalComponent";
import { Repeater } from "./Repeater";
import { ChevronDown, Plus } from "lucide";
import { Undoers } from "./Array";
import { Tools } from "../../globalComps/tools";

const repeater = (data: { [key: string]: IComponent }) => {
    let repeater = new Repeater();
    repeater.setData(data);
    return repeater;
}

export class AccordionShowOne implements IComponent{
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
        this.comp = repeater(this.getData(this.s.data));
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
    private ifComp(
        conditions: { func: (value: any) => boolean; comp: IComponent }[],
        defaultValue: any = null,
        props?: { [key: string]: any }
    ) {
        let comp = new ConditionalComponent();
        comp.s.defaultValue = defaultValue;
        comp.setConditions(conditions);
        comp.getElement();
        comp.comp!.update(props);
        return comp;
    }
    private ifCreator(item: { title: string; content: string; more?: any }) {
        return this.ifComp(
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

export class AccordionShowMany implements IComponent {
    s: { [key: string]: any } = {};
    comp: GComponent | null = null;
    constructor() {
        this.s.data = [
            {
                title: "domain",
                open: true,
                content: Tools.comp("input", {
                    class: "w-full p-2 border-2 border-gray-300 rounded-md mt-2",
                    placeholder: "Enter domain",
                }),
                form: Tools.comp("form", {
                    class: "w-full flex flex-col gap-2",
                    children: [
                        Tools.comp("input", {
                            class: "w-full p-2 border-2 border-gray-300 rounded-md mt-2",
                            placeholder: "Enter domain",
                        }),
                        Tools.comp("input", {
                            class: "w-full p-2 border-2 border-gray-300 rounded-md mt-2",
                            placeholder: "Enter domain",
                        }),
                    ],
                }),
            },
            {
                title: "operations",
                open: false,
            },
        ];
        this.s.funcs = {
            opsCreator: this.opsCreator.bind(this),
            contentCreator: null,
            sectionCreator: this.creator.bind(this),
            onPlus: this.onPlus.bind(this),
            onTitleClick: this.onTitleClick.bind(this),
            onTitleClickHandlerOnShow: (e: any, s: any) => {
                this.getContent(s.content, s.item.content);
            },
            onTitleClickHandlerOnHide: (e: any, s: any) => {
                s.content.clear();
            },
            onPlusHandlerOnShow: (e: any, s: any) => {
                this.getContent(s.content, s.item.form);
            },
            onPlusHandlerOnHide: (e: any, s: any) => {
                s.content.clear();
            },
        };
    }
    getElement(): HTMLElement | SVGElement {
        if (this.comp) {
            return this.comp.getElement();
        }
        this.comp = Tools.comp("div", {
            children: this.s.data.map((item: any) =>
                this.s.funcs.sectionCreator(item)
            ),
        });
        return this.comp.getElement();
    }
    getProps(): { [key: string]: any } {
        return this.comp!.getProps();
    }
    setData(data: { [key: string]: any }) {
        this.s.data = data;
        this.comp!.update({
            innerHTML: "",
            children: this.s.data.map((item: any) =>
                this.s.funcs.sectionCreator(item)
            ),
        });
    }
    private getContent(container: Container, comp: any) {
        if (comp) {
            container.display(comp);
        } else {
            container.comp.update({
                textContent: "content",
            });
        }
    }
    private creator(item: any) {
        const content = Tools.container({
            key: "content",
        });
        if (item.open) {
            this.getContent(content, item.content);
        }
        this.s.comps = {
            contentArea: content,
        };
        return Tools.div({
            class: "w-full",
            children: [
                Tools.comp(
                    "button",
                    {
                        class: "w-full text-left p-2 bg-green-500 text-white hover:bg-green-600 rounded-t-lg flex justify-between items-center mt-2",
                        children: [
                            Tools.div({
                                textContent: item.title,
                            }),
                            this.s.funcs.opsCreator(item, content),
                        ],
                        key: "title",
                    },
                    {
                        click: (e: any, s: any) => {
                            this.s.funcs.onTitleClick(e, {
                                s,
                                accordion: this,
                                item,
                                content,
                            });
                        },
                    },
                    {
                        data: item,
                        cs: !!item.open,
                    }
                ),
                content,
            ],
        });
    }
    private opsCreator(item: any, content: Container) {
        return Tools.icon(
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
                        content,
                    });
                },
            },
            {
                data: item,
                cs: false,
            }
        );
    }
    onPlus(e: any, s: any) {
        e.stopPropagation();
        s.s.s.cs = !s.s.s.cs;
        if (s.s.s.cs) {
            s.s.update({
                class: "transition-transform duration-300 rotate-315",
            });
            this.s.funcs.onPlusHandlerOnShow(e, s);
        } else {
            s.s.update({
                class: "transition-transform duration-300 rotate-0",
            });
            this.s.funcs.onPlusHandlerOnHide(e, s);
        }
    }
    onTitleClick(e: any, s: any) {
        let btnTitle = s.s;
        btnTitle.s.cs = !btnTitle.s.cs;
        if (!s.s.s.cs) {
            this.s.funcs.onTitleClickHandlerOnHide(e, s);
        } else {
            this.s.funcs.onTitleClickHandlerOnShow(e, s);
        }
    }
}

export const accordionTest = () => {
    const accordion = new AccordionShowOne();
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

export const accordionTest2 = () => {
    const accordion = new AccordionShowMany();
    accordion.getElement();
    return accordion;
};
