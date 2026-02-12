import type { GComponent } from "../../globalComps/GComponent";
import { Tools } from "../../globalComps/tools";
import { Settings } from "lucide";
import { MainCtrl as RouteWebPageMainCtrl } from "../../t2025/dec/DomainOpsFrontend/route/controller";
import { type IApp, type IRouteController } from "./interfaces";
import { GRouteController } from "./routeController";
import { DefaultPageContent } from "../../t2025/dec/DomainOpsFrontend/route/ui";
import {
    MainCtrl as LocalStorageConfigurerMainCtrl,
    LocalStorageConfigurer,
} from "../../t2025/dec/localStorageSetter";
import { AppCard } from "./Components";
import {
    DefaultPageSkeleton,
    MainCtrl as DefaultPageSkeletonMainCtrl,
} from "./apps/defaults";
import { type DeploymentCenterPageCtrl } from "./index";

const Section = (title: string, children: GComponent[]) => {
    return Tools.comp("section", {
        class: "mb-12",
        children: [
            Tools.comp("h2", {
                class: "text-lg font-semibold text-gray-700 mb-4 uppercase tracking-wider",
                textContent: title,
            }),
            ...children,
        ],
    });
};

export const SettingsPage = () => {
    let cog = Tools.comp("div", {
        class: "p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors",
        children: [Tools.icon(Settings, { class: "w-4 h-4" })],
    });
    let labels = Tools.comp("div", {
        children: [
            Tools.comp("h3", {
                class: "text-xl font-bold text-gray-800",
                textContent: "Global Configuration",
            }),
            Tools.comp("p", {
                class: "text-gray-500",
                textContent: "API keys, theme settings, and security policies.",
            }),
        ],
    });
    let global_config_panel = Tools.comp("div", {
        class: "group bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex items-center justify-between",
        children: [
            Tools.comp("div", {
                class: "flex items-center space-x-5",
                children: [cog, labels],
            }),
        ],
    });
    let appList = Tools.comp("div", {
        class: "grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-6 overflow-auto",
    });
    let comp = Tools.comp(
        "div",
        {
            class: "p-8",
            children: [
                Section("System-Wide", [global_config_panel]),
                Section("Installed Applications", [appList]),
            ],
        },
        {},
        { appList, global_config_panel, cog, labels },
    );
    return comp;
};

export class SettingsPageCtrl
    extends GRouteController
    implements IRouteController
{
    comp: any | undefined;
    private apps: IApp[] = [];
    sub_routes: string[] = ["global", "apps"];
    ctrl: DefaultPageSkeleton;
    localStorageSetterCtrl: LocalStorageConfigurer;
    initialized: boolean = false;
    private path: string = "";
    parent: DeploymentCenterPageCtrl;
    constructor(parent: DeploymentCenterPageCtrl) {
        super();
        this.localStorageSetterCtrl =
            LocalStorageConfigurerMainCtrl.localStorageConfigurer(
                "DeploymentCenterSettings",
            );
        this.ctrl = DefaultPageSkeletonMainCtrl.defaultPageSkeleton(
            "/settings",
            { name: "Settings", href: "/settings", subtitle: "Settings" },
        );
        this.parent = parent;
    }
    setup() {
        this.comp.s.global_config_panel.update(
            {},
            { click: () => RouteWebPageMainCtrl.navigate("/settings/global") },
        );
        this.set_apps(this.apps);
        this.initialized = true;
    }
    set_comp(comp: any) {
        this.comp = comp;
    }
    get_body_comp(path: string) {
        if (path.startsWith("/settings/global")) {
            return this.get_global_settings_comp();
        }
        if (path === "/settings") {
            return this.comp;
        }
        let remaining_path = path.replace("/settings", "");
        let app = this.apps.find((app) => app.href === remaining_path);
        if (app?.params?.length && app.params.length > 0) {
            return this.get_app_settings_comp(app);
        }

        return DefaultPageContent("No settings found");
    }
    set_apps(apps: IApp[]) {
        this.apps = apps;
        let apps_with_settings = apps.filter(
            (app) => app.params?.length && app.params.length > 0,
        );
        this.comp.s.appList.update({
            innerHTML: "",
            children: apps_with_settings.map((app) =>
                MainCtrl.appCard({
                    name: app.name,
                    subtitle: `${app.params?.length} settings`,
                    href: app.href,
                }),
            ),
        });
    }
    matches_path(path: string): boolean {
        this.path = path;
        return path.startsWith("/settings");
    }
    get_component(params: any): GComponent {
        this.set_apps(this.parent.home_route_ctrl.apps);
        let res = this.ctrl.get_component(params);
        this.ctrl.body_comp.update({
            innerHTML: "",
            child: this.get_body_comp(this.path),
        });

        return res;
    }
    get_app_settings_comp(app: IApp) {
        this.localStorageSetterCtrl.set_title(app.name + " Settings");
        this.localStorageSetterCtrl.model_location = ["apps", app.href];
        this.localStorageSetterCtrl.load_keys(app.params || []);
        return this.localStorageSetterCtrl.comp;
    }

    get_app_infos(app: IApp) {
        if (this.localStorageSetterCtrl.model.exists(["apps", app.href])) {
            return this.localStorageSetterCtrl.model.readEntry([
                "apps",
                app.href,
            ]);
        }
        return {};
    }

    get_global_infos() {
        this.localStorageSetterCtrl.model_location = [];
        if (this.localStorageSetterCtrl.model.exists(["global"])) {
            return this.localStorageSetterCtrl.model.readEntry(["global"]);
        }
        return {};
    }

    get_global_settings_comp() {
        this.localStorageSetterCtrl.set_title("Global Settings");
        this.localStorageSetterCtrl.model_location = ["global"];
        this.localStorageSetterCtrl.loadExisting();
        return this.localStorageSetterCtrl.comp;
    }
}

export class MainCtrl {
    static settingsPage() {
        const settingsPageCtrl = new SettingsPageCtrl({} as any);
        settingsPageCtrl.set_comp(SettingsPage());
        settingsPageCtrl.setup();
        return settingsPageCtrl;
    }
    static appCard(app: IApp) {
        let card = AppCard({
            icon: MainCtrl.get_icon_from_name(app.name),
            name: app.name,
            status: app.subtitle,
        });
        card.update(
            {},
            { click: () => RouteWebPageMainCtrl.relative_navigate(app.href) },
        );
        return card;
    }
    static get_icon_from_name(name: string) {
        let icons = [
            "🌍",
            "🔥",
            "💧",
            "🍎",
            "🌱",
            "🍇",
            "🎮",
            "💨",
            "⛰️",
            "⚡",
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i);
        }
        return icons[hash % icons.length];
    }
}
