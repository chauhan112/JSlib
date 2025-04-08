import { read, createLogger, readAll, deleteItem, updateLogger } from "./apis";
import { DocumentHandler } from "../Array";
import { GComponent } from "../GComponent";
import { GForm } from "../GForm";
import { ListWithCrud } from "../ListWithCrud";
import { Tools } from "../tools";
import { ListWithCrudWrapper } from "./ListWithCrudWrapper";

export class ActivitiesContent {
    form: GForm;
    content: GComponent;
    comps: { [key: string]: any } = {};
    list: ListWithCrud;
    docHandler: DocumentHandler;
    typ: string = "logger";
    more: any = {};
    listWrapper: ListWithCrudWrapper;
    s: { [key: string]: any } = {};
    constructor(root?: any, docHandler?: DocumentHandler) {
        let rootComponent = root || this;
        this.docHandler = docHandler || new DocumentHandler();
        this.form = this.makeForm();
        this.listWrapper = new ListWithCrudWrapper(this.typ, rootComponent);
        this.list = this.listWrapper.list;
        this.list.docHandler = this.docHandler;
        this.list.s.funcs.contextMenuClick = this.onContextMenuClick.bind(this);
        this.list.getElement();
        this.content = this.makeContent();
        this.more.plusIcon = null;
        this.s.root = rootComponent;
    }
    makeForm() {
        const form = new GForm();
        form.s.funcs.createItem = (comp: any) => comp.comp;
        this.comps.operation = Tools.dropdown([]);
        this.comps.domains = Tools.multiSelect([], "Select domains...");
        form.s.data = [
            {
                key: "activityName",
                comp: Tools.input({
                    key: "activityName",
                    placeholder: "Enter activity name",
                    class: "w-full p-1 rounded-sm bg-gray-100 text-black",
                }),
            },
            {
                key: "operation",
                comp: this.comps.operation,
            },
            {
                key: "domains",
                comp: this.comps.domains,
            },
            {
                comp: Tools.input({
                    type: "submit",
                    textContent: "Submit",
                    class: "w-full p-1 rounded-md bg-blue-500 text-white",
                }),
            },
        ];
        form.getElement();
        return form;
    }
    makeContent() {
        this.comps.formArea = Tools.container({ key: "formArea" });
        const area = Tools.div({
            class: "w-full h-full",
            children: [this.comps.formArea, this.list],
        });
        area.getElement();
        return area;
    }
    setOperations(operations: any[]) {
        this.form.s.data[1].comp.s.options = operations.map((ele: any) => ({
            value: ele.value,
            textContent: ele.textContent,
        }));
    }
    init() {
        readAll([], this.typ).then((res: any) => {
            this.list.setData(
                res.data.map((item: any) => {
                    return { name: item[1], key: item[0] };
                })
            );
        });
    }
    onEditSubmit(e: any, ls: any) {
        e.preventDefault();

        updateLogger(ls.form.s.currentItem.key, [], {
            new_name: ls.values.activityName,
            operation: ls.values.operation,
            domains: ls.values.domains.map((ele: any) => ele.value),
        }).then((res: any) => {
            console.log("updated", res.data);
            this.init();
            this.form.clearValues();
            this.comps.formArea.clear();
        });
    }
    onCreateSubmit(e: any, ls: any) {
        e.preventDefault();
        console.log(ls.values);
        if (ls.values.domains.length > 0 && ls.values.operation) {
            createLogger(
                ls.values.activityName,
                [],
                ls.values.domains.map((ele: any) => ele.value),
                ls.values.operation
            ).then((res: any) => {
                console.log("created", res.data);
                this.init();
                this.form.clearValues();
                if (this.more.plusIcon) {
                    this.more.plusIcon
                        .getElement()
                        .dispatchEvent(new Event("click"));
                }
            });
        }
    }
    onPlusClickShowForm() {
        this.fillFormWithOptions(null).then((res: any) => {
            this.comps.formArea.display(this.form);
            this.form.clearValues();
            this.form.s.funcs.onSubmit = this.onCreateSubmit.bind(this);
        });
    }
    onPlusClickHideForm() {
        this.comps.formArea.clear();
    }
    onContextMenuClick(e: any, ls: any) {
        if (ls.item.name === "Edit") {
            this.onEditContent(e, ls);
        } else if (ls.item.name === "Delete") {
            this.onDeleteContent(e, ls);
        }
    }
    private async fillFormWithOptions(ls: any) {
        if (this.more.domains && this.more.operations) {
            return this.more;
        }
        const domains = await readAll([], "domains");
        const operations = await readAll([], "operations");
        this.comps.domains.setOptions(
            domains.data.map((item: any) => ({
                value: item[0],
                textContent: item[1],
            }))
        );
        this.comps.operation.setOptions(
            operations.data.map((item: any) => ({
                value: item[0],
                textContent: item[1],
            }))
        );

        this.more = {
            ...this.more,
            domains: domains.data,
            operations: operations.data,
        };
        console.log("fetched", this.more);
        return this.more;
    }
    onEditContent(e: any, ls: any) {
        this.fillFormWithOptions(ls).then((res: any) => {
            read(ls.data.key, [], this.typ).then((res: any) => {
                this.form.setValues({
                    activityName: ls.data.name,
                    operation: res.data.operation,
                    domains: res.data.domains.map((ele: any) => ({
                        value: ele,
                    })),
                });
            });
            this.comps.formArea.display(this.form);
            this.form.s.funcs.onSubmit = this.onEditSubmit.bind(this);
            this.form.s.currentItem = ls.data;
        });
    }

    onDeleteContent(e: any, ls: any) {
        if (confirm(`Are you sure you want to delete this ${this.typ}?`)) {
            deleteItem(ls.data.key, [], this.typ).then((res: any) => {
                console.log("deleted", res.data);
                this.init();
            });
        }
    }
}
