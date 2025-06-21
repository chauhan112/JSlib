import {
    ChevronLeft,
    EllipsisVertical,
    LogIn,
    PencilLine,
    Plus,
    Trash,
} from "lucide";
import { Tools } from "../../april/tools";
import { AppLogoSVG } from "./Logo";
import { SearchComponent } from "../../may/FileSearch/Search";
import { GComponent, IComponent } from "../../april/GComponent";
import { Model } from "./Model";
import "./newdesign.css";
import { ContextMenu } from "./ContextMenu";

let model = new Model();
let contextMenu = ContextMenu([
    { label: "Edit" },
    { label: "Delete" },
    { label: "Copy" },
    { label: "Paste" },
    { label: "Cut" },
    { label: "Select All" },
]);

export const CardComponentWrapper = (comp: GComponent) => {
    const lay = Tools.div({
        class: "w-fit bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center h-[fit-content]",
    });
    const display = (comp: GComponent) => {
        lay.update({
            innerHTML: "",
            child: comp,
        });
    };
    display(comp);
    lay.s.display = display;
    return lay;
};
export const NewDesign = () => {
    const header = Header();
    header.s.closeLeftSideBarIcon.update(
        {},
        {
            click: () => {
                mainBody.s.nav.getElement().classList.toggle("hidden");
                header.s.closeLeftSideBarIcon
                    .getElement()
                    .classList.toggle("rotate-180");
            },
        }
    );
    header.s.closePropertiesSideBarIcon.update(
        {},
        {
            click: () => {
                mainBody.s.right.getElement().classList.toggle("hidden");
                header.s.closePropertiesSideBarIcon
                    .getElement()
                    .classList.toggle("rotate-180");
            },
        }
    );
    const mainBody = MainBody();
    console.log(mainBody);
    return Tools.div({
        class: "h-screen flex flex-col",
        children: [header, mainBody],
    });
};
export const Header = () => {
    const { svg } = AppLogoSVG();
    svg.update({ class: "w-[2.6rem] ml-4" });
    const closeLeftSideBarIcon = Tools.icon(ChevronLeft, {
        class: "w-8 h-8 absolute left-0 cursor-pointer",
    });
    const closePropertiesSideBarIcon = Tools.icon(ChevronLeft, {
        class: "w-8 h-8 absolute right-0 rotate-180 cursor-pointer",
    });
    return Tools.div(
        {
            class: "flex items-center justify-between px-4 bg-[#F5C85F]",
            children: [
                Tools.div({
                    class: "m-2 flex items-center gap-4 ",
                    children: [closeLeftSideBarIcon, svg],
                }),
                Tools.div({
                    class: "text-xl font-bold",
                    textContent: "Domain Ops Logger",
                }),
                Tools.div({
                    class: "m-2 flex items-center gap-4 pr-4",
                    child: closePropertiesSideBarIcon,
                }),
            ],
        },
        {},
        { closeLeftSideBarIcon, closePropertiesSideBarIcon }
    );
};
export const SmallCRUDops = (ops: any[], form: GComponent) => {
    form.getElement().classList.add("hidden");

    const onMainBodyClick = (e: any, ls: any) => {
        console.log(ls);
    };
    const onMenuOptionClick = (e: any, ls: any) => {
        console.log(e);
        contextMenu.s.displayMenu(e, ls);
    };
    let state = {
        onMainBodyClick,
        onMenuOptionClick,
    };
    const navItem = Tools.div({
        class: "w-full flex flex-col items-center px-2 gap-2",
        key: "navItems",
        children: ops.map((item: any) =>
            NavChild({
                ...item,
                onMainBodyClick: (e: any, ls: any) => {
                    state.onMainBodyClick(e, ls);
                },
                onMenuOptionClick: (e: any, ls: any) => {
                    state.onMenuOptionClick(e, ls);
                },
            })
        ),
    });
    const updateNavItems = (items: any[]) => {
        navItem.update({
            innerHTML: "",
            children: items.map((item: any) =>
                NavChild({
                    ...item,
                    onMainBodyClick: (e: any, ls: any) => {
                        onMainBodyClick(e, ls);
                    },
                    onMenuOptionClick: (e: any, ls: any) => {
                        onMenuOptionClick(e, ls);
                    },
                })
            ),
        });
    };
    return Tools.div(
        {
            class: "w-full",
            children: [
                Tools.comp(
                    "button",
                    {
                        textContent: "+ create new",
                        class: "text-2xl w-full flex items-center justify-center py-4 hover:border cursor-pointer",
                    },
                    {
                        click: (e: any, ls: any) => {
                            form.getElement().classList.toggle("hidden");
                        },
                    }
                ),
                form,
                navItem,
            ],
        },
        {},
        { updateNavItems, state }
    );
};
export const Navigation = () => {
    const createForm = DomainOpsForm();
    createForm.update(
        {},
        {
            submit: (e: any, ls: any) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const name = formData.get("name") as string;
                const curKey = tabComp.s.getCurrentKey();
                if (curKey === "Domains") {
                    model.domain.create([], name);
                } else if (curKey === "Operations") {
                    model.operations.create([], name);
                }
                (createForm.getElement() as HTMLFormElement).reset();
                createForm.getElement().classList.add("hidden");
                updateNavItems();
            },
        }
    );
    const tabComp = TabComponent([
        { label: "Domains" },
        { label: "Operations" },
    ]);

    const updateNavItems = () => {
        const curKey = tabComp.s.getCurrentKey();
        if (curKey === "Domains") {
            domCrud.s.updateNavItems(model.domain.readNameAndId([]));
        } else if (curKey === "Operations") {
            domCrud.s.updateNavItems(model.operations.readNameAndId([]));
        }
    };

    const domCrud = SmallCRUDops([], createForm);
    updateNavItems();

    tabComp.s.setOnTabClick((e: any, ls: any) => {
        tabComp.s.onTabClick(e, ls);
        updateNavItems();
    });

    return Tools.div({
        class: "flex flex-col items-center min-w-[10rem] w-2/12 bg-[#1ABC9C] h-full",

        key: "nav",
        children: [
            Tools.div({
                class: "w-full flex justify-between flex-wrap",
                children: [tabComp, domCrud],
            }),
        ],
    });
};
export const MainBody = () => {
    return Tools.div({
        key: "body",
        class: "flex-1 flex items-center justify-center",
        children: [Navigation(), BodyContent(), Properties(), contextMenu],
    });
};
export const BodyContent = () => {
    return Tools.div({
        class: "flex flex-col items-center flex-1 h-full ",
        key: "contentArea",
        children: [
            Tools.div({
                class: "w-full flex flex-col px-2 border-gray-300",
                children: [
                    Tools.comp("span", {
                        textContent: "Properties/Domains/Operations",
                    }),
                    Tools.div({
                        class: "flex items-center justify-between gap-2 mt-2",
                        children: [
                            Tools.icon(Plus, {
                                class: "w-12 h-12 cursor-pointer hover:bg-gray-200",
                            }),
                            SearchComponent(),
                        ],
                    }),
                    Tools.div({
                        class: "flex flex-wrap gap-2 mt-2 bg-gray-200 p-2 rounded-lg h-full flex-1",
                        children: [
                            CardComponentWrapper(ActivityComponent()),
                            CardComponentWrapper(ActivityComponent()),
                        ],
                    }),
                ],
            }),
        ],
    });
};
export const Properties = () => {
    const crudOps = SmallCRUDops(
        [
            { name: "key-value", id: "key1" },
            { name: "key2-value", id: "key2" },
        ],
        Tools.comp("form", {
            class: "w-full flex flex-col items-center justify-center py-2",
            children: [
                Tools.comp("input", {
                    class: "w-full bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500",
                    type: "text",
                    placeholder: "key",
                    name: "key",
                }),
                Tools.comp("input", {
                    class: "w-full bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500",
                    type: "text",
                    placeholder: "value",
                    name: "value",
                }),
                Tools.comp("input", {
                    class: "w-full bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500",
                    type: "submit",
                }),
            ],
        })
    );
    const lay = Tools.div({
        class: "flex flex-col items-center w-2/12 bg-[#1ABC9C] h-full",
        key: "right",
        children: [
            Tools.div({
                class: "bg-slate-700 py-2 text-xl font-bold border-white border-b w-full text-center text-white",
                textContent: "Properties",
            }),
            crudOps,
        ],
    });
    crudOps.getElement();
    return lay;
};
export const NavChild = ({
    name,
    id,
    ...props
}: {
    name: string;
    id: string;
    [key: string]: any;
}) => {
    return Tools.div({
        class: "w-full flex items-center justify-between",
        children: [
            Tools.div(
                {
                    textContent: name,
                    class: "text-white flex-1 text-center py-1 cursor-pointer hover:bg-gray-200 hover:text-black",
                },
                {
                    click: props.onMainBodyClick,
                },
                { data: id, props: props }
            ),
            Tools.div({
                class: "w-fit flex items-center justify-between",
                children: [
                    Tools.icon(
                        EllipsisVertical,
                        {
                            class: "w-8 h-8 cursor-pointer hover:border border-yellow-500",
                        },
                        { click: props.onMenuOptionClick },
                        { data: id, props: props }
                    ),
                ],
            }),
        ],
    });
};
export const ActivityComponent = () => {
    const opsContainer = Tools.div({
        class: "flex flex-col hidden w-full absolute bottom-0 right-0 flex items-center gap-2 z-10 bg-gray-200 transparent h-2/3 items-center justify-around",
        children: [
            Tools.comp("button", {
                class: "flex items-center justify-center w-full cursor-pointer hover:border border-green-500  py-2",
                child: Tools.icon(LogIn),
            }),
            Tools.div({
                class: "flex items-center gap-4",
                children: [
                    Tools.comp("button", {
                        class: "flex items-center justify-center cursor-pointer hover:border border-yellow-500 w-full p-1",
                        child: Tools.icon(PencilLine),
                    }),

                    Tools.comp("button", {
                        class: "flex items-center justify-center cursor-pointer hover:border border-yellow-500 w-full p-1",
                        child: Tools.icon(Trash),
                    }),
                    Tools.comp("button", {
                        class: "flex items-center justify-center cursor-pointer hover:border border-yellow-500 w-full p-1",
                        child: Tools.icon(EllipsisVertical),
                    }),
                ],
            }),
        ],
    });

    return Tools.div(
        {
            class: "flex flex-col gap-2 relative",
            children: [
                Tools.comp("h1", {
                    textContent: "Activity Name",
                    class: "font-bold text-lg",
                }),
                Tools.comp("h3", {
                    textContent: "renamed version of activity",
                }),
                Tools.comp("p", {
                    textContent: "operation",
                    class: "font-bold text-sm text-green-500 flex ",
                }), // tag
                Tools.comp("ul", {
                    class: "flex flex-wrap gap-2",
                    children: [
                        Tools.comp("li", {
                            textContent: "domain1",
                            class: "font-bold text-sm text-blue-500 ",
                        }),
                        Tools.comp("li", {
                            textContent: "domain2",
                            class: "font-bold text-sm text-blue-500 ",
                        }),
                    ],
                }),

                opsContainer,
            ],
        },
        {
            mouseenter: () => {
                opsContainer.getElement().classList.remove("hidden");
            },
            mouseleave: () => {
                opsContainer.getElement().classList.add("hidden");
            },
        }
    );
};
export const DivWrapper = (children: IComponent[], ...props: any) => {
    return Tools.div({
        children: children,
        ...props,
    });
};
export const DomainOpsForm = () => {
    return Tools.comp("form", {
        class: "w-full flex flex-col items-center justify-center py-2 hidden",
        children: [
            Tools.comp("input", {
                class: "w-full bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500",
                type: "text",
                placeholder: "enter name",
                name: "name",
            }),
            Tools.comp("input", {
                class: "w-full bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500",
                type: "submit",
            }),
        ],
    });
};

