import { InputType } from "../../../june/domain-ops/Model";
import { SingleCrudController, MainCtrl as SingleCrudMainCtrl } from "../SingleCrud";
import { backendCall } from "../api_calls";
import { type SingleCrudModelInterface } from "../SingleCrud";
import { GlobalStates } from "../../../june/domain-ops/GlobalStates";

export class ActivityCRUDModel implements SingleCrudModelInterface {
    type: string = "Activity";
    
    async read_all (){
        let data = await backendCall("read_all", {}, this.type);
        return data.data;
    }
    async read (id?: string){
        let data = await backendCall("read", {id}, this.type);
        return data.data;
    }
    
    async create (data: any){
        let payload = {
            table_name: data.table_name,
            domains: data.domains.map((dom: any) => dom.value),
            operation_id: parseInt(data.operation),
        }
        let res = await backendCall("create", payload, this.type);
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
    async read_for_create_form(id?: string){
        let data = await backendCall("read_for_create_form", {id}, this.type);
        return data.data;
    }
}

export class ActivityPageCtrl {
    singleCrudCtrl: SingleCrudController;
    comp: any;
    constructor(){
        this.singleCrudCtrl = SingleCrudMainCtrl.singleCrud(4, new ActivityCRUDModel(), (data: any) => {
            let name = data.operation.name + " " + data.domains.map((dom: any) => dom.name).join(", ");
            return name;
        },
            [{type: InputType.Input, key: "table_name", params: {placeholder: "enter table name"}}, 
                {type: InputType.MultiSelect, key: "domains", params: []}, 
                {type: InputType.Select, key: "operation", params: []}],
            [{type: InputType.Input, key: "table_name", params: {placeholder: "enter table name"}}, 
                {type: InputType.MultiSelect, key: "domains", params: []}, 
                {type: InputType.Select, key: "operation", params: []}
            ]
        );
        
        this.singleCrudCtrl.comp.s.searchComp.s.plusIcon.update({}, { click: () => this.on_plus_clicked() });
        this.singleCrudCtrl.contextMenus["Edit"] = this.on_edit_clicked.bind(this);
    }
    on_plus_clicked(){
        (this.singleCrudCtrl.model as ActivityCRUDModel).read_for_create_form().then((data: any) => {
            this.singleCrudCtrl.onPlusClicked();
            this.singleCrudCtrl.createForm.dataFormCtrl?.comp.s.formElements.domains.s.setOptions(data.domains.map((dom: any) => ({ value: dom.id, textContent: dom.name })));
            this.singleCrudCtrl.createForm.dataFormCtrl?.comp.s.formElements.operation.s.setOptions(data.operations.map((op: any) => ({ value: op.id, textContent: op.name })));
        });
        
        
        
    }
    on_edit_clicked(data: any){
        (this.singleCrudCtrl.model as ActivityCRUDModel).read_for_create_form().then((data2: any) => {;
            
            let values = {
                table_name: data.table_name,
                domains: data.domains.map((dom: any) => dom.id),
                operation: data.operation.id,
            }
            
            let modal = GlobalStates.getInstance().getState("modal");
            this.singleCrudCtrl.updateForm.setup();


            modal.s.handlers.display(this.singleCrudCtrl.updateForm.dataFormCtrl.comp);
            modal.s.handlers.show();
            modal.s.modalTitle.update({ textContent: "Update" });
            this.singleCrudCtrl.updateForm.set_values(data.id,values );

        }); 
    }
    
}

export const ActivityPage = () => {
    const activityPageCtrl = new ActivityPageCtrl();
    return activityPageCtrl.singleCrudCtrl.comp;
}