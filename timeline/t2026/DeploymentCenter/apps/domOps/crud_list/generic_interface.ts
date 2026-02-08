import { v4 as uuidv4 } from "uuid";
import type {
    ICRUDModel,
    ListItem,
    IContextMenuOptions,
    IRoute,
    IView,
    ICreateFormFields,
    IUpdateFormFields,
    CrudListModel,
    FormField,
    IViewComponent,
} from "./interface";
import type { GComponent } from "../../../../../globalComps/GComponent";
import type { NewListDisplayerCtrl } from "../../../../../t2025/dec/DomainOpsFrontend/components/ListDisplayer";
import { MainCtrl as RouteWebPageMainCtrl } from "../../../../../t2025/dec/DomainOpsFrontend/route/controller";
import {
    NewDynamicFormCtrl,
    MainCtrl as DynamicFormMainCtrl,
} from "../../../../../t2025/dec/DomainOpsFrontend/components/Form";
import { CreateForm } from "./Components";
import { ViewComponent } from "../../../../../t2025/dec/DomainOpsFrontend/SingleCrud";

export class GenericCrudModel implements ICRUDModel {
    data: any[] = [];
    constructor() {
        for (let i = 0; i < 20; i++) {
            this.data.push({ title: `Test ${i}`, id: i.toString() });
        }
    }
    read_all: () => Promise<ListItem[]> = async () => {
        return this.data.map((item: any) => ({
            title: item.title,
            id: item.id,
            original: item,
        }));
    };
    read: (id: string) => Promise<ListItem> = async (id: string) => {
        const item = this.data.find((item: ListItem) => item.id === id);
        if (!item) {
            throw new Error(`Item with id ${id} not found`);
        }
        return { title: item.title, id: item.id, original: item };
    };
    create: (data: any) => Promise<ListItem> = async (data: any) => {
        const newItem = { ...data, id: uuidv4() };
        this.data.push(newItem);
        return { title: newItem.title, id: newItem.id, original: newItem };
    };
    update: (id: string, data: any) => Promise<ListItem> = async (
        id: string,
        data: any,
    ) => {
        const item = this.data.find((item: ListItem) => item.id === id);
        if (!item) {
            throw new Error(`Item with id ${id} not found`);
        }
        const updatedItem = { ...item, ...data };
        this.data = this.data.map((item: ListItem) =>
            item.id === id ? updatedItem : item,
        );
        return {
            title: updatedItem.title,
            id: updatedItem.id,
            original: updatedItem,
        };
    };
    deleteIt: (id: string) => Promise<void> = async (id: string) => {
        this.data = this.data.filter((item: ListItem) => item.id !== id);
    };
    search: (
        word: string,
        case_sensitive: boolean,
        regex: boolean,
    ) => Promise<ListItem[]> = async (
        word: string,
        case_sensitive: boolean,
        regex: boolean,
    ) => {
        return this.data
            .filter((item: any) => item.title.includes(word))
            .map((item: any) => ({
                title: item.title,
                id: item.id,
                original: item,
            }));
    };
}

export class GenericCrudContextMenuOptions implements IContextMenuOptions {
    parent_ctrl: CrudListModel;
    constructor(parent_ctrl: CrudListModel) {
        this.parent_ctrl = parent_ctrl;
    }
    get_options(): string[] {
        return ["View", "Edit", "Delete"];
    }
    async more_ops_clicked(label: string, data: ListItem) {
        switch (label) {
            case "View":
                this.parent_ctrl.route.route_to("/view", { data: data });
                break;
            case "Edit":
                this.parent_ctrl.route.route_to("/edit", { data: data });
                break;
            case "Delete":
                this.parent_ctrl.model.deleteIt(data.id).then(() => {
                    this.parent_ctrl.view.delete_one(data.id);
                });
                break;
        }
    }
    async clicked(data: any) {
        console.log(data);
    }
}

export class GenericCreateFormFields implements ICreateFormFields {
    form: NewDynamicFormCtrl | undefined;
    parent_ctrl: CrudListModel;
    constructor(parent_ctrl: CrudListModel) {
        this.parent_ctrl = parent_ctrl;
    }
    get_fields(): FormField[] {
        return [
            {
                type: "Input",
                key: "title",
                params: { attrs: { placeholder: "Title" } },
            },
        ];
    }
    get_title: (data: any) => string = (data: any) => {
        return data.title;
    };
    async save(data: any) {
        this.parent_ctrl.model
            .create(data)
            .then((createdItem: ListItem) => {
                this.parent_ctrl.route.route_back();
                this.parent_ctrl.view.create_one(createdItem);
            })
            .catch((error: any) => {
                console.error(error);
            });
    }
    get_form(): GComponent {
        if (!this.form) {
            this.form = DynamicFormMainCtrl.dynamicForm(
                this.get_fields(),
                "Create",
            );
            this.form.onSubmit = this.save_impl.bind(this);
        }
        return CreateForm(
            [this.form.comp],
            () => this.parent_ctrl.route.route_back(),
            "Create New Item",
        );
    }
    private save_impl(data: any) {
        this.save(data);
    }
}

