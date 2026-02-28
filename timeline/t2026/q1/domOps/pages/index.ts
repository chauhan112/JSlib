import type { GComponent } from "../../../../globalComps/GComponent";
import type { ISComponent } from "../../../../globalComps/interface";
import { Tools } from "../../../../globalComps/tools";
import {
    WebpageComp,
    type WebpageComponentType,
} from "../../WebPageWithRoutes/webpage_with_nav";
import { DevModel } from "../data_model";
import type { Activity, Domain, IComponentPage, Operation } from "../interface";
import { Activity as ActivityIcon, Diamond, Play, Search } from "lucide";
import { ActivityPage } from "./activityPage";
import { AdvanceLister, UIListerWithContext } from "./search_comp";
import type { IDatamodel } from "../../lister/interface";
import { Factory } from "../../dynamicFormGenerator/generic";
import { Breadcrumb } from "../../breadcrumb/generic";
import type { IBreadcrumbItem } from "../../breadcrumb/interface";

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
    update_ui() {
        this.model
            ?.read_all()
            .then((data) => this.lister.lister!.set_values(data));
    }
}

export class MainPage implements ISComponent {
    webpage = new WebpageComp();
    activity = new ActivityPage();
    model = new DevModel();
    domains = new DomainOpsPage();
    operations = new DomainOpsPage();
    breadcrumbs = new Breadcrumb();
    private body: GComponent | null = null;
    setup() {
        let comps2 = this.webpage.get_subcomponents();
        this.sidebar_setup(comps2);
        this.page_setup(comps2);
        this.activity.model = this.model.get_activity_model();
        this.activity.filterModel = this.model.get_filter_model();
        this.activity.set_up();
        this.domains.model = this.model.get_domain_model();
        this.domains.set_up();
        this.operations.model = this.model.get_operation_model();
        this.operations.set_up();
        this.activity.get_domains = async () => this.domains.model!.read_all();
        this.activity.get_operations = async () =>
            this.operations.model!.read_all();
        this.body = Tools.div({
            class: "flex flex-col flex-1 gap-4",
            children: [
                this.breadcrumbs.get_comp(),
                Tools.div({
                    key: "content",
                    class: "flex flex-col max-h-full overflow-y-auto",
                }),
            ],
        });
        this.breadcrumbs.set_values([{ name: "root", value: "" }]);
        this.breadcrumbs.on_click = (item: IBreadcrumbItem) =>
            this.on_breadcrumb_click(item);
        let body = this.webpage.get_subcomponents().body;
        body.display(this.body);
        let lister = this.activity.activity.get_subcomponents()
            .lister as UIListerWithContext;
        lister.on_click = (data: Activity) => {
            this.model.loc.push(data);
            this.breadcrumbs.set_values([
                { name: "root", value: "" },
                ...this.model.loc.map((item) => ({
                    name: item.name,
                    value: item.id,
                })),
            ]);
            console.log(this.webpage.get_subcomponents().sidebar.selected_nav);
            let selected =
                this.webpage.get_subcomponents().sidebar.selected_nav;
            (comps2.sidebar.navs.get(selected) as HTMLElement).click();
            this.activity.update_ui();
        };
        (comps2.sidebar.navs.get("activity") as HTMLElement).click();
    }

    private on_breadcrumb_click(item: IBreadcrumbItem) {
        this.breadcrumbs.values = this.breadcrumbs.get_till_item(item);

        if (this.breadcrumbs.values.length === 1) {
            this.model.loc = [];
        } else {
            let tillItems = [];
            let last =
                this.breadcrumbs.values[this.breadcrumbs.values.length - 1];
            for (let item of this.model.loc) {
                tillItems.push(item);
                if (item.id === last.value) {
                    break;
                }
            }
            this.model.loc = tillItems;
        }
        this.breadcrumbs.update();
        let selected = this.webpage.get_subcomponents().sidebar.selected_nav;
        let comps2 = this.webpage.get_subcomponents();
        (comps2.sidebar.navs.get(selected) as HTMLElement).click();
    }

    private sidebar_setup(comps2: WebpageComponentType) {
        comps2.header_tools.set_header_clicked(() => {
            console.log("header clicked");
        });

        comps2.sidebar.add_nav_item({
            label: "Activity",
            icon: ActivityIcon,
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

    private display(comp: GComponent): void {
        this.body?.s.content.set_props({ innerHTML: "", child: comp });
    }

    private page_setup(comps2: WebpageComponentType) {
        comps2.sidebar.on_nav_item_click = (item: any) => {
            switch (item.value) {
                case "activity":
                    this.activity.update_ui();
                    this.display(this.activity.get_comp());
                    break;
                case "domains":
                    this.domains.update_ui();
                    this.display(this.domains.get_comp());
                    break;
                case "operations":
                    this.operations.update_ui();
                    this.display(this.operations.get_comp());
                    break;
                default:
                    this.display(
                        Tools.comp("div", { textContent: "coming soon" }),
                    );
                    break;
            }
        };
    }
}
