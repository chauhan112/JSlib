import { SearchComp, SearchComponentCtrl } from "./components/SearchComponent";
import { ListDisplayer, ListDisplayerCtrl } from "./components/ListDisplayer";
import { Tools } from "../../april/tools";
import { InputType } from "../../june/domain-ops/Model";
import { Filter, SearchType } from "../../july/generic-crud/search/model";
import { UiParamsMap } from "../../july/generic-crud/search/controller";
import { MainCtrl as DynamicFormMainCtrl, NewDynamicFormCtrl } from "./components/Form";
import { AdvanceRouter } from "./route/controller";
import { GComponent } from "../../april/GComponent";

export interface SingleCrudModelInterface {
    read_all: () => Promise<any[]>;
    read: (id: string) => Promise<any>;
    create: (data: any) => Promise<any>;
    update: (id: string, data: any) => Promise<any>;
    deleteIt: (id: string) => Promise<void>;
}
export class SingleCrudModel implements SingleCrudModelInterface {
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
    const body = Tools.div({
        class: "w-full flex-col flex gap-2 p-2 ",
        children: [searchComp, listDisplayer],
    });
    return Tools.div({
        class: "w-full flex-col flex gap-2 p-2 ",
        child: body,
    }, {}, { searchComp, listDisplayer, body });
};
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

export class FormController {
    createForm!: NewDynamicFormCtrl;
    updateForm!: NewDynamicFormCtrl;
    createFields: any[] = [{type: InputType.Input, key: "title", params: {placeholder: "Enter title"}}];
    updateFields: any[] = [{type: InputType.Input, key: "title", params: {placeholder: "Enter title"}}];
    setup() {
        this.createForm = DynamicFormMainCtrl.dynamicForm(this.createFields);
        this.updateForm = DynamicFormMainCtrl.dynamicForm(this.updateFields);
    }
    get_create_form() {
        return this.form(this.createForm.comp, "Create");
    }
    private form(comp: any, title: string) {
        return Tools.div({
            class: "w-full flex-col flex gap-2 p-2 ",
            children: [Tools.comp("h3", { class: "text-lg font-semibold text-gray-800 break-all", textContent: title }), comp],
        });
    }
    get_update_form() {
        return this.form(this.updateForm.comp, "Update");
    }
}

