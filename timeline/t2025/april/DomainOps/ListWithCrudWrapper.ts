import { ListWithCrud } from "../ListWithCrud";
import { Tools } from "../../../globalComps/tools";

export class ListWithCrudWrapper {
    list: ListWithCrud;
    typ: string;
    s: { [key: string]: any } = {};
    constructor(typ: string, root: any) {
        this.typ = typ;
        this.list = new ListWithCrud();
        this.list.s.funcs.createItem = this.createItem.bind(this);
        this.s.funcs = {
            itemClick: this.itemClick.bind(this),
        };
        this.s.root = root;
    }
    itemClick(e: any, ls: any) {
        this.s.root.propertySection.s.currentInfo = {
            data: ls.s.data,
            typ: this.typ,
        };
        this.s.root.s.comps.content.comp.s.header.s.title.s.activityName.update(
            {
                textContent: ls.s.data.name,
            }
        );
        console.log(this.s.root.propertySection.s.currentInfo);
        this.s.root.propertySection.fetchProperties();
        this.s.root.propertySection.show();
    }
    createItem(item: any) {
        return Tools.div({
            class: "w-full flex items-center justify-between ",
            children: [
                Tools.comp(
                    "button",
                    {
                        textContent: item.name,
                        class: "cursor-pointer flex-1 rounded-md text-left",
                    },
                    {
                        click: (e: any, ls: any) => {
                            this.s.funcs.itemClick(e, ls);
                        },
                    },
                    { data: item }
                ),
                Tools.div({
                    class: "w-fit flex items-center justify-between",
                    children: this.list.s.funcs.operationsMaker(item),
                }),
            ],
        });
    }
}
