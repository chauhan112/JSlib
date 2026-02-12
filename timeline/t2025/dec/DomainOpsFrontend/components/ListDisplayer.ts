import { Tools } from "../../../../globalComps/tools";
import { MainCtrl as CardCompMainCtrl } from "./atomic";
import { Pagination } from "../../../july/generic-crud/page";
import type { GComponent } from "../../../../globalComps/GComponent";

export const ListDisplayer = () => {
    const pagination = Pagination();
    let list = Tools.comp("ul", {
        class: "flex flex-col gap-2 w-full",
        children: [],
    });
    return Tools.div(
        {
            class: "flex flex-col w-full items-start gap-4",
            children: [pagination, list],
        },
        {},
        { list, pagination },
    );
};
export class PaginationModel {
    data: any[] = [];
    pageSize: number = 10;
    currentPage: number = 1;
    maxPage: number = 1;
    getCurrentPageData() {
        return this.data.slice(
            (this.currentPage - 1) * this.pageSize,
            this.currentPage * this.pageSize,
        );
    }
    getMaxPage() {
        return Math.ceil(this.data.length / this.pageSize);
    }
    nextPage() {
        if (this.currentPage < this.maxPage) this.currentPage++;
    }
    prevPage() {
        if (this.currentPage > 1) this.currentPage--;
    }
    goToPage(page: number) {
        if (page > 0 && page <= this.maxPage) this.currentPage = page;
    }
    setData(data: any[]) {
        this.data = data;
        this.maxPage = this.getMaxPage();
        this.currentPage = 1;
    }
}
export class PaginationCtrl {
    comp: any;
    model: PaginationModel;
    update: () => void = () => {
        this.default_update();
    };
    constructor() {
        this.model = new PaginationModel();
    }
    set_comp(comp: any) {
        this.comp = comp;
    }
    set_data(data: any[]) {
        this.model.setData(data);
    }
    default_update() {
        if (this.model.maxPage <= 1) {
            this.comp.getElement().classList.add("hidden");
        } else {
            this.comp.getElement().classList.remove("hidden");
        }
        this.comp.s.page.update({
            textContent: `${this.model.currentPage}/${this.model.maxPage}`,
        });
    }
    setup() {
        this.comp.s.next.update(
            {},
            {
                click: () => {
                    this.model.nextPage();
                    this.update();
                },
            },
        );
        this.comp.s.prev.update(
            {},
            {
                click: () => {
                    this.model.prevPage();
                    this.update();
                },
            },
        );
    }
}

export interface ICardCompCtrl {
    get_comp: () => GComponent;
}

export class CardCompCtrl implements ICardCompCtrl {
    comp: any;
    constructor(
        data: any,
        title_getter: (data: any) => string,
        on_more_ops_clicked: (data: any, label: string) => void,
        on_card_clicked: (data: any) => void,
        contextMenuOptions: { label: string }[],
    ) {
        const cardCompCtrl = CardCompMainCtrl.cardComp(data, title_getter);
        cardCompCtrl.onOpsMenuClicked = on_more_ops_clicked;
        cardCompCtrl.onCardClicked = on_card_clicked;
        cardCompCtrl.set_options(contextMenuOptions);
        cardCompCtrl.setup();
        this.comp = cardCompCtrl;
    }
    get_comp() {
        return this.comp.comp;
    }
}

export type CardCompReturn = GComponent | ICardCompCtrl;

export class ListDisplayerCtrl {
    comp: any;
    contextMenuOptions: { label: string }[] = [
        { label: "Edit" },
        { label: "Delete" },
        { label: "View" },
    ];
    listComps: any[] = [];
    paginationCtrl: PaginationCtrl = new PaginationCtrl();
    on_card_clicked: (data: any) => void = () => {};
    on_more_ops_clicked: (data: any, label: string) => void = () => {};
    cardCompCreator: (data: any) => CardCompReturn = (data: any) =>
        this.default_cardCompCreator(data);
    title_getter: (data: any) => string = (data: any) => data.title;
    set_comp(comp: any) {
        this.comp = comp;
    }
    setup() {
        this.paginationCtrl.set_comp(this.comp.s.pagination);
        this.paginationCtrl.update = this.update.bind(this);
        this.paginationCtrl.setup();
    }
    default_cardCompCreator(data: any): CardCompReturn {
        const cardCompCtrl = new CardCompCtrl(
            data,
            this.title_getter,
            this.on_more_ops_clicked,
            this.on_card_clicked,
            this.contextMenuOptions,
        );
        return cardCompCtrl.get_comp();
    }
    update() {
        let data = this.paginationCtrl.model.getCurrentPageData();
        this.listComps = data.map((d: any) => this.cardCompCreator(d));
        this.comp.s.list.update({ innerHTML: "", children: this.listComps });
        this.paginationCtrl.default_update();
    }
    set_data(data: any[], title_getter?: (data: any) => string) {
        this.paginationCtrl.set_data(data);
        if (title_getter) {
            this.title_getter = title_getter;
        }
        if (this.paginationCtrl.model.maxPage > 1) {
            this.comp.s.pagination.getElement().classList.remove("hidden");
        } else {
            this.comp.s.pagination.getElement().classList.add("hidden");
        }
    }
    set_pageSize(pageSize: number) {
        this.paginationCtrl.model.pageSize = pageSize;
    }
}

export class NewListDisplayerCtrl extends ListDisplayerCtrl {
    cardCompCreator: (data: any) => ICardCompCtrl = (data: any) =>
        this.default_cardCompCreator(data);
    default_cardCompCreator(data: any): ICardCompCtrl {
        const cardCompCtrl = new CardCompCtrl(
            data,
            this.title_getter,
            this.on_more_ops_clicked,
            this.on_card_clicked,
            this.contextMenuOptions,
        );
        cardCompCtrl.comp.comp.getElement().classList.add("cursor-pointer");

        return cardCompCtrl;
    }
    update() {
        let data = this.paginationCtrl.model.getCurrentPageData();
        this.listComps = data.map((d: any) => this.cardCompCreator(d));
        this.comp.s.list.update({
            innerHTML: "",
            children: this.listComps.map((comp: ICardCompCtrl) =>
                comp.get_comp(),
            ),
        });
        this.paginationCtrl.default_update();
    }
}
export class MainCtrl {
    static listDisplayer(
        data: any[],
        pageSize: number = 10,
        on_card_clicked?: (data: any) => void,
        on_more_ops_clicked?: (data: any, label: string) => void,
        menuOptions?: { label: string }[],
    ) {
        const ldCtrl = new ListDisplayerCtrl();
        const listDisplayer = ListDisplayer();
        ldCtrl.paginationCtrl.model.pageSize = pageSize;
        ldCtrl.set_comp(listDisplayer);
        ldCtrl.set_data(data);
        if (on_card_clicked) {
            ldCtrl.on_card_clicked = on_card_clicked;
        }
        if (on_more_ops_clicked) {
            ldCtrl.on_more_ops_clicked = on_more_ops_clicked;
        }
        if (menuOptions) {
            ldCtrl.contextMenuOptions = menuOptions;
        }
        ldCtrl.setup();
        ldCtrl.update();
        return ldCtrl;
    }
    static pagination(pageSize: number = 10) {
        const paginationCtrl = new PaginationCtrl();
        const pagination = Pagination();
        paginationCtrl.set_comp(pagination);
        paginationCtrl.model.pageSize = pageSize;
        paginationCtrl.setup();
        return paginationCtrl;
    }
}
