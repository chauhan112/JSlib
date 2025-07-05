import { GenericForm, Params } from "../Form";
import { InputType, Model } from "../Model";
import { FlexTable, Section } from "../FlexTable";
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
            options.map((op) => ({ value: op[1], label: op[0] }))
        ),
        Params.inp("order", {
            class: "w-full p-2 rounded-md bg-gray-100 text-black",
            placeholder: "give the order for sorting",
            type: "number",
            value: 0,
        }),
        Params.json("params", {
            class: "w-full p-2 rounded-md bg-gray-100 text-black flex-1",
            placeholder:
                "pass the params as json for example: options for select component",
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
        modal.s.modalTitle.update({ textContent: "update Structure: " + id });
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
        modal.s.modalTitle.update({ textContent: "Create Structure" });
    };
    const setup = () => {
        states.comp.s.header.s.plus.update(
            {},
            {
                click: onPlusClicked,
            }
        );
        states.comp.s.table.s.handlers.onOpsClicked = onActions;
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
