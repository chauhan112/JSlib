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

export class DomainCtrl {
    singleCrudCtrl: SingleCrudController;
    model: DomainOpsCRUDModel;
    nav_selector!: (href: string) => void;
    constructor() {
        this.model = new DomainOpsCRUDModel();
        this.model.type = "Domain";
        this.singleCrudCtrl = SingleCrudMainCtrl.singleCrud(10, this.model, (data: any) => data.name,
            [{type: "Input", key: "name", params: {attrs: {placeholder: "Enter name"}}}],
            [{type: "Input", key: "name", params: {attrs: {placeholder: "Enter name"}}}]
        );
        this.singleCrudCtrl.router.updateRoute("/", () => {
            this.singleCrudCtrl.display_default();
            this.nav_selector("/domain");
        });
    }
    set_nav_selector(nav_selector: (href: string) => void) {
        this.nav_selector = nav_selector;
    }
}
export class OperationCtrl {
    singleCrudCtrl: SingleCrudController;
    model: DomainOpsCRUDModel;
    nav_selector!: (href: string) => void;
    constructor() {
        this.model = new DomainOpsCRUDModel();
        this.model.type = "Operation";
        this.singleCrudCtrl = SingleCrudMainCtrl.singleCrud(10, this.model, (data: any) => data.name,
            [{type: "Input", key: "name", params: {attrs: {placeholder: "Enter name"}}}],
            [{type: "Input", key: "name", params: {attrs: {placeholder: "Enter name"}}}]
        );
        this.singleCrudCtrl.router.updateRoute("/", () => {
            this.singleCrudCtrl.display_default();
            this.nav_selector("/operation");
        });
    }
    set_nav_selector(nav_selector: (href: string) => void) {
        this.nav_selector = nav_selector;
    }
}