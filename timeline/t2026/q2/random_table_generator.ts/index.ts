import type { GComponent } from "../../../globalComps/GComponent";
import { Tools } from "../../../globalComps/tools";
import {
    GRouterController,
    type IApp,
} from "../../DeploymentCenter/interfaces";
import { Textarea } from "../../q1/dynamicFormGenerator/generic";
import { RandomDataSampleGenerator } from "../../q1/lister/data_model";
import { json2csv } from "json-2-csv";

// import { Parser } from "json2csv";
// bun add json-2-csv

export class RandomContentGenerator extends GRouterController {
    info: IApp = {
        name: "/random table ",
        href: "/random_table_generator",
        subtitle: "data as json",
        params: [],
    };
    initialized: boolean = false;
    result = new Textarea();
    comp: GComponent | null = null;
    setup() {
        this.result.get_comp().getElement().classList.remove("h-40");
        this.result.get_comp().getElement().classList.add("h-full");
        this.comp = Tools.div({
            class: "flex flex-col gap-2 h-screen",
            children: [
                this.result.get_comp(),
                Tools.comp(
                    "button",
                    {
                        textContent: "generate",
                        class: "cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded",
                    },
                    { click: () => this.generate() },
                ),
            ],
        });
        this.initialized = true;
    }
    async generate() {
        let rand = new RandomDataSampleGenerator();
        rand.set_fields([
            { key: "title", type: "string" },
            { key: "description", type: "text" },
        ]);
        rand.generate();
        let vals = await rand.read_all();
        // convert to csv from json [{"title": "a", "description": "b"}, {"title": "c", "description": "d"}]

        let csv = json2csv(vals);
        this.result.set_value(csv);
    }
    get_component(params: any): GComponent {
        return this.comp!;
    }
}
