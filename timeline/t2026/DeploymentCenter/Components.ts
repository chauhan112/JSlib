import { Keyboard, Search, Sliders, Terminal } from "lucide";
import { Tools } from "../../globalComps/tools";
import { MainCtrl as RouteWebPageMainCtrl } from "../../t2025/dec/DomainOpsFrontend/route/controller";
import { RouteWebPage, SidebarCtrl } from "../../t2025/dec/DomainOpsFrontend/route/ui";

const Head = () => {
    return Tools.comp("div", {
        class: "flex items-center gap-2 cursor-pointer",
        children: [
            Tools.comp("div", {
                class:
                    "w-8 h-8 bg-black rounded flex items-center justify-center text-white",
                children: [Tools.icon(Terminal, { class: "w-4 h-4" })],
            }),
            Tools.comp("span", {
                class: "font-bold hidden sm:block",
                textContent: "DevStack",
            }),
        ],
    });
}
export const HeaderWithSearch = () => {
    const setting = Tools.comp("div", {
        class: "flex items-center gap-2",
        children: [
            Tools.comp("button", {
                class: "p-2 hover:bg-gray-100 rounded-full text-gray-600 cursor-pointer",
                children: [Tools.icon(Sliders, { class: "w-4 h-4" })],
            }),
        ],
    })
    const search = SearchBar();
    const title = Head();
    return Tools.comp("header", {
        class: "bg-white border-b px-4 py-3 sticky top-0 z-50",
        children: [
            Tools.comp("div", {
                class: "max-w-7xl mx-auto flex items-center justify-between gap-4",
                children: [
                    title,
                    search,
                    setting,
                ],
            }),
        ],
    }, {}, { title, search, setting });
}
const SearchBar = () => {
    return Tools.comp("form", {
        class: "flex-1 max-w-xl relative group",
        children: [
            Tools.icon(Search, { class: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black" }),
            Tools.comp("input", {
                type: "text",
                name: "search",
                placeholder: "Search documentation... (Press /)",
                class:
                    "w-full bg-gray-100 border-transparent focus:bg-white focus:border-black focus:ring-0 rounded-lg py-2 pl-10 pr-4 text-sm transition-all",
            }),
            Tools.icon(Keyboard, { class: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black" }),
        ],
    })
}

export const AppCard = (app: {icon: string, name: string, status: string}) => {
    return Tools.comp("div", {
        class:
            "bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group",
        children: [
            Tools.comp("div", {
                class: "text-4xl mb-4",
                textContent: app.icon,
            }),
            Tools.comp("h3", {
                class:
                    "text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors",
                textContent: app.name,
            }),
            Tools.comp("span", {
                class: "text-sm text-gray-500",
                textContent: app.status,
            }),
        ],
    })
}

export class HeaderController {
    comp: any;
    setup() {
        this.comp.s.title.update({}, { click: () => globalThis.location.href = "/"  });
        this.comp.s.setting.update({}, { click: () => RouteWebPageMainCtrl.navigate("/settings") });
    }
    set_comp(comp: any) {
        this.comp = comp;
    }
}

export class WebPageWithNav{
    comp: any;
    sidebar_ctrl: SidebarCtrl = new SidebarCtrl();
    root_nav: string = "/";
    setup() {
        this.sidebar_ctrl.set_comp(this.comp.s.sidebar);
        this.sidebar_ctrl.setup();
        this.comp.s.header.s.hamburger_btn.update({}, { click: () => this.toggle_sidebar() });
        this.comp.s.sidebar.s.header.s.close_btn.update({}, { click: () => this.toggle_sidebar() });
        this.comp.s.header.s.title.update({}, { click: () => globalThis.location.href = this.root_nav });
        this.sidebar_ctrl.get_menu_item = this.get_menu_item;
    }
    set_comp(comp: any) {
        this.comp = comp;
    }
    toggle_sidebar() {
        this.comp.s.sidebar.getElement().classList.toggle('-translate-x-full');
        this.comp.s.overlay.getElement().classList.toggle('hidden');
    }
    set_app_name(app_name: string) {
        this.comp.s.header.s.title.update({textContent: app_name});
        this.sidebar_ctrl.set_app_name(app_name);
    }
    get_menu_item(label: string, href: string) {
        return Tools.comp("a", {
            href: "#" + href,
            class: "nav-link flex items-center px-4 py-3 rounded-md transition-colors duration-200 hover:bg-gray-700",
            textContent: label,
        })
    }
}

export class MainCtrl {
    static webPageWithNav() {
        const webPageWithNavCtrl = new WebPageWithNav();
        webPageWithNavCtrl.set_comp(RouteWebPage());
        webPageWithNavCtrl.setup();
        return webPageWithNavCtrl;
    }
}