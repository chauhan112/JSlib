import {
    AudioLines,
    BarChart,
    ChevronDown,
    Cog,
    History,
    IconNode,
    Key,
    Menu,
    MessageSquareDot,
    MessageSquareMore,
    PanelLeftClose,
    SlidersHorizontal,
} from "lucide";
import { Tools } from "../../april/tools";
import { GComponent } from "../../april/GComponent";

export const Accordion = () => {
    const comp = Tools.comp("div", {
        class: "accordion-item",
    });
    const states: any = {
        body: Tools.div({ class: "hidden" }),
    };
    const setBodyHeader = (body: GComponent, header: GComponent) => {
        body.getElement().classList.add("hidden");
        header.update(
            {},
            {
                click: (e: any) => {
                    body.getElement().classList.toggle("hidden");
                    e.stopPropagation();
                },
            }
        );
        comp.update({ innerHTML: "", children: [header, body] });
        states.body = body;
        states.header = header;
    };

    const setLabel = (label: string) => {
        let downIcon = Tools.icon(ChevronDown, {
            class: "w-6 h-6 transition duration-300",
        });
        let header = Tools.comp(
            "button",
            {
                class: "cursor-pointer flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hover:bg-[#dde3ea] dark:hover:bg-[#282a2c]",
                children: [
                    Tools.comp("span", { textContent: label }),
                    downIcon,
                ],
            },
            {
                click: (e: any) => {
                    states.body.getElement().classList.toggle("hidden");
                    downIcon.getElement().classList.toggle("rotate-180");
                },
            }
        );

        comp.update({ innerHTML: "", children: [header, states.body] });
        states.header = header;
    };
    comp.update({}, {}, { setBodyHeader, states, setLabel });
    return comp;
};

