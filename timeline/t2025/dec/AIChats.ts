import { InputType } from "../june/domain-ops/Model";
import { Tools } from "../april/tools";
import { MainCtrl as SingleCrudMainCtrl } from "./DomainOpsFrontend/SingleCrud";
import { backendCall } from "./DomainOpsFrontend/api_calls";
import { type SingleCrudModelInterface } from "./DomainOpsFrontend/SingleCrud";
export class AIChatsCRUDModel implements SingleCrudModelInterface {
    type: string = "AIchats";
    
    async read_all (){
        let data = await backendCall("read_all", {}, this.type);
        return data.data;
    }
    async read (id: string){
        let data = await backendCall("read", {id}, this.type);
        return data.data;
    }
    async create (data: any){
        let res = await backendCall("create", data, this.type);
        return res.data;
    }
    async update (id: string, data: any){
        await backendCall("update", {id, ...data}, this.type);
        return true;
    }
    async deleteIt (id: string){
        let data = await backendCall("delete", {id}, this.type);
        return data.data;
    }
}
export const AIChatsPage = () => {
    const singleCrudCtrl = SingleCrudMainCtrl.singleCrud(4, new AIChatsCRUDModel(), (data: any) => data.name,
        [{type: InputType.Input, key: "name", params: {placeholder: "Enter name"}}],
        [{type: InputType.Input, key: "name", params: {placeholder: "Enter name"}}]
    );
    
    return Tools.div({
        class: "w-full flex-col flex gap-2 p-2 ",
        children: [singleCrudCtrl.comp],
    }, {}, {
        singleCrudCtrl
    });
};