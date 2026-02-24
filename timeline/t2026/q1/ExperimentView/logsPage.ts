import type { GComponent } from "../../../globalComps/GComponent";
import { Factory } from "../dynamicFormGenerator/generic";
import type { IDynamicFormGenerator } from "../dynamicFormGenerator/interface";
import {
    DirectusTableModel,
    TokenFromLocalStorage,
} from "../lister/data_model";
import type { ILister, IRouter } from "../lister/interface";
import { ListerWithContext } from "../lister/listers/simple";
import { SimpleRouter } from "../lister/navigators";
import type { IWebPage } from "../WebPageWithRoutes/interface";

export class LogsPage implements IRouter {
    lister: ILister = new ListerWithContext();
    model: DirectusTableModel;
    private path_comp: GComponent | null = null;
    table_name = "raja_experiments_logs";
    navigator: SimpleRouter = new SimpleRouter();
    exp_id: string = "";
    page: IWebPage | null = null;
    on_load_func = () => {};
    form: IDynamicFormGenerator = Factory.simple_create_form([
        { key: "Did", type: "textarea", placeholder: "what you did" },
        { key: "Next", type: "textarea", placeholder: "what you will do" },
    ]);
    constructor() {
        this.model = new DirectusTableModel(
            this.table_name,
            new TokenFromLocalStorage("DeploymentCenterSettings"),
        );
        let lister = this.lister as ListerWithContext;
        lister.contextMenuOptions = [{ label: "Delete" }];
        lister.on_click = (data: any) => {
            this.navigator.relative_route("" + data.id, data);
        };
        lister.on_context_clicked = this.on_context_clicked.bind(this);
        lister.set_title_func((data: any) => data.Did.toString().slice(0, 40));
        this.define_routes();
    }

    get_element(path: string, params?: any): GComponent | null {
        this.set_exp_id(params.exp_id);
        return this.navigator.get_element(path, params);
    }

    on_context_clicked(data: any, label: string) {
        if (label === "Delete") {
            if (confirm("Are you sure?")) {
                console.log("deletibg it", data);
            }
            return;
        }
        this.navigator.relative_route(
            label.toLowerCase() + "/" + data.id,
            data,
        );
    }

    define_routes() {
        this.navigator.add_path("", (params: any) => this.root_list_comp());
        this.navigator.add_path("/{log_id}", (params: any) => {
            console.log("view", params);
            let curVals = this.navigator.get_current_params();
            if (curVals) this.form.set_values(curVals);
            else
                this.model
                    .read_all_with({
                        id: params.log_id,
                        experiment_id: this.exp_id,
                    })
                    .then((data: any[]) => {
                        if (data.length > 0) this.form.set_values(data[0]);
                        else this.navigator.step_back();
                    });
            return this.form.get_comp();
        });
        this.navigator.add_path("/edit/{log_id}", (params: any) => {
            console.log("edit", params);
            return this.root_list_comp();
        });
    }

    root_list_comp() {
        this.model
            .read_all_with({ experiment_id: this.exp_id })
            .then((data: any) => {
                this.lister.set_values(data);
            });
        this.on_load_func();
        this.page!.get_body().display(this.lister.get_comp());
        return this.page!.get_comp();
    }
    set_exp_id(exp_id: string) {
        this.exp_id = exp_id;
    }
    set_web_page(page: IWebPage) {
        this.page = page;
    }
    set_header_setup(func: () => void) {
        this.on_load_func = func;
    }
}
