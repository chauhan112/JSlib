import { Button, GenericForm, GComponent, Repeater } from "./Components";
import { CITTools } from "./tools";

export const repeaterTest = () => {
    let repeater = new Repeater();
    repeater.update({
        class: "flex gap-2",
    });

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
        itemComp.update({
            class: "p-2 border",
            ...CITTools.removeKeys(item, ["typ"]),
        });
        if (itemComp.typ === "input" && item.type !== "submit") {
            itemComp.states.valueGetter = (e: HTMLInputElement) => {
                return e.value;
            };
        }
        itemComp.render();
        return itemComp;
    };

    form.update(
        {
            class: "flex flex-col gap-2 w-fit",
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
