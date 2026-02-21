import { Cuboid, Menu, X, type IconNode } from "lucide";
import { Tools } from "../../../globalComps/tools";
import type { GComponent } from "../../../globalComps/GComponent";
import type { IContainer } from "./interface";
import type { LabelValueItem } from "../ui-showcase/interface";
export interface IElement {
    get_element(): HTMLElement;
}

export interface ISubComponentable<T> {
    get_subcomponents(): T;
}

export type WebpageComponentType = {
    sidebar: SidebarComp;
    body: BodyComp;
    header: HeaderComp;
    header_tools: {
        set_title: (title: string) => void;
        set_header_clicked: (func: () => void) => void;
    };
};

export class HeaderComp implements IElement {
    private element: HTMLElement;
    private titleElement: HTMLElement;
    private menuButton: HTMLButtonElement;

    constructor() {
        this.element = document.createElement("header");
        this.element.className =
            "md:hidden bg-slate-900 text-white p-4 flex justify-between items-center z-40 shadow-md flex-shrink-0";
        let titleElement = Tools.comp(
            "span",
            {
                class: "select-none",
                textContent: "DomOps",
            },
            { click: () => this.on_header_clicked() },
        );
        const leftDiv = Tools.div({
            class: "font-bold text-lg flex items-center gap-2",
            children: [Tools.icon(Cuboid, { class: "h-6 w-6" }), titleElement],
        });

        this.titleElement = titleElement.getElement();
        this.menuButton = document.createElement("button");
        this.menuButton.className =
            "w-8 h-8 flex items-center justify-center rounded hover:bg-slate-800";
        this.menuButton.innerHTML = Tools.icon(Menu, {
            class: "h-6 w-6",
        }).getElement().outerHTML;

        this.element.appendChild(leftDiv.getElement());
        this.element.appendChild(this.menuButton);
    }

    public set_title(title: string): void {
        this.titleElement.textContent = title;
    }
    set_on_menu_click(handler: (e: MouseEvent) => void): void {
        this.menuButton.onclick = handler;
    }

    on_header_clicked() {
        console.log("header clicked");
    }

    public get_element(): HTMLElement {
        return this.element;
    }
}

export class BodyComp implements IElement, IContainer {
    private element: HTMLElement;
    private el: GComponent;
    constructor() {
        this.el = Tools.comp("main", {
            class: "flex-1 overflow-y-auto bg-slate-50 relative w-full h-full animate-fade-in",
            children: [
                Tools.div({
                    key: "wraper",
                    class: "p-4 md:p-8 max-w-7xl mx-auto min-h-full pb-20 md:pb-8",
                }),
            ],
        });
        this.element = this.el.getElement();
    }
    display(comp: GComponent): void {
        this.el.s.wraper.update({ innerHTML: "", child: comp });
    }
    get_comp(): GComponent {
        return this.el;
    }

    public set_content(el: HTMLElement): void {
        this.el.s.wraper.getElement().innerHTML = "";
        this.el.s.wraper.getElement().appendChild(el);
    }

    public get_element(): HTMLElement {
        return this.element;
    }
}

export const Footer = (title: string, subtitle: string) => {
    const footer = document.createElement("div");
    footer.className =
        "p-4 border-t border-slate-800 text-xs text-center md:text-left";
    footer.innerHTML = `
            <div class="bg-slate-800 p-3 rounded flex items-center gap-3">
                <div class="w-8 h-8 rounded bg-gradient-to-br from-blue-400 to-purple-500"></div>
                <div>
                    <div class="text-white font-bold">${title}</div>
                    <div class="text-slate-500">${subtitle} </div>
                </div>
            </div>
        `;
    return footer;
};

export type SideBarElements = {
    footer: {
        set_title(title: string): void;
        set_subtitle(subtitle: string): void;
        display(comp: HTMLElement): void;
    };
};

