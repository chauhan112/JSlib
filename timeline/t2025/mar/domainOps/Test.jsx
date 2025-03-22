import { Repeater, GForm, Accordion } from "./Repeater";
import { DownArrow } from "./Icons";
import React from "react";
import { ListWithContextMenu, ListWithContextMenu2 } from "./ContextMenu";
import { DropdownShowCase } from "./Dropdown";
export const TestRepeater = () => {
    return (
        <div>
            <Repeater
                {...{
                    data: [
                        { key: "1", typ: "a", href: "#", children: "Home" },
                        { key: "2", typ: "a", href: "#", children: "password" },
                    ],
                    Component: GComponent,
                    items: {
                        className:
                            "bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-400 mouse-pointer select-none block text-center ",
                    },
                    container: {
                        className: "flex flex-col gap-4 w-fit p-2",
                    },
                }}
                ref={ref}
            />
            ;
        </div>
    );
};

export const TestGForm = () => {
    return (
        <div>
            <GForm
                {...{
                    formStruc: [
                        {
                            key: "Name",
                            placeholder: "Name",
                            type: "text",
                            className: "w-full border rounded mb-2 p-2",
                        },
                    ],
                }}
            />
        </div>
    );
};

export const TestAccordion = () => {
    return (
        <div>
            <Accordion
                {...{
                    items: [
                        {
                            key: "1",
                            title: "Home",
                            open: true,
                            content: {
                                className: "",
                                children: <TestGForm />,
                            },
                        },
                        {
                            key: "2",
                            title: "password",
                            open: false,
                            content: {
                                children: "password",
                            },
                        },
                    ],
                }}
            />
        </div>
    );
};

export const TestArrow = () => {
    let ref = React.createRef();
    return (
        <>
            <DownArrow
                {...{ down: true, className: "w-5 h-5 text-black" }}
                ref={ref}
            />
            <button
                onClick={() => {
                    ref.current.flip();
                    console.log(ref.current);
                }}
            >
                awdd
            </button>
        </>
    );
};

export const TestContextMenu = () => {
    const sampleItems = ["Item 1", "Item 2", "Item 3", "Item 4"];
    return <ListWithContextMenu items={sampleItems} />;
};

export const TestDropdown = () => {
    const options = [
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 4",
        "Option 5",
    ];
    return <DropdownShowCase />;
};
