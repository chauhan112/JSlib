import { ChevronLeft, Plus } from "lucide";
import { Tools } from "../../april/tools";
import { AppLogoSVG } from "./Logo";
import { SearchComponent } from "../../may/FileSearch/Search";
import { GComponent } from "../../april/GComponent";
import { Model } from "./Model";

import { ContextMenu } from "./ContextMenu";
import { ActitivityForm, TabComponent, ActivityComponent } from "./Component";
import { Properties } from "./Properties";
import { SmallCRUDops } from "./SimpleCrudOps";
import { GlobalStates } from "./GlobalStates";

let model = new Model();

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
    header.s.closePropertiesSideBarIcon.getElement().classList.add("hidden");
    header.s.closePropertiesSideBarIcon
        .getElement()
        .classList.toggle("rotate-180");
    header.s.closePropertiesSideBarIcon.update(
        {},
        {
            click: () => {
                mainBody.s.properties.getElement().classList.toggle("hidden");
                header.s.closePropertiesSideBarIcon
                    .getElement()
                    .classList.toggle("rotate-180");
            },
        }
    );
    const mainBody = MainBody();
    mainBody.s.nav.s.comps.contextMenu.s.contextMenuOptions.push({
        label: "Properties",
        onClick: (e: any, ls: any) => {
            header.s.closePropertiesSideBarIcon
                .getElement()
                .classList.remove("hidden");
            header.s.closePropertiesSideBarIcon.handlers.click();
        },
    });
    mainBody.s.properties.getElement().classList.toggle("hidden");
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
export const OptionsManager = () => {
    const state: any = { options: {} };
    const addOption = (option: any) => {
        state.options[option.id] = option;
    };
    const removeOption = (id: string) => {
        delete state.options[id];
    };
    const clear = () => (state.options = {});

    return { state, addOption, removeOption, clear };
};
export const Navigation = () => {
    let contextMenu = ContextMenu([]);
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
    const onEditContextMenuOptionClick = (e: any, ls: any) => {
        let item = contextMenu.s.currentContext.s.data;
        createForm.getElement().classList.remove("hidden");
        createForm.s.setFormValues({ name: item.name });
        createForm.update(
            {},
            {
                submit: onEdit,
            },
            {
                info: item,
            }
        );
    };
    const onDeleteContextMenuOptionClick = (e: any, ls: any) => {
        let item = contextMenu.s.currentContext.s.data;
        let curKey = tabComp.s.getCurrentKey();
        curKey.s.info.delete(item.id, []);
        updateNavItems();
    };
    contextMenu.s.contextMenuOptions = [
        { label: "Edit", onClick: onEditContextMenuOptionClick },
        { label: "Delete", onClick: onDeleteContextMenuOptionClick },
    ];
    const onMenuClicked = (e: any, ls: any) => {
        contextMenu.s.setOptions(contextMenu.s.contextMenuOptions);
        contextMenu.s.displayMenu(e, ls);
        contextMenu.s.currentContext = ls;
    };
    domCrud.s.state.onMenuOptionClick = onMenuClicked;
    tabComp.s.setOnTabClick((e: any, ls: any) => {
        tabComp.s.onTabClick(e, ls);
        updateNavItems();
    });
    return Tools.div(
        {
            class: "flex flex-col items-center min-w-[10rem] w-2/12 bg-[#1ABC9C] h-full",

            key: "nav",
            children: [
                Tools.div({
                    class: "w-full flex justify-between flex-wrap",
                    children: [tabComp, domCrud, contextMenu],
                }),
            ],
        },
        {},
        {
            comps: { tabComp, domCrud, contextMenu, createForm },
            handlers: { onMenuClicked, onCreateNew, onEdit, updateNavItems },
        }
    );
};
export const MainBody = () => {
    let modal = GlobalStates.getInstance().getState("modal");
    const properties = Properties();
    const nav = Navigation();
    const bodyContent = BodyContent();

    return Tools.div(
        {
            key: "body",
            class: "flex-1 flex items-center justify-center",
            children: [nav, bodyContent, properties, modal],
        },
        {},
        { properties, nav, bodyContent }
    );
};
export const BodyContent = () => {
    let modal = GlobalStates.getInstance().getState("modal");
    const onOpsClicked = (e: any, ls: any) => {
        const typ = ls.s.data.type;
        const info = ls.s.data.info;
        let activityId = info.id;
        if (typ === "select") {
        } else if (typ === "edit") {
            let activity = model.activity.read([], activityId);
            onPlusClicked(e, ls);
            activityCreateForm.s.setValue(activity);
            activityCreateForm.s.curId = activityId;
            activityCreateForm.s.form.update(
                {},
                {
                    submit: onEdit,
                }
            );
            activityCreateForm.s.comps.submitBtn.update({
                textContent: "Update",
            });
            modal.s.modalTitle.update({ textContent: "Update Activity" });
        } else if (typ === "delete") {
            if (confirm("Are you sure you want to delete this activity?")) {
                model.activity.delete([], activityId);
                renderActivities(model.activity.readAll([]));
            }
        }
    };
    const getActivityComponent = (
        op: { name: string; id: string },
        doms: { name: string; id: string }[],
        name: string,
        id: string
    ) => {
        return CardComponentWrapper(
            ActivityComponent({ op, doms, id, name }, onOpsClicked)
        );
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
            name: string;
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
                getActivityComponent(
                    item.operation,
                    item.domains,
                    item.name,
                    item.id
                )
            ),
        });
    };
    renderActivities(res);

    const activityCreateForm = ActitivityForm();

    const onCreate = (e: any, ls: any) => {
        e.preventDefault();
        let values = activityCreateForm.s.getValue();
        if (values.domains.length > 0 && values.operation) {
            activityCreateForm.s.resetForm();
            model.activity.create(
                [],
                values.name,
                values.operation,
                values.domains
            );
        } else {
            throw new Error("Please select a domain and an operation");
        }
        renderActivities(model.activity.readAll([]));
        modal.s.handlers.hide();
    };
    const onEdit = (e: any, ls: any) => {
        e.preventDefault();
        let values = activityCreateForm.s.getValue();
        if (values.domains.length > 0 && values.operation) {
            activityCreateForm.s.resetForm();
            model.activity.update(
                [],
                activityCreateForm.s.curId,
                values.domains,
                values.operation,
                { name: values.name }
            );
        } else {
            throw new Error("Please select a domain and an operation");
        }
        renderActivities(model.activity.readAll([]));
        modal.s.handlers.hide();
    };
    const onPlusClicked = (e: any, ls: any) => {
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
        activityCreateForm.s.form.update(
            {},
            {
                submit: onCreate,
            }
        );
        activityCreateForm.s.comps.submitBtn.update({
            textContent: "Create",
        });
        modal.s.modalTitle.update({ textContent: "Create Activity" });
        activityCreateForm.s.resetForm();
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
                                    click: onPlusClicked,
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
