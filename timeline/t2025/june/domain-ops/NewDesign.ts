import { Plus } from "lucide";
import { Tools } from "../../april/tools";

import { SearchComponent } from "../../may/FileSearch/Search";
import { GComponent } from "../../april/GComponent";
import { Model } from "./Model";
import { ContextMenu } from "./ContextMenu";
import {
    ActitivityForm,
    TabComponent,
    ActivityComponent,
    Breadcrumb,
    Header,
} from "./Component";
import { Properties } from "./Properties";
import { SmallCRUDops } from "./SimpleCrudOps";
import { GlobalStates } from "./GlobalStates";

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

export class BreadCrumbTools {
    static getPath(path: string[], model: Model) {
        const res: { name: string; loc: string[] }[] = [
            { name: "/root", loc: [] },
        ];
        const curLoc = [];
        for (let i = 0; i < path.length; i += 2) {
            curLoc.push(path[i]);
            curLoc.push(path[i + 1]);
            res.push({
                name: model.model.readEntry([...curLoc, "name"]),
                loc: [...curLoc],
            });
        }
        return res;
    }
}

export const NewDesign = () => {
    let model = new Model();
    let states: any = { model, currentSpace: [], currentLocation: [] };
    const getCurrentSpace = () => {
        return [...states.currentLocation, ...states.currentSpace];
    };
    states.getCurrentSpace = getCurrentSpace;
    const setCurrentLocation = (loc: any) => {
        states.currentLocation = loc;
        mainBody.s.nav.s.handlers.updateNavItems();
        breadCrumb.s.handlers.setData(
            BreadCrumbTools.getPath(states.currentLocation, model)
        );
        mainBody.s.bodyContent.s.handlers.renderActivities(
            model.activity.readAll(states.currentLocation)
        );
    };
    states.setCurrentLocation = setCurrentLocation;
    const header = Header();
    const mainBody = MainBody(states);
    header.s.left.update(
        {},
        {
            click: () => {
                mainBody.s.nav.getElement().classList.toggle("hidden");
                header.s.left.getElement().classList.toggle("rotate-180");
            },
        }
    );
    const propsStateActions: any = {
        open: () => {
            mainBody.s.properties.s.show();
            if (mainBody.s.properties.s.isShowing()) {
                header.s.right.s.icon.getElement().classList.remove("hidden");
                header.s.right.s.icon.getElement().classList.add("rotate-180");
            }
        },
        close: () => {
            mainBody.s.properties.s.hide();
            mainBody.s.properties.getElement().classList.add("hidden");
            header.s.right.s.icon.getElement().classList.remove("rotate-180");
        },
        hideBtn: () => {
            header.s.right.s.icon.getElement().classList.add("hidden");
        },
        toggle: () => {
            mainBody.s.properties.getElement().classList.toggle("hidden");
            header.s.right.s.icon.getElement().classList.toggle("rotate-180");
        },
    };
    const breadCrumb = mainBody.s.bodyContent.s.comps.breadCrumb;
    breadCrumb.s.handlers.compCreator = (item: any) => {
        return Tools.div(
            {
                class: "cursor-pointer " + breadCrumb.s.niceClass.class,
                textContent: item.name,
            },
            {
                click: (e: any, ls: any) => {
                    states.setCurrentLocation(item.loc);
                },
            },
            { data: item }
        );
    };

    propsStateActions.hideBtn();
    propsStateActions.close();
    header.s.right.update(
        {},
        {
            click: () => propsStateActions.toggle(),
        }
    );
    const contextMenu = mainBody.s.nav.s.comps.contextMenu;
    contextMenu.s.contextMenuOptions.push({
        label: "Properties",
        onClick: (e: any, ls: any) => {
            let curKey = mainBody.s.nav.s.comps.tabComp.s.getCurrentKey();
            let item = contextMenu.s.currentContext.s.data;
            states.currentSpace = [curKey.s.info.key, item.id];
            propsStateActions.open();
        },
    });

    mainBody.s.nav.s.handlers.updateNavItems();
    mainBody.s.bodyContent.s.handlers.renderActivities(
        model.activity.readAll(states.currentLocation)
    );
    const comp = Tools.div(
        {
        class: "h-screen flex flex-col",
        children: [header, mainBody],
        },
        {},
        {
            header,
            mainBody,
        }
    );
    states.newdesign = comp;
    return comp;
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
export const Navigation = (root?: any) => {
    let model = root?.model;
    let contextMenu = ContextMenu([]);
    const createForm = DomainOpsForm();
    const onCreateNew = (e: any, ls: any) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get("name") as string;
        const curKey = tabComp.s.getCurrentKey();
        curKey.s.info.create(root?.currentLocation || [], name);
        (createForm.getElement() as HTMLFormElement).reset();
        createForm.getElement().classList.add("hidden");
        updateNavItems();
    };
    const onEdit = (e: any, ls: any) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get("name") as string;
        const curKey = tabComp.s.getCurrentKey();
        curKey.s.info.updateName(
            root?.currentLocation || [],
            createForm.s.info.id,
            name
        );
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

        domCrud.s.updateNavItems(
            curKey.s.info.readNameAndId(root?.currentLocation)
        );
    };
    const domCrud = SmallCRUDops([], createForm);

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
        curKey.s.info.delete(item.id, root?.currentLocation);
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
    domCrud.s.state.onMainBodyClick = (e: any, ls: any) => {
        let curKey = tabComp.s.getCurrentKey();
        root?.setCurrentLocation([
            ...root?.currentLocation,
            curKey.s.info.key,
            ls.s.data.id,
        ]);
    };
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
export const MainBody = (root?: any) => {
    const properties = Properties(root);
    const nav = Navigation(root);
    const bodyContent = BodyContent(root);

    return Tools.div(
        {
            key: "body",
            class: "flex-1 flex items-center justify-center",
            children: [nav, bodyContent, properties],
        },
        {},
        { properties, nav, bodyContent }
    );
};
export const BodyContent = (root?: any) => {
    let model = root?.model;
    let modal = GlobalStates.getInstance().getState("modal");
    const onActivityEdit = (e: any, ls: any) => {
        const info = ls.s.data.info;
        let activityId = info.id;
        let activity = model.activity.read([], activityId);
        onPlusClicked(e, ls);
        try {
            activityCreateForm.s.setValue(activity);
        } catch (error) {
            console.log(error);
        }
        activityCreateForm.s.curId = activityId;
        activityCreateForm.s.form.update(
            {},
            {
                submit: onEditSubmit,
            }
        );
        activityCreateForm.s.comps.submitBtn.update({
            textContent: "Update",
        });
        modal.s.modalTitle.update({ textContent: "Update Activity" });
    };
    const onActivityDelete = (e: any, ls: any) => {
        const info = ls.s.data.info;
        let activityId = info.id;
        if (confirm("Are you sure you want to delete this activity?")) {
            model.activity.delete([], activityId);
            renderActivities(model.activity.readAll([]));
        }
    };
    const activityOps: any = {
        edit: onActivityEdit,
        delete: onActivityDelete,
    };
    const onOpsClicked = (e: any, ls: any) => {
        const typ = ls.s.data.type;
        activityOps[typ]?.(e, ls);
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
    const activityCreateForm = ActitivityForm();

    const onCreateSubmit = (e: any, ls: any) => {
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
    const onEditSubmit = (e: any, ls: any) => {
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
                submit: onCreateSubmit,
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

    const breadCrumb = Breadcrumb();
    const searchComp = SearchComponent();

    return Tools.div(
        {
            class: "flex flex-col items-center flex-1 h-full ",
            key: "contentArea",
            children: [
                Tools.div({
                    class: "w-full flex flex-col px-2 border-gray-300",
                    children: [
                        breadCrumb,
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
                                searchComp,
                            ],
                        }),
                        listDisplayer,
                    ],
                }),
            ],
        },
        {},
        {
            comps: {
                activityCreateForm,
                listDisplayer,
                breadCrumb,
                searchComp,
            },
            handlers: {
                renderActivities,
                activityOps,
                onOpsClicked,
                getActivityComponent,
                onCreateSubmit,
                onEditSubmit,
                onPlusClicked,
            },
        }
    );
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
