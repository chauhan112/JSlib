import { Menu } from "lucide";
import { GComponent } from "../../../../globalComps/GComponent";
import type { ISComponent } from "../../../../globalComps/interface";
import { Tools } from "../../../../globalComps/tools";
import type { IContainer, ISubComponentable } from "../interface";

export interface IHeaderUpdatable {
    set_title(title: string): void;
    on_click(): void;
}

export class HeaderComponent
    implements
        ISubComponentable<{
            title: GComponent;
            btn: GComponent;
        }>,
        ISComponent
{
    private comp: GComponent;
    private titleEl: GComponent;
    private hamburger: GComponent;

    constructor() {
        this.titleEl = Tools.comp("span", {
            class: "font-bold text-xl cursor-pointer select-none",
            textContent: "DomOps",
        });
        this.hamburger = Tools.comp("button", {
            class: "md:hidden p-2 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none",
            child: Tools.icon(Menu, { class: "w-6 h-6" }),
        });

        this.comp = Tools.comp("header", {
            class: "flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm w-full z-10",
            children: [
                Tools.comp("div", {
                    class: "flex items-center gap-4",
                    children: [this.hamburger, this.titleEl],
                }),
            ],
        });
        this.titleEl.set_events({ click: () => this.on_title_click() });
    }
    get_comp(): GComponent {
        return this.comp;
    }
    get_subcomponents() {
        return {
            title: this.titleEl,
            btn: this.hamburger,
        };
    }

    set_title(title: string): void {
        this.titleEl.update({ textContent: title });
    }

    on_title_click(): void {
        console.log("title clicked");
    }

    on_hamburger_click(callback: () => void): void {
        this.hamburger.set_events({ click: callback });
    }
}

export type WebpageComponentType = {
    sidebar: BaseContainer;
    body: BaseContainer;
    header: HeaderComponent;
    header_tool: IHeaderUpdatable;
};

export class BaseContainer implements IContainer {
    comp: GComponent;
    constructor(comp: GComponent) {
        this.comp = comp;
    }
    display(comp: GComponent): void {
        this.comp.update({ innerHTML: "", child: comp });
    }
}

export class WebpageComp
    implements ISubComponentable<WebpageComponentType>, ISComponent
{
    el: GComponent = Tools.comp("div", {
        class: "flex h-screen w-screen bg-gray-50 overflow-hidden font-sans",
    });
    private sidebar: BaseContainer;
    private header: HeaderComponent;
    private body: BaseContainer;
    constructor() {
        this.sidebar = new BaseContainer(
            Tools.comp("aside", {
                class: "h-full w-64 bg-gray-800 text-white flex flex-col transition-transform transform -translate-x-full md:translate-x-0 absolute md:relative z-20",
            }),
        );
        this.header = new HeaderComponent();
        this.body = new BaseContainer(
            Tools.comp("main", {
                class: "flex-1 p-6 overflow-y-auto",
            }),
        );

        const rightContainer = Tools.comp("div", {
            class: "flex flex-col flex-1 w-full overflow-hidden relative",
            children: [this.header.get_comp(), this.body.comp],
        });
        this.el.set_props({
            children: [this.sidebar.comp, rightContainer],
        });
        this.header.on_hamburger_click(() => {
            this.sidebar.comp
                .getElement()
                .classList.toggle("-translate-x-full");
        });
    }

    get_subcomponents(): WebpageComponentType {
        return {
            sidebar: this.sidebar,
            body: this.body,
            header: this.header,
            header_tool: {
                set_title: this.header.set_title.bind(this.header),
                on_click: this.header.on_title_click.bind(this.header),
            },
        };
    }

    get_comp(): GComponent {
        return this.el;
    }
}
