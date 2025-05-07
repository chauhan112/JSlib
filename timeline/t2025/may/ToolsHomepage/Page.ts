import { Tools } from "../../april/tools";
import { CircleCheck } from "lucide";

export const CardComponent = (
    title: string = "Task Manager",
    description: string = "Organize your daily tasks and boost productivity."
) => {
    return Tools.div({
        class: "tool-card bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center",
        children: [
            Tools.icon(CircleCheck, {
                class: "w-16 h-16 text-blue-500 mb-4",
            }),
            Tools.comp("h2", {
                class: "text-xl font-semibold mb-2",
                textContent: title,
            }),
            Tools.comp("p", {
                class: "text-gray-600 text-sm mb-4 flex-grow",
                textContent: description,
            }),
            Tools.comp("a", {
                class: "mt-auto inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-5 rounded-md transition-colors duration-300",
                textContent: "Launch Tool",
                href: "#task-manager",
            }),
        ],
    });
};

export const Header = () => {
    return Tools.comp("header", {
        class: "text-center mb-12",
        children: [
            Tools.comp("h1", {
                class: "text-4xl font-bold text-gray-900 mb-2",
                textContent: "Tool Hub",
            }),
            Tools.comp("p", {
                class: "text-lg text-gray-600",
                textContent: "Your collection of useful utilities",
            }),
        ],
    });
};

export const Footer = () => {
    return Tools.comp("footer", {
        class: "mt-16 pt-8 border-t border-gray-300 text-center text-gray-500 text-sm",
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
    return Tools.div({
        class: "bg-gradient-to-br from-gray-100 to-blue-50 font-sans text-gray-800",
        children: [
            Tools.div({
                class: "mx-auto px-4 py-12",
                children: [
                    Header(),
                    Tools.comp("main", {
                        children: [
                            Grid([
                                CardComponent(
                                    "Task Manager",
                                    "Organize your daily tasks and boost productivity."
                                ),
                                CardComponent(
                                    "Link Shortener",
                                    "Create short, shareable links from long URLs."
                                ),
                                CardComponent(
                                    "Currency Converter",
                                    "Check the latest exchange rates between currencies."
                                ),
                                CardComponent(
                                    "Calendar Event",
                                    "Quickly add an event to your default calendar."
                                ),
                                CardComponent(),
                                CardComponent(),
                                CardComponent(),
                                CardComponent(),
                                CardComponent(),
                                CardComponent(),
                                CardComponent(),
                                CardComponent(),
                            ]),
                        ],
                    }),

                    Footer(),
                ],
            }),
        ],
    });
};

export const Grid = (comps: any[]) => {
    return Tools.div({
        class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8",
        children: comps,
    });
};
