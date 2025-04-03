import {
    GenericForm,
    GComponent,
    Repeater,
    ConditionalComponent,
    Grouper,
    Dropdown,
    Button,
    LinkButton,
} from "./Components";
import { CITTools } from "./tools";
import { Accordion } from "./AIGeneratedComponents";
import { GIcon, PlusIcon } from "./icons";

export const buttonTest = () => {
    let btn = new Button();
    btn.update({
        textContent: "Click me",
    });
    return btn;
};

export const linkButtonTest = () => {
    let btn = new LinkButton();
    btn.update({
        textContent: "Click me",
    });
    return btn;
};
export const repeaterTest = () => {
    let repeater = new Repeater();
    repeater.update(
        {
            class: "flex gap-2",
        },
        undefined,
        undefined,
        false
    );

    repeater.setData([
        {
            key: "1",
            textContent: "Item 1",
        },
        {
            key: "2",
            textContent: "Item 2",
        },
        {
            key: "3",
            textContent: "Item 3",
        },
    ]);
    let btn = new Button();
    btn.update({
        textContent: "Click me",
        class: "bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600",
    });
    btn.handlers = {
        click: () => {
            console.log(repeater.states.data);
        },
    };
    return repeater;
};

export const formTest = () => {
    let form = new GenericForm();
    form.setFormStruc([
        {
            key: "name",
            type: "text",
            value: "John Doe",
            placeholder: "Enter your name",
        },
        {
            key: "email",
            type: "email",
            value: "john.doe@example.com",
            placeholder: "Enter your email",
        },
        {
            key: "password",
            type: "password",
            placeholder: "Enter your password",
        },
        {
            key: "submit",
            type: "submit",
            textContent: "Submit",
        },
    ]);

    form.createItem = (item: any) => {
        let itemComp = new GComponent();
        itemComp.typ = item.typ || "input";
        itemComp.update(
            {
                class: "p-2 border",
                ...CITTools.removeKeys(item, ["typ"]),
            },
            undefined,
            undefined,
            false
        );
        if (itemComp.typ === "input" && item.type !== "submit") {
            itemComp.states.valueGetter = (e: HTMLInputElement) => {
                return e.value;
            };
        }

        return itemComp;
    };

    form.update(
        {
            class: "flex flex-col gap-2 w-fit p-4",
        },
        {},
        {
            submit: (e: Event) => {
                e.preventDefault();
                console.log(form.states.formStruc);
            },
        }
    );

    return form;
};

export const conditionalTest = () => {
    let conditional = new ConditionalComponent();
    let btn = new Button();
    btn.update({
        textContent: "Hidden Btn",
    });

    conditional.states.value = false;
    let btn2 = new Button();
    btn2.update(
        {
            textContent: "Visible Btn",
        },
        {},
        {
            click: () => {
                conditional.setValue(!conditional.states.value);
            },
        }
    );

    let group = new Grouper();
    group.setChildren([btn2, conditional]);
    conditional.setConditions([[(value: any) => value, btn]]);
    return group;
};

export const grouperTest = () => {
    let grouper = new Grouper();
    let btn = new Button();
    btn.update({
        textContent: "Click me",
        class: "bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600",
    });
    let title = new GComponent();
    title.update({
        textContent: "Title",
    });
    grouper.setChildren([title, btn]);
    grouper.update({
        class: "flex flex-col gap-2 p-4",
    });
    return grouper;
};

export const dropdownTest = () => {
    let dropdown = new Dropdown();
    dropdown.setOptions([
        {
            key: "Neon Glow",
            textContent: "Neon Glow",
        },
        {
            key: "Watercolor",
            textContent: "Watercolor",
        },
        {
            key: "Metallic",
            textContent: "Metallic",
        },
        {
            key: "Sketchbook",
            textContent: "Sketchbook",
        },
        {
            key: "Crystal",
            textContent: "Crystal",
        },
    ]);
    return dropdown;
};

export const ai_accordionTest = () => {
    const myAccordion = new Accordion();
    myAccordion.render();
    myAccordion.setItems([
        {
            title: "Section 1",
            content: "Content for section 1 goes here...",
        },
        {
            title: "Section 2",
            content: "Content for section 2 goes here...",
        },
        {
            title: "Section 3",
            content: "Content for section 3 goes here...",
        },
    ]);

    return myAccordion;
};

export const iconTest = () => {
    let icon = new GIcon();
    icon.setIcon(PlusIcon);
    return icon;
};

export const breadcrumbTest = () => {
    let repeater = new Repeater();

    repeater.states.itemTyp = "a";
    repeater.states.itemProps = {
        class: "relative pb-[5px] hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-indigo-600 after:transition-[width] after:duration-300 after:ease-in-out :after:w-full :after:bg-emerald-500",
    };
    repeater.update({
        class: "flex items-center text-gray-700 ",
    });

    repeater.setData([
        {
            key: "1",
            textContent: "Item 1",
            href: "#",
        },
        {
            key: "2",
            textContent: "Item 2",
            href: "#",
        },
        {
            key: "3",
            textContent: "Item 3",
            href: "#",
            class: "relative pb-[5px] hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-indigo-600 after:transition-[width] after:duration-300 after:ease-in-out :after:w-full :after:bg-emerald-500 text-green-600 font-medium",
        },
    ]);
    let btn = new Button();
    btn.update(
        {
            textContent: "Click me",
            class: "bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600",
        },
        {},
        {
            click: () => {
                repeater.updateKey("3", {
                    textContent: "Item 3 Updated",
                });
            },
        }
    );

    let group = new Grouper();
    group.setChildren([repeater, btn]);
    group.update({
        class: "flex flex-col gap-2 p-4",
    });
    return group;
};
