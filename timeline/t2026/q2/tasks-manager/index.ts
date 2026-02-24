import { th } from "@faker-js/faker";
import type { GComponent } from "../../../globalComps/GComponent";
import type { ISComponent } from "../../../globalComps/interface";
import { GRouterController } from "../../DeploymentCenter/interfaces";
import {
    AdvanceLister,
    UIListerWithContext,
} from "../../q1/domOps/pages/search_comp";
import {
    Factory,
    type IFormSimpleFormElement,
} from "../../q1/dynamicFormGenerator/generic";
import {
    DirectusTableModel,
    LocalStorageDataModel,
    TokenFromLocalStorage,
} from "../../q1/lister/data_model";
import type { LocalStorageJSONModel } from "../../../t2025/april/LocalStorage";
import type { IDatamodel } from "../../q1/lister/interface";
import { PageWithGoBackComp } from "../../q1/domOps/pages/PageWithGoBackComp";
import { Tools } from "../../../globalComps/tools";

export interface IDirectusCrudModelPage {
    get_token_getter(): TokenFromLocalStorage;
    get_create_form_fields(): IFormSimpleFormElement[];
    get_update_form_fields(): IFormSimpleFormElement[];
    get_table_name(): string;
    get_title(data: any): string;
    get_local_filter_selector_model_key(): string;
    get_local_storage_filter_model_key(): string;
    on_create(data: any, model: IDatamodel<any>): Promise<any>;
}

export class LogsModel implements IDirectusCrudModelPage {
    private tokenGetter: TokenFromLocalStorage = new TokenFromLocalStorage(
        "DeploymentCenterSettings",
    );
    private fields: IFormSimpleFormElement[] = [
        { key: "did", type: "textarea" },
        { key: "next", type: "textarea" },
    ];
    task_id: string = "";
    get_token_getter(): TokenFromLocalStorage {
        return this.tokenGetter;
    }
    get_create_form_fields(): IFormSimpleFormElement[] {
        return this.fields;
    }
    get_update_form_fields(): IFormSimpleFormElement[] {
        return this.fields;
    }
    get_table_name(): string {
        return "raja_generic_logs";
    }
    get_title(data: any): string {
        return data.did.slice(0, 16);
    }
    get_local_filter_selector_model_key(): string {
        return "tasks_manager_logs_selector";
    }
    get_local_storage_filter_model_key(): string {
        return "tasks_manager_logs";
    }
    on_create(data: any, model: IDatamodel<any>) {
        return model.create({ ...data, more: "raja_tasks:" + this.task_id });
    }
    set_task_id(task_id: string): void {
        this.task_id = task_id;
    }
}

export class TaskModel implements IDirectusCrudModelPage {
    private tokenGetter: TokenFromLocalStorage = new TokenFromLocalStorage(
        "DeploymentCenterSettings",
    );
    private fields: IFormSimpleFormElement[] = [
        { key: "title", type: "text" },
        { key: "description", type: "textarea" },
        { key: "done", type: "checkbox", label: "-" },
        { key: "estimation", type: "number" },
        { key: "conclusions", type: "textarea" },
    ];
    get_token_getter(): TokenFromLocalStorage {
        return this.tokenGetter;
    }
    get_create_form_fields(): IFormSimpleFormElement[] {
        return this.fields;
    }
    get_update_form_fields(): IFormSimpleFormElement[] {
        return this.fields;
    }
    get_table_name(): string {
        return "raja_tasks";
    }
    get_title(data: any): string {
        return data.title;
    }
    get_local_filter_selector_model_key(): string {
        return "tasks_manager_tasks_selector";
    }
    get_local_storage_filter_model_key(): string {
        return "tasks_manager_tasks";
    }
    on_create(data: any, model: IDatamodel<any>) {
        return model.create(data);
    }
}

export class AnyTableManager implements ISComponent {
    lister: AdvanceLister | null = null;
    model: IDirectusCrudModelPage = new LogsModel();
    get_comp(): GComponent {
        if (this.lister) return this.lister.get_comp();
        this.lister = new AdvanceLister();
        let comps = this.lister.get_subcomponents();
        comps.model.create_form = Factory.simple_create_form(
            this.model.get_create_form_fields(),
        );
        comps.model.update_form = Factory.simple_create_form(
            this.model.get_update_form_fields(),
        );
        comps.model.data_model = new DirectusTableModel(
            this.model.get_table_name(),
            this.model.get_token_getter(),
        );
        comps.model.filter_model = new LocalStorageDataModel(
            this.model.get_local_storage_filter_model_key(),
        ) as IDatamodel<any>;

        (
            comps.model.filter_selector_model as LocalStorageJSONModel
        ).setLocalStorageKey(this.model.get_local_filter_selector_model_key());
        (comps.lister as UIListerWithContext).set_title_func((data: any) =>
            this.model.get_title(data),
        );
        this.lister.setup();
        comps.model.create_form.on_submit = () => {
            this.model
                .on_create(
                    comps.model.create_form.get_all_values(),
                    comps.model.data_model,
                )
                .then(() => {
                    comps.model.create_form.reset_fields();
                    this.lister!.get_comp();
                });
        };

        return this.lister.get_comp();
    }
}

export class TasksView implements ISComponent {
    tasks: AnyTableManager = new AnyTableManager();
    logs: AnyTableManager = new AnyTableManager();
    page: PageWithGoBackComp = new PageWithGoBackComp();
    comp: GComponent = Tools.div();
    setup() {
        let logsModel = new LogsModel();
        this.tasks.model = new TaskModel();
        this.logs.model = logsModel;
        this.tasks.get_comp();
        this.logs.get_comp();
        let comps = this.tasks.lister?.get_subcomponents();
        this.page.on_go_back = () => this.on_go_back();

        (comps?.lister as UIListerWithContext).on_click = (data) => {
            logsModel.set_task_id(data.id);
            this.page.display(this.logs.get_comp());
            this.page.set_title(this.tasks.model.get_title(data));
            let model = this.logs.lister?.get_subcomponents().model
                .data_model as DirectusTableModel;
            model.read_all = () =>
                model.read_all_with({
                    more:
                        this.tasks.model.get_table_name() +
                        ":" +
                        logsModel.task_id,
                });
            this.logs.lister?.get_subcomponents().lister?.set_values([]);
            this.comp.set_props({
                innerHTML: "",
                children: [this.page.get_comp()],
            });
        };
        this.on_go_back();
    }
    on_go_back() {
        this.comp.set_props({
            innerHTML: "",
            children: [this.tasks.get_comp()],
        });
    }
    get_comp(): GComponent {
        return this.comp;
    }
}

export class TaskPage extends GRouterController {
    info = {
        name: "Tasks Manager",
        href: "/tasks",
        subtitle: "manage tasks",
        params: [],
    };
    initialized: boolean = false;
    tv = new TasksView();
    setup() {
        this.tv.setup();
        this.initialized = true;
    }

    get_component(params: any): GComponent {
        return this.tv.get_comp();
    }
}
