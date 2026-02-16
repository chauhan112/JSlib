import { GComponent } from "../../../globalComps/GComponent";
import { Tools } from "../../../globalComps/tools";
import { NewListDisplayerCtrl } from "../../../t2025/dec/DomainOpsFrontend/components/ListDisplayer";
import type { ILister, IPaginator, ISearchComponent } from "./interface";
import {
    MainCtrl as AtomicMainCtrl,
    CardCompCtrl,
} from "../../../t2025/dec/DomainOpsFrontend/components/atomic";

export class Lister implements ILister {
    values: any[] = [];
    title_getter: (data: any) => string = (data: any) => data?.title || "";
    comp: GComponent = Tools.comp("ul", {
        class: "flex flex-col gap-2 w-full",
    });
    listComps: CardCompCtrl[] = [];
    ctrl: NewListDisplayerCtrl = new NewListDisplayerCtrl();
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
        cardCompCtrl.onCardClicked = this.on_click.bind(this);
        return cardCompCtrl;
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
export class EnumeratedLister implements ILister {
    set_values(data: any[]): void {
        throw new Error("Method not implemented.");
    }
    get_comp(): GComponent {
        throw new Error("Method not implemented.");
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
