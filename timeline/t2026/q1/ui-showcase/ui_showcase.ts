import type { GComponent } from "../../../globalComps/GComponent";
import type { ISComponent } from "../../../globalComps/interface";
import { Tools } from "../../../globalComps/tools";
import { RandomDataSampleGenerator } from "../lister/data_model";
import { GroupComponent } from "./components/group_comp";
import type { ISubComponentable, LabelValueItem } from "./interface";
import { WebpageComp } from "../WebPageWithRoutes/webpage_with_nav";
import { ExplorerPage } from "./pages/explorer";
import { EnumCtrl, EnumeratedLister } from "../lister/listers";
import {
    AlignLeft,
    ArrowLeft,
    Filter,
    Home,
    Library,
    Star,
    TreeDeciduous,
} from "lucide";
import { InMemoryExplorerModel } from "./generics";
import { apps } from "./add_app";
import { LocalStorageJSONModel } from "../../../t2025/april/LocalStorage";

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
export type AppItem = {
    loc: string[];
    title: string;
    is_favourite?: boolean;
};

export interface IUIModel {
    get_recent(): Promise<AppItem[]>;
    get_favourite(): Promise<AppItem[]>;
    get_apps(): Promise<AppItem[]>;
    add_app(loc: string[], title: string, get_comp: () => GComponent): void;
}

export class UIShowcaseModel implements IUIModel {
    private key_values: { [key: string]: any } = {};
    explorerModel = new InMemoryExplorerModel();
    locStorageModel = new LocalStorageJSONModel("ui-showcase");
    async get_recent() {
        console.log(apps);
        return apps.slice(-5, -1);
    }
    async get_favourite() {
        if (this.locStorageModel.exists(["favourite"])) {
            return this.locStorageModel.readEntry(["favourite"]);
        }
        return [];
    }
    async add_favourite(app: AppItem) {
        if (this.locStorageModel.exists(["favourite"])) {
            let data = this.locStorageModel.readEntry(["favourite"]);
            data.push(app);
            this.locStorageModel.updateEntry(["favourite"], data);
            return;
        }
        this.locStorageModel.addEntry(["favourite"], [app]);
    }

    async get_apps() {
        return Object.values(this.key_values).map((d) => d.app);
    }
    add_app(loc: string[], title: string, get_comp: () => GComponent) {
        let new_loc = [...loc, title];
        this.key_values[JSON.stringify(new_loc)] = {
            app: { title, loc },
            get_comp,
        };
        this.explorerModel.addEntry(new_loc, JSON.stringify(new_loc));
    }
    get_app(app_item: AppItem) {
        return this.key_values[
            JSON.stringify([...app_item.loc, app_item.title])
        ];
    }
}
export class UIShowcase implements ISComponent {
    home: Homepage = new Homepage();
    webpage = new WebpageComp();
    expComp = new ExplorerPage();
    lister = new EnumeratedLister<AppItem>();
    model = new UIShowcaseModel();
    setup() {
        for (let app of apps) {
            this.model.add_app(
                app.loc,
                app.title,
                () => app.get_comp()! as GComponent,
            );
        }
        let comps = this.home.get_subcomponents();
        this.model.get_favourite().then((data) => {
            comps.favourite.set_items(data);
        });
        this.model.get_recent().then((data: AppItem[]) => {
            comps.recent.set_items(
                data.map((d: AppItem) => {
                    return { label: d.title, value: d };
                }),
            );
        });

        comps.favourite.on_item_click = (item: LabelValueItem) => {
            this.display_home(item);
        };

        comps.recent.on_item_click = (item: LabelValueItem) => {
            this.display_home(item);
        };
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
        this.expComp.model = this.model.explorerModel;
        this.expComp.setup();
        this.lister.cardCompCreator = this.comp_creator.bind(this);

        this.model.get_apps().then((data) => {
            this.lister.set_values(data);
        });

        this.expComp.explorer.on_file_clicked = (item: LabelValueItem) => {
            this.expComp.model.get_location().then((loc) => {
                let app = this.model.get_app({ loc, title: item.value });
                this.expComp.display_area.update({
                    innerHTML: "",
                    children: [app.get_comp()],
                });
            });
            console.log(item);
        };

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

        (comps2.sidebar.navs.get("home") as HTMLElement).click();
        comps2.header_tools.set_title("UI Showcase");
    }

    comp_creator(data: AppItem, index: number) {
        let ctrl = new EnumCtrl(
            index + 1,
            data,
            [
                {
                    key: "fav",
                    icon: Star,
                },
            ],
            [
                Tools.icon(Star, {
                    class: "w-5 h-5 text-yellow-500",
                    fill: "currentColor",
                }),
            ],
        );
        ctrl.comp.s.titleComp.update({
            innerHTML: "",
            children: [
                Tools.comp("div", {
                    class: "font-bold text-sm text-slate-700",
                    textContent: data.title,
                }),
                Tools.comp("div", {
                    class: "text-xs text-gray-400",
                    textContent: data.loc.join(" > "),
                }),
            ],
        });
        ctrl.on_click = (data: AppItem) =>
            this.display_comp(data, () => this.lister.get_comp());
        return ctrl;
    }

    get_comp(): GComponent {
        return this.webpage.get_comp();
    }

    private display_home(item: LabelValueItem) {
        this.display_comp(item.value, () => this.home.get_comp());
    }

    display_comp(app_item: AppItem, goBackComp: () => GComponent) {
        let comp = this.model.get_app(app_item).get_comp();
        this.webpage.get_subcomponents().body.display(
            Tools.comp("div", {
                class: "w-full flex flex-col gap-8 cursor-pointer",
                children: [
                    Tools.icon(
                        ArrowLeft,
                        {},
                        {
                            click: () =>
                                this.webpage
                                    .get_subcomponents()
                                    .body.display(goBackComp()),
                        },
                    ),
                    comp,
                ],
            }),
        );
    }
}
