import { Eye, Heart, Star } from "lucide";
import { Tools } from "../../../globalComps/tools";
import type { IComponent, IElement, LabelValueItem } from "./interface";
import "./style.css";
import type { ISComponent } from "../../../globalComps/interface";
import type { GComponent } from "../../../globalComps/GComponent";

export const GLMGroup = (title: string, subtitle: string) => {
    const iconComp = Tools.comp("div", {
        class: "w-10 h-10 rounded-xl bg-[var(--warning)]/10 border border-[var(--warning)]/20 flex items-center justify-center",
        children: [
            Tools.icon(Star, {
                class: "w-5 h-5 text-[var(--warning)]",
            }),
        ],
    });

    const titleComp = Tools.comp("h2", {
        class: "text-lg font-semibold",
        textContent: title,
    });

    const subtitleComp = Tools.comp("p", {
        class: "text-xs text-[var(--muted)]",
        textContent: subtitle,
    });

    const countComp = Tools.comp("span", {
        class: "text-xs font-mono text-[var(--muted)] bg-[var(--card)] px-2 py-1 rounded",
        textContent: "7 items",
    });
    const listerComp = Tools.comp("div", {
        class: "w-full flex flex-wrap gap-3 items-center justify-center",
    });

    const comp = Tools.comp(
        "section",
        {
            class: "mb-10 component-section animate-scale flex flex-col",
            children: [
                Tools.comp("div", {
                    class: "flex items-center justify-between mb-5",
                    children: [
                        Tools.comp("div", {
                            class: "flex items-center gap-3",
                            children: [
                                iconComp,
                                Tools.comp("div", {
                                    children: [titleComp, subtitleComp],
                                }),
                            ],
                        }),
                        countComp,
                    ],
                }),
                listerComp,
            ],
        },
        {},
        { titleComp, subtitleComp, countComp, listerComp },
    );

    return comp;
};

export const CardTagUI = () => {
    return Tools.comp("div", {
        class: "flex items-center gap-2",
        children: [
            Tools.comp("span", {
                class: "px-2 py-0.5 rounded text-xs font-medium",
                textContent: "ui",
            }),
        ],
    });
};

export const CardCompSmall = (title: string, subtitle: string) => {
    let icon = Tools.icon(Heart);
    return Tools.comp("div", {
        class: "component-card flex-shrink-0 w-64 p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl cursor-pointer animate-scale",
        children: [
            Tools.comp("div", {
                class: "flex items-start justify-between mb-2",
                children: [
                    CardTagUI(),
                    Tools.comp("button", {
                        class: "favorite-btn p-1 rounded hover:bg-[var(--bg)] transition-colors active",
                        children: [icon],
                    }),
                ],
            }),
            Tools.comp("h3", {
                class: "font-semibold text-sm mb-1",
                textContent: title,
            }),
            Tools.comp("p", {
                class: "text-xs text-[var(--muted)] line-clamp-2",
                textContent: subtitle,
            }),
            Tools.comp("div", {
                class: "flex items-center gap-3 mt-3 text-xs text-[var(--muted)]",
                children: [
                    Tools.icon(Eye, { class: "w-4 h-4" }),
                    Tools.comp("span", {
                        class: "flex items-center gap-1",
                        textContent: "6m ago",
                    }),
                ],
            }),
        ],
    });
};

export const CardCompBig = (title: string, subtitle: string) => {
    const icon = Tools.comp("button", {
        class: "favorite-btn p-1.5 rounded-lg hover:bg-[var(--bg)] transition-colors active",
        children: [Tools.icon(Heart)],
    });
    return Tools.comp("div", {
        class: "component-card p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl cursor-pointer animate-scale",
        children: [
            Tools.comp("div", {
                class: "flex items-start justify-between mb-3",
                children: [
                    CardTagUI(),
                    Tools.comp("div", {
                        class: "flex items-center gap-1",
                        children: [icon],
                    }),
                ],
            }),
            Tools.comp("h3", {
                class: "font-semibold mb-1",
                textContent: title,
            }),
            Tools.comp("p", {
                class: "text-xs text-[var(--muted)] line-clamp-2 mb-3",
                textContent: subtitle,
            }),
            Tools.comp("div", {
                class: "flex items-center justify-between text-xs text-[var(--muted)]",
                children: [
                    Tools.comp("span", {
                        class: "flex items-center gap-1",
                        textContent: "2.3k",
                        children: [Tools.icon(Eye, { class: "w-4 h-4" })],
                    }),
                    Tools.comp("span", { textContent: "6m ago" }),
                ],
            }),
        ],
    });
};

export class BaseElement implements IElement {
    protected el: GComponent;
    constructor(tag: string = "div", className: string = "") {
        this.el = Tools.comp(tag);
        if (className) this.el.update({ class: className });
    }
    get_element(): HTMLElement {
        return this.el.getElement();
    }
}

export class BaseComponent extends BaseElement implements IComponent {
    set_attrs(attrs: { [key: string]: any }): void {
        this.el.update(attrs);
    }

    set_events(events: { [key: string]: any }): void {
        this.el.update({}, events);
    }
}

const CardCompGroup = (label: string) => {
    return Tools.comp("div", {
        class: "p-4 bg-white rounded shadow-sm border border-gray-100 hover:shadow-md cursor-pointer transition",
        textContent: label,
    });
};
export class GroupComponent extends BaseComponent implements ISComponent {
    private titleEl: GComponent;
    private itemsContainer: GComponent;

    constructor() {
        super("div", "mb-8");
        this.titleEl = Tools.comp("h2", {
            class: "text-lg font-bold text-gray-700 mb-4 border-b pb-2",
        });
        this.itemsContainer = Tools.comp("div", {
            class: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4",
        });
        this.el.update({ children: [this.titleEl, this.itemsContainer] });
    }
    get_comp(): GComponent {
        return this.el;
    }

    set_title(title: string): void {
        this.titleEl.update({ textContent: title });
    }

    set_items(items: LabelValueItem[]): void {
        this.itemsContainer.update({ innerHTML: "" });
        items.forEach((item) => {
            const card = this.card_comp_creator(item);
            this.itemsContainer.update({ child: card });
        });
    }

    card_comp_creator(data: any) {
        const card = CardCompGroup(data.label);
        card.update({}, { click: () => this.on_item_click(data) });
        return card;
    }

    on_item_click(item: LabelValueItem): void {
        console.log("Group item clicked:", item);
    }
}
