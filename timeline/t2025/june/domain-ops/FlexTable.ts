import { Pencil, Plus, Trash } from "lucide";
import { Tools } from "../../april/tools";

export const TableColumns = {
    three_cols: {
        class: "grid grid-cols-[1fr_2fr_1fr] gap-4",
    },
    four_cols: {
        class: "grid grid-cols-[1fr_1.5fr_.5fr_1fr] gap-4 ",
    },
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

export const FlexTable = (
    headers: string[],
    includeActions: boolean = true
) => {
    const handlers: any = { onOpsClicked: (e: any, ls: any) => {} };
    const states = {
        actionsWrapper: {
            class: "flex items-center justify-start w-20 gap-5",
        },
        actionIcon: {
            class: "w-4 h-4 hover:cursor-pointer hover:scale-110 transition-all duration-300",
        },
        actions: [
            { type: "edit", icon: Pencil },
            { type: "delete", icon: Trash },
        ],
        dataProps: { class: "truncate" },
        dataWrapper: { class: TableColumns.four_cols.class },
    };
    const createRow = (id: string, vals: string[]) => {
        const children = vals.map((c: string) =>
            Tools.comp(
                "div",
                { textContent: c, title: c, ...states.dataProps },
                {},
                { id: id }
            )
        );
        if (includeActions) {
            children.push(handlers.action(id, states.actions));
        }
        let comp = Tools.comp("div", {
            ...states.dataWrapper,
            children: children,
        });

        return comp;
    };
    const action = (keyId: string, actions: any[]) => {
        return Tools.comp("div", {
            children: actions.map((c: any) =>
                Tools.icon(
                    c.icon,
                    states.actionIcon,
                    {
                        click: (e: any, ls: any) =>
                            handlers.onOpsClicked(e, ls),
                    },
                    { id: keyId, data: c }
                )
            ),
            ...states.actionsWrapper,
        });
    };
    const createHeader = (headers: string[]) => {
        const hrows = headers.map((col: any) =>
            Tools.comp("span", {
                class: "flex-1",
                textContent: col,
            })
        );
        if (includeActions) {
            hrows.push(
                Tools.comp("span", {
                    class: "w-20 text-left",
                    textContent: "Actions",
                })
            );
        }
        let comp = Tools.comp("div", {
            children: hrows,
            class: TableColumns.four_cols.class,
        });
        comp.getElement().classList.add("text-gray-500", "font-bold");
        return comp;
    };
    const setData = (data: { id: string; vals: string[] }[]) => {
        dataSection.update({
            innerHTML: "",
            children: data.map((c: any) => createRow(c.id, c.vals)),
        });
    };
    const dataSection = Tools.comp("div", {
        class: "space-y-2 text-white",
        textContent: "No structure found",
    });

    const setHeaders = (headers: string[]) => {
        header.update({
            innerHTML: "",
            child: createHeader(headers),
            class: "",
        });
    };
    const header = createHeader(headers);
    handlers.action = action;
    const comp = Tools.comp(
        "div",
        {
            class: "w-full text-left",
            children: [header, dataSection],
        },
        {},
        {
            header,
            setHeaders,
            dataSection,
            handlers,
            createRow,
            createHeader,
            setData,
            states,
        }
    );

    return comp;
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
