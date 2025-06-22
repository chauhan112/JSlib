import { ChevronLeft, Plus } from "lucide";
import { Tools } from "../../april/tools";
import { AppLogoSVG } from "./Logo";
import { SearchComponent } from "../../may/FileSearch/Search";
import { GComponent } from "../../april/GComponent";
import { Model } from "./Model";

import { ContextMenu } from "./ContextMenu";
import { GenericModal } from "../../may/FileSearch/Modal";
import {
    ActitivityForm,
    TabComponent,
    ActivityComponent,
    NavChild,
} from "./Component";

let model = new Model();
let contextMenu = ContextMenu([
    { label: "Edit" },
    { label: "Delete" },
    { label: "Copy" },
    { label: "Paste" },
    { label: "Cut" },
    { label: "Select All" },
]);
let modal = GenericModal("Activity Create Form");

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

    const onMainBodyClick = (e: any, ls: any) => {};
    const onMenuOptionClick = (e: any, ls: any) => {};
    let state = {
        onMainBodyClick,
        onMenuOptionClick,
    };
    const getNavItem = (item: any) => {
        return NavChild({
            ...item,
            onMainBodyClick: (e: any, ls: any) => {
                state.onMainBodyClick(e, ls);
            },
            onMenuOptionClick: (e: any, ls: any) => {
                state.onMenuOptionClick(e, ls);
            },
        });
    };
    const navItem = Tools.div({
        class: "w-full flex flex-col items-center px-2 gap-2",
        key: "navItems",
        children: ops.map(getNavItem),
    });
    const updateNavItems = (items: any[]) => {
        navItem.update({
            innerHTML: "",
            children: items.map(getNavItem),
        });
    };
    return Tools.div(
        {
            class: "w-full",
            children: [
                Tools.comp("button", {
                    key: "createBtn",
                    textContent: "+ create new",
                    class: "text-2xl w-full flex items-center justify-center py-4 hover:border cursor-pointer",
                }),
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
    const onCreateNew = (e: any, ls: any) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get("name") as string;
        const curKey = tabComp.s.getCurrentKey();
        curKey.s.info.create([], name);
        (createForm.getElement() as HTMLFormElement).reset();
        createForm.getElement().classList.add("hidden");
        updateNavItems();
    };
    const onEdit = (e: any, ls: any) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get("name") as string;
        const curKey = tabComp.s.getCurrentKey();
        curKey.s.info.updateName([], createForm.s.info.id, name);
        (createForm.getElement() as HTMLFormElement).reset();
        createForm.getElement().classList.add("hidden");
        updateNavItems();
    };

    const tabComp = TabComponent([
        { label: "Domains", info: model.domain },
        { label: "Operations", info: model.operations },
    ]);

    const updateNavItems = () => {
        const curKey = tabComp.s.getCurrentKey();
        domCrud.s.updateNavItems(curKey.s.info.readNameAndId([]));
    };

    const domCrud = SmallCRUDops([], createForm);
    updateNavItems();
    domCrud.s.createBtn.update(
        {},
        {
            click: (e: any, ls: any) => {
                createForm.getElement().classList.toggle("hidden");
                createForm.update(
                    {},
                    {
                        submit: onCreateNew,
                    }
                );
                (createForm.getElement() as HTMLFormElement).reset();
            },
        }
    );

    domCrud.s.state.onMenuOptionClick = (e: any, ls: any) => {
        contextMenu.s.setOptions([
            { label: "Edit", info: ls.s.data },
            { label: "Delete", info: ls.s.data },
        ]);
        let curKey = tabComp.s.getCurrentKey();
        contextMenu.s.state.onMenuItemClick = (e: any, ls: any) => {
            let item = ls.s.data;
            if (item.label === "Edit") {
                console.log("Delete", item.info);
                createForm.getElement().classList.remove("hidden");
                createForm.s.setFormValues({ name: item.info.name });
                createForm.update(
                    {},
                    {
                        submit: onEdit,
                    },
                    {
                        info: item.info,
                    }
                );
            } else if (item.label === "Delete") {
                curKey.s.info.delete(item.info.id, []);
                updateNavItems();
            }
        };
        contextMenu.s.displayMenu(e, ls);
    };

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
        children: [
            Navigation(),
            BodyContent(),
            Properties(),
            contextMenu,
            modal,
        ],
    });
};
export const BodyContent = () => {
    const getActivityComponent = (
        op: { name: string; id: string },
        doms: { name: string; id: string }[]
    ) => {
        return CardComponentWrapper(ActivityComponent({ op, doms }));
    };
    let listDisplayer = Tools.div({
        class: "flex flex-wrap gap-2 mt-2 bg-gray-200 p-2 rounded-lg h-full flex-1",
        textContent: "no activities yet",
    });

    let res = model.activity.readAll([]);
    const renderActivities = (
        act: {
            domains: { name: string; id: string }[];
            operation: { name: string; id: string };
            id: string;
        }[]
    ) => {
        if (act.length === 0) {
            listDisplayer.update({
                innerHTML: "",
                textContent: "no activities yet",
            });
            return;
        }
        listDisplayer.update({
            innerHTML: "",
            children: act.map((item) =>
                getActivityComponent(item.operation, item.domains)
            ),
        });
    };
    renderActivities(res);

    const activityCreateForm = ActitivityForm();
    activityCreateForm.s.form.update(
        {},
        {
            submit: (e: any, ls: any) => {
                e.preventDefault();
                let values = activityCreateForm.s.getValue();
                if (values.domains.length > 0 && values.operation) {
                    activityCreateForm.s.resetForm();
                    model.activity.create(
                        [],
                        values.aliasName,
                        values.operation,
                        values.domains
                    );
                } else {
                    throw new Error("Please select a domain and an operation");
                }
                renderActivities(model.activity.readAll([]));
                modal.s.handlers.hide();
            },
        }
    );
    const onCreate = (e: any, ls: any) => {
        const domains = model.domain.readNameAndId([]).map((item) => {
            return {
                textContent: item.name,
                value: item.id,
            };
        });
        const operations = model.operations.readNameAndId([]).map((item) => {
            return {
                textContent: item.name,
                value: item.id,
            };
        });
        activityCreateForm.s.setDomains(domains);
        activityCreateForm.s.setOperations(operations);
        modal.s.handlers.display(activityCreateForm);
        modal.s.handlers.show();
    };
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
                            Tools.icon(
                                Plus,
                                {
                                    class: "w-12 h-12 cursor-pointer hover:bg-gray-200",
                                },
                                {
                                    click: onCreate,
                                }
                            ),
                            SearchComponent(),
                        ],
                    }),
                    listDisplayer,
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
export const DomainOpsForm = () => {
    let form = Tools.comp("form", {
        class: "w-full flex flex-col items-center justify-center py-2 hidden",
        children: [
            Tools.comp("input", {
                class: "w-full bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500",
                type: "text",
                placeholder: "enter name",
                name: "name",
                key: "name",
            }),
            Tools.comp("input", {
                class: "w-full bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500",
                type: "submit",
            }),
        ],
    });
    const setFormValues = (data: { name: string }) => {
        form.s.name.getElement().value = data.name || "";
    };
    form.update(
        {},
        {},
        {
            setFormValues,
        }
    );
    return form;
};
