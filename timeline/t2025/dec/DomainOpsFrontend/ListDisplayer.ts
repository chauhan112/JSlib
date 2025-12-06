import { Tools } from "../../april/tools";
import {CardCompCtrl, MainCtrl as CardCompMainCtrl} from "./Component";
import { Pagination } from "../../july/generic-crud/page";


export const ListDisplayer = () => {
    const pagination = Pagination();
    let list = Tools.comp("ul", {
        class: "flex flex-col gap-2 w-full",
        children: [],
    });
    return Tools.div({
        class: "flex flex-col w-full items-start gap-4",
        children: [pagination, list],
    }, {}, { list, pagination });
}
export class PaginationModel {
    data: any[] = [];
    pageSize: number = 10;
    currentPage: number = 1;
    maxPage: number = 1;
    getCurrentPageData() {
        return this.data.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
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
    update: () => void = () => {this.default_update();};
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
        this.comp.s.page.update({ textContent: `${this.model.currentPage}/${this.model.maxPage}` });
    }
    setup() {
        this.comp.s.next.update({}, { click: () => { this.model.nextPage(); this.update(); } });
        this.comp.s.prev.update({}, { click: () => { this.model.prevPage(); this.update(); } });
    }
}
export class ListDisplayerCtrl {
    comp: any;
    contextMenuOptions: { label: string; }[] = [ {label: "Edit"}, {label: "Delete"}, {label: "View"} ];
    set_comp(comp: any) {
        this.comp = comp;
    }
    set_data(data: any[]) {}
}

export class MainCtrl {
    static listDisplayer() {
        const listDisplayerCtrl = new ListDisplayerCtrl();
        const listDisplayer = ListDisplayer();
        listDisplayerCtrl.set_comp(listDisplayer);
        return listDisplayerCtrl;
    }
    static contextMenuOptionMaker(label: string, info: any, onClick: (e: any, ls: any) => void) {
        return { label, info, onClick };
    }
}