export class SidebarComp
    implements IElement, ISubComponentable<SideBarElements>
{
    private element: HTMLElement;
    private navList: HTMLUListElement;
    private navItems: Map<string, HTMLButtonElement> = new Map();

    public onCloseClick?: () => void;

    private footer: HTMLElement;
    header: GComponent;
    navs: Map<string, HTMLElement> = new Map();
    constructor() {
        this.element = document.createElement("nav");
        this.element.className =
            "fixed inset-y-0 left-0 w-64 bg-slate-900 text-slate-300 flex flex-col z-50 transform -translate-x-full transition-transform duration-300 md:relative md:translate-x-0 md:flex-shrink-0 shadow-2xl md:shadow-none h-full";

        this.header = Tools.div({
            class: "p-6 text-white font-bold text-xl hidden md:flex items-center gap-3 border-b border-slate-800 select-none cursor-pointer",
            children: [
                Tools.icon(Cuboid, {
                    class: "h-6 w-6",
                }),
                Tools.comp("span", {
                    key: "title",
                    textContent: "DomOps",
                }),
            ],
        });
        this.element.appendChild(this.header.getElement());
        const mobileCloseContainer = document.createElement("div");
        mobileCloseContainer.className =
            "md:hidden p-4 flex justify-end border-b border-slate-800";

        const closeBtn = document.createElement("button");
        closeBtn.className = "text-white"; //
        closeBtn.innerHTML = Tools.icon(X, {
            class: "h-6 w-6",
        }).getElement().outerHTML;
        closeBtn.onclick = () => this.onCloseClick?.();

        mobileCloseContainer.appendChild(closeBtn);
        this.element.appendChild(mobileCloseContainer);

        this.navList = document.createElement("ul");
        this.navList.className = "flex-1 p-4 space-y-1 overflow-y-auto";
        this.element.appendChild(this.navList);

        this.footer = Footer("Admin", "v1.0.0");
        this.element.appendChild(this.footer);
    }
    get_subcomponents(): SideBarElements {
        return {
            footer: {
                set_title: (title: string) => {
                    this.footer.querySelector(".text-white")!.textContent =
                        title;
                },
                set_subtitle: (subtitle: string) => {
                    this.footer.querySelector(".text-slate-500")!.textContent =
                        subtitle;
                },
                display: (comp: HTMLElement) => {
                    this.footer.innerHTML = "";
                    this.footer.appendChild(comp);
                },
            },
        };
    }

    add_nav_item(config: LabelValueItem & { icon: IconNode }): void {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.className =
            "nav-item w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-3 cursor-pointer";

        btn.innerHTML =
            Tools.icon(config.icon, {
                class: "w-5 text-center",
            }).getElement().outerHTML +
            " " +
            config.label;

        btn.onclick = () => {
            this.navItems.forEach((b) =>
                b.classList.remove("bg-blue-600", "text-white"),
            );
            btn.classList.add("bg-blue-600", "text-white");
            this.on_nav_item_click(config);
        };
        this.navs.set(config.value, btn);
        this.navItems.set(config.value, btn);
        li.appendChild(btn);
        this.navList.appendChild(li);
    }

    add_divider(label: string): void {
        const div = document.createElement("div");
        div.className =
            "pt-4 pb-2 text-xs font-bold uppercase text-slate-600 px-4";
        div.textContent = label;
        this.navList.appendChild(div);
    }

    set_visible(visible: boolean): void {
        if (visible) {
            this.element.classList.remove("-translate-x-full");
        } else {
            this.element.classList.add("-translate-x-full");
        }
    }

    trigger_nav_click(id: string): void {
        this.navItems.get(id)?.click();
    }

    get_element(): HTMLElement {
        return this.element;
    }
    on_nav_item_click(item: LabelValueItem): void {
        console.log(item);
    }
}

export class WebpageComp
    implements IElement, ISubComponentable<WebpageComponentType>
{
    private header: HeaderComp;
    private sidebar: SidebarComp;
    private body: BodyComp;
    private element: HTMLElement;
    private backdrop: HTMLElement;
    private eleComp: GComponent;

    constructor() {
        this.eleComp = Tools.div();
        this.element = this.eleComp.getElement();
        this.element.className =
            "flex flex-col md:flex-row h-screen w-full overflow-hidden bg-slate-50";

        this.header = new HeaderComp();
        this.sidebar = new SidebarComp();
        this.body = new BodyComp();

        this.backdrop = document.createElement("div");
        this.backdrop.className =
            "fixed inset-0 bg-black/50 z-40 hidden md:hidden transition-opacity opacity-0";
        this.backdrop.onclick = () => this.toggle_sidebar(false);

        this.element.appendChild(this.backdrop);
        this.element.appendChild(this.sidebar.get_element());

        const rightSideContainer = document.createElement("div");
        rightSideContainer.className = "flex-1 flex flex-col overflow-hidden";

        rightSideContainer.appendChild(this.header.get_element());
        rightSideContainer.appendChild(this.body.get_element());

        this.element.appendChild(rightSideContainer);

        this.init_logic();
    }

    private init_logic(): void {
        this.header.set_on_menu_click(() => this.toggle_sidebar(true));
        this.sidebar.onCloseClick = () => this.toggle_sidebar(false);
    }

    public toggle_sidebar(show: boolean): void {
        this.sidebar.set_visible(show);
        if (show) {
            this.backdrop.classList.remove("hidden");
            setTimeout(() => this.backdrop.classList.remove("opacity-0"), 10);
        } else {
            this.backdrop.classList.add("opacity-0");
            setTimeout(() => this.backdrop.classList.add("hidden"), 300);
        }
    }

    public get_subcomponents(): WebpageComponentType {
        return {
            sidebar: this.sidebar,
            body: this.body,
            header: this.header,
            header_tools: {
                set_title: (title: string) => this.set_title(title),
                set_header_clicked: (func: () => void) => {
                    this.header.on_header_clicked = func;
                    this.sidebar.header.set_events({ click: func });
                },
            },
        };
    }
    private set_title(title: string): void {
        this.header.set_title(title);
        this.sidebar.header.s.title.update({ textContent: title });
    }

    public get_element(): HTMLElement {
        return this.element;
    }
    get_comp(): GComponent {
        return this.eleComp;
    }
}