export const Sidebar = () => {
    const panelClose = Tools.comp("button", {
        class: "lg:block p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 right-0 bottom-0 hidden",
        children: [Tools.icon(PanelLeftClose, { class: "w-6 h-6" })],
    });
    const getAccordionBody = (items: { label: string; icon: IconNode }[]) => {
        return Tools.comp("div", {
            class: "pt-1 pl-5 hidden",
            children: items.map((item) => {
                return Tools.comp("a", {
                    href: "#",
                    class: "flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-[#dde3ea] dark:hover:bg-[#282a2c]",
                    children: [
                        Tools.icon(item.icon, { class: "w-6 h-6" }),
                        Tools.comp("span", {
                            textContent: "Chat",
                        }),
                    ],
                });
            }),
        });
    };
    const getAccordion = (
        label: string,
        items: { label: string; icon: IconNode }[]
    ) => {
        let acc = Accordion();
        acc.s.states.body = getAccordionBody(items);
        acc.s.setLabel(label);
        return acc;
    };

    const var_theme_toggle = Tools.comp("button", {
        class: "flex w-full items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-[#dde3ea] dark:hover:bg-[#282a2c]",
        children: [
            Tools.comp("span", { class: "material-symbols-outlined" }),
            Tools.comp("span", {
                textContent: "Toggle Theme",
            }),
        ],
    });

    const userSetting = Tools.comp("img", {
        class: "h-6 w-6 rounded-full",
        alt: "Profile",
        src: "https://lh3.googleusercontent.com/a/ACg8ocIrAAIi2TgWjsyclT42OwOqtnlT_YplxXi0ad5gk1zlX2EPJg=s64-cc",
    });

    const getNavElement = (
        icon: IconNode,
        label: string,
        selected: boolean = false
    ) => {
        let comp = Tools.comp("a", {
            href: "#",
            class: "flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-[#dde3ea] dark:hover:bg-[#282a2c]",
            children: [
                Tools.icon(icon, { class: "w-6 h-6" }),
                Tools.comp("span", {
                    textContent: label,
                }),
            ],
        });
        if (selected)
            comp.update({
                class: "flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium bg-[#dde3ea] dark:bg-[#282a2c] text-blue-600 dark:text-blue-400 hover:bg-[#d5dce6] dark:hover:bg-[#3c3f43]",
            });
        return comp;
    };

    return Tools.comp("aside", {
        class: "fixed text-white left-0 z-10 inset-0 flex h-screen flex-col overflow-y-auto dark:bg-[#1e1f20] bg-[#f3f6fc] transition-all duration-300 ease-in-out -translate-x-full lg:translate-x-0 w-64",
        children: [
            Tools.comp("div", {
                class: "flex items-center justify-between gap-2 px-4 py-5",
                children: [
                    Tools.comp("a", {
                        href: "#",
                        class: "flex items-center gap-2",
                        children: [
                            Tools.comp("h1", {
                                class: "text-xl font-semibold ",
                                textContent: "Company Icon",
                            }),
                        ],
                    }),
                    panelClose,
                ],
            }),
            Tools.comp("div", {
                class: "flex flex-1 flex-col justify-between px-2",
                children: [
                    Tools.comp("nav", {
                        class: "flex flex-col gap-1",
                        children: [
                            getNavElement(MessageSquareMore, "New Chat", true),
                            getNavElement(History, "History"),
                            Tools.comp("hr", {
                                class: "my-2 border-gray-300 dark:border-gray-600",
                            }),
                            getAccordion("Studio", [
                                { label: "Chat", icon: MessageSquareDot },
                                { label: "Stream", icon: AudioLines },
                            ]),
                            getAccordion("Dashboard", [
                                { label: "API Keys", icon: Key },
                                { label: "Usage", icon: BarChart },
                            ]),
                        ],
                    }),
                    Tools.comp("div", {
                        class: "pb-4 px-2",
                        children: [
                            Tools.comp("hr", {
                                class: "my-2 border-gray-300 dark:border-gray-600",
                            }),
                            var_theme_toggle,
                            Tools.comp("a", {
                                href: "#",
                                class: "flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium mt-1 hover:bg-[#dde3ea] dark:hover:bg-[#282a2c]",
                                children: [
                                    userSetting,
                                    Tools.comp("span", {
                                        textContent: "My Account",
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            }),
        ],
    });
};

export const Header = () => {
    const hamburger_btn = Tools.comp("button", {
        class: "block rounded-lg border border-gray-300 dark:border-gray-600 p-1.5 lg:hidden",
        children: [
            Tools.icon(Menu, {
                class: "h-6 w-6",
            }),
        ],
    });

    const selectModel = Tools.comp("div", {
        class: "relative",
        children: [
            Tools.comp("select", {
                class: "w-full rounded-lg border border-gray-300 bg-gray-200 dark:bg-gray-800 py-2 px-4 text-sm font-medium transition focus:border-blue-500 active:border-blue-500",
                children: [
                    Tools.comp("option", { textContent: "Gemini 1.5 Flash" }),
                    Tools.comp("option", { textContent: "Gemini 1.5 Pro" }),
                ],
            }),
        ],
    });
    const opsComp = Tools.comp("div", {
        class: "flex items-center gap-2",
        children: [
            Tools.comp("button", {
                class: "hidden sm:flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700",
                textContent: "Get API key",
                children: [Tools.icon(Key, { class: "w-6 h-6" })],
            }),
            Tools.comp("button", {
                class: "p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700",
                children: [Tools.icon(SlidersHorizontal, { class: "w-6 h-6" })],
            }),
            Tools.comp("button", {
                class: "p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700",
                children: [Tools.icon(Cog, { class: "w-6 h-6" })],
            }),
            Tools.comp("img", {
                class: "h-6 w-6 rounded-full",
                alt: "Profile",
                src: "https://lh3.googleusercontent.com/a/ACg8ocIrAAIi2TgWjsyclT42OwOqtnlT_YplxXi0ad5gk1zlX2EPJg=s64-cc",
            }),
        ],
    });

    return Tools.comp(
        "header",
        {
            class: "sticky top-0 flex w-full bg-gray-100 dark:bg-[#131314] drop-shadow-sm border-b border-gray-200 dark:border-gray-700",
            children: [
                Tools.comp("div", {
                    class: "flex flex-grow items-center justify-between px-4 py-2 shadow-sm md:px-6 2xl:px-8",
                    children: [
                        Tools.comp("div", {
                            class: "flex items-center gap-2 sm:gap-4",
                            children: [hamburger_btn, selectModel],
                        }),
                        opsComp,
                    ],
                }),
            ],
        },
        {},
        {
            hamburger_btn,
            selectModel,
            opsComp,
        }
    );
};
