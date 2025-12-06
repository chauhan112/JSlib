import { Tools } from "../../april/tools";
import { MainCtrl as SingleCrudMainCtrl } from "./SingleCrud";
import { backendCall } from "./api_calls";
import { type SingleCrudModelInterface } from "./SingleCrud";
import { InputType } from "../../june/domain-ops/Model";

export class DomainOpsCRUDModel implements SingleCrudModelInterface {
    async read_all (){
        let data = await backendCall("read_all", {}, "Domain");
        return data.data;
    }
    async read (id: string){
        let data = await backendCall("read", {id}, "Domain");
        return data.data;
    }
    async create (data: any){
        let res = await backendCall("create", data, "Domain");
        return res.data;
    }
    async update (id: string, data: any){
        await backendCall("update", {id, ...data}, "Domain");
        return true;
    }
    async deleteIt (id: string){
        let data = await backendCall("delete", {id}, "Domain");
        return data.data;
    }
}

export const Page = () => {
    const singleCrudCtrl = SingleCrudMainCtrl.singleCrud(4, new DomainOpsCRUDModel(), (data: any) => data.name,
        [{type: InputType.Input, key: "name", params: {placeholder: "Enter name"}}],
        [{type: InputType.Input, key: "name", params: {placeholder: "Enter name"}}]
    );
    return Tools.div({
        class: "w-full flex-col flex gap-2 p-2 ",
        children: [singleCrudCtrl.comp],
    });
};