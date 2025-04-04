import { Tools, IComponent, Repeater } from "./GComponent";
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
                                Tools.icon(ChevronDown, {
                                    key: "down",
                                    class: "transition-transform duration-300 rotate-0",
                                }),
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
                                    s.update({
                                        class:
                                            s.s.def.class +
                                            " " +
                                            s.s[s.s.cs].class,
                                    });
                                    s.s.cs = !s.s.cs;
                                    this.s.funcs.onPlus(e, [s, this]);
                                },
                            },
                            {
                                cs: false,
                                true: {
                                    class: "rotate-0",
                                },
                                false: {
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
                        for (const key in this.comp!.itemComp) {
                            if (key === item.more) {
                                this.comp!.itemComp[key].s.iff.setValue(
                                    !this.comp!.itemComp[key].s.iff.s.value
                                );
                            } else {
                                this.comp!.itemComp[key].s.iff.setValue(false);
                            }
                            if (this.comp!.itemComp[key].s.iff.s.value) {
                                this.comp!.itemComp[
                                    key
                                ].s.btn.s.td.s.down.update({
                                    class: this.comp!.itemComp[
                                        key
                                    ].s.btn.s.td.s.down.props.class.replace(
                                        "rotate-0",
                                        "rotate-180"
                                    ),
                                });
                            } else {
                                this.comp!.itemComp[
                                    key
                                ].s.btn.s.td.s.down.update({
                                    class: this.comp!.itemComp[
                                        key
                                    ].s.btn.s.td.s.down.props.class.replace(
                                        "rotate-180",
                                        "rotate-0"
                                    ),
                                });
                            }
                        }
                        this.s.funcs.onShow(e, [s, this]);
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
