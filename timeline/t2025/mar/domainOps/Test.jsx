import {
    Repeater,
    GForm,
    Accordion,
    AccordionComponent,
    ContextMenuComponent,
    ContextMenu,
} from "./Repeater";
import { DownArrow } from "./Icons";
import React from "react";
import { ListWithContextMenu, ListWithContextMenu2 } from "./ContextMenu";
import { DropdownShowCase } from "./Dropdown";
import { MoreVertical, Trash } from "lucide-react";
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
            <Repeater
                data={[
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
                ]}
                Component={AccordionComponent}
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

export const TestContextMenuComponent = () => {
    const sampleItems = [
        {
            key: "item1",
            title: { children: "Item 1" },
        },
        {
            key: "item2",
            title: { children: "Item 2" },
        },
        {
            key: "item3",
            title: { children: "Item 3" },
        },
        {
            key: "item4",
            title: { children: "Item 4" },
        },
    ];
    return <Repeater data={sampleItems} Component={ContextMenuComponent} />;
};

export const TestContextMenu = () => {
    return (
        <ContextMenu
            items={[
                {
                    key: "item1",
                    title: { children: "Item 1" },
                },
            ]}
            commonOps={{
                btns: [
                    {
                        key: "moreInfo",
                        className: "p-1 text-black hover:text-gray-700",
                        children: <MoreVertical className="h-5 w-5" />,
                    },
                    {
                        key: "delete",
                        className: "p-1 text-black hover:text-gray-700",
                        children: <Trash className="h-5 w-5" />,
                    },
                ],
            }}
            moreOptions={[]}
        />
    );
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
