import { Tools } from "../../april/tools";
import { CircleCheck, IconNode } from "lucide";
import { Logo, GoBackOrHome, DEF_TITLE } from "./Components";
import { Router } from "./Router";
import { Page as FileSearchPage } from "../FileSearch/Components";
import { Page as HtmlToMyLib } from "../HtmlToMyLib/index";
import { Controller as LinksController } from "../LinksOpener/Controller";

export const CardComponent = (
    title: string = "Task Manager",
    description: string = "Organize your daily tasks and boost productivity.",
    icon: IconNode = CircleCheck,
    link: string = "task-manager/"
) => {
    return Tools.div({
        class: "w-fit bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center h-[fit-content]",
        children: [
            Tools.icon(icon, {
                key: "icon",
                class: "w-16 h-16 text-blue-500 mb-4",
            }),
            Tools.comp("h2", {
                key: "title",
                class: "text-xl font-semibold mb-2",
                textContent: title,
            }),
            Tools.comp("p", {
                key: "description",
                class: "text-gray-600 text-sm mb-4 flex-grow",
                textContent: description,
            }),
            Tools.comp("a", {
                key: "link",
                class: "mt-auto inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-5 rounded-md transition-colors duration-300",
                textContent: "Launch Tool",
                href: "#" + link,
            }),
        ],
    });
};

export const Header = () => {
    const logo = Logo();
    return Tools.comp(
        "header",
        {
            class: "bg-gray-800 text-white px-4 py-2 sticky top-0 z-50",
            key: "header",
            children: [
                Tools.div({
                    key: "wrapper",
                    class: "mx-auto flex justify-between items-center",
                    children: [GoBackOrHome(), logo],
                }),
            ],
        },
        {},
        {
            updateTitle: (title: string) => {
                logo.s.header.update({ textContent: title });
            },
        }
    );
};

export const Footer = () => {
    return Tools.comp("footer", {
        class: "pt-8 border-t border-gray-300 text-center text-gray-500 text-sm",
        children: [
            Tools.comp("p", {
                textContent:
                    "© " +
                    new Date().getFullYear() +
                    " RaCorp. All rights reserved.",
            }),
        ],
    });
};

export const Page = () => {
    let s = {};
    let homeBody = Grid([]);
    const router = Router.getInstance();

    let mainBody = Tools.container(
        {
            class: "flex flex-1 flex-col p-4",
            children: [homeBody],
        },
        {},
        "main"
    );
    let layout = Tools.div({
        class: "bg-gradient-to-br from-gray-100 to-blue-50 font-sans text-gray-800",
        children: [
            Tools.div({
                key: "wrapper",
                class: "mx-auto flex flex-col min-h-screen",
                children: [Header(), mainBody, Footer()],
            }),
        ],
    });
    router.addRoute("/", () => {
        mainBody.clear();
        mainBody.display(homeBody);
        layout.s.wrapper.s.header.s.updateTitle(DEF_TITLE);
    });
    const addApp = (app: {
        title: string;
        description: string;
        link: string;
        routeFunc: () => void;
        icon: IconNode;
        moreOps?: any;
    }) => {
        const { title, description, icon, link, moreOps } = app;
        const card = CardComponent(title, description, icon, link);
        homeBody.update({
            child: card,
        });
        router.addRoute(link, app.routeFunc);
    };

    const addExternalApp = (app: {
        title: string;
        description: string;
        link: string;
    }) => {
        const { title, description, link } = app;
        const card = CardComponent(title, description, CircleCheck, "");
        card.s.link.update({
            target: "_blank",
            rel: "noopener noreferrer",
            href: link,
        });
        homeBody.update({
            child: card,
        });
    };
    const getElement = () => {
        return layout.getElement();
    };
    let state = {
        s,
        layout,
        getElement,
        homeBody,
        mainBody,
        router,
        addApp,
        addExternalApp,
    };
    return state;
};

export const Grid = (comps: any[]) => {
    return Tools.div({
        class: "flex flex-wrap gap-8",
        children: comps,
    });
};

export const ExternalAppList = [
    {
        title: "ARC Viewer",
        description: "Visualize ARC problems and solutions",
        link: "https://chauhan112.github.io/arc-viewer/",
    },
    {
        title: "Generic CRUD",
        description: "Simple generic CRUD template",
        link: "https://chauhan112.github.io/generic-crud/",
    },
    {
        title: "Domain Ops Logger",
        description: "First version of domain ops logger",
        link: "https://chauhan112.github.io/DomainOpsLogger/",
    },
];

export const MainPage = () => {
    const page = Page();
    page.layout.s.wrapper.s.header.s.wrapper.s.goBack.s.img.update({
        src: "logo.png",
    });
    page.addApp({
        title: "Content Searching",
        description: "Search in your git repo files content",
        link: "file-search/",
        routeFunc: () => {
            const fspage = FileSearchPage();
            page.mainBody.clear();
            page.mainBody.display(fspage);
            page.layout.s.wrapper.s.header.s.updateTitle(
                DEF_TITLE + " - " + "Content Searching"
            );
        },
        icon: CircleCheck,
    });
    page.addApp({
        title: "Links Opener",
        description: "Search in your git repo files content",
        link: "links-opener/",
        routeFunc: () => {
            const ctrl = LinksController();
            const fspage = ctrl.comp;
            page.mainBody.clear();
            page.mainBody.display(fspage);
            page.layout.s.wrapper.s.header.s.updateTitle(
                DEF_TITLE + " - " + "Links Opener"
            );
        },
        icon: CircleCheck,
    });
    page.addApp({
        title: "HTML to my lib",
        description: "convert html to js format",
        link: "html-to-my-lib/",
        routeFunc: () => {
            const fspage = HtmlToMyLib();
            page.mainBody.clear();
            page.mainBody.display(fspage);
            page.layout.s.wrapper.s.header.s.updateTitle(
                DEF_TITLE + " - " + "HTML to my lib"
            );
        },
        icon: CircleCheck,
    });
    for (const app of ExternalAppList) {
        page.addExternalApp(app);
    }
    page.router.route();
    return page;
};
