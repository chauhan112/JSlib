import { SearchComp, SearchComponentCtrl } from "./SearchComponent";
import { ListDisplayer, ListDisplayerCtrl } from "./ListDisplayer";
import { Tools } from "../../april/tools";

export class SingleCrudModel {
    async read_all (){
        return [{title: "Test"}, {title: "Test2"}, {title: "Test3"}, {title: "Test4"}, {title: "Test5"}, {title: "Test6"}, {title: "Test7"}, {title: "Test8"}, {title: "Test9"}, {title: "Test10"}];
    }
    async read (id: string){
        return {title: "Test"};
    }
    async create (name: string){
        return {title: "Test"};
    }
    async update (id: string, name: string){
        return {title: "Test"};
    }
    async deleteIt (id: string){
        return {title: "Test"};
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