export class SingleCrudController {
    comp: any;
    model: SingleCrudModelInterface = new SingleCrudModel();
    dataManager: DataManager = new DataManager();
    searchComponentCtrl: SearchComponentCtrl = new SearchComponentCtrl();
    listDisplayerCtrl: ListDisplayerCtrl = new ListDisplayerCtrl();
    createDataFormCtrl: any = undefined;
    formController: FormController = new FormController();
    viewController: ViewController = new ViewController();
    contextMenus: { [key: string]: any } = {};
    constructor(){
        this.contextMenus = {
            Edit: this.on_edit_clicked.bind(this),
            Delete: this.on_delete_clicked.bind(this),
            View: this.on_view_clicked.bind(this),
        }
    }
    title_getter: (data: any) => string = (data: any) => data.title;
    on_card_clicked: (data: any) => void = (data: any) => {
        console.log(data);
    };
    set_model(model: SingleCrudModelInterface) {
        this.model = model;
    }
    set_comp(comp: any) {
        this.comp = comp;
    }
    on_create_submit(data: any) {
        this.model.create(data).then((res_data: any) => {
            this.dataManager.add_data(res_data);
            this.render_list(true);
            let modal = GlobalStates.getInstance().getState("modal");
            modal.s.handlers.hide();
        });
    }
    on_update_submit(data: any) {
        const id = this.updateForm.current_infos.id;
        
        this.model.update(id, data).then((new_data: any) => {
            this.dataManager.update_data(id, new_data);
            this.updateForm.current_infos = null;
            this.render_list(true);
            let modal = GlobalStates.getInstance().getState("modal");
            modal.s.handlers.hide();
        });
    }
    on_context_menu_clicked(data: any, label: string) {
        this.contextMenus[label](data);
    }
    on_delete_clicked(data: any) {
        if (confirm("Are you sure?")) {
            this.model.deleteIt(data.id).then(() => {
                this.dataManager.remove_data(data.id);
                this.render_list(true);
            });
        }
    }
    on_view_clicked(data: any) {
        let modal = GlobalStates.getInstance().getState("modal");
        modal.s.handlers.display(this.viewController.comp);
        modal.s.handlers.show();
        this.viewController.set_data(data);
        modal.s.modalTitle.update({ textContent: "Content View" });
    }
    render_list(fromLocal: boolean = false){
        if (fromLocal) {
            this.listDisplayerCtrl.set_data(this.dataManager.get_data(), this.title_getter);
            this.listDisplayerCtrl.update();
            return;
        }
        this.model.read_all().then((data: any) => {
            this.listDisplayerCtrl.set_data(data, this.title_getter);
            this.listDisplayerCtrl.update();
            this.dataManager.set_data(data);
        });
    }
    setup(){
        this.searchComponentCtrl.set_comp(this.comp.s.searchComp);
        this.searchComponentCtrl.setup();
        this.listDisplayerCtrl.set_comp(this.comp.s.listDisplayer); 
        this.listDisplayerCtrl.setup();
        this.listDisplayerCtrl.on_card_clicked = (data: any) => this.on_card_clicked(data);
        this.listDisplayerCtrl.on_more_ops_clicked = (data: any, label: string) => this.on_context_menu_clicked(data, label);
        this.createForm = DynamicFormMainCtrl.dynamicForm(this.createFields);
        this.updateForm = DynamicFormMainCtrl.dynamicForm(this.updateFields);
        this.createForm.onSubmit = (data: any) => this.on_create_submit(data);
        this.updateForm.onSubmit = (data: any) => this.on_update_submit(data);
        this.comp.s.searchComp.s.plusIcon.update({}, { click: () => this.onPlusClicked() });
        this.viewController.set_comp(ViewComponent());
        this.searchComponentCtrl.onSearch = (params: { type: SearchType; params: any }[]) => this.on_search(params);
    }
    set_pageSize(pageSize: number) {
        this.listDisplayerCtrl.set_pageSize(pageSize);
    }
    update() {
        this.render_list();
        this.listDisplayerCtrl.update();
    }
    onPlusClicked() {
        let modal = GlobalStates.getInstance().getState("modal");
        this.createForm.setup();
        modal.s.handlers.display(this.createForm.comp);
        modal.s.handlers.show();
        modal.s.modalTitle.update({ textContent: "Create" });
        this.createForm.clear_value();
    }
    on_edit_clicked(data: any) {
        let modal = GlobalStates.getInstance().getState("modal");
        this.updateForm.setup();
        modal.s.handlers.display(this.updateForm.comp);
        modal.s.handlers.show();
        modal.s.modalTitle.update({ textContent: "Update" });
        this.updateForm.current_infos = data;
        this.updateForm.set_value(data);
        
    }
    on_search(params: { type: SearchType; params: any }[]) {
        if (params.length > 0 ) {
            this.dataManager.apply_filter(UiParamsMap(params));
            this.render_list(true);
        }else{
            this.dataManager.clear_filter();
            this.render_list(true);
        }
    }

}
export class DataManager {
    data: any[] = [];
    filteredData: any[] = [];
    filterApplied: boolean = false;
    filter: { type: SearchType; params: any }[] = [];
    remove_data(id: string) {
        this.data = this.data.filter((item: any) => item.id !== id);
        this.sync_data();
    }
    update_data(id: string, data: any) {
        this.data = this.data.map((item: any) => item.id === id ? data : item);
        this.sync_data();
    }
    add_data(data: any) {
        this.data.push(data);
        this.sync_data();
    }
    get_data() {
        return this.filteredData;
    }
    apply_filter(filter: { type: SearchType; params: any }[]) {
        this.filter = filter;
        this.filterApplied = true;
        this.filteredData = Filter.ArrayConcatSearch(filter, this.data);
    }
    set_data(data: any[]) {
        this.data = data;
        this.filteredData = data;
        this.filterApplied = false;
        this.filter = [];
    }
    clear_filter() {
        this.filteredData = this.data;
        this.filterApplied = false;
        this.filter = [];
    }
    sync_data() {
        if (this.filterApplied) {
            this.filteredData = Filter.ArrayConcatSearch(this.filter, this.data);
        } else {
            this.filteredData = this.data;
        }
    }
}

export class MainCtrl {
    static singleCrud(pageSize: number = 10, model?: SingleCrudModelInterface, title_getter?: (data: any) => string, 
            createFields?: any[], updateFields?: any[]) {
        let singleCrudCtrl = new SingleCrudController();
        
        const singleCrud = SingleCrud();
        singleCrudCtrl.set_comp(singleCrud);
        if (model) {
            singleCrudCtrl.set_model(model);
        }
        singleCrudCtrl.set_pageSize(pageSize);
        if (title_getter) {
            singleCrudCtrl.title_getter = title_getter;
        }
        if (createFields) {
            singleCrudCtrl.createFields = createFields;
        }
        if (updateFields) {
            singleCrudCtrl.updateFields = updateFields;
        }
        singleCrudCtrl.setup();
        singleCrudCtrl.update();
        return singleCrudCtrl;
    }
    
}