export const TabComponent = (ops: { label: string; info?: any }[]) => {
    let currentButton: GComponent | null = null;
    let onTabClick = (e: any, ls: any) => {
        e.target.classList.add("tab-selected");
        e.target.classList.remove("tab-unselected");
        if (currentButton) {
            currentButton.getElement().classList.remove("tab-selected");
            currentButton.getElement().classList.add("tab-unselected");
        }

        currentButton = ls;
    };
    const children = ops.map((op) => {
        return Tools.comp(
            "button",
            {
                textContent: op.label,
                class: "hover:bg-white px-4 py-2 flex-1 border border-dashed cursor-pointer tab-unselected",
            },
            {
                click: (e: any, ls: any) => {
                    onTabClick(e, ls);
                    if (ls.info) {
                        console.log(ls.info); // Handle the info as needed
                    }
                },
            },
            { info: op.info, label: op.label }
        );
    });
    const getCurrentKey = () => {
        return currentButton
            ? (currentButton.getElement() as HTMLButtonElement).textContent
            : "";
    };

    const setOnTabClick = (callback: (e: any, ls: any) => void) => {
        onTabClick = callback;
    };

    const tabContainer = Tools.div(
        {
            class: "flex items-center justify-between w-full p-2 ",
            children,
        },
        {},
        { getCurrentKey, onTabClick, setOnTabClick }
    );

    if (ops.length > 0) {
        (children[0].getElement() as HTMLButtonElement).click(); // Simulate click on the first tab
    }
    return tabContainer;
};
