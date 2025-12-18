import { MainCtrl as SingleCrudMainCtrl, SingleCrudController } from "../SingleCrud";
import { backendCall } from "../api_calls";
import { type SingleCrudModelInterface } from "../SingleCrud";

export class DomainOpsCRUDModel implements SingleCrudModelInterface {
    type: string = "Domain";
    
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
        let res = await backendCall("update", {id, ...data}, this.type);
        return res.data;
    }
    async deleteIt (id: string){
        let data = await backendCall("delete", {id}, this.type);
        return data.data;
    }
}

export class DomOpsPageCtrl {
    singleCrudCtrl: SingleCrudController;
    model: DomainOpsCRUDModel;
    constructor() {
        this.model = new DomainOpsCRUDModel();
        this.singleCrudCtrl = SingleCrudMainCtrl.singleCrud(4, this.model, (data: any) => data.name,
            [{type: "Input", key: "name", params: {attrs: {placeholder: "Enter name"}}}],
            [{type: "Input", key: "name", params: {attrs: {placeholder: "Enter name"}}}]
        );
    }
    get_domain_page() {
        this.model.type = "Domain";
        this.singleCrudCtrl.update();
        return this.singleCrudCtrl.comp;
    }
    get_operation_page() {
        this.model.type = "Operation";
        this.singleCrudCtrl.update();
        return this.singleCrudCtrl.comp;
    }

}