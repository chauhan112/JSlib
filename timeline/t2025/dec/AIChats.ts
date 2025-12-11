import { InputType } from "../june/domain-ops/Model";
import { Tools } from "../april/tools";
import { MainCtrl as SingleCrudMainCtrl } from "./DomainOpsFrontend/SingleCrud";
import { backendCall } from "./DomainOpsFrontend/api_calls";
import { type SingleCrudModelInterface } from "./DomainOpsFrontend/SingleCrud";
export class AIChatsCRUDModel implements SingleCrudModelInterface {
    type: string = "AIChats";
    
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
    async open_chat(path: string){
        let data = await backendCall("open_file", {path}, this.type);
        return data.data;
    }
}
export const AIChatsPage = () => {
    const singleCrudCtrl = SingleCrudMainCtrl.singleCrud(10, new AIChatsCRUDModel(), (data: any) => data.name,
        [{type: InputType.Input, key: "name", params: {placeholder: "Enter name"}}],
        [{type: InputType.Input, key: "name", params: {placeholder: "Enter name"}}]
    );
    singleCrudCtrl.on_card_clicked = (data: any) => {
        (singleCrudCtrl.model as AIChatsCRUDModel).open_chat(data.path);
    }
    return Tools.div({
        class: "w-full flex-col flex gap-2 p-2 ",
        children: [singleCrudCtrl.comp],
    }, {}, {
        singleCrudCtrl
    });
};