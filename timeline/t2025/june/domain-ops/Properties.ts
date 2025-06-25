import { Tools } from "../../april/tools";
import {
    Test,
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
        const OpsIcon = (icon: IconNode, key: string) => {
            return Tools.icon(
                icon,
                { class: "hover:cursor-pointer w-4 h-4" },
                { click: (e: any, ls: any) => onHandlers.onIconClicked(e, ls) },
                { data: key }
            );
        };
        return Tools.div({
            class: "flex gap-2",
            children: [OpsIcon(Pencil, keyId), OpsIcon(Trash, keyId)],
        });
    };
    const onIconClicked = (e: any, ls: any) => {};
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
    const table = Tools.container({
        class: "p-2 w-full text-white",
        child: Test.table(),
    });
    const form = new AttributeForm();
    form.getElement();
    let comp = Tools.div(
        {
            class: "flex flex-col items-center w-fit bg-[#1ABC9C] h-full",
            children: [header, table],
        },
        {},
        { header, table, form }
    );
    form.s.comps.closeBtn.getElement().classList.add("hidden");

    header.s.plus.update(
        {},
        {
            click: (e: any, ls: any) => {
                let modal = GlobalStates.getInstance().getState("modal");
                modal.s.modalTitle.update({ textContent: "Create Attribute" });
                modal.s.handlers.display(form);
                modal.s.handlers.show();
            },
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
