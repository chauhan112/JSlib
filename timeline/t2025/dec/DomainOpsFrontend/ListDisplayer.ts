import { Tools } from "../../april/tools";
import {MainCtrl as CardCompMainCtrl} from "./Component";
import { Pagination } from "../../july/generic-crud/page";


export const ListDisplayer = () => {
    const cardCompCtrl = CardCompMainCtrl.cardComp({title: "Test"});
    const pagination = Pagination();
    let list = Tools.comp("ul", {
        class: "flex gap-2 w-full",
        children: [cardCompCtrl.comp],
    });
    return Tools.div({
        class: "flex flex-col w-full items-start gap-4",
        children: [pagination, list],
    }, {}, { cardCompCtrl });
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