import { Tools } from "../../../globalComps/tools";
import { Sidebar, Header as NewHeader } from "./Component";
import { DocumentHandler } from "../../april/Array";

export const Header = () => {
    return Tools.comp("header", {
        class: "fixed top-0 w-full lg:hidden bg-red-600 text-white p-4 text-2xl flex items-center",
        children: [
            Tools.comp("button", {
                key: "btn",
                class: "mr-4",
                textContent: "☰",
            }),
            Tools.comp("span", { textContent: "Company Name" }),
        ],
    });
};

export const Nav = () => {
    let navs = [
        { title: "Home", href: "#" },
        { title: "Showcase", href: "#showcase" },
        { title: "Services", href: "#services" },
        { title: "Designers", href: "#designers" },
        { title: "Packages", href: "#packages" },
        { title: "Contact", href: "#contact" },
    ];
    const NavComp = (params: {
        href: string;
        title: string;
        [key: string]: any;
    }) => {
        return Tools.comp("a", {
            href: params.href,
            class: "block py-2 px-8 hover:bg-white hover:text-black",
            textContent: params.title,
        });
    };
    const closeBtn = Tools.comp("button", {
        class: "absolute top-0 left-0 p-4 text-2xl lg:hidden",
        textContent: "X Close Menu",
    });
    const sidebar = Tools.comp("nav", {
        class: "fixed top-0 left-0 h-full w-72 bg-red-600 text-white z-30 hidden lg:block font-bold",
        children: [
            Tools.comp("div", {
                class: "p-8",
                children: [
                    closeBtn,
                    Tools.comp("h3", {
                        class: "py-16 text-2xl",
                        children: [
                            Tools.comp("b", {
                                innerHTML: "Company <br> Name",
                            }),
                        ],
                    }),
                ],
            }),
            Tools.comp("div", {
                class: "space-y-1",
                children: navs.map((nav) => NavComp(nav)),
            }),
        ],
    });

    return Tools.comp(
        "div",
        { children: [sidebar] },
        {},
        { sidebar, NavComp, closeBtn }
    );
};

export const Page = () => {
    const header = NewHeader();
    let sidebar = Sidebar();
    return Tools.div(
        { class: "w-full h-full text-white", children: [header, sidebar] },
        {},
        { header, sidebar }
    );
};

export const PageCtrl = () => {
    let comp = Page();
    comp.s.sidebar.update({}, { click: (e: any) => e.stopPropagation() });
    const onSidebarToggle = (e: any) => {
        e.stopPropagation();
        comp.s.sidebar.getElement().classList.toggle("-translate-x-full");
        DocumentHandler.getInstance().undoer.add(() => {
            comp.s.sidebar.getElement().classList.toggle("-translate-x-full");
        });
    };

    comp.s.header.s.hamburger_btn.update({}, { click: onSidebarToggle });
    return { comp };
};
