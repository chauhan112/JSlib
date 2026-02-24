import { GComponent, type IComponent } from "../../../globalComps/GComponent";
import { Tools } from "../../../globalComps/tools";
import type { ILister } from "./interface";
import { Trash, type IconNode } from "lucide";
import type { ISComponent } from "../../../globalComps/interface";

export const EnumComp = (
    nr: number,
    title: string,
    icons: { icon: IconNode; key: string }[],
    comps: IComponent[] = [],
) => {
    let iconsComps: any[] = icons.map((icon) =>
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
    iconsComps = [...iconsComps, ...comps];

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
                    class: "flex items-center gap-3",
                    children: iconsComps,
                }),
            ],
        },
        {},
        { iconsComps, nrComp, titleComp },
    );
};

export class EnumCtrl implements ISComponent {
    comp: GComponent;
    data: any;
    constructor(
        nr: number,
        data: any,
        icons: { icon: IconNode; key: string }[],
        comps: IComponent[] = [],
    ) {
        this.data = data;
        this.comp = EnumComp(nr, data.title, icons, comps);
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
export class EnumeratedLister<T> implements ILister {
    values: T[] = [];
    comp: GComponent = Tools.comp("ul", {
        class: "bg-white shadow-sm rounded-xl overflow-hidden border border-slate-200",
    });
    listComps: any[] = [];
    set_values(data: T[]): void {
        this.values = data;
        this.update();
    }
    get_comp(): GComponent {
        return this.comp;
    }

    cardCompCreator(data: T, idx: number): ISComponent {
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

export class SelectableLister implements ILister {
    set_values(data: any[]): void {
        throw new Error("Method not implemented.");
    }
    get_comp(): GComponent {
        throw new Error("Method not implemented.");
    }
}
