import { Tools } from "../tools";

import { create, readAll, deleteItem, updateName } from "./apis";
import { GComponent } from "../GComponent";
import { GForm } from "../GForm";
import { ListWithCrud } from "../ListWithCrud";
import { DocumentHandler } from "../Array";

export class Section {
    form: any = null;
    list: any = null;
    typ: string = "";
    content: GComponent | null = null;
    plusIcon: GComponent | null = null;
    funcs: any = null;
    endpoint: string = "update_name";
    constructor(typ: string, form: GForm, docHandler?: DocumentHandler) {
        this.typ = typ;
        this.form = form;
        this.list = new ListWithCrud();
        if (docHandler) {
            this.list.docHandler = docHandler;
        } else {
            this.list.docHandler = new DocumentHandler();
        }
        this.list.getElement();
        this.list.s.funcs.contextMenuClick = this.onContextMenuClick.bind(this);
        this.content = this.makeContent();
        this.funcs = {
            updateNameData: (val: any) => val.domain,
            createInfoData: (val: any) => val.domain,
            valuesForFormData: (val: any) => {
                return { domain: val.name };
            },
            onEditSubmit: this.onEditSubmit.bind(this),
        };
    }

    makeContent() {
        return Tools.div({
            class: "w-full h-full",
            children: [Tools.container({ key: "formArea" }), this.list],
        });
    }
    fillList() {
        readAll([], this.typ).then((res: any) => {
            let domains = res.data.map((item: any) => {
                return { name: item[1], key: item[0] };
            });
            this.list.setData(domains);
        });
    }
    onEditSubmit(e: any, s: any) {
        e.preventDefault();
        if (s.values.domain !== this.form.s.currentData.name) {
            updateName(
                this.form.s.currentData.key,
                [],
                this.funcs.updateNameData(s.values),
                this.typ
            ).then((res: any) => {
                this.fillList();
                s.form.clearValues();
                this.content!.s.formArea.clear();
            });
        } else {
            s.form.clearValues();
            this.content!.s.formArea.clear();
        }
    }
    onSubmitForCreate(e: any, s: any) {
        e.preventDefault();
        create(this.funcs.createInfoData(s.values), [], this.typ).then(
            (res: any) => {
                this.plusIcon!.getElement().dispatchEvent(new Event("click"));
                s.form.clearValues();
                this.fillList();
            }
        );
    }
    onContextMenuClick(e: any, s: any) {
        if (s.item.name === "Delete") {
            if (confirm(`Are you sure you want to delete this ${this.typ}?`)) {
                deleteItem(s.data.key, [], this.typ).then((res: any) => {
                    this.fillList();
                });
            }
        } else if (s.item.name === "Edit") {
            this.content!.s.formArea.display(this.form);
            this.form.s.funcs.onSubmit = this.funcs.onEditSubmit;
            this.form.s.currentData = s.data;
            this.form.setValues(this.funcs.valuesForFormData(s.data));
        }
    }
}
