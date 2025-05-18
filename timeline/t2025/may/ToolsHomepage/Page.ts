import { Tools } from "../../april/tools";
import { CircleCheck, IconNode } from "lucide";
import { Logo, GoBackOrHome, DEF_TITLE } from "./Components";
import { Router } from "./Router";
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
    const getElement = () => {
        return layout.getElement();
    };
    let state = { s, layout, getElement, homeBody, mainBody, router, addApp };
    return state;
};

export const Grid = (comps: any[]) => {
    return Tools.div({
        class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8",
        children: comps,
    });
};