export class GenericUpdateFormFields implements IUpdateFormFields {
    form: NewDynamicFormCtrl | undefined;
    parent_ctrl: CrudListModel;
    prev_data: any = null;
    constructor(parent_ctrl: CrudListModel) {
        this.parent_ctrl = parent_ctrl;
    }
    get_fields(): FormField[] {
        return [
            {
                type: "Input",
                key: "title",
                params: { attrs: { placeholder: "Title" } },
            },
        ];
    }
    get_title: (data: any) => string = (data: any) => {
        return data.title;
    };
    async save(data: any) {
        let updatedData = { ...this.prev_data, ...data };
        console.log("updatedData", updatedData);
        this.parent_ctrl.model
            .update(this.prev_data.id, updatedData)
            .then((updatedItem: ListItem) => {
                this.parent_ctrl.route.route_back();
                this.parent_ctrl.view.update_one(updatedItem);
            })
            .catch((error: any) => {
                console.error(error);
            });
    }
    get_form(): GComponent {
        if (!this.form) {
            this.form = DynamicFormMainCtrl.dynamicForm(
                this.get_fields(),
                "Update",
            );
            this.form.onSubmit = this.save_impl.bind(this);
        }
        let data = this.parent_ctrl.route.get_params();
        if (data) {
            this.prev_data = data.data.original;
            this.form.set_value(this.prev_data);
        } else {
            this.parent_ctrl.route.route_back();
        }
        return CreateForm(
            [this.form.comp],
            () => this.parent_ctrl.route.route_back(),
            "Update Item",
        );
    }
    private save_impl(data: any) {
        this.save(data);
    }
}

export class GenericView implements IView {
    comp: NewListDisplayerCtrl;
    constructor(comp: NewListDisplayerCtrl) {
        this.comp = comp;
    }
    set_data(data: ListItem[]) {
        this.comp.set_data(data);
        this.comp.update();
    }
    update_one(data: ListItem) {
        this.comp.paginationCtrl.model.data =
            this.comp.paginationCtrl.model.data.map((item: ListItem) =>
                item.id === data.id ? data : item,
            );
        this.comp.update();
    }
    delete_one(id: string) {
        this.comp.paginationCtrl.model.data =
            this.comp.paginationCtrl.model.data.filter(
                (item: ListItem) => item.id !== id,
            );
        this.comp.paginationCtrl.model.maxPage =
            this.comp.paginationCtrl.model.getMaxPage();
        this.comp.update();
    }
    create_one(data: ListItem) {
        this.comp.paginationCtrl.model.data.push(data.original);
        this.comp.paginationCtrl.model.maxPage =
            this.comp.paginationCtrl.model.getMaxPage();
        this.comp.update();
    }
}

export class GenericRoute implements IRoute {
    routes: { [key: string]: () => GComponent } = {};
    selected_route: GComponent | null = null;
    selected_params: any = null;
    route_to(path: string, params?: any) {
        this.selected_params = params;
        RouteWebPageMainCtrl.relative_navigate(path, params);
    }
    route_back(n: number = 1) {
        RouteWebPageMainCtrl.go_back(n);
    }
    define_route(path: string, componentFunction: () => GComponent) {
        this.routes[path] = componentFunction;
    }
    match_route(path: string) {
        if (this.routes[path]) {
            this.selected_route = this.routes[path]();
            return true;
        }
        return false;
    }
    get_matched_route(): GComponent {
        let route = this.selected_route;
        if (!route) {
            throw new Error("No route selected");
        }
        this.selected_route = null;
        return route;
    }
    get_params(): any {
        let params = this.selected_params;
        this.selected_params = null;
        return params;
    }
}

export class GenericViewComponent implements IViewComponent {
    comp: GComponent;
    parent_ctrl: CrudListModel;

    constructor(parent_ctrl: CrudListModel) {
        this.parent_ctrl = parent_ctrl;
        this.comp = ViewComponent();
    }
    get_comp(): GComponent {
        let data = this.parent_ctrl.route.get_params();
        if (data) {
            this.set_data(data.data.original);
        } else {
            this.parent_ctrl.route.route_back();
        }
        return this.comp;
    }
    set_data(data: any) {
        (this.comp.getElement() as HTMLTextAreaElement).value = JSON.stringify(
            data,
            null,
            2,
        );
    }
}
