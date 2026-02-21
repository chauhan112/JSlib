import type { GComponent } from "../../../globalComps/GComponent";
import type { ISComponent } from "../../../globalComps/interface";
import { Tools } from "../../../globalComps/tools";
import {
    GRouterController,
    type IApp,
} from "../../DeploymentCenter/interfaces";
import { RandomDataSampleGenerator } from "../lister/data_model";
import { GroupComponent } from "./group_comp";
import type { ISubComponentable } from "./interface";
import { WebpageComp as WebpageComp2 } from "../WebPageWithRoutes/webpage_with_nav";
import { Filter, Home, Library, TreeDeciduous } from "lucide";
import { ExplorerPage } from "./pages/explorer";
import { EnumeratedLister } from "../lister/listers";

class HomepageModel {
    private fav: RandomDataSampleGenerator = new RandomDataSampleGenerator();
    private recent = new RandomDataSampleGenerator();
    constructor() {
        this.fav.set_fields([
            { key: "label", type: "string" },
            { key: "value", type: "text" },
        ]);
        this.fav.total = 5;
        this.fav.generate();

        this.recent.set_fields([
            { key: "label", type: "string" },
            { key: "value", type: "text" },
        ]);
        this.recent.total = 5;
        this.recent.generate();
    }
    async get_recent() {
        return this.recent.read_all();
    }
    async get_favourite() {
        return this.fav.read_all();
    }
}

export class Homepage
    implements
        ISComponent,
        ISubComponentable<{
            favourite: GroupComponent;
            recent: GroupComponent;
        }>
{
    private subcomps = {
        favourite: new GroupComponent(),
        recent: new GroupComponent(),
    };
    private el: GComponent;
    model: HomepageModel = new HomepageModel();
    constructor() {
        this.subcomps.favourite.set_title("Favourites");
        this.subcomps.recent.set_title("Recently Used");
        this.el = Tools.comp("div", {
            class: "flex flex-col w-full h-full",
            children: [
                this.subcomps.favourite.get_comp(),
                this.subcomps.recent.get_comp(),
            ],
        });
    }
    get_comp(): GComponent {
        return this.el;
    }

    get_subcomponents() {
        return this.subcomps;
    }
}

export class UIShowcasePage extends GRouterController {
    info: IApp = {
        name: "UI Showcase",
        href: "/ui-showcase",
        subtitle: "",
        params: [],
    };
    initialized: boolean = false;
    home: Homepage = new Homepage();
    webpage = new WebpageComp2();
    expComp = new ExplorerPage();
    lister = new EnumeratedLister();
    setup() {
        let comps = this.home.get_subcomponents();
        comps.favourite.set_title("Favorites");
        comps.recent.set_title("Recently Used");
        this.home.model.get_favourite().then((data) => {
            comps.favourite.set_items(data);
        });
        this.home.model.get_recent().then((data) => {
            comps.recent.set_items(data);
        });
        this.initialized = true;
        let comps2 = this.webpage.get_subcomponents();

        comps2.header_tools.set_header_clicked(() => {
            console.log("header clicked");
        });
        comps2.sidebar.add_nav_item({
            label: "Home",
            icon: Home,
            value: "home",
        });

        comps2.sidebar.add_nav_item({
            label: "Explorer",
            icon: TreeDeciduous,
            value: "explorer",
        });
        comps2.sidebar.add_nav_item({
            label: "All Elements",
            icon: Library,
            value: "all",
        });
        comps2.sidebar.add_divider("Config");

        comps2.sidebar.add_nav_item({
            label: "Filters",
            icon: Filter,
            value: "filters",
        });
        this.expComp.setup();
        this.lister.set_values([
            {
                title: "React",
            },
            {
                title: "Angular",
            },
            {
                title: "Vue",
            },
        ]);
        comps2.sidebar.on_nav_item_click = (item: any) => {
            let body = this.webpage.get_subcomponents().body;
            switch (item.value) {
                case "home":
                    body.display(this.home.get_comp());
                    break;
                case "explorer":
                    body.display(this.expComp.get_comp());
                    break;
                case "all":
                    body.display(this.lister.get_comp());
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
        comps2.header_tools.set_title("UI Showcase");
    }
    get_component(params: any): GComponent {
        return this.webpage.get_comp();
    }
}
