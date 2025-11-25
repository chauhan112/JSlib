import { Table } from "../../../april/DomainOps/Home";
import { Header } from "../Header";
import { Tools } from "../../../april/tools";
import { ArrowLeft, Plus } from "lucide";
import { SearchComponent } from "../../../may/FileSearch/Search";
import { StructureSection, StructureSectionController } from "./Structures";
import { Properties } from "../Properties";
import { Controller as LoggerDataController } from "./LoggerData";

export const ActivityMain = () => {
    const activityName = "Ops: domain1, domain2, domain3";
    const header = Header();
    header.s.title.update({ textContent: activityName });
    const prop = Properties();
    const struc = StructureSection();
    const searchComp = SearchComponent();
    const table = Table();
    header.s.left.update({
        innerHTML: "",
        child: Tools.icon(ArrowLeft, { class: "w-8 h-8 cursor-pointer" }),
    });
    header.s.left
        .getElement()
        .classList.add("hover:scale-110", "transition-all", "duration-300");
    header.s.right.s.icon.getElement().classList.add("rotate-180");
    header.s.right.s.icon
        .getElement()
        .classList.add("transition-all", "duration-300");
    const logsList = Tools.div({ class: "w-full h-full px-4", child: table });
    const plusIcon = Tools.icon(Plus, {
        class: "w-12 h-12 mx-4 cursor-pointer hover:scale-110 transition-all duration-300",
    });
    const rightNav = Tools.div({
        class: "flex flex-col min-h-full",
        children: [prop, struc],
    });

    const mainBody = Tools.div({
        class: "w-full flex flex-col",
        children: [
            Tools.div({
                class: "flex items-center justify-between",
                children: [plusIcon, searchComp],
            }),
            logsList,
        ],
    });
    let comp = Tools.div(
        {
            class: "w-full flex flex-col h-[100vh]",
            children: [
                header,
                Tools.div({
                    class: "flex w-full h-full",
                    children: [mainBody, rightNav],
                }),
            ],
        },
        {},
        { logsList, header, prop, struc, searchComp, plusIcon, rightNav }
    );
    return comp;
};
export const ActivityMainController = (root: any) => {
    let comp = ActivityMain();
    const toggleRightNav = () => {
        comp.s.rightNav.getElement().classList.toggle("hidden");
        comp.s.header.s.right.s.icon
            .getElement()
            .classList.toggle("rotate-180");
    };
    const setTitle = (title: string) => {
        comp.s.header.s.title.update({ textContent: title });
    };
    let strucCtrl = StructureSectionController(root);
    let loggerDataCtrl = LoggerDataController(root);
    let currentSpaceForLogger: any = {};
    const getCurrentSpace = () => currentSpaceForLogger.val;
    const setCurrentSpace = (space: any) => {
        currentSpaceForLogger.val = space;
        loggerDataCtrl.funcs.renderAll();
    };
    const setup = () => {
        strucCtrl.states.comp = comp.s.struc;
        strucCtrl.states.getCurrentSpace = getCurrentSpace;
        strucCtrl.setup();
        comp.s.header.s.right.update(
            {},
            {
                click: toggleRightNav,
            }
        );
        loggerDataCtrl.funcs.setup();
    };
    return {
        comp,
        funcs: {
            toggleRightNav,
            setTitle,
            getCurrentSpace,
            setup,
            setCurrentSpace,
        },
        strucCtrl,
    };
};
