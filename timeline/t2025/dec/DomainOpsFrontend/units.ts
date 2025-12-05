
import { DynamicFormController } from "../../july/DynamicForm";
import { InputType} from "../../june/domain-ops/Model";
import { backendCall } from "./api_calls";
import { FormSelectCompCtrl } from "../../aug/jobAIApply/simpleVersion";
import { Tools } from "../../april/tools";
import { GenericCRUDCtrl } from "../../july/generic-crud/page";
import { type  ModelType} from "../../july/generic-crud/model";

export const DomainOperationForm = () => {
    const s : { [key: string]: any } = {};
    const dataFormCtrl = DynamicFormController();
    dataFormCtrl.setFields([
        { type: InputType.Input, key: "name", params: { placeholder: "Enter a name" } },
    ]);
    const onCreate = (op_name: string) => {
        backendCall("create", dataFormCtrl.comp.s.handlers.getValues(), op_name).then((res) => {
            dataFormCtrl.comp.s.handlers.clearValues();
        }).catch((err: any) => {
            console.log(err.response.data);
        });
    };
    const onSubmit = (e: any, ls: any) => {
        e.preventDefault();
        onCreate("Domain");
    };
    const setup = () => {
        dataFormCtrl.comp.s.handlers.submit = onSubmit;
    };
    s.onCreate = onCreate;
    return {s, dataFormCtrl};
}

export const DomOpsPage = () => {
    const selectOpComp = FormSelectCompCtrl("dom op activities");
    const options = [
        { value: "Domain", label: "Domain" },
        { value: "Operation", label: "Operation" },
        {
            value: "Activity", label: "Activity"
        }
    ];

    selectOpComp.setOptions(options);
    selectOpComp.setLabel("Domain Ops Activities");
    const dOf= DomainOperationForm();
    return Tools.div({
        class: "w-full flex flex-col gap-2 p-2",
        children: [selectOpComp.comp, dOf.dataFormCtrl.comp]
    },{},{
        selectOpComp,
        dOf,
    });
}

export const Model = () => {
    let s : { [key: string]: any } = {op_name: "Domain"};
    const create = async (vals: any) => {
        return await backendCall("create", vals, s.op_name);
    }
    const readAll = async () => {
        let data = await backendCall("read_all", {}, s.op_name);
        return data.data.map((x: any) => {
            return {
                title: x.name,
                id: x.id,
                original: x,
            };
        });
    }
    const read = async (id: string) => {
        let data = await backendCall("read", {id}, s.op_name);
        return data.data;
    }
    const update = async (id: string, vals: any) => {
        let data = await backendCall("update", {id, name: vals.name}, s.op_name);
        return data.data;
    }
    const deleteIt = async (id: string) => {
        let data = await backendCall("delete", {id}, s.op_name);
        return data.data;
    }
    return {s, create, readAll, read, update, delete: deleteIt};
}

export const PageCtrl = () => {
    const comp = DomOpsPage();
    const ctrl = GenericCRUDCtrl();
    const onSubmit = (e: any, ls: any) => {
        e.preventDefault();
        comp.s.dOf.s.onCreate(comp.s.selectOpComp.getValue());
    };
    const setup = () => {
        comp.s.dOf.dataFormCtrl.comp.s.handlers.submit = onSubmit;
        ctrl.funcs.setup();
        let model: ModelType = Model();
        ctrl.dataCrudCtrl.states.model = model;
        ctrl.dataCrudCtrl.states.refresh();
        
        ctrl.dataCrudCtrl.states.fields = [
            { type: InputType.Input, key: "name", params: { placeholder: "Enter a namessss" } },
        ];
        
    };
    return {comp:ctrl.comp, setup};
}