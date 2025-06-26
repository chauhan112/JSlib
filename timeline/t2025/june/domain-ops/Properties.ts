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

export const Properties = (root?: any) => {
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

    const renderValues = (keysVals: { key: string; value: string }[]) => {
        const data = keysVals.map((kv: { key: string; value: string }) => [
            kv.key,
            kv.value,
        ]);
        table.s.addRows(data);
    };

    const show = () => {
        let model = root?.model;
        const space = root?.getCurrentSpace();
        if (!space) return;
        let vals = model.properties.readAll(space);
        renderValues(vals);
        comp.getElement().classList.remove("hidden");
    };
    const hide = () => {
        comp.getElement().classList.add("hidden");
    };

    const isShowing = () => !comp.getElement().classList.contains("hidden");

    header.s.plus.update(
        {},
        {
            click: (e: any, ls: any) => {
                let modal = GlobalStates.getInstance().getState("modal");
                modal.s.modalTitle.update({ textContent: "Create Attribute" });
                modal.s.handlers.display(form);
                modal.s.handlers.show();
                form.s.comps.okBtn.update({}, { click: onCreateSubmit });
                form.clearValues();
            },
        }
    );

    const onEdit = (e: any, ls: any) => {
        let item = ls.s.data;
        let model = root?.model;
        const space = root?.getCurrentSpace();
        if (!space) return;
        let value = model.properties.read(space, item.key);
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
        form.s.comps.okBtn.update({}, { click: onEditSubmit });
    };
    const onDelete = (e: any, ls: any) => {
        let item = ls.s.data;
        let model = root?.model;
        const space = root?.getCurrentSpace();
        if (!space) return;
        if (
            confirm(
                "Are you sure you want to delete the attribute " +
                    item.key +
                    "?"
            )
        ) {
            model.properties.delete(space, item.key);
            renderValues(model.properties.readAll(space));
        }
    };
    const runChanges = (
        func: (
            model: Model,
            space: string[],
            vals: { key: string; value: any }
        ) => void
    ) => {
        let model: Model = root?.model;
        const space = root?.getCurrentSpace();
        if (!space) return;
        let vals = form.getValues();
        if (vals.type == "json") vals.value = JSON.parse(vals.value);
        func(model, space, vals);
        form.clearValues();
        let modal = GlobalStates.getInstance().getState("modal");
        modal.s.handlers.close();
        renderValues(model.properties.readAll(space));
    };
    const onEditSubmit = (e: any, ls: any) => {
        e.preventDefault();
        runChanges((model, space, vals) =>
            model.properties.update(space, vals.key, vals.value)
        );
    };

    const handlers: any = { edit: onEdit, delete: onDelete };

    table.s.onHandlers.onIconClicked = (e: any, ls: any) => {
        let item = ls.s.data;
        handlers[item.type](e, ls);
    };

    const onCreateSubmit = (e: any, ls: any) => {
        e.preventDefault();
        runChanges((model, space, vals) =>
            model.properties.create(space, vals.key, vals.value)
        );
    };

    comp.update(
        {},
        {},
        {
            comps: { header, table, form, tableWrapper },
            renderValues,
            show,
            hide,
            isShowing,
            handlers,
        }
    );

    return comp;
};

const Header = () => {
    return Tools.div({
        class: "flex bg-slate-700 gap-2 font-bold items-center w-80  border-white border-b",
        children: [
            Tools.div({
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
