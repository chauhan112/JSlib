import { DynamicFormController } from "../../../july/DynamicForm";
import { GenericForm, Params } from "../Form";
import { GlobalStates } from "../../../../globalComps/GlobalStates";
import { Model } from "../Model";
import { FlexTable } from "../FlexTable";

export const Unstructured = () => {
    const form = GenericForm();
    let comps: any[] = [
        Params.textArea("did", {
            class: "w-full p-2 rounded-md bg-gray-100 text-black flex-1",
            placeholder: "did",
        }),
        Params.textArea("next", {
            class: "w-full p-2 rounded-md bg-gray-100 text-black flex-1",
            placeholder: "next",
        }),
        Params.inpSubmit(),
    ];
    form.s.handlers.setComponents(comps);
    return form;
};

export const ColsSizes = {
    six_cols: {
        class: "grid grid-cols-6 gap-4",
    },
    did_next_cols_header: {
        class: "grid grid-cols-[40px_2fr_2fr_1fr_1fr_100px] gap-4 px-4 py-2 bg-[#6D5E4B] text-white rounded-t-md font-medium text-sm sticky top-0 mt-6",
    },
    did_next_cols_data: {
        class: "grid grid-cols-[40px_2fr_2fr_1fr_1fr_100px] gap-4 px-4 py-3 items-center border-b border-[#E7DAB8]/70 text-sm text-gray-700 last:border-b-0",
    },
    action: {
        class: "hover:cursor-pointer hover:scale-110 transition-all duration-300",
    },
    actionWrapper: {
        class: "flex justify-end space-x-3 text-[#4A8C71]",
    },
};

export const Controller = (root: any) => {
    const comp = Unstructured();
    const structuredForm = DynamicFormController();

    const table = FlexTable(["#", "did", "next", "created", "modified"]);
    table.s.states.dataWrapper.class = ColsSizes.did_next_cols_data.class;
    table.s.states.actionIcon.class = ColsSizes.action.class;
    table.s.states.actionsWrapper.class = ColsSizes.actionWrapper.class;
    table.s.header.update({ class: ColsSizes.did_next_cols_header.class });
    let model: Model = root.model;
    const onPlusClicked = (e: any, ls: any) => {
        let modal = GlobalStates.getInstance().getState("modal");
        modal.s.modalTitle.update({ textContent: "Create Log" });
        let structures = root.lmCtrl.strucCtrl.states.structures;
        if (structures.length == 0) {
            modal.s.handlers.display(comp);
            comp.s.handlers.submit = onCreateSubmit;
            comp.s.handlers.clearValues();
        } else {
            modal.s.handlers.display(structuredForm.comp);
            structuredForm.setFields(structures);
            structuredForm.comp.s.handlers.submit = onCreateSubmit;
            structuredForm.comp.s.handlers.clearValues();
        }
        modal.s.handlers.show();
    };
    const renderAll = () => {
        root.lmCtrl.comp.s.logsList.update({ innerHTML: "", child: table });
        let curActivity = root.lmCtrl.funcs.getCurrentSpace();
        let logs = model.logger.readAll(curActivity);
        let logsOrderd = logs.map((log: any, i: number) => {
            return {
                id: log.id,
                vals: [i + 1, log.did, log.next, log.created, log.modified],
            };
        });
        table.s.setData(logsOrderd);
    };
    const onEdit = (id: string) => {
        onPlusClicked(null, null);
        let structures = root.lmCtrl.strucCtrl.states.structures;
        let curActivity = root.lmCtrl.funcs.getCurrentSpace();
        if (structures.length == 0) {
            comp.s.handlers.setValues(model.logger.read(curActivity, id));
            comp.s.handlers.submit = onEditSubmit;
            comp.update({}, {}, { id: id });
        } else {
            structuredForm.comp.s.handlers.setValues(
                model.logger.read(curActivity, id)
            );
            structuredForm.comp.s.handlers.submit = onEditSubmit;
            structuredForm.comp.update({}, {}, { id: id });
        }
        let modal = GlobalStates.getInstance().getState("modal");
        modal.s.modalTitle.update({ textContent: "Update Log: " + id });
    };
    const onDelete = (id: string) => {
        if (!confirm("Are you sure?")) return;
        let curActivity = root.lmCtrl.funcs.getCurrentSpace();
        model.logger.delete(curActivity, id);
        renderAll();
    };
    const onEditSubmit = (e: any, ls: any) => {
        e.preventDefault();
        let curActivity = root.lmCtrl.funcs.getCurrentSpace();
        let vals = ls.s.handlers.getValues();
        model.logger.update(curActivity, ls.s.id, vals);
        ls.s.handlers.clearValues();
        let modal = GlobalStates.getInstance().getState("modal");
        modal.s.handlers.hide();
        renderAll();
    };
    const actions: any = {
        edit: onEdit,
        delete: onDelete,
    };
    table.s.handlers.onOpsClicked = (e: any, ls: any) => {
        let id = ls.s.id;
        let type = ls.s.data.type;
        actions[type](id);
    };
    const onCreateSubmit = (e: any, ls: any) => {
        e.preventDefault();
        let curActivity = root.lmCtrl.funcs.getCurrentSpace();
        let vals = ls.s.handlers.getValues();
        model.logger.create(curActivity, vals);
        ls.s.handlers.clearValues();
        let modal = GlobalStates.getInstance().getState("modal");
        modal.s.handlers.hide();
        renderAll();
    };
    const setup = () => {
        root.lmCtrl.comp.s.plusIcon.update(
            {},
            {
                click: onPlusClicked,
            }
        );
    };
    return {
        comp,
        structuredForm,
        funcs: {
            onPlusClicked,
            renderAll,
            onEdit,
            onDelete,
            onEditSubmit,
            setup,
        },
    };
};
