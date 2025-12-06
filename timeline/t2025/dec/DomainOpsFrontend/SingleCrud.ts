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
    });
};

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