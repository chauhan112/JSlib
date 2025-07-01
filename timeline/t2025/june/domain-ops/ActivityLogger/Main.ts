import { Table } from "../../../april/DomainOps/Home";
import { Header } from "../Component";
import { Tools } from "../../../april/tools";
import { ArrowLeft, Plus } from "lucide";
import { SearchComponent } from "../../../may/FileSearch/Search";
import { GenericForm, Params } from "../Form";
import { InputType, Model } from "../Model";
import { FlexTable, Properties, Section } from "../Properties";
import { GlobalStates } from "../GlobalStates";

export const StructureForm = () => {
    const form = GenericForm();
    let options = Object.entries(InputType);
    let comps: any[] = [
        Params.inp("key", {
            class: "w-full p-2 rounded-md bg-gray-100 text-black",
            placeholder: "Enter the key",
        }),
        Params.select(
            "type",
            options.map((op) => [op[1], op[0]])
        ),
        Params.inp("order", {
            class: "w-full p-2 rounded-md bg-gray-100 text-black",
            placeholder: "give the order for sorting",
            type: "number",
            value: 0,
        }),
        Params.inpSubmit(),
    ];
    form.s.handlers.setComponents(comps);
    return form;
};
export const StructureSection = () => {
    const section = Section();
    const sf = StructureForm();
    const table = FlexTable(["key", "inputType", "order"]);
    section.s.body.update({ child: table });
    section.s.header.s.title.update({ textContent: "Structure" });

    const setInfos = (
        infos: { key: string; type: string; order: number; id: string }[]
    ) => {
        table.s.setData(
            infos.map((info: any) => {
                return {
                    id: info.id,
                    vals: [info.key, info.type, info.order],
                };
            })
        );
    };

    section.update({}, {}, { table, form: sf, setInfos });
    return section;
};
export const StructureSectionController = (root: any) => {
    const states: any = { comp: null, getCurrentSpace: null };

    const renderAll = () => {
        states.structures = root.model.logStructure.read(
            states.getCurrentSpace()
        );
        states.comp.s.setInfos(states.structures);
    };
    const onDelete = (id: string) => {
        if (!confirm("Are you sure?")) return;
        let model: Model = root.model;
        model.logStructure.delete(states.getCurrentSpace(), id);
        renderAll();
    };
    const onEdit = (id: string) => {
        let val = states.structures.find((x: any) => x.id == id);
        let modal = GlobalStates.getInstance().getState("modal");
        let sf = states.comp.s.form;
        modal.s.handlers.display(sf);
        states.comp.s.form.s.handlers.submit = onEditSubmit;
        sf.s.handlers.setValues(val);
        modal.s.handlers.show();
        sf.update({}, {}, { data: val });
    };
    const onEditSubmit = (e: any, ls: any) => {
        e.preventDefault();
        let prevVal = ls.s.data;
        let newVal = ls.s.handlers.getValues();
        let model: Model = root.model;
        model.logStructure.update(states.getCurrentSpace(), prevVal.id, newVal);
        let modal = GlobalStates.getInstance().getState("modal");
        modal.s.handlers.hide();
        renderAll();
    };
    const onActions = (e: any, ls: any) => {
        console.log(ls.s.data.type);
        let opType = ls.s.data.type;
        if (opType == "delete") {
            onDelete(ls.s.id);
        } else if (opType == "edit") {
            onEdit(ls.s.id);
        }
    };
    const onCreate = (e: any, ls: any) => {
        let form = states.comp.s.form;
        e.preventDefault();

        let vals = form.s.handlers.getValues();
        let valsCopy = { ...vals, order: parseInt(vals.order) };
        form.s.handlers.clearValues();
        let model: Model = root.model;
        console.log(valsCopy);
        model.logStructure.create(states.getCurrentSpace(), valsCopy);
        console.log(model);
        let modal = GlobalStates.getInstance().getState("modal");
        modal.s.handlers.hide();
        renderAll();
    };
    const onPlusClicked = (e: any, ls: any) => {
        let modal = GlobalStates.getInstance().getState("modal");
        modal.s.handlers.display(states.comp.s.form);
        modal.s.handlers.show();
        states.comp.s.form.s.handlers.submit = onCreate;
    };
    const setup = () => {
        states.comp.s.header.s.plus.update(
            {},
            {
                click: onPlusClicked,
            }
        );
    };
    return {
        states,
        renderAll,
        onCreate,
        onActions,
        onEdit,
        onDelete,
        onPlusClicked,
        setup,
    };
};
export const LoggerMain = () => {
    const activityName = "Ops: domain1, domain2, domain3";
    const header = Header();
    header.s.title.update({ textContent: activityName });
    const prop = Properties();
    const struc = StructureSection();
    const searchComp = SearchComponent();
    const table = Table();
    header.s.left.update({
        innerHTML: "",
        child: Tools.icon(ArrowLeft, { class: "w-8 h-8 cursor-pointer" }),
    });
    header.s.left
        .getElement()
        .classList.add("hover:scale-110", "transition-all", "duration-300");
    header.s.right.s.icon.getElement().classList.add("rotate-180");
    header.s.right.s.icon
        .getElement()
        .classList.add("transition-all", "duration-300");
    const logsList = Tools.div({ class: "w-full h-full", child: table });
    const plusIcon = Tools.icon(Plus, {
        class: "w-12 h-12 mx-4 cursor-pointer hover:scale-110 transition-all duration-300",
    });
    const rightNav = Tools.div({
        class: "flex flex-col min-h-full",
        children: [prop, struc],
    });

    const mainBody = Tools.div({
        class: "w-full flex flex-col",
        children: [
            Tools.div({
                class: "flex items-center justify-between",
                children: [plusIcon, searchComp],
            }),
            logsList,
        ],
    });
    let comp = Tools.div(
        {
            class: "w-full flex flex-col h-[100vh]",
            children: [
                header,
                Tools.div({
                    class: "flex w-full h-full",
                    children: [mainBody, rightNav],
                }),
            ],
        },
        {},
        {
            header,
            prop,
            struc,
            searchComp,

            plusIcon,
        }
    );
    return comp;
};
export const LoggerMainController = (root: any) => {
    let comp = LoggerMain();
    function toggleRightNav() {
        comp.s.rightNav.getElement().classList.toggle("hidden");
        comp.s.header.s.right.s.icon
            .getElement()
            .classList.toggle("rotate-180");
    }
    function setTitle(title: string) {
        comp.s.header.s.title.update({ textContent: title });
    }
    let strucCtrl = StructureSectionController(root);

    let currentSpaceForLogger: any = {};
    const getCurrentSpace = () => currentSpaceForLogger.val;
    const setCurrentSpace = (space: any) => (currentSpaceForLogger.val = space);

    comp.s.header.s.right.update(
        {},
        {
            click: toggleRightNav,
        }
    );

    const setup = () => {
        strucCtrl.states.comp = comp.s.struc;
        strucCtrl.states.getCurrentSpace = getCurrentSpace;
        strucCtrl.setup();
    };
    return {
        comp,
        funcs: {
            toggleRightNav,
            setTitle,
            getCurrentSpace,
            setup,
            setCurrentSpace,
        },
        strucCtrl,
    };
};
