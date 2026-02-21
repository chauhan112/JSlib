import { GComponent } from "../../../globalComps/GComponent";
import { Tools } from "../../../globalComps/tools";
import type { ILister } from "./interface";
import {
    MainCtrl as AtomicMainCtrl,
    CardCompCtrl,
} from "../../../t2025/dec/DomainOpsFrontend/components/atomic";
import { Trash, type IconNode } from "lucide";
import type { ISComponent } from "../../../globalComps/interface";

export class Lister implements ILister {
    values: any[] = [];
    title_getter: (data: any) => string = (data: any) => data?.title || "";
    comp: GComponent = Tools.comp("ul", {
        class: "flex flex-col gap-2 w-full",
    });
    listComps: CardCompCtrl[] = [];
    set_values(data: any[]): void {
        this.values = data;
        this.update();
    }
    get_comp(): GComponent {
        return this.comp;
    }
    set_title_func(func: (data: any) => string) {
        this.title_getter = func;
        this.update();
    }

    cardCompCreator(data: any): CardCompCtrl {
        const cardCompCtrl = AtomicMainCtrl.cardComp(data, this.title_getter);
        cardCompCtrl.set_options([]);
        cardCompCtrl.comp.getElement().classList.add("cursor-pointer");
        cardCompCtrl.onCardClicked = (data: any) => this.on_click(data);
        return cardCompCtrl;
    }

    update() {
        this.listComps = this.values.map((d: any) => this.cardCompCreator(d));
        this.comp.update({
            innerHTML: "",
            children: this.listComps.map((comp: CardCompCtrl) => comp.comp),
        });
    }
    on_click(data: any) {
        console.log("hello", data);
    }
}
export class ListerWithContext extends Lister {
    contextMenuOptions: { label: string }[] = [
        { label: "Edit" },
        { label: "Delete" },
        { label: "View" },
    ];
    cardCompCreator(data: any): CardCompCtrl {
        const cardCompCtrl = AtomicMainCtrl.cardComp(data, this.title_getter);
        cardCompCtrl.set_options(this.contextMenuOptions);
        cardCompCtrl.comp.getElement().classList.add("cursor-pointer");
        cardCompCtrl.onCardClicked = (data: any) => this.on_click(data);
        cardCompCtrl.onOpsMenuClicked = (data: any, label: string) =>
            this.on_context_clicked(data, label);
        return cardCompCtrl;
    }
    on_context_clicked(data: any, label: string) {}
}
export class SelectableLister implements ILister {
    set_values(data: any[]): void {
        throw new Error("Method not implemented.");
    }
    get_comp(): GComponent {
        throw new Error("Method not implemented.");
    }
}

const EnumComp = (
    nr: number,
    title: string,
    icons: { icon: IconNode; key: string }[],
) => {
    let iconsComps = icons.map((icon) =>
        Tools.icon(
            icon.icon,
            {
                key: icon.key,
                class: "h-5 w-5 cursor-pointer text-slate-600 hover:scale-110",
            },
            {},
            { data: icon.key },
        ),
    );
    let nrComp = Tools.comp("div", {
        class: "w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold",
        textContent: "" + nr,
    });
    let titleComp = Tools.comp("div", {
        class: "font-bold text-sm text-slate-700",
        textContent: title,
    });
    return Tools.comp(
        "div",
        {
            class: "flex items-center justify-between p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer",
            children: [
                Tools.comp("div", {
                    class: "flex items-center gap-3",
                    children: [nrComp, titleComp],
                }),
                Tools.comp("div", {
                    children: iconsComps,
                }),
            ],
        },
        {},
        { iconsComps, nrComp, titleComp },
    );
};

class EnumCtrl implements ISComponent {
    comp: GComponent;
    data: any;
    constructor(
        nr: number,
        data: any,
        icons: { icon: IconNode; key: string }[],
    ) {
        this.data = data;
        this.comp = EnumComp(nr, data.title, icons);
        this.comp.update({}, { click: () => this.on_click(data) });
        this.comp.s.iconsComps.forEach((iconComp: GComponent) => {
            iconComp.update(
                {},
                {
                    click: (e: any, ls: any) => {
                        e.stopPropagation();
                        this.on_icons_clicked(ls.s.data, this.data);
                    },
                },
            );
        });
    }
    get_comp(): GComponent {
        return this.comp;
    }
    on_click(data: any) {
        console.log("data", data);
    }
    on_icons_clicked(key: string, data: any) {
        console.log("icon", key, data);
    }
}
export class EnumeratedLister implements ILister {
    values: any[] = [];
    comp: GComponent = Tools.comp("ul", {
        class: "bg-white shadow-sm rounded-xl overflow-hidden border border-slate-200",
    });
    listComps: any[] = [];
    set_values(data: any[]): void {
        this.values = data;
        this.update();
    }
    get_comp(): GComponent {
        return this.comp;
    }

    cardCompCreator(data: any, idx: number): ISComponent {
        const cardCompCtrl = new EnumCtrl(idx + 1, data, [
            { key: "delete", icon: Trash },
        ]);
        return cardCompCtrl;
    }

    update() {
        this.listComps = this.values.map((d: any, idx: number) =>
            this.cardCompCreator(d, idx),
        );
        this.comp.update({
            innerHTML: "",
            children: this.listComps.map((comp: ISComponent) =>
                comp.get_comp(),
            ),
        });
    }
}
export class TabularLister implements ILister {
    set_values(data: any[]): void {
        throw new Error("Method not implemented.");
    }
    get_comp(): GComponent {
        throw new Error("Method not implemented.");
    }
}
export class SearchableLister implements ILister {
    set_values(data: any[]): void {
        throw new Error("Method not implemented.");
    }
    get_comp(): GComponent {
        throw new Error("Method not implemented.");
    }
}
export class PaginateLister implements ILister {
    // lister: ILister;
    // paginator: IPaginator;
    set_values(data: any[]): void {
        throw new Error("Method not implemented.");
    }
    get_comp(): GComponent {
        throw new Error("Method not implemented.");
    }
}
export class PaginateAndSearchLister implements ILister {
    // lister: ILister;
    // paginator: IPaginator;
    // searcher: ISearchComponent;
    set_values(data: any[]): void {
        throw new Error("Method not implemented.");
    }
    get_comp(): GComponent {
        throw new Error("Method not implemented.");
    }
}
export class PaginateSearchFilterLister implements ILister {
    set_values(data: any[]): void {
        throw new Error("Method not implemented.");
    }
    get_comp(): GComponent {
        throw new Error("Method not implemented.");
    }
}

export class Pills implements ILister {
    set_values(data: any[]): void {
        throw new Error("Method not implemented.");
    }
    get_comp(): GComponent {
        throw new Error("Method not implemented.");
    }
}
