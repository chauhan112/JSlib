import { ChevronLeft, ChevronRight, EllipsisVertical } from "lucide";
import { Tools } from "../../april/tools";
import { AppLogoSVG } from "./Logo";
import { SearchComponent } from "../../may/FileSearch/Search";
import { GComponent } from "../../april/GComponent";

export const CardComponentWrapper = (comp: GComponent) => {
    const lay = Tools.div({
        class: "w-fit bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center h-[fit-content]",
    });
    const display = (comp: GComponent) => {
        lay.update({
            innerHTML: "",
            child: comp,
        });
    };
    display(comp);
    lay.s.display = display;
    return lay;
};
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
export const SmallCRUDops = (ops: any[], form: GComponent) => {
    form.getElement().classList.add("hidden");
    return Tools.div({
        class: "w-full",
        children: [
            Tools.comp(
                "button",
                {
                textContent: "+ create new",
                class: "text-2xl w-full flex items-center justify-center py-4 hover:border cursor-pointer",
                },
                {
                    click: (e: any, ls: any) => {
                        form.getElement().classList.toggle("hidden");
                    },
                }
            ),
            form,
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
                    SmallCRUDops(
                        [
                        { name: "Domain 1", id: "dom1" },
                        { name: "Domain 2", id: "dom2" },
                        ],
                        DomainOpsForm()
                    ),
                ],
            }),
        ],
    });
};
export const MainBody = () => {
    return Tools.div({
        key: "body",
        class: "flex-1 flex items-center justify-center",
        children: [Navigation(), BodyContent(), Properties()],
    });
};

export const BodyContent = () => {
    return Tools.div({
        class: "flex flex-col items-center flex-1 h-full ",
        key: "contentArea",
        children: [
            Tools.div({
                class: "w-full flex flex-col px-2 border-gray-300",
                children: [
                    Tools.comp("span", {
                        textContent: "Properties/Domains/Operations",
                    }),
                    Tools.div({
                        class: "flex items-center justify-between gap-2 mt-2",
                        children: [
                            Tools.icon(Plus, {
                                class: "w-12 h-12 cursor-pointer hover:bg-gray-200",
                            }),
                            SearchComponent(),
                        ],
                    }),
                    Tools.div({
                        class: "flex flex-wrap gap-2 mt-2 bg-gray-200 p-2 rounded-lg h-full flex-1",
                        children: [
                            CardComponentWrapper(ActivityComponent()),
                            CardComponentWrapper(ActivityComponent()),
                        ],
                    }),
                ],
            }),
        ],
    });
};

export const Properties = () => {
    const crudOps = SmallCRUDops(
        [
        { name: "key-value", id: "key1" },
        { name: "key2-value", id: "key2" },
        ],
        Tools.comp("form", {
            class: "w-full flex flex-col items-center justify-center py-2",
            children: [
                Tools.comp("input", {
                    class: "w-full bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500",
                    type: "text",
                    placeholder: "key",
                    name: "key",
                }),
                Tools.comp("input", {
                    class: "w-full bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500",
                    type: "text",
                    placeholder: "value",
                    name: "value",
                }),
                Tools.comp("input", {
                    class: "w-full bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500",
                    type: "submit",
                }),
            ],
        })
    );
    const lay = Tools.div({
        class: "flex flex-col items-center w-2/12 bg-[#1ABC9C] h-full",
        key: "right",
        children: [
            Tools.div({
                class: "bg-slate-700 py-2 text-xl font-bold border-white border-b w-full text-center text-white",
                textContent: "Properties",
            }),
            crudOps,
        ],
    });
    crudOps.getElement();
    return lay;
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

export const ActivityComponent = () => {
    return Tools.div({
        class: "flex flex-col gap-2",
        children: [
            Tools.comp("h1", { textContent: "Activity Name" }),
            Tools.comp("h3", { textContent: "renamed version of activity" }),
            Tools.comp("span", { textContent: "operation" }),
            Tools.comp("ul", {
                children: [
                    Tools.comp("li", { textContent: "domain1" }),
                    Tools.comp("li", { textContent: "domain2" }),
                ],
            }),
        ],
    });
};
