import {  SingleCrudController, MainCtrl as SingleCrudMainCtrl } from "../SingleCrud";
import { backendCall } from "../api_calls";
import { type SingleCrudModelInterface } from "../SingleCrud";
import { GlobalStates } from "../../../june/domain-ops/GlobalStates";
import type { DropdownCtrl, MultiSelectCompCtrl } from "../components/atomic";
import type { NewDynamicFormCtrl } from "../components/Form";

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
        let payload = {
            id: id, 
            table_name: data.table_name,
            domains: data.domains.map((dom: any) => dom.value),
            operation_id: parseInt(data.operation),
        }
        let res = await backendCall("update", payload, this.type);
        return res.data;
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
            [   {type: "Input", key: "table_name", params: {attrs: {placeholder: "enter table name"}}}, 
                {type: "MultiSelect", key: "domains", params: {options: []}}, 
                {type: "Select", key: "operation", params: {options: []}}],

            [{type: "Input", key: "table_name", params: {attrs: {placeholder: "enter table name"}}}, 
                {type: "MultiSelect", key: "domains", params: {options: []}}, 
                {type: "Select", key: "operation", params: {options: []}}
            ],
        );
        this.singleCrudCtrl.comp.s.searchComp.s.plusIcon.update({}, { click: () => this.on_plus_clicked() });
        this.singleCrudCtrl.contextMenus["Edit"] = this.on_edit_clicked.bind(this);
        this.singleCrudCtrl.listDisplayerCtrl.contextMenuOptions = [{label: "Edit"}, {label: "Delete"}, {label: "View"}, {label: "Structure"}];
    }
    set_domains(doms: { value: string; label: string }[], form: NewDynamicFormCtrl){
        let multiSelectCtrl = form.formElementCtrls.domains as MultiSelectCompCtrl;
        multiSelectCtrl.set_options(doms);
    }
    set_operations(ops: { value: string; label: string }[], form: NewDynamicFormCtrl){
        let dropdownCtrl = form.formElementCtrls.operation as DropdownCtrl;
        dropdownCtrl.set_options(ops);
    }
    on_plus_clicked(){
        (this.singleCrudCtrl.model as ActivityCRUDModel).read_for_create_form().then((data: any) => {
            this.singleCrudCtrl.onPlusClicked();
            let doms = data.domains.map((dom: any) => ({ value: dom.id, label: dom.name }));
            let ops = data.operations.map((op: any) => ({ value: op.id, label: op.name }));
            this.set_domains(doms, this.singleCrudCtrl.createForm);
            this.set_operations(ops, this.singleCrudCtrl.createForm);
        });
    }
    on_edit_clicked(data: any){
        (this.singleCrudCtrl.model as ActivityCRUDModel).read_for_create_form().then((all_data: any) => {
            let form = this.singleCrudCtrl.updateForm;
            let modal = GlobalStates.getInstance().getState("modal");
            modal.s.handlers.display(form.comp);
            modal.s.handlers.show();
            modal.s.modalTitle.update({ textContent: "Update" });
            form.current_infos = data;
            let values = {
                table_name: data.table_name,
                domains: data.domains.map((dom: any) => ({ value: dom.id, label: dom.name })),
                operation: data.operation.id,
            }
            
            let doms = all_data.domains.map((dom: any) => ({ value: dom.id, label: dom.name }));
            let ops = all_data.operations.map((op: any) => ({ value: op.id, label: op.name }));
            
            this.set_domains(doms, form);
            this.set_operations(ops, form);
            form.set_value(values);
            let multiSelectCtrl = this.singleCrudCtrl.updateForm.formElementCtrls.domains as MultiSelectCompCtrl;
            multiSelectCtrl.update_ui();
        }); 
    }
}

export const ActivityPage = () => {
    const activityPageCtrl = new ActivityPageCtrl();
    return activityPageCtrl.singleCrudCtrl.comp;
}