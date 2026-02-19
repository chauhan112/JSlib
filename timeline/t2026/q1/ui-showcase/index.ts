import type { GComponent } from "../../../globalComps/GComponent";
import type { ISComponent } from "../../../globalComps/interface";
import { Tools } from "../../../globalComps/tools";
import {
    GRouterController,
    type IApp,
} from "../../DeploymentCenter/interfaces";
import { RandomDataSampleGenerator } from "../lister/data_model";
import { BaseComponent, GroupComponent } from "./group_comp";
import type { IComponent, ISubComponentable } from "./interface";
import { WebpageComp } from "./pages/generic-webpage";

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
    webpage = new WebpageComp();
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
        this.webpage.get_subcomponents().body.display(this.home.get_comp());
    }
    get_component(params: any): GComponent {
        return this.webpage.get_comp();
    }
}
