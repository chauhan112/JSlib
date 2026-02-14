import type { GComponent } from "../../../globalComps/GComponent";
import {
    type IApp,
    GRouterController,
} from "../../DeploymentCenter/interfaces";
import { Factory, SimpleForm } from "./generic";

export class DynamicFormGenerator extends GRouterController {
    initialized: boolean = false;
    comp: GComponent | null = null;
    form: SimpleForm = Factory.simple_create_form([
        { key: "name", type: "text", placeholder: "Enter name" },
        {
            key: "description",
            type: "textarea",
            placeholder: "Enter description",
        },
        {
            key: "is_done",
            type: "checkbox",
            label: "is done?",
            defaultValue: true,
        },
        {
            key: "priority",
            type: "dropdown",
            options: [
                { value: "low", label: "low" },
                { value: "medium", label: "medium" },
                { value: "high", label: "high" },
            ],
        },
        {
            key: "tags",
            type: "multiselect",
            options: [
                { value: "tag1", label: "tag1" },
                { value: "tag2", label: "tag2" },
                { value: "tag3", label: "tag3" },
            ],
        },
    ]);
    info: IApp = {
        name: "form",
        href: "/dynamic-form-generator",
        subtitle: "dynamic form generator",
        params: [],
    };
    get_component(params: any): GComponent {
        return this.form.get_comp();
    }

    on_submit() {
        console.log(this.form.get_all_values());
        console.log(this.form.get_changed_values());
    }
    setup() {
        this.form!.on_submit = this.on_submit.bind(this);
    }
}
