import type { GComponent } from "../../../../globalComps/GComponent";
import type { ISComponent } from "../../../../globalComps/interface";
import { Tools } from "../../../../globalComps/tools";
import {
    SidebarComp,
    WebpageComp,
} from "../../WebPageWithRoutes/webpage_with_nav";
import { DevModel } from "../data_model";
import type {
    Activity,
    Domain,
    IComponentPage,
    IFilterSelector,
    IListerFilter,
} from "../interface";
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
    filterModel: IDatamodel<any> | null = null;
    selectorModel: IFilterSelector | null = null;
    set_up() {
        let comps = this.lister.get_subcomponents();
        comps.model.filter_model = this.filterModel!;
        comps.model.get_filter_selector_model = () => this.selectorModel!;
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
        let comps = this.webpage.get_subcomponents();
        this.sidebar_setup(comps.sidebar);
        this.items_setup();
        this.body = Tools.div({
            class: "flex flex-col flex-1 gap-4",
            children: [
                this.breadcrumbs.get_comp(),
                Tools.div({
                    key: "content",
                    class: "flex flex-col",
                }),
            ],
        });
        this.breadcrumbs.set_values([{ name: "root", value: "" }]);
        this.breadcrumbs.on_click = this.on_breadcrumb_click.bind(this);
        comps.body.display(this.body);
        let lister = this.activity.activity.get_subcomponents()
            .lister as UIListerWithContext;
        lister.on_click = this.on_activity_click.bind(this);
        (comps.sidebar.navs.get("activity") as HTMLElement).click();
    }
    private items_setup() {
        this.activity.model = this.model.get_activity_model();
        this.assing_model_and_selector(
            this.activity,
            this.model.get_filter_model().get_activity(),
        );
        this.activity.set_up();
        this.domains.model = this.model.get_domain_model();
        this.assing_model_and_selector(
            this.domains,
            this.model.get_filter_model().get_domain(),
        );
        this.domains.set_up();
        this.operations.model = this.model.get_operation_model();
        this.assing_model_and_selector(
            this.operations,
            this.model.get_filter_model().get_operation(),
        );
        this.operations.set_up();
        this.activity.get_domains = async () => this.domains.model!.read_all();
        this.activity.get_operations = async () =>
            this.operations.model!.read_all();
    }

    private assing_model_and_selector(inst: any, n: IListerFilter) {
        inst.filterModel = n.get_model();
        inst.selectorModel = n.get_selector();
    }

    private on_activity_click(data: Activity) {
        let comps = this.webpage.get_subcomponents();
        this.breadcrumbs.values.push({
            name: data.name,
            value: data.id,
        });
        this.model.set_parent(data.id);
        this.breadcrumbs.update();
        let selected = this.webpage.get_subcomponents().sidebar.selected_nav;
        (comps.sidebar.navs.get(selected) as HTMLElement).click();
    }
    private on_breadcrumb_click(item: IBreadcrumbItem) {
        this.model.set_parent(item.value as string);
        this.breadcrumbs.values = this.breadcrumbs.get_till_item(item);
        this.breadcrumbs.update();
        let selected = this.webpage.get_subcomponents().sidebar.selected_nav;
        let comps2 = this.webpage.get_subcomponents();
        (comps2.sidebar.navs.get(selected) as HTMLElement).click();
    }
    private sidebar_setup(sidebar: SidebarComp) {
        sidebar.add_nav_item({
            label: "Activity",
            icon: ActivityIcon,
            value: "activity",
        });

        sidebar.add_nav_item({
            label: "Domains",
            icon: Diamond,
            value: "domains",
        });
        sidebar.add_nav_item({
            label: "Operations",
            icon: Play,
            value: "operations",
        });
        sidebar.add_divider("Advance Ops");

        sidebar.add_nav_item({
            label: "Activities in List",
            icon: Search,
            value: "activities-in-list",
        });

        sidebar.on_nav_item_click = (item: any) => {
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
    get_comp(): GComponent {
        return this.webpage.get_comp();
    }

    private display(comp: GComponent): void {
        this.body?.s.content.set_props({ innerHTML: "", child: comp });
    }
}
