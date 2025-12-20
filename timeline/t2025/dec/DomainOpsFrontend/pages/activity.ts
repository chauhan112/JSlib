import {  SingleCrudController, MainCtrl as SingleCrudMainCtrl } from "../SingleCrud";
import { backendCall } from "../api_calls";
import { type SingleCrudModelInterface } from "../SingleCrud";
import { GlobalStates } from "../../../june/domain-ops/GlobalStates";
import type { DropdownCtrl, MultiSelectCompCtrl } from "../components/atomic";
import type { NewDynamicFormCtrl } from "../components/Form";
import { AdvanceRouter } from "../route/controller";
import type { GComponent } from "../../../april/GComponent";
import { Tools } from "../../../april/tools";

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

export const StructureComp = () => {
    return Tools.div({
        class: "w-full h-full flex flex-col gap-2",
        children: [
            Tools.comp("h1", { textContent: "Structure" }),
        ],
    });
}

export class StructurePageCtrl {
    comp: any;
    constructor(){
        this.comp = StructureComp();
    }
}
export class ActivityPageCtrl {
    singleCrudCtrl: SingleCrudController;
    comp: any;
    router: AdvanceRouter;
    structurePageCtrl: StructurePageCtrl;
    display_comp!: (comp: GComponent, href: string) => void;
    nav_selector!: (href: string) => void;
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
        this.singleCrudCtrl.contextMenus["Structure"] = this.on_structure_clicked.bind(this);
        this.structurePageCtrl = new StructurePageCtrl();
        this.router = this.singleCrudCtrl.router;
        this.router.addRoute("/structure/{id}/", () => {
            this.display_comp(this.structurePageCtrl.comp, `/activity`);
        });
        this.router.updateRoute("/", () => {
            this.singleCrudCtrl.display_default();
            this.nav_selector("/activity");
        });
    }
    set_display_comp(display_comp: (comp: GComponent, href: string) => void){
        this.display_comp = display_comp;
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
            let doms = data.domains.map((dom: any) => ({ value: dom.id, label: dom.name }));
            let ops = data.operations.map((op: any) => ({ value: op.id, label: op.name }));
            this.set_domains(doms, this.singleCrudCtrl.formController.createForm);
            this.set_operations(ops, this.singleCrudCtrl.formController.createForm);
            this.singleCrudCtrl.router.relative_navigate("/create");
        });
    }
    on_structure_clicked(data: any){
        this.router.relative_navigate(`/structure/${data.id}`);
    }
    on_edit_clicked(data: any){
        (this.singleCrudCtrl.model as ActivityCRUDModel).read_for_create_form().then((all_data: any) => {
            let form = this.singleCrudCtrl.formController.updateForm;
            
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
            let multiSelectCtrl = this.singleCrudCtrl.formController.updateForm.formElementCtrls.domains as MultiSelectCompCtrl;
            multiSelectCtrl.update_ui();
            this.singleCrudCtrl.router.relative_navigate("/edit/" + data.id);
        }); 
    }
    get_comp() {
        return this.singleCrudCtrl.comp;
    }
    set_nav_selector(nav_selector: (href: string) => void) {
        this.nav_selector = nav_selector;
    }
}