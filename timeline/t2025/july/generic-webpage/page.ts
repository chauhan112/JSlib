import { Tools } from "../../april/tools";

export const Header = () => {
    return Tools.comp("header", {
        class: "fixed top-0 w-full z-20 lg:hidden bg-red-600 text-white p-4 text-2xl flex items-center",
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

export const Modal = () => {
    let comp = Tools.div({
        class: "fixed inset-0 bg-black bg-opacity-50 z-20 hidden lg:hidden cursor-pointer",
    });
    return comp;
};

export const Page = () => {
    const header = Header();
    const nav = Nav();
    let modal = Modal();
    return Tools.div(
        { class: "w-full h-full", children: [header, nav, modal] },
        {},
        { header, nav, modal }
    );
};

export const PageCtrl = () => {
    let comp = Page();
    const onOpenModal = () => {
        comp.s.modal.getElement().classList.remove("hidden");
        comp.s.nav.s.sidebar.getElement().classList.remove("hidden");
    };
    const onCloseModal = () => {
        comp.s.modal.getElement().classList.add("hidden");
        comp.s.nav.s.sidebar.getElement().classList.add("hidden");
    };
    comp.s.modal.update({}, { click: onCloseModal });
    comp.s.nav.s.closeBtn.update({}, { click: onCloseModal });
    comp.s.header.s.btn.update({}, { click: onOpenModal });
    return { comp };
};
