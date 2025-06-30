import { Tools } from "../../april/tools";
import {
    AttributeForm,
    PropertySection,
} from "../../april/DomainOps/PropertySection";
import { IconNode, Pencil, Plus, Trash } from "lucide";
import { GlobalStates } from "./GlobalStates";
import { Model } from "./Model";

export const Table = (headers: string[], includeActions: boolean = true) => {
    const comp = Tools.comp("table", {
        class: "w-full text-left",
    });
    const createHeader = (headers: string[]) => {
        const hrows = headers.map((col: any) =>
            Tools.comp("th", { textContent: col })
        );
        if (includeActions) {
            hrows.push(Tools.comp("th", { textContent: "Actions" }));
        }
        return Tools.comp("tr", {
            key: "header",
            class: "text-gray-500",
            children: hrows,
        });
    };
    const createRow = (keyId: string, data: string[]) => {
        const rows = data.map((col: any) =>
            Tools.comp("td", { textContent: col })
        );
        if (includeActions) {
            rows.push(Tools.comp("td", { child: opsRows(keyId) }));
        }
        return Tools.comp("tr", { children: rows });
    };
    const addRows = (data: string[][]) => {
        const rows = data.map((row: string[]) => createRow(row[0], row));
        comp.update({ innerHTML: "", child: headerTh, children: rows });
    };
    const opsRows = (keyId: string) => {
        const OpsIcon = (icon: IconNode, key: any) => {
            return Tools.icon(
                icon,
                { class: "hover:cursor-pointer w-4 h-4" },
                { click: (e: any, ls: any) => onHandlers.onIconClicked(e, ls) },
                { data: key }
            );
        };
        return Tools.div({
            class: "flex gap-2",
            children: [
                OpsIcon(Pencil, { key: keyId, type: "edit" }),
                OpsIcon(Trash, { key: keyId, type: "delete" }),
            ],
        });
    };
    const onIconClicked = (e: any, ls: any) => {
        console.log(ls.s.data);
    };
    const onHandlers = {
        onIconClicked,
    };
    const headerTh = createHeader(headers);
    comp.update(
        { child: headerTh },
        {},
        {
            createHeader,
            createRow,
            addRows,
            onHandlers,
        }
    );
    return comp;
};

export class PropertiesCtrl {
    inst: any;
    model!: Model;
    constructor(states: any) {
        this.inst = states;
    }
    setModel(model: Model) {
        this.model = model;
    }
    renderValues(keysVals: { key: string; value: string }[]) {
        let table = this.inst.table;

        const data = keysVals.map((kv: { key: string; value: string }) => [
            kv.key,
            kv.value,
        ]);
        table.s.addRows(data);
    }
    show() {
        const space = this.getCurrentSpace();
        if (!space) return;
        let vals = this.model.properties.readAll(space);
        this.renderValues(vals);
        this.inst.comp.getElement().classList.remove("hidden");
    }
    hide() {
        this.inst.comp.getElement().classList.add("hidden");
    }
    getCurrentSpace() {
        return this.inst.states.getCurrentSpace();
    }
    isShowing() {
        return !this.inst.comp.getElement().classList.contains("hidden");
    }
    onPlusClicked(e: any, ls: any) {
        let form = this.inst.form;
        let modal = GlobalStates.getInstance().getState("modal");
        modal.s.modalTitle.update({ textContent: "Create Attribute" });
        modal.s.handlers.display(form);
        modal.s.handlers.show();
        form.s.comps.okBtn.update(
            {},
            { click: this.onCreateSubmit.bind(this) }
        );
        form.clearValues();
    }
    onCreateSubmit(e: any, ls: any) {
        e.preventDefault();
        this.runChanges((space, vals) =>
            this.model.properties.create(space, vals.key, vals.value)
        );
    }
    runChanges(
        func: (space: string[], vals: { key: string; value: any }) => void
    ) {
        let model: Model = this.model;
        let form = this.inst.form;
        const space = this.getCurrentSpace();
        if (!space) return;
        let vals = form.getValues();
        if (vals.type == "json") vals.value = JSON.parse(vals.value);
        func(space, vals);
        form.clearValues();
        let modal = GlobalStates.getInstance().getState("modal");
        modal.s.handlers.close();
        this.renderValues(model.properties.readAll(space));
    }
    onEdit(e: any, ls: any) {
        let form = this.inst.form;
        let item = ls.s.data;
        const space = this.getCurrentSpace();
        if (!space) return;
        let value = this.model.properties.read(space, item.key);
        let type = "string";
        if (typeof value != "string") {
            type = "json";
        }

        form.setValues({
            key: item.key,
            type: type,
            value: type == "string" ? value : JSON.stringify(value),
        });
        let modal = GlobalStates.getInstance().getState("modal");
        modal.s.modalTitle.update({ textContent: "Update Attribute" });
        modal.s.handlers.display(form);
        modal.s.handlers.show();
        form.s.comps.okBtn.update({}, { click: this.onEditSubmit.bind(this) });
    }
    onEditSubmit(e: any, ls: any) {
        e.preventDefault();
        this.runChanges((space, vals) =>
            this.model.properties.update(space, vals.key, vals.value)
        );
    }
    onDelete(e: any, ls: any) {
        let item = ls.s.data;

        const space = this.getCurrentSpace();
        if (!space) return;
        if (
            confirm(
                "Are you sure you want to delete the attribute " +
                    item.key +
                    "?"
            )
        ) {
            this.model.properties.delete(space, item.key);
            this.renderValues(this.model.properties.readAll(space));
        }
    }
    setup() {
        this.inst.header.s.plus.update(
            {},
            {
                click: this.onPlusClicked.bind(this),
            }
        );

        this.inst.handlers = {
            edit: this.onEdit.bind(this),
            delete: this.onDelete.bind(this),
        };

        this.inst.table.s.onHandlers.onIconClicked = (e: any, ls: any) => {
            let item = ls.s.data;
            this.inst.handlers[item.type](e, ls);
        };
    }
}
export const Properties = () => {
    const props = new PropertySection();
    props.getElement();
    const header = Header();
    const table = Table(["Key", "Value"]);
    const tableWrapper = Tools.div({
        class: "p-2 w-full text-white",
        child: table,
    });

    const form = new AttributeForm();
    form.getElement();
    let comp = Tools.div({
        class: "flex flex-col items-center w-fit bg-[#1ABC9C] h-full",
        children: [header, tableWrapper],
    });
    form.s.comps.closeBtn.getElement().classList.add("hidden");

    const ctrl = new PropertiesCtrl({ comp, table, form, header });
    comp.update(
        {},
        {},
        {
            comps: { header, table, form, tableWrapper },
            ctrl,
        }
    );

    return comp;
};

