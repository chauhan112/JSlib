import { EllipsisVertical, LogIn, PencilLine, Trash } from "lucide";
import { Tools } from "../../april/tools";
import { GComponent } from "../../april/GComponent";

export const SearchComp = () => {
    return Tools.comp("form", {
        class: "w-full flex items-center justify-around",
        children: [
            Tools.comp("input", {
                class: "bg-gray-200 rounded-full py-1 px-2 focus:outline-none",
                name: "search",
                placeholder: "Search...",
            }),
            // Tools.icon(Search, {
            //     class: "w-6 h-6 text-gray-500 absolute left-8",
            // }),
            SearchSettingBtn(),
        ],
    });
};
export const SearchSettingBtn = () => {
    return Tools.comp("button", {
        class: "hover:scale-110 hover:cursor-pointer",
        innerHTML: `<svg width="24" height="24" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="18" height="17" stroke="0"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M6.6583 4.51815C6.6583 5.84037 5.50414 6.91207 4.07915 6.91207C2.65499 6.91207 1.5 5.84037 1.5 4.51815C1.5 3.1967 2.65499 2.125 4.07915 2.125C5.50414 2.125 6.6583 3.1967 6.6583 4.51815ZM15.37 3.46965C15.9933 3.46965 16.5 3.93977 16.5 4.51815C16.5 5.0973 15.9933 5.56742 15.37 5.56742H10.4384C9.8142 5.56742 9.30754 5.0973 9.30754 4.51815C9.30754 3.93977 9.8142 3.46965 10.4384 3.46965H15.37ZM2.63083 11.3035H7.56247C8.18663 11.3035 8.69329 11.7737 8.69329 12.3528C8.69329 12.9312 8.18663 13.4021 7.56247 13.4021H2.63083C2.00666 13.4021 1.5 12.9312 1.5 12.3528C1.5 11.7737 2.00666 11.3035 2.63083 11.3035ZM13.9208 14.7176C15.3458 14.7176 16.5 13.6459 16.5 12.3244C16.5 11.0022 15.3458 9.93053 13.9208 9.93053C12.4967 9.93053 11.3417 11.0022 11.3417 12.3244C11.3417 13.6459 12.4967 14.7176 13.9208 14.7176Z" fill="black"/>
</svg>`,
    });
};
export const SelectComponent = (ops: any[]) => {
    const makeOps = (option: Partial<HTMLOptionElement>) => {
        return Tools.comp("option", option);
    };
    const setValue = (value: string) => {
        const selectElement = comp.getElement() as HTMLSelectElement;
        selectElement.value = value;
    };
    const getValue = () => {
        const selectElement = comp.getElement() as HTMLSelectElement;
        return selectElement.value;
    };

    const setOptions = (options: any[]) => {
        comp.update({
            innerHTML: "",
            children: options.map(makeOps),
        });
    };
    let comp = Tools.comp(
        "select",
        {
            class: "w-full p-1 rounded-sm bg-gray-100 text-black border border-gray-300 transition-all duration-300",
            children: ops.map(makeOps),
        },
        {},
        {
            setValue,
            getValue,
            setOptions,
        }
    );
    return comp;
};
export const TabComponent = (ops: { label: string; info?: any }[]) => {
    let currentButton: GComponent | null = null;
    let onTabClick = (e: any, ls: any) => {
        if (currentButton) {
            currentButton.getElement().classList.remove("tab-selected");
            currentButton.getElement().classList.add("tab-unselected");
        }
        e.target.classList.add("tab-selected");
        e.target.classList.remove("tab-unselected");

        currentButton = ls;
    };
    const children = ops.map((op) => {
        return Tools.comp(
            "button",
            {
                textContent: op.label,
                class: "hover:bg-white px-4 py-2 flex-1 border border-dashed cursor-pointer tab-unselected",
            },
            {
                click: (e: any, ls: any) => {
                    onTabClick(e, ls);
                    if (ls.info) {
                        console.log(ls.info);
                    }
                },
            },
            { info: op.info, label: op.label }
        );
    });
    const getCurrentKey = () => {
        return currentButton;
    };

    const setOnTabClick = (callback: (e: any, ls: any) => void) => {
        onTabClick = callback;
    };

    const tabContainer = Tools.div(
        {
            class: "flex items-center justify-between w-full p-2 ",
            children,
        },
        {},
        { getCurrentKey, onTabClick, setOnTabClick }
    );

    if (ops.length > 0) {
        (children[0].getElement() as HTMLButtonElement).click(); // Simulate click on the first tab
    }
    return tabContainer;
};
export const ActitivityForm = () => {
    const dropdown = SelectComponent([
        { value: "domain1", label: "Domain 1" },
        { value: "domain2", label: "Domain 2" },
    ]);

    return Tools.div({
        class: "flex items-center justify-center mx-auto bg-gradient-to-r from-[#1ABC9C] to-[#16A085] ",
        child: Tools.comp("form", {
            class: "glass-card p-8 rounded-2xl shadow-xl max-w-md w-full",
            children: [
                dropdown,
                Tools.comp("div", {
                    class: "mb-4",
                    children: [
                        Tools.comp("label", {
                            class: "block text-white/80 mb-2",
                            textContent: "Email",
                        }),
                        Tools.comp("input", {
                            type: "email",
                            class: "glass-input w-full p-3 rounded-lg text-white placeholder-white/50 focus:outline-none",
                            placeholder: "your@email.com",
                        }),
                    ],
                }),
                Tools.comp("div", {
                    class: "mb-6",
                    children: [
                        Tools.comp("label", {
                            class: "block text-white/80 mb-2",
                            textContent: "Password",
                        }),
                        Tools.comp("input", {
                            type: "password",
                            class: "glass-input w-full p-3 rounded-lg text-white placeholder-white/50 focus:outline-none",
                            placeholder: "••••••••",
                        }),
                    ],
                }),
                Tools.comp("button", {
                    type: "submit",
                    class: "w-full py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg transition-colors border border-white/20",
                    textContent: "Login",
                }),
                Tools.comp("p", {
                    class: "text-center mt-4 text-white/70",
                    textContent: "Don't have an account?",
                    children: [
                        Tools.comp("a", {
                            href: "#",
                            class: "text-white hover:underline",
                            textContent: "Sign up",
                        }),
                    ],
                }),
            ],
        }),
    });
};
export const ActivityComponent = ({
    op,
    doms,
    ...props
}: {
    op: { name: string; id: string };
    doms: { name: string; id: string }[];
    [key: string]: any;
}) => {
    const opsContainer = Tools.div({
        class: "flex flex-col hidden w-full absolute bottom-0 right-0 flex items-center gap-2 z-10 bg-gray-200 transparent h-2/3 items-center justify-around",
        children: [
            Tools.comp("button", {
                class: "flex items-center justify-center w-full cursor-pointer hover:border border-green-500  py-2",
                child: Tools.icon(LogIn),
            }),
            Tools.div({
                class: "flex items-center gap-4",
                children: [
                    Tools.comp("button", {
                        class: "flex items-center justify-center cursor-pointer hover:border border-yellow-500 w-full p-1",
                        child: Tools.icon(PencilLine),
                    }),

                    Tools.comp("button", {
                        class: "flex items-center justify-center cursor-pointer hover:border border-yellow-500 w-full p-1",
                        child: Tools.icon(Trash),
                    }),
                    Tools.comp("button", {
                        class: "flex items-center justify-center cursor-pointer hover:border border-yellow-500 w-full p-1",
                        child: Tools.icon(EllipsisVertical),
                    }),
                ],
            }),
        ],
    });

    return Tools.div(
        {
            class: "flex flex-col gap-2 relative",
            children: [
                Tools.comp("p", {
                    textContent: "operation",
                    class: "font-bold text-sm text-green-500 flex ",
                }), // tag
                Tools.comp("ul", {
                    class: "flex flex-wrap gap-2",
                    children: [
                        Tools.comp("li", {
                            textContent: "domain1",
                            class: "font-bold text-sm text-blue-500 ",
                        }),
                        Tools.comp("li", {
                            textContent: "domain2",
                            class: "font-bold text-sm text-blue-500 ",
                        }),
                    ],
                }),
                Tools.comp("h3", {
                    textContent: "renamed version of activity",
                }),

                opsContainer,
            ],
        },
        {
            mouseenter: () => {
                opsContainer.getElement().classList.remove("hidden");
            },
            mouseleave: () => {
                opsContainer.getElement().classList.add("hidden");
            },
        }
    );
};
export const NavChild = ({
    name,
    id,
    ...props
}: {
    name: string;
    id: string;
    [key: string]: any;
}) => {
    return Tools.div({
        class: "w-full flex items-center justify-between",
        children: [
            Tools.div(
                {
                    textContent: name,
                    class: "text-white flex-1 text-center py-1 cursor-pointer hover:bg-gray-200 hover:text-black",
                },
                {
                    click: props.onMainBodyClick,
                },
                { data: { name, id, ...props } }
            ),
            Tools.div({
                class: "w-fit flex items-center justify-between",
                children: [
                    Tools.icon(
                        EllipsisVertical,
                        {
                            class: "w-8 h-8 cursor-pointer hover:border border-yellow-500",
                        },
                        { click: props.onMenuOptionClick },
                        { data: { name, id, ...props } }
                    ),
                ],
            }),
        ],
    });
};
export const FormInputComponent = (label: string): GComponent => {
    const inpComp = Tools.comp("input", {
        type: "email",
        class: "glass-input w-full p-3 rounded-lg text-white placeholder-white/50 focus:outline-none",
        placeholder: "your@email.com",
    });

    return FormInputWrapper(label, { inpComp });
};
export const FormInputWrapper = (
    label: string,
    props: {
        inpComp: GComponent;
        getValue?: () => any;
        setValue?: (string: string) => void;
    }
): GComponent => {
    const labelComp = Tools.comp("label", {
        class: "block text-white/80 mb-2",
        textContent: label,
    });
    const getValue = () => {
        return (props.inpComp.getElement() as HTMLInputElement).value;
    };
    const setValue = (string: string) => {
        (props.inpComp.getElement() as HTMLInputElement).value = string;
    };
    return Tools.comp(
        "div",
        {
            class: "mb-4",
            children: [labelComp, props.inpComp],
        },
        {},
        { labelComp, getValue, setValue, ...props }
    );
};
