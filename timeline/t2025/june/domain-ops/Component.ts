import { EllipsisVertical, LogIn, PencilLine, Trash, type IconNode } from "lucide";
import { Tools } from "../../april/tools";
import { GComponent, type IComponent } from "../../april/GComponent";
import "./newdesign.css";
import { DocumentHandler, Atool } from "../../april/Array";

export const SearchComp = () => {
    return Tools.comp("form", {
        class: "w-full flex items-center justify-around",
        children: [
            Tools.comp("input", {
                class: "bg-gray-200 rounded-full py-1 px-2 focus:outline-none",
                name: "search",
                placeholder: "Search...",
            }),
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
export const SelectComponent = (ops: any[], props?: any) => {
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
            ...props,
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
    const aliasName = FormInputWrapper("alternate name", {
        inpComp: Tools.comp("input", {
            class: "glass-input w-full p-3 rounded-lg text-white placeholder-white/50 focus:outline-none",
            placeholder: "name or alias",
            name: "alternateName",
        }),
    });
    const domainSelect = FormInputWrapper("select domain", {
        inpComp: MultiSelectComponent([]),
    });
    const operationSelect = FormInputWrapper("select operation", {
        inpComp: SelectComponent([]),
    });

    const setValue = (value: {
        name: string;
        domains: { name: string; id: string }[];
        operation: string;
    }) => {
        (aliasName.s.inpComp.getElement() as HTMLInputElement).value =
            value.name;
        domainSelect.s.inpComp.s.setValue(value.domains);
        operationSelect.s.inpComp.s.setValue(value.operation);
    };
    const getValue = () => {
        let doms = domainSelect.s.inpComp.s
            .getValue()
            .map((d: { value: string; textContent: string }) => d.value);
        return {
            name: (aliasName.s.inpComp.getElement() as HTMLInputElement).value,
            domains: doms,
            operation: (
                operationSelect.s.inpComp.getElement() as HTMLSelectElement
            ).value,
        };
    };
    const setDomains = (domains: { value: string; label: string }[]) => {
        domainSelect.s.inpComp.s.setOptions(domains);
    };
    const setOperations = (operations: { value: string; label: string }[]) => {
        operationSelect.s.inpComp.s.setOptions(operations);
    };

    const resetForm = () => {
        setValue({ name: "", domains: [], operation: "" });
    };
    const submitBtn = Tools.comp("button", {
        key: "submitBtn",
        type: "submit",
        class: "w-full py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg transition-colors border border-white/20",
        textContent: "create",
    });
    return Tools.div(
        {
            class: "flex items-center justify-center mx-auto bg-gradient-to-r from-[#1ABC9C] to-[#16A085] ",

            child: Tools.comp("form", {
                key: "form",
                class: "glass-card p-8 rounded-2xl shadow-xl max-w-md w-full",
                children: [aliasName, domainSelect, operationSelect, submitBtn],
            }),
        },
        {},
        {
            setValue,
            getValue,
            setDomains,
            setOperations,
            resetForm,
            comps: { aliasName, domainSelect, operationSelect, submitBtn },
        }
    );
};
export const ActivityComponent = (
    value: {
        op: { name: string; id: string };
        doms: { name: string; id: string }[];
        name: string;
        [key: string]: any;
    },
    onOpsClicked: (e: any, ls: any) => void
) => {
    const UIComp = (icon: IconNode, info?: any) => {
        return Tools.comp(
            "button",
            {
                class: "flex items-center justify-center cursor-pointer hover:bg-gray-400 border-yellow-500 w-full p-1",
                child: Tools.icon(icon),
            },
            { click: (e: any, ls: any) => onOpsClicked(e, ls) },
            { data: info }
        );
    };
    const opsContainer = Tools.div({
        class: "opsContainer flex flex-col hidden w-full absolute bottom-0 right-0 flex items-center gap-2 z-10 bg-gray-200 transparent h-2/3 items-center justify-around",
        children: [
            UIComp(LogIn, { type: "select", info: value }),
            Tools.div({
                class: "flex items-center gap-4",
                children: [
                    UIComp(PencilLine, { type: "edit", info: value }),
                    UIComp(Trash, { type: "delete", info: value }),
                    // UIComp(EllipsisVertical),
                ],
            }),
        ],
    });
    const DomElement = (dom: { name: string; id: string }) => {
        return Tools.comp("li", {
            textContent: dom.name,
            class: "font-bold text-sm text-blue-500 ",
        });
    };
    return Tools.div({
        class: "onHoverElement flex flex-col gap-2 relative min-h-32 w-32",
        children: [
            Tools.comp("p", {
                textContent: value.op.name,
                class: "font-bold text-sm text-green-500 flex ",
            }), // tag
            Tools.comp("ul", {
                class: "flex flex-wrap gap-2",
                children: value.doms.map(DomElement),
            }),
            Tools.comp("h3", {
                textContent: value.name,
            }),
            opsContainer,
        ],
    });
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
        inpComp: IComponent;
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
export const MultiSelectComponent = (options: any[]) => {
    let optionsComp: { [key: string]: GComponent } = {};
    let states = { placeholder: "Select options..." };
    const makeOption = (option: any) => {
        const comp = Tools.comp("label", {
            class: "flex items-center px-4 py-2 hover:border-l-2 hover:border-gray-600 cursor-pointer text-gray-700",
            children: [
                Tools.comp(
                    "input",
                    {
                        key: "checkbox",
                        type: "checkbox",
                        class: "w-4 h-4 text-black border-gray-400 rounded-none focus:ring-0",
                        value: option.value,
                    },
                    {
                        change: (e: any, ls: any) => {
                            updateBtnText();
                        },
                    },
                    {
                        data: option,
                    }
                ),
                Tools.comp("span", {
                    class: "ml-2",
                    textContent: option.textContent,
                }),
            ],
        });
        optionsComp[option.value] = comp;
        return comp;
    };
    const dropdownMenu = Tools.div(
        {
            class: "absolute w-full bg-white border-b-2 border-gray-400 rounded-none shadow-md max-h-60 overflow-y-auto z-10 hidden",
            children: options.map(makeOption),
        },
        {
            click: (e: any) => {
                e.stopPropagation();
            },
        }
    );
    const selectedItems: any[] = [];
    
    const selectButton = Tools.comp(
        "button",
        {
            textContent: states.placeholder,
            class: "w-full px-4 py-2 text-left bg-white text-gray-800 border-b-2 border-gray-400 rounded-none focus:outline-none focus:border-black transition-colors",
        },
        {
            click: (e: any, ls: any) => {
                e.preventDefault();
                dropdownMenu.getElement().classList.toggle("hidden");
                DocumentHandler.getInstance().undoer.add(() => {
                    dropdownMenu.getElement().classList.add("hidden");
                });
                e.stopPropagation();
            },
        }
    );
    const updateBtnText = () => {
        selectedItems.length = 0;
        for (const key in optionsComp) {
            if (optionsComp[key].s.checkbox.component.checked) {
                selectedItems.push(optionsComp[key].s.checkbox.s.data);
            }
        }
        let btnText = "";
        const selected = selectedItems.map((item: any) => item.textContent);
        if (selected.length === 0) {
            btnText = states.placeholder;
        } else if (selected.length <= 2) {
            btnText = selected.join(", ");
        } else {
            btnText = `${selected.length} options selected`;
        }
        selectButton.update({
            textContent: btnText,
        });
    };
    const setOptions = (options: any[]) => {
        dropdownMenu.update({
            innerHTML: "",
            children: options.map(makeOption),
        });
    };
    const getValue = () => {
        return selectedItems;
    };
    const setValue = (value: any[]) => {
        selectedItems.length = 0;
        for (const key in optionsComp) {
            optionsComp[key].s.checkbox.component.checked = false;
        }
        for (const option of value) {
            optionsComp[option].s.checkbox.component.checked = true;
        }
        updateBtnText();
    };
    const clear = () => {
        setValue([]);
    };
    const setPlaceholder = (placeholder: string) => {
        states.placeholder = placeholder;
        selectButton.update({
            textContent: placeholder,
        });
    };
    let comp = Tools.div(
        {
            class: "relative",
            children: [selectButton, dropdownMenu],
        },
        {},
        {
            selectButton,
            dropdownMenu,
            optionsComp,
            makeOption,
            updateBtnText,
            setOptions,
            getValue,
            setValue,
            setPlaceholder,
            states,
            clear,
        }
    );
    return comp;
};
export const Breadcrumb = () => {
    const comp = Tools.div({
        class: "flex items-center gap-2 text-center items-center",
    });
    const niceClass = {
        class: "hover:after:w-full relative hover:text-indigo-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-indigo-600 after:transition-all after:duration-300 after:ease-in-out",
    };
    const compCreator = (item: any) => {
        return Tools.div(
            {
                ...niceClass,
                child: Tools.comp("a", {
                    href: item.href,
                    textContent: item.name,
                }),
            },
            {},
            {
                data: item,
            }
        );
    };

    const separator = () =>
        Tools.comp("span", {
            class: "mx-0 mb-1",
            textContent: "›",
        });
    const lastComponent = (item: any) => {
        return Tools.div({
            class: "hover:after:w-full relative text-green-600 font-medium",
            textContent: item.name,
        });
    };

    const getChildren = (data: any[]) => {
        let params = Atool.addInMiddle(
            data.slice(0, -1).map(handlers.compCreator),
            handlers.separator
        );
        let last = data[data.length - 1];
        if (!last) {
            return params;
        }
        const lastComp = lastComponent(last);
        params.push(handlers.separator());
        params.push(lastComp);
        return params;
    };

    const setData = (data: any[]) => {
        comp.update({
            innerHTML: "",
            children: getChildren(data),
        });
    };
    let handlers: any = {
        compCreator,
        setData,
        getChildren,
        separator,
        lastComponent,
    };
    comp.update({}, {}, { niceClass, handlers });
    return comp;
};