export const FlexTable = (
    headers: string[],
    includeActions: boolean = true
) => {
    const handlers = { actions: (e: any, ls: any) => {} };
    const createRow = (id: string, vals: string[]) => {
        const children = vals.map((c: string) =>
            Tools.comp(
                "div",
                { class: "flex-1 truncate", textContent: c },
                {},
                { id: id }
            )
        );
        if (includeActions) {
            children.push(action(id, [Pencil, Trash]));
        }
        return Tools.comp("div", {
            class: "flex items-center gap-4 py-2",
            children: children,
        });
    };
    const action = (keyId: string, actions: IconNode[]) => {
        return Tools.comp("div", {
            class: "flex items-center justify-start w-20 gap-5",
            children: actions.map((c: any) =>
                Tools.icon(
                    c,
                    { class: "w-4 h-4" },
                    {
                        click: (e: any, ls: any) => handlers.actions(e, ls),
                    },
                    { id: keyId }
                )
            ),
        });
    };
    const createHeader = (headers: string[]) => {
        const hrows = headers.map((col: any) =>
            Tools.comp("div", {
                class: "flex-1",
                textContent: col,
            })
        );
        if (includeActions) {
            hrows.push(
                Tools.comp("div", {
                    class: "w-20 text-left",
                    textContent: "Actions",
                })
            );
        }
        return Tools.comp("tr", {
            key: "header",
            class: "text-gray-500",
            children: hrows,
        });
    };
    const setData = (data: { id: string; vals: string[] }[]) => {
        dataSection.update({
            innerHTML: "",
            children: data.map((c: any) => createRow(c.id, c.vals)),
        });
    };
    const dataSection = Tools.comp("div", {
        class: "space-y-2 text-white",
    });
    const comp = Tools.comp(
        "table",
        {
            class: "w-full text-left",
            children: [createHeader(headers), dataSection],
        },
        {},
        { dataSection, handlers, createRow, createHeader, setData, action }
    );

    return comp;
};

export const Header = () => {
    return Tools.comp("header", {
        class: "flex bg-slate-700 gap-2 font-bold items-center w-80  border-white border-b",
        children: [
            Tools.div({
                key: "title",
                class: "bg-slate-700 py-2 text-xl font-bold w-full text-center text-white",
                textContent: "Properties",
            }),
            Tools.icon(Plus, {
                key: "plus",
                class: " text-white hover:text-gray-300 cursor-pointer w-8 h-8 mr-2",
            }),
        ],
    });
};

export const Section = () => {
    const header = Header();

    const body = Tools.div({
        class: "p-2 w-full text-white h-full",
    });

    return Tools.div(
        {
            class: "flex flex-col items-center w-fit bg-[#1ABC9C] h-full",
            children: [header, body],
        },
        {},
        { header, body }
    );
};
