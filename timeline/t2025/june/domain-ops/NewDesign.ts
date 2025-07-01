import { Plus } from "lucide";
import { Tools } from "../../april/tools";
import { SearchComponent } from "../../may/FileSearch/Search";
import { GComponent } from "../../april/GComponent";
import { Model } from "./Model";
import {
    ActitivityForm,
    TabComponent,
    ActivityComponent,
    Breadcrumb,
    Header,
} from "./Component";
import { Properties, PropertiesCtrl } from "./Properties";
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
    const header = Header();
    const mainBody = MainBody();
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
    return comp;
};
export const NewDesignCtrl = (root: any) => {
    let model = root.model;
    let navCtrl = NavController(root);
    let actCtrl = ActivityCtrl(root);
    let states: any = { currentSpace: [], currentLocation: [] };
    let comp = NewDesign();
    const getCurrentSpace = () => {
        return [...states.currentLocation, ...states.currentSpace];
    };
    const setCurrentLocation = (loc: any) => {
        const breadCrumb = comp.s.mainBody.s.bodyContent.s.breadCrumb;
        states.currentLocation = loc;
        navCtrl.funcs.updateNavItems();
        breadCrumb.s.handlers.setData(
            BreadCrumbTools.getPath(states.currentLocation, model)
        );
        actCtrl.funcs.renderActivities(
            model.activity.readAll(states.currentLocation)
        );
    };

    const onNavToggle = () => {
        comp.s.mainBody.s.nav.getElement().classList.toggle("hidden");
        comp.s.header.s.left.getElement().classList.toggle("rotate-180");
    };

    const propsStateActions: any = {
        open: () => {
            comp.s.mainBody.s.properties.s.ctrl.show();
            if (comp.s.mainBody.s.properties.s.ctrl.isShowing()) {
                comp.s.header.s.right.s.icon
                    .getElement()
                    .classList.remove("hidden");
                comp.s.header.s.right.s.icon
                    .getElement()
                    .classList.add("rotate-180");
            }
        },
        close: () => {
            comp.s.mainBody.s.properties.s.ctrl.hide();
            comp.s.mainBody.s.properties.getElement().classList.add("hidden");
            comp.s.header.s.right.s.icon
                .getElement()
                .classList.remove("rotate-180");
        },
        hideBtn: () => {
            comp.s.header.s.right.s.icon.getElement().classList.add("hidden");
        },
        toggle: () => {
            comp.s.mainBody.s.properties
                .getElement()
                .classList.toggle("hidden");
            comp.s.header.s.right.s.icon
                .getElement()
                .classList.toggle("rotate-180");
        },
    };

    const breadCrumbItem = (item: any) => {
        const breadCrumb = comp.s.mainBody.s.bodyContent.s.breadCrumb;
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

    const setup = () => {
        states.getCurrentSpace = getCurrentSpace;
        states.setCurrentLocation = setCurrentLocation;
        comp.s.header.s.left.update(
            {},
            {
                click: onNavToggle,
            }
        );
        comp.s.header.s.right.update(
            {},
            {
                click: () => propsStateActions.toggle(),
            }
        );
        const ctrl: PropertiesCtrl = comp.s.mainBody.s.properties.s.ctrl;
        ctrl.setModel(model);
        ctrl.setup();
        ctrl.inst.states = states;
        const breadCrumb = comp.s.mainBody.s.bodyContent.s.breadCrumb;
        breadCrumb.s.handlers.compCreator = breadCrumbItem;
        propsStateActions.hideBtn();
        propsStateActions.close();
        const contextMenu = GlobalStates.getInstance().getState("contextMenu");
        navCtrl.contextMenuOptions.push({
            label: "Properties",
            onClick: (e: any, ls: any) => {
                let curKey = comp.s.mainBody.s.nav.s.tabComp.s.getCurrentKey();
                let item = contextMenu.s.currentContext.s.data;
                states.currentSpace = [
                    navCtrl.funcs.getInstance(curKey.s.info).key,
                    item.id,
                ];
                propsStateActions.open();
            },
        });
        navCtrl.states.comp = comp.s.mainBody.s.nav;
        navCtrl.funcs.setup();
        navCtrl.funcs.updateNavItems();
        actCtrl.states.comp = comp.s.mainBody.s.bodyContent;
        actCtrl.funcs.setup();
        actCtrl.funcs.renderActivities(
            model.activity.readAll(states.currentLocation)
        );
    };

    return {
        comp,
        states,
        propsStateActions,
        actCtrl,
        navCtrl,
        funcs: {
            setup,
            onNavToggle,
            getCurrentSpace,
            setCurrentLocation,
            breadCrumbItem,
        },
    };
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
    const tabComp = TabComponent([
        { label: "Domains", info: "domains" },
        { label: "Operations", info: "operations" },
    ]);
    const createForm = DomainOpsForm();
    const domCrud = SmallCRUDops([], createForm);

    return Tools.div(
        {
            class: "flex flex-col items-center min-w-[10rem] w-2/12 bg-[#1ABC9C] h-full",

            key: "nav",
            children: [
                Tools.div({
                    class: "w-full flex justify-between flex-wrap",
                    children: [tabComp, domCrud],
                }),
            ],
        },
        {},
        {
            tabComp,
            domCrud,
            createForm,
        }
    );
};
export const NavController = (root: any) => {
    let contextMenu = GlobalStates.getInstance().getState("contextMenu");
    let states: any = {
        comp: null,
        domains: root.model.domain,
        operations: root.model.operations,
    };
    console.log("nv", root);
    const getInstance = (key: string) => states[key];
    const onCreateNew = (e: any, ls: any) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get("name") as string;
        const curKey = states.comp.s.tabComp.s.getCurrentKey();
        getInstance(curKey.s.info).create(
            root.newDesignCtrl.states.currentLocation,
            name
        );
        (states.comp.s.createForm.getElement() as HTMLFormElement).reset();
        states.comp.s.createForm.getElement().classList.add("hidden");
        updateNavItems();
    };
    const onEdit = (e: any, ls: any) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get("name") as string;
        const curKey = states.comp.s.tabComp.s.getCurrentKey();
        getInstance(curKey.s.info).updateName(
            root?.currentLocation || [],
            states.comp.s.createForm.s.info.id,
            name
        );
        (states.comp.s.createForm.getElement() as HTMLFormElement).reset();
        states.comp.s.createForm.getElement().classList.add("hidden");
        updateNavItems();
    };
    const updateNavItems = () => {
        const curKey = states.comp.s.tabComp.s.getCurrentKey();
        states.comp.s.domCrud.s.updateNavItems(
            getInstance(curKey.s.info).readNameAndId(
                root.newDesignCtrl.states.currentLocation
            )
        );
    };
    const onEditContextMenuOptionClick = (e: any, ls: any) => {
        let item = contextMenu.s.currentContext.s.data;
        states.comp.s.createForm.getElement().classList.remove("hidden");
        states.comp.s.createForm.s.setFormValues({ name: item.name });
        states.comp.s.createForm.update(
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
        let curKey = states.comp.s.tabComp.s.getCurrentKey();
        getInstance(curKey.s.info).delete(item.id, root?.currentLocation);
        updateNavItems();
    };
    let contextMenuOptions = [
        { label: "Edit", onClick: onEditContextMenuOptionClick },
        { label: "Delete", onClick: onDeleteContextMenuOptionClick },
    ];
    const onMenuClicked = (e: any, ls: any) => {
        contextMenu.s.setOptions(contextMenuOptions);
        contextMenu.s.displayMenu(e, ls);
        contextMenu.s.currentContext = ls;
    };
    const onTabChanged = (e: any, ls: any) => {
        states.comp.s.tabComp.s.onTabClick(e, ls);
        updateNavItems();
    };
    const onMainBodyClick = (e: any, ls: any) => {
        let curKey = states.comp.s.tabComp.s.getCurrentKey();
        root.newDesignCtrl.states.setCurrentLocation([
            ...root.newDesignCtrl.states.currentLocation,
            getInstance(curKey.s.info).key,
            ls.s.data.id,
        ]);
    };
    const onCreateBtnClicked = (e: any, ls: any) => {
        states.comp.s.createForm.getElement().classList.toggle("hidden");
        states.comp.s.createForm.update(
            {},
            {
                submit: onCreateNew,
            }
        );
        (states.comp.s.createForm.getElement() as HTMLFormElement).reset();
    };
    const setup = () => {
        states.comp.s.domCrud.s.createBtn.update(
            {},
            {
                click: onCreateBtnClicked,
            }
        );
        states.comp.s.domCrud.s.state.onMenuOptionClick = onMenuClicked;
        states.comp.s.tabComp.s.setOnTabClick(onTabChanged);
        states.comp.s.domCrud.s.state.onMainBodyClick = onMainBodyClick;
    };
    return {
        contextMenuOptions,
        states,
        funcs: {
            setup,
            onEdit,
            onCreateNew,
            onEditContextMenuOptionClick,
            onDeleteContextMenuOptionClick,
            onMenuClicked,
            onTabChanged,
            onMainBodyClick,
            onCreateBtnClicked,
            updateNavItems,
            getInstance,
        },
    };
};
export const MainBody = () => {
    const properties = Properties();
    const nav = Navigation();
    const bodyContent = BodyContent();

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
export const BodyContent = () => {
    let listDisplayer = Tools.div({
        class: "flex flex-wrap gap-2 mt-2 bg-gray-200 p-2 rounded-lg h-full flex-1",
        textContent: "no activities yet",
    });

    const breadCrumb = Breadcrumb();
    const searchComp = SearchComponent();
    const plusBtn = Tools.icon(Plus, {
        class: "w-12 h-12 cursor-pointer hover:bg-gray-200",
    });
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
                            children: [plusBtn, searchComp],
                        }),
                        listDisplayer,
                    ],
                }),
            ],
        },
        {},
        {
            listDisplayer,
            breadCrumb,
            searchComp,
            plusBtn,
        }
    );
};
export const ActivityCtrl = (root: any) => {
    let model = root.model;
    let modal = GlobalStates.getInstance().getState("modal");
    let states: any = { comp: null };
    const activityCreateForm = ActitivityForm();
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
    const renderActivities = (
        act: {
            domains: { name: string; id: string }[];
            operation: { name: string; id: string };
            name: string;
            id: string;
        }[]
    ) => {
        if (act.length === 0) {
            states.comp.s.listDisplayer.update({
                innerHTML: "",
                textContent: "no activities yet",
            });
            return;
        }
        states.comp.s.listDisplayer.update({
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
        const domains = model.domain.readNameAndId([]).map((item: any) => {
            return {
                textContent: item.name,
                value: item.id,
            };
        });
        const operations = model.operations
            .readNameAndId([])
            .map((item: any) => {
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
    const setup = () => {
        states.comp.s.plusBtn.update(
            {},
            {
                click: onPlusClicked,
            }
        );
    };
    return {
        states,
        activityOps,
        funcs: {
            renderActivities,
            setup,
            onPlusClicked,
            onOpsClicked,
            onActivityEdit,
            onActivityDelete,
            onEditSubmit,
            onCreateSubmit,
            getActivityComponent,
        },
        createForm: activityCreateForm,
    };
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
