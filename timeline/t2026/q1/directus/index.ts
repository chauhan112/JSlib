import { DirectusModel } from "./model";
import { GComponent } from "../../../globalComps/GComponent";
import { Tools } from "../../../globalComps/tools";

export interface IForm {
    create_values: any;
    read_fields: string[];
    collection: string;
    update_values: any;
    search_query: string;
    selected_id: string;
    search_query2: string;
}
export interface ITestButtons {
    button_names: string[];
    form: IForm;
    caller: (name: string) => Promise<void>;
    get_component: () => GComponent;
}

class TestForm implements IForm {
    create_values: any = {
        title: "Test",
        description: "Test",
        is_done: false,
    };
    update_values: any = {
        title: "Updating Test",
    };
    selected_id: string = "";
    collection: string = "tasks";
    read_fields: string[] = ["title", "description", "is_done", "id"];
    search_query: string = "Test";
    search_query2: string = "Test2";
}

export class TestButtons implements ITestButtons {
    button_names: string[] = [
        "get_all",
        "get_by_id",
        "create",
        "update",
        "delete",
        "search",
        "get_column_names",
        "search2",
    ];
    directusModel: DirectusModel;
    form: IForm;
    selected_comp: GComponent;
    constructor() {
        this.form = new TestForm();
        this.directusModel = new DirectusModel();
        this.directusModel.set_url_and_token(
            import.meta.env.VITE_DIRECTUS_URL,
            import.meta.env.VITE_DIRECTUS_TOKEN,
        );
        this.selected_comp = Tools.div({
            textContent: "selected id: None",
        });
    }
    async caller(name: string): Promise<void> {
        if (this.button_names.includes(name)) {
            await (this[name as keyof TestButtons] as any)();
        } else {
            console.log("Invalid command");
        }
        if (this.form.selected_id) {
            this.selected_comp.update({
                textContent: "selected id: " + this.form.selected_id,
            });
        }
    }
    async update(): Promise<void> {
        const data = await this.directusModel.update(
            this.form.collection,
            this.form.selected_id,
            this.form.update_values,
        );
        console.log(data.data);
    }
    async get_all(): Promise<void> {
        const data = await this.directusModel.get_all(
            this.form.collection,
            this.form.read_fields,
        );

        console.log(data.data);
        if (data.data.length > 0) {
            this.form.selected_id = data.data[0].id;
        }
    }
    async get_by_id(): Promise<void> {
        const data = await this.directusModel.get_by_id(
            this.form.collection,
            this.form.selected_id,
        );
        console.log(data.data);
    }
    async create(): Promise<void> {
        const data = await this.directusModel.create(
            this.form.collection,
            this.form.create_values,
        );
        this.form.selected_id = data.data.id;
        console.log(data.data);
    }
    async delete(): Promise<void> {
        const data = await this.directusModel.delete(
            this.form.collection,
            this.form.selected_id,
        );
        console.log(data?.data);
        this.form.selected_id = "";
    }

    async search(): Promise<void> {
        const data = await this.directusModel.search(
            this.form.collection,
            this.form.search_query,
            this.form.read_fields,
        );
        console.log(data.data);
    }
    async get_column_names(): Promise<void> {
        const data = await this.directusModel.get_column_names(
            this.form.collection,
        );
        console.log(data.data);
    }
    async search2(): Promise<void> {
        const data = await this.directusModel.search(
            this.form.collection,
            this.form.search_query2,
            this.form.read_fields,
        );
        console.log(data.data);
    }
    get_component(): GComponent {
        let comp = Tools.div({
            class: "flex gap-2",
            children: this.button_names.map((name) => {
                return Tools.comp(
                    "button",
                    {
                        textContent: name,
                        class: "bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer",
                    },
                    {
                        click: (e: any, ls: any) => {
                            this.caller(name);
                        },
                    },
                );
            }),
        });
        return Tools.div({
            children: [this.selected_comp, comp],
        });
    }
}
