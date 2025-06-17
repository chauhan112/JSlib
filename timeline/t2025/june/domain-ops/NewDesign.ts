import { ChevronLeft, ChevronRight, EllipsisVertical } from "lucide";
import { Tools } from "../../april/tools";
import { AppLogoSVG } from "./Logo";
import { text } from "motion/react-client";

export const NewDesign = () => {
    return Tools.div({
        class: "h-screen flex flex-col",
        children: [Header(), MainBody()],
    });
};

export const Header = () => {
    const { svg } = AppLogoSVG();
    svg.update({ class: "w-[2.6rem] ml-4" });
    return Tools.div({
        class: "flex items-center justify-between px-4 bg-[#F5C85F]",
        children: [
            Tools.div({
                class: "m-2 flex items-center gap-4 ",
                children: [
                    Tools.icon(ChevronLeft, {
                        class: "w-8 h-8 absolute left-0 cursor-pointer",
                    }),
                    svg,
                ],
            }),
            Tools.div({
                class: "text-xl font-bold",
                textContent: "Domain Ops Logger",
            }),
            Tools.div({
                class: "m-2 flex items-center gap-4 pr-4",
                child: Tools.icon(ChevronLeft, {
                    class: "w-8 h-8 absolute right-0",
                }),
            }),
        ],
    });
};

const SmallCRUDops = (ops: any[]) => {
    return Tools.div({
        class: "w-full",
        children: [
            Tools.comp("button", {
                textContent: "+ create new",
                class: "text-2xl w-full flex items-center justify-center py-4 hover:border cursor-pointer",
            }),
            Tools.div({
                class: "w-full flex flex-col items-center px-2 gap-2",
                key: "navItems",
                children: ops.map((item: any) => NavChild(item)),
            }),
        ],
    });
};

export const Navigation = () => {
    return Tools.div({
        class: "flex flex-col items-center min-w-[10rem] w-2/12 bg-[#1ABC9C] h-full",

        key: "nav",
        children: [
            Tools.div({
                class: "w-full flex justify-between flex-wrap",
                children: [
                    Tools.comp("button", {
                        class: "hover:bg-gray-100 px-4 py-2 flex-1 border border-dashed cursor-pointer",
                        textContent: "Domains",
                    }),
                    Tools.comp("button", {
                        class: "hover:bg-gray-100 px-4 py-2 flex-1 border border-dashed cursor-pointer",
                        textContent: "Operations",
                    }),
                    SmallCRUDops([
                        { name: "Domain 1", id: "dom1" },
                        { name: "Domain 2", id: "dom2" },
                    ]),
                ],
            }),
        ],
    });
};
export const MainBody = () => {
    return Tools.div({
        key: "body",
        class: "flex-1 flex items-center justify-center",
        children: [
            Navigation(),
            Tools.div({
                class: "flex flex-col items-center flex-1 h-full ",
                key: "contentArea",
                children: [
                    Tools.div({
                        class: "w-full flex px-2 border-b border-gray-300",
                        children: [
                            Tools.comp("span", {
                                textContent: "Properties/Domains/Operations",
                            }),
                        ],
                    }),
                ],
            }),
            Tools.div({
                class: "flex flex-col items-center w-2/12 bg-[#1ABC9C] h-full",
                key: "right",
                children: [
                    Tools.div({
                        class: "bg-slate-700 py-2 text-xl font-bold border-white border-b w-full text-center text-white",
                        textContent: "Properties",
                    }),
                    SmallCRUDops([
                        { name: "key-value", id: "key1" },
                        { name: "key2-value", id: "key2" },
                    ]),
                ],
            }),
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
                    class: "bg-gray-100 flex-1 text-center py-1",
                },
                {},
                { data: id, props: props }
            ),
            Tools.div({
                class: "w-fit flex items-center justify-between",
                children: [
                    // Tools.icon(
                    //     ChevronRight,
                    //     {
                    //         class: "w-8 h-8 cursor-pointer hover:border border-yellow-500",
                    //     },
                    //     {},
                    //     { data: id, props: props }
                    // ),
                    Tools.icon(
                        EllipsisVertical,
                        {
                            class: "w-8 h-8 cursor-pointer hover:border border-yellow-500",
                        },
                        {},
                        { data: id, props: props }
                    ),
                ],
            }),
        ],
    });
};
