import { Tools, IComponent, Repeater, GComponent } from "./GComponent";
import { ChevronDown, Plus } from "lucide";

export class Accordion implements IComponent {
    s: { [key: string]: any } = {};
    comp: Repeater | null = null;
    constructor() {
        this.s.data = {};
        this.s.funcs = {
            onPlus: (e: any, s: any) => {},
            onShow: (e: any, s: any) => {},
        };
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
            data[key] = this.creator(rawData[key]);
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

    private creator(item: { title: string; content: string; more?: any }) {
        const ifComp = Tools.ifComp(
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
                                    e.stopPropagation();
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
                }
            ),
            ifComp,
        ];

        return Tools.div({
            children,
        });
    }
}

export const accordionTest = () => {
    const accordion = new Accordion();
    accordion.setData({
        "1": {
            title: "title 1",
            content: "content 1",
            more: "1",
        },
        "2": {
            title: "title 2",
            content: "content 2",
            more: "2",
        },
        "3": {
            title: "title 3",
            content: "content 3",
            more: "3",
        },
        "4": {
            title: "title 4",
            content: "content 4",
            more: "4",
        },
        "5": {
            title: "title 5",
            content: "content 5",
            more: "5",
        },
    });
    return accordion;
};
