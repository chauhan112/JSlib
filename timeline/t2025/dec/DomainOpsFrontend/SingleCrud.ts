import { SearchComp, SearchComponentCtrl } from "./SearchComponent";
import { ListDisplayer, ListDisplayerCtrl } from "./ListDisplayer";
import { Tools } from "../../april/tools";
import { DynamicFormController } from "../../july/DynamicForm";
import { GlobalStates } from "../../june/domain-ops/GlobalStates";
import { InputType } from "../../june/domain-ops/Model";

export class SingleCrudModel {
    data: any[] = [];
    constructor() {
        for (let i = 0; i < 10; i++) {
            this.data.push({title: `Test ${i}`, "id": i});
        }
    }
    async read_all (){
        return this.data;
    }
    async read (id: string){
        return this.data.find((item: any) => item.id === id);
    }
    async create (data: any){
        const newItem = { ...data, id: this.data.length + 1 };
        this.data.push(newItem);
        return newItem;
    }
    async update (id: string, data: any){
        const newData = [];
        for (let item of this.data) {
            if (item.id === id) {
                newData.push({ ...item, ...data });
            } else {
                newData.push(item);
            }
        }
        this.data = newData;
    }
    async deleteIt (id: string){
        this.data = this.data.filter((item: any) => item.id !== id);
    }
}
export const SingleCrud = () => {
    const searchComp = SearchComp();
    searchComp.getElement().classList.remove("p-4");

    const listDisplayer = ListDisplayer();
    return Tools.div({
        class: "w-full flex-col flex gap-2 p-2 ",
        children: [searchComp, listDisplayer],
    }, {}, { searchComp, listDisplayer });
};
export class DynamicFormManager {
    fields: any[] = [];
    dataFormCtrl: any = undefined;
    currentId: any;
    onSubmit: (data: any, id: any) => void = (data: any, id: any) => {
        console.log(data, id);
    };
    set_fields(fields: any[]) {
        this.fields = fields;
    }
    get_values() {
        return this.dataFormCtrl.comp.s.handlers.getValues();
    }
    clear_values() {
        this.dataFormCtrl.comp.s.handlers.clearValues();
    }
    set_values(id: any, values: any) {
        this.dataFormCtrl.comp.s.handlers.setValues(values);
        this.currentId = id;
    }
    private def_submit(e: any,) {
        e.preventDefault();
        this.onSubmit(this.get_values(), this.currentId);
    }
    setup() {
        if (!this.dataFormCtrl) {
            this.dataFormCtrl = DynamicFormController();
            this.dataFormCtrl.comp.s.handlers.submit = this.def_submit.bind(this);
            this.dataFormCtrl.setFields(this.fields);
        }
    }
}
export const ViewComponent = () => {
    return Tools.comp("textarea", {
        placeholder: "content goes here",
        class: "h-64 w-full border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
        disabled: true,
    });
}
export class ViewController {
    comp: any;
    set_comp(comp: any) {
        this.comp = comp;
    }
    set_data(data: any) {
        (this.comp.getElement() as HTMLTextAreaElement).value = JSON.stringify(
            data,
            null,
            2
        );
    }
}
export class SingleCrudController {
    comp: any;
    model: SingleCrudModel = new SingleCrudModel();
    searchComponentCtrl: SearchComponentCtrl = new SearchComponentCtrl();
    listDisplayerCtrl: ListDisplayerCtrl = new ListDisplayerCtrl();
    set_model(model: SingleCrudModel) {
        this.model = model;
    }
    set_comp(comp: any) {
        this.comp = comp;
    }
    setup(){
        this.searchComponentCtrl.set_comp(this.comp.s.searchComp);
        this.searchComponentCtrl.setup();
        this.listDisplayerCtrl.set_comp(this.comp.s.listDisplayer);
        this.listDisplayerCtrl.setup();
    }
    
}