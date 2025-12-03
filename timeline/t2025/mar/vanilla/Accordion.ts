import { type IComponent } from "./interfaces";
import { Repeater, Button, GComponent } from "./Components";
import { CITTools } from "./tools";
import { ChevronDown, Plus } from "lucide";
export class Accordion implements IComponent {
    handlers: { [key: string]: (...args: any[]) => void } = {};
    states: { [key: string]: any } = {};
    props: { [key: string]: string } = {};
    comp: Repeater = new Repeater();

    constructor() {
        this.comp.createItem = this.createItem;
        this.comp.update(
            {
                class: "flex flex-col w-100 mx-auto mt-10",
            },
            undefined,
            undefined,
            false
        );
        this.states = {
            btn: {
                props: (val: any) => {},
                handlers: (val: any) => {},
            },
            display: {
                props: (val: any) => {},
            },
        };
    }
    getTitleComp = (item: any) => {
        let btn = new Button();
        btn.states.defclass = btn.comp.props.class;
        btn.update(
            {
                textContent: "title 1",
                ...this.states.btn.props(item, btn),
            },
            {},
            {
                click: (e) => this.onTitleClick(item, e),
                ...this.states.btn.handlers(item, btn),
            }
        );
        return btn;
    };
    getDisplayComp = (item: any) => {
        let displayComponent = new GComponent();
        displayComponent.typ = "div";
        displayComponent.props = {
            class: "w-full",
            textContent: "Displayx lorem ipsum dolor sit amet ",
            ...this.states.display.props(item),
        };
        return displayComponent;
    };
    onTitleClick = (item: any, e: any) => {
        for (let key in this.comp.itemComp) {
            if (key !== item.key) {
                this.comp.itemComp[key].states.children[1].setValue(false);
            } else {
                this.comp.itemComp[key].states.children[1].setValue(true);
            }
        }
    };
    createItem = (item: any) => {
        let displayComponent = this.getDisplayComp(item);
        let btn = this.getTitleComp(item);
        let cond = CITTools.conditionalComponent(item.show, [
            (val) => val,
            displayComponent,
        ]);

        let group = CITTools.groupComponents(btn, cond);
        group.update({
            class: "flex flex-col w-100",
        });
        group.states.comp = {
            displayComponent,
            btn,
        };
        return group;
    };
    update(
        props?: { [key: string]: string },
        state?: { [key: string]: any },
        handlers?: { [key: string]: (...args: any[]) => void }
    ): void {
        this.comp.update(props, state, handlers);
    }
    getElement(): HTMLElement {
        return this.comp.getElement();
    }
    setData(data: any[]) {
        this.comp.setData(data);
    }
}

export const accordionTest = () => {
    let comp = new Accordion();
    comp.states.display.props = (val: any) => {
        return {
            textContent: val?.content,
        };
    };
    comp.states.btn.props = (val: any) => {
        return {
            textContent: "",
            class: "bg-gray-200 p-2 text-left mt-2 flex justify-between",
            children: [
                CITTools.comp("div", {
                    class: "flex flex-row gap-2",
                    children: [
                        CITTools.icon(ChevronDown),
                        CITTools.comp("div", {
                            textContent: val.title,
                        }),
                    ],
                }),
                CITTools.icon(
                    Plus,
                    {},
                    {},
                    {
                        click: (e: any) => {
                            e.stopPropagation();
                            console.log(e);
                        },
                    }
                ),
            ],
        };
    };
    comp.states.btn.handlers = (val: any, btn: any) => {
        return {
            click: (e: any) => {
                comp.onTitleClick(val, e);
                console.log(comp);
            },
        };
    };
    comp.comp.setData([
        {
            key: "1",
            title: "hello",
            show: true,
            content: "super aweseom content",
        },
        {
            key: "2",
            title: "title 2",
            content: "super aweseom content",
            show: false,
        },
        {
            key: "3",
            title: "title 3",
            content: "super aweseom content",
            show: false,
        },
        {
            key: "4",
            title: "title 4",
            content: "super aweseom content",
            show: false,
        },
    ]);

    return comp;
};
