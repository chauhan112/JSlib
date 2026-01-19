import { Tools } from "../../../../globalComps/tools";
import { Menu, X } from "lucide";
import { GComponent } from "../../../../globalComps/GComponent";


export const Header = () => {
    const hamburger_btn = Tools.comp("button", {
        class: "block rounded-lg border border-gray-300 dark:border-gray-600 p-1.5 lg:hidden",
        children: [Tools.icon(Menu, { class: "h-6 w-6" })],
    })
    return Tools.comp("header", {
        class:
            "flex items-center justify-between px-6 py-4 bg-white shadow lg:hidden z-10",
        children: [Tools.comp("h1", {
            class: "text-xl font-bold text-gray-800",
            textContent: "My App",
            key: "title",
        }), hamburger_btn],
    }, {}, { hamburger_btn });
}

export const Sidebar = () => {
    const menu_items = Tools.comp("nav", {
        class: "flex-1 px-2 py-4 space-y-2 overflow-y-auto"
    });
    const footer = Tools.comp("div", {
        class: "p-4 border-t border-gray-700",
        children: [
            Tools.comp("p", {
                class: "text-sm text-gray-400",
                textContent: "© 2023 My App",
                key: "footer_text",
            }),
        ],
    });
    const header = Tools.comp("div", {
        class: "h-16 flex items-center justify-between px-6 border-b border-gray-700 bg-gray-900 lg:bg-transparent",
        children: [
            Tools.comp("h1", {
                class: "text-2xl font-bold select-none cursor-pointer",
                key: "title",
                textContent: "My App"
            }),
            Tools.comp("button", {
                class: "block rounded-lg border border-gray-300 dark:border-gray-600 p-1.5 lg:hidden",
                key: "close_btn",
                children: [Tools.icon(X, { class: "h-6 w-6" })],
            }),
        ],
    });
    return Tools.comp("aside", {
        class:
            "absolute inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white transform -translate-x-full transition duration-300 ease-in-out lg:relative lg:translate-x-0 flex flex-col shadow-lg",
        children: [
            header,
            menu_items,
            footer,
        ],
    }, {}, { menu_items, header, footer });
}

export class SidebarCtrl {
    comp: any;
    components: { [key: string]: GComponent } = {};

    set_comp(comp: any) {
        this.comp = comp;
    }
    setup() {
        this.comp.s.header.s.title.update({}, { click: () => globalThis.location.href = "/" });
    }
    add_menu_item(label: string, href: string) {
        const menu_item = this.get_menu_item(label, href);
        this.comp.s.menu_items.update({ child: menu_item });
        this.components[href] = menu_item;
    }
    get_menu_item(label: string, href: string) {
        return Tools.comp("a", {
            href: href,
            class: "nav-link flex items-center px-4 py-3 rounded-md transition-colors duration-200 hover:bg-gray-700",
            textContent: label,
        })
    }
    add_menu_as_component(component: GComponent, href: string) {
        this.comp.s.menu_items.update({ child: component });
        this.components[href] = component;
    }
    select_menu_item(href: string) {
        for (const key in this.components) {
            this.components[key].getElement().classList.remove('bg-gray-900', 'border-l-4', 'border-blue-500');
            this.components[key].getElement().classList.add('hover:bg-gray-700');

        }
        if (this.components[href]) {
            const link = this.components[href].getElement();
            link.classList.add('bg-gray-900', 'border-l-4', 'border-blue-500');
            link.classList.remove('hover:bg-gray-700');
        }
    }
    set_app_name(app_name: string) {
        this.comp.s.header.s.title.update({textContent: app_name});
        this.comp.s.footer.s.footer_text.update({textContent: `© ${new Date().getFullYear()} ${app_name}`});
    }
}

export const RouteWebPage = () => {
    const sidebar = Sidebar();
    const overlay = Tools.comp("div", {
        class: "fixed inset-0 z-20 bg-black opacity-50 transition-opacity lg:hidden hidden",
    })
    const mainBody = Tools.comp("main", {
        class:
            "flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 lg:p-8",
        children: [DefaultPageContent()],
    })

    const header = Header();
    return Tools.comp("div", {
        class:
            "bg-gray-100 font-sans leading-normal tracking-normal text-gray-900",
        children: [
            Tools.comp("div", {
                class: "flex h-screen overflow-hidden relative",
                children: [
                    overlay,
                    sidebar,
                    Tools.comp("div", {
                        class: "flex-1 flex flex-col h-screen overflow-hidden",
                        children: [
                            header,
                            mainBody,
                        ],
                    }),
                ],
            }),
        ],
    }, {}, { mainBody, sidebar, overlay, header });
}

export const DefaultPageContent = (textContent: string = "Page Content") => {
    return Tools.comp("div", {
        children: [
            Tools.comp("h2", { textContent: textContent }),
        ],
    });
}

export const Page404 = () => {
    return Tools.comp("div", {
        class: "flex-1 flex flex-col h-screen overflow-hidden",
        children: [
            Tools.comp("h2", { textContent: "Page Not Found" }),
        ],
    });
}