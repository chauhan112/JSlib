import { CRUDForm, NewForm } from "../GenericCRUD/Form";
import { Model } from "../LocalStorage";
import { Tools } from "../tools";
import { Input } from "../GForm";

const ViewContent = (onCancel: any) => {
    const textArea = new Input(
        {
            key: "content",
            class: "w-full p-2 rounded-md bg-gray-100 text-black",
            placeholder: "wdw",
            disabled: true,
        },
        "textarea"
    );
    return Tools.div({
        class: "w-full flex flex-col gap-2 items-end justify-center p-2",
        children: [
            textArea,
            Tools.comp(
                "button",
                {
                    class: "w-fit p-2 px-8 rounded-md bg-blue-500 text-white hover:shadow-lg hover:cursor-pointer",
                    textContent: "Close",
                },
                {
                    click: onCancel,
                }
            ),
        ],
    });
};

export const StructureForm = () => {
    const model = new Model();
    model.addEntry(["values"], []);
    const crudFrom = CRUDForm();
    const state = {
        crud: crudFrom,
        model,
    };

    const vc = ViewContent(state.crud.onCancel);
    const editForm = NewForm(crudFrom.formProps);
    let editFormWithCancel = Tools.div({
        class: "w-full flex items-center justify-between p-2",
        children: [
            editForm,
            Tools.comp(
                "button",
                {
                    textContent: "Cancel",
                    class: "w-fit p-2 px-4 rounded-md bg-red-500 text-white hover:shadow-lg hover:cursor-pointer",
                },
                {
                    click: state.crud.onCancel,
                }
            ),
        ],
    });
    const onSubmit = (e: any, ls: any) => {
        e.preventDefault();
        let vals = state.model.readEntry(["values"]);
        if (!vals.some((item: any) => item.keyName == ls.values.keyName)) {
            state.crud.form.clearValues();
            state.model.updateEntry(["values"], [...vals, ls.values]);
            state.crud.lc.appendData({
                name: ls.values.keyName,
                key: ls.values.keyName,
            });
            state.crud.onCancel(e, ls);
        } else {
            alert("Key already exists");
        }
    };
    const onItemClicked = (e: any, ls: any) => {
        let vals = model.readEntry(["values"]);

        if (ls.ops == "read") {
            let val = vals.filter(
                (item: any) => item.keyName == ls.data.key
            )[0];
            vc.s.content.set(JSON.stringify(val));
            crudFrom.formArea.clear();
            crudFrom.formArea.display(vc);
        } else if (ls.ops == "delete") {
            if (confirm("Are you sure you want to delete this entry?")) {
                let newVals = vals.filter(
                    (item: any) => item.keyName != ls.data.key
                );
                model.updateEntry(["values"], newVals);
                crudFrom.lc.setData(
                    newVals.map((item: any) => {
                        return { name: item.keyName, key: item.keyName };
                    })
                );
            }
        } else if (ls.ops == "edit") {
            let val = vals.filter(
                (item: any) => item.keyName == ls.data.key
            )[0];
            editForm.setValues(val);
            crudFrom.formArea.clear();
            crudFrom.formArea.display(editFormWithCancel);
        }
    };
    const onEditSubmit = (e: any, ls: any) => {
        e.preventDefault();

        let vals = state.model.readEntry(["values"]);
        if (vals.some((item: any) => item.keyName == ls.values.keyName)) {
            let newVals = [];
            for (let item of vals) {
                if (item.keyName == ls.values.keyName) {
                    newVals.push(ls.values);
                } else {
                    newVals.push(item);
                }
            }
            model.updateEntry(["values"], newVals);
            state.crud.onCancel(e, ls);
        } else {
            alert("Key does not exist");
        }
    };
    crudFrom.lc.s.funcs.contextMenuClick = onItemClicked;
    crudFrom.form.s.funcs.onSubmit = onSubmit;
    editForm.s.funcs.onSubmit = onEditSubmit;
    return state;
};
