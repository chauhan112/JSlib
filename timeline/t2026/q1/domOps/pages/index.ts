import type { GComponent } from "../../../../globalComps/GComponent";
import type { ISComponent } from "../../../../globalComps/interface";
import { Tools } from "../../../../globalComps/tools";
import {
    WebpageComp,
    type WebpageComponentType,
} from "../../WebPageWithRoutes/webpage_with_nav";
import { DevModel } from "../data_model";
import type { Domain, IComponentPage, Operation } from "../interface";
import { Activity, Diamond, Play, Search } from "lucide";
import { ActivityPage } from "./activityPage";
import { AdvanceLister } from "./search_comp";
import type { IDatamodel } from "../../lister/interface";
import { Factory } from "../../dynamicFormGenerator/generic";

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

export class DomainOpsPage extends GenericPage<Domain> implements ISComponent {
    lister = new AdvanceLister();
    model: IDatamodel<Domain> | null = null;

    set_up() {
        this.lister.get_subcomponents().model.create_form =
            Factory.simple_create_form([{ key: "name", type: "text" }]);
        this.lister.get_subcomponents().model.update_form =
            Factory.simple_create_form([{ key: "name", type: "text" }]);
        this.lister.get_subcomponents().model.data_model = this.model!;
        this.lister.setup();
    }

    get_comp(): GComponent {
        return this.lister.get_comp();
    }
}

export class MainPage implements ISComponent {
    webpage = new WebpageComp();
    activity = new ActivityPage();
    model = new DevModel();
    domains = new DomainOpsPage();
    operations = new DomainOpsPage();
    setup() {
        let comps2 = this.webpage.get_subcomponents();
        this.sidebar_setup(comps2);
        this.page_setup(comps2);
        this.activity.model = this.model.get_activity_model();
        this.activity.filterModel = this.model.get_filter_model();
        this.activity.set_up();
        (comps2.sidebar.navs.get("activity") as HTMLElement).click();
        this.domains.model = this.model.get_domain_model();
        this.domains.set_up();
        this.operations.model = this.model.get_operation_model();
        this.operations.set_up();
        this.activity.get_domains = async () => this.domains.model!.read_all();
        this.activity.get_operations = async () =>
            this.operations.model!.read_all();
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
                case "domains":
                    body.display(this.domains.get_comp());
                    break;
                case "operations":
                    body.display(this.operations.get_comp());
                    break;
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
}
