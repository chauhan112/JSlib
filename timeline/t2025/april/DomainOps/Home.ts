import { DocumentHandler } from "../Array";
import { GComponent, IComponent } from "../GComponent";
import { Tools } from "../tools";
import { Sidebar } from "./Sidebar";
import { PropertySection } from "./PropertySection";
import { Search, Menu, Eye, Pencil, Trash, Plus } from "lucide";

export class Home implements IComponent {
    s: { [key: string]: any } = {};
    comp: GComponent | null = null;
    sidebar: Sidebar;
    propertySection: PropertySection;
    constructor() {
        this.sidebar = new Sidebar(this);
        this.sidebar.getElement();
        this.propertySection = new PropertySection(this);
        this.propertySection.getElement();
    }
    getElement(): HTMLElement | SVGElement {
        if (this.comp) {
            return this.comp.getElement();
        }
        this.s.comps = {};
        this.s.comps.content = MainBody();
        this.comp = Tools.div({
            class: "w-full h-full flex justify-between",
            children: [
                this.sidebar,
                this.s.comps.content,
                this.propertySection,
            ],
        });

        return this.comp.getElement();
    }
    getProps(): { [key: string]: any } {
        return this.comp!.getProps();
    }
}

export const MainBody = () => {
    return Tools.container({
        class: "flex flex-col flex-1",
        children: [Header(), Table(), Footer()],
    });
};
export const Header = () => {
    return Tools.div({
        class: "bg-[#F5C85F] px-6 py-3 shadow",
        children: [
            Tools.div({
                class: "flex justify-between items-center",
                children: [
                    Tools.div({
                        children: [
                            Tools.comp("p", {
                                class: "text-xs text-gray-600 mb-0.5",
                                textContent: "Root/logger",
                            }),
                            Tools.comp("h2", {
                                class: "text-2xl font-semibold text-gray-800",
                                textContent: "Activity_name",
                            }),
                        ],
                    }),
                    Tools.div({
                        class: "flex items-center space-x-4",
                        children: [
                            Tools.div({
                                class: "relative",
                                children: [
                                    Tools.icon(Search, {
                                        class: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 ",
                                    }),
                                    Tools.comp("input", {
                                        type: "text",
                                        placeholder: "Search",
                                        class: "bg-[#F8D775] border border-gray-400/50 rounded-md py-2 pl-10 pr-4 w-64 focus:outline-none focus:ring-1 focus:ring-yellow-600 placeholder-gray-600/80 text-sm",
                                    }),
                                ],
                            }),
                            Tools.icon(Menu, {
                                class: "hover:cursor-pointer text-gray-700 hover:text-black text-xl",
                            }),
                        ],
                    }),
                ],
            }),
        ],
    });
};
export const Footer = () => {
    return Tools.div({
        class: " flex justify-end",
        children: [
            Tools.comp("button", {
                class: "cursor-pointer mb-4 mr-4 bg-[#F5C85F] hover:bg-[#eab330] text-gray-800 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold shadow-md",
                child: Tools.icon(Plus),
            }),
        ],
    });
};
export const Table = () => {
    return Tools.div({
        class: "flex flex-col flex-1 overflow-y-auto px-4",
        children: [
            Tools.div({
                class: "grid grid-cols-[40px_1fr_2fr_1.5fr_1fr_100px] gap-4 px-4 py-2 bg-[#6D5E4B] text-white rounded-t-md font-medium text-sm sticky top-0 mt-6",
                children: [
                    Tools.comp("span", { textContent: "#" }),
                    Tools.comp("span", { textContent: "Column_name" }),
                    Tools.comp("span", { textContent: "Activity_name" }),
                    Tools.comp("span", { textContent: "Status" }),
                    Tools.comp("span", { textContent: "Date" }),
                    Tools.comp("span", {
                        class: "text-right",
                        textContent: "Actions",
                    }),
                ],
            }),
            ...Array.from({ length: 5 }, (_, i) => Row(i + 1)),
        ],
    });
};
export const Ops = () => {
    return Tools.div({
        class: "flex justify-end space-x-3 text-[#4A8C71]",
        children: [
            Tools.icon(Eye, { class: "hover:cursor-pointer" }),
            Tools.icon(Pencil, { class: "hover:cursor-pointer" }),
            Tools.icon(Trash, { class: "hover:cursor-pointer" }),
        ],
    });
};
export const Row = (nr: any) => {
    return Tools.div({
        class: "grid grid-cols-[40px_1fr_2fr_1.5fr_1fr_100px] gap-4 px-4 py-3 items-center border-b border-[#E7DAB8]/70 text-sm text-gray-700 last:border-b-0",
        children: [
            Tools.comp("span", { textContent: nr + "." }),
            Tools.comp("span", {
                children: [
                    Tools.comp("span", {
                        class: "inline-block bg-[#A2B8A4] h-2 w-16 rounded-full",
                    }),
                ],
            }),
            Tools.comp("span", {
                class: "font-medium",
                textContent: "Activity_name",
            }),
            Tools.comp("span", { textContent: "Created_on" }),
            Tools.comp("span", { textContent: "" }),
            Ops(),
        ],
    });
};
