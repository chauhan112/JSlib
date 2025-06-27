import { GComponent, IComponent } from "../GComponent";
import { Tools } from "../tools";
import { Sidebar } from "./Sidebar";
import { PropertySection } from "./PropertySection";
import { Main as ModalMain } from "../Modal";
import {
    Search,
    Menu,
    Eye,
    Pencil,
    Trash,
    Plus,
    Clock,
    Pen,
    IconNode,
} from "lucide";
import { StructureForm } from "./StructureForm";
let modal = ModalMain.modal();
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
        this.s.comps.content = MainBody(this);
        this.comp = Tools.div({
            class: "w-full h-full flex justify-between",
            children: [
                this.sidebar,
                this.s.comps.content,
                this.propertySection,
                modal,
            ],
        });

        return this.comp.getElement();
    }
    getProps(): { [key: string]: any } {
        return this.comp!.getProps();
    }
}
export const MainBody = (root?: any) => {
    return Tools.container({
        key: "mainBody",
        class: "flex flex-col flex-1",
        children: [Header(root), Table(root), Footer(root)],
    });
};
export const Header = (root?: any) => {
    return Tools.div({
        key: "header",
        class: "bg-[#F5C85F] px-6 py-3 shadow flex justify-between items-center",
        children: [
            Tools.div({
                key: "title",
                children: [
                    Tools.comp("p", {
                        key: "breadcrumb",
                        class: "text-xs text-gray-600 mb-0.5",
                        textContent: "Root/logger",
                    }),
                    Tools.comp("h2", {
                        key: "activityName",
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
                    Tools.icon(
                        Menu,
                        {
                            class: "hover:cursor-pointer text-gray-700 hover:text-black text-xl",
                        },
                        {
                            click: (e: any, ls: any) => {
                                modal.display(settingPage);
                                settingPage.s.cancelSave.s.cancel.update(
                                    {},
                                    { click: () => modal.hide() }
                                );
                                console.log(settingPage);
                            },
                        }
                    ),
                ],
            }),
        ],
    });
};
export const Footer = (root?: any) => {
    let uform = FormUnstructured();

    uform.s.form.s.cancelSave.s.cancel.update(
        {},
        { click: () => modal.hide() }
    );
    return Tools.div({
        class: " flex justify-end",
        children: [
            Tools.comp(
                "button",
                {
                    class: "cursor-pointer mb-4 mr-4 bg-[#F5C85F] hover:bg-[#eab330] text-gray-800 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold shadow-md",
                    child: Tools.icon(Plus),
                },
                {
                    click: (e: any, ls: any) => {
                        modal.display(uform);
                    },
                }
            ),
        ],
    });
};
export const Table = (root?: any) => {
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
            Tools.icon(Eye, {
                class: "hover:cursor-pointer hover:scale-110 transition-all duration-300",
            }),
            Tools.icon(Pencil, {
                class: "hover:cursor-pointer hover:scale-110 transition-all duration-300",
            }),
            Tools.icon(Trash, {
                class: "hover:cursor-pointer hover:scale-110 transition-all duration-300",
            }),
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
            Tools.comp("span", { textContent: "--" }),
            Ops(),
        ],
    });
};
export const FormUnstructured = () => {
    const DateInfoComp = (icon: IconNode, title: string, val?: string) => {
        return Tools.div({
            class: "flex gap-3 mb-3",
            children: [
                Tools.icon(icon, {
                    class: "w-5",
                }),
                Tools.div({
                    class: "font-semibold",
                    textContent: title,
                }),
                Tools.comp("input", {
                    class: "ms-5 px-2 outline-teal-300 rounded bg-teal-100",
                    type: "text",
                    disabled: true,
                    value: val
                        ? new Date(parseInt(val)).toLocaleString()
                        : new Date().toLocaleString(),
                }),
            ],
        });
    };
    const TextArea = (props: Record<string, any> = {}) => {
        return Tools.comp("textarea", {
            class: "mb-3 outline-slate-500 px-3 py-2 w-full rounded-xl flex-1 bg-white",
            ...props,
        });
    };
    return Tools.div({
        class: "flex flex-col h-dvh bg-slate-500",
        children: [
            Tools.div({
                class: "bg-teal-200",
                children: [
                    Tools.div({
                        class: "py-5 px-7",
                        children: [
                            Tools.comp("input", {
                                class: "outline-teal-500 text-3xl mb-3 font-bold bg-teal-200 border pb-1 px-2",
                                children: [],
                                placeholder: "Activity_name",
                                type: "text",
                                name: "title",
                            }),
                            DateInfoComp(Clock, "Created_on"),
                            DateInfoComp(Pen, "Modified_on"),
                        ],
                    }),
                ],
            }),
            Tools.div({
                key: "form",
                class: "flex flex-col flex-1 p-5",
                children: [
                    TextArea({ placeholder: "Did", name: "did" }),
                    TextArea({ placeholder: "Next", name: "next" }),
                    CancelSaveBtns(),
                ],
            }),
        ],
    });
};
export const CancelSaveBtns = () => {
    return Tools.div({
        key: "cancelSave",
        class: "flex gap-5 justify-end mt-5",
        children: [
            Tools.comp("button", {
                key: "cancel",
                class: "bg-red-500 w-fit px-10 py-1 font-bold rounded-xl cursor-pointer on hover:bg-red-600",
                textContent: "Cancel",
            }),
            Tools.comp("button", {
                key: "save",
                class: "bg-green-500 w-fit px-10 py-1 font-bold rounded-xl cursor-pointer on hover:bg-green-600",
                textContent: "Save",
            }),
        ],
    });
};
export const StructuredForm = (struct: any) => {};

export const StructureCreatingForm = () => {};

export const SettingPage = () => {
    let sf = StructureForm();
    let title = Tools.comp("h2", {
        class: "text-2xl font-semibold text-gray-800",
        textContent: "Settings",
    });
    return Tools.div({
        class: "flex flex-col bg-yellow-500 p-4 max-h-[100vh] overflow-y-auto justify-between",
        children: [
            Tools.div({ children: [title, sf.crud.layout] }),
            CancelSaveBtns(),
        ],
    });
};
let settingPage = SettingPage();
