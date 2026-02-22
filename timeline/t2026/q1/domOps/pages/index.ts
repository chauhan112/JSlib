import type { GComponent } from "../../../../globalComps/GComponent";
import type { ISComponent } from "../../../../globalComps/interface";
import { Tools } from "../../../../globalComps/tools";
import {
    WebpageComp,
    type WebpageComponentType,
} from "../../WebPageWithRoutes/webpage_with_nav";
import { DevModel } from "../data_model";
import type { Domain, IComponentPage } from "../interface";
import { AdvanceLister } from "./search_comp";
import { Activity, Diamond, Play, Search } from "lucide";

export class GenericPage<T> implements IComponentPage<T> {
    comp = Tools.div({ textContent: "Generic Page" });
    parent = "";
    set_data(data: T[]): void {
        throw new Error("Method not implemented.");
    }
    set_parent(parent: string): void {
        this.parent = parent;
    }
    get_comp(): GComponent {
        return this.comp;
    }
}

export class DomainPage extends GenericPage<Domain> {
    set_data(data: Domain[]): void {}
    get_comp(): GComponent {
        return this.comp;
    }
}

export class MainPage implements ISComponent {
    webpage = new WebpageComp();
    activity = new AdvanceLister();
    model = new DevModel();
    setup() {
        let comps2 = this.webpage.get_subcomponents();
        this.sidebar_setup(comps2);
        this.page_setup(comps2);
        this.activity.get_subcomponents().model.data_model =
            this.model.get_activity_model();
        this.activity.get_subcomponents().model.filter_model =
            this.model.get_filter_model();
        this.activity.setup();
        (comps2.sidebar.navs.get("activity") as HTMLElement).click();
    }
    private sidebar_setup(comps2: WebpageComponentType) {
        comps2.header_tools.set_header_clicked(() => {
            console.log("header clicked");
        });

        comps2.sidebar.add_nav_item({
            label: "Activity",
            icon: Activity,
            value: "activity",
        });

        comps2.sidebar.add_nav_item({
            label: "Domains",
            icon: Diamond,
            value: "domains",
        });
        comps2.sidebar.add_nav_item({
            label: "Operations",
            icon: Play,
            value: "operations",
        });
        comps2.sidebar.add_divider("Advance Ops");

        comps2.sidebar.add_nav_item({
            label: "Activities in List",
            icon: Search,
            value: "activities-in-list",
        });
    }
    get_comp(): GComponent {
        return this.webpage.get_comp();
    }
    private page_setup(comps2: WebpageComponentType) {
        comps2.sidebar.on_nav_item_click = (item: any) => {
            let body = this.webpage.get_subcomponents().body;
            switch (item.value) {
                case "activity":
                    body.display(this.activity.get_comp());
                    break;
                // case "explorer":
                //     body.display(this.expComp.get_comp());
                //     break;
                // case "all":
                //     body.display(this.lister.get_comp());
                //     break;
                // case "filters":
                //     body.display(this.home.get_comp());
                //     break;
                default:
                    body.display(
                        Tools.comp("div", { textContent: "coming soon" }),
                    );
                    break;
            }
        };
    }

    private async on_search_click(words: any[]) {
        console.log("search clicked", words);
        let lsubcomp = this.activity.get_subcomponents();
        this.model
            .get_activity_model()
            .read_all()
            .then((data) => {
                lsubcomp.lister.set_values(data);
            });
        return [];
    }
}
