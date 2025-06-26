import { Tools } from "../../april/tools";
import { Table } from "../../april/DomainOps/Home";
import { Header } from "./Component";
import { GlobalStates } from "./GlobalStates";
import { Section } from "./Properties";
import { SearchComponent } from "../../may/FileSearch/Search";
import { NewDesign } from "./NewDesign";
import { ArrowLeft, Plus } from "lucide";
class LoggerMainController {
    inst: any;
    constructor(states: any) {
        this.inst = states;
    }
    onGoback() {
        this.inst.modal.s.handlers.close();
    }
}
class MainPageController {
    inst: any;
    constructor(states: any) {
        this.inst = states;
    }
    onGoback() {
        this.inst.comp.update({ innerHTML: "", child: this.inst.nd });
    }
}
export const LoggerMain = () => {
    const activityName = "Ops: domain1, domain2, domain3";
    const header = Header();
    header.s.title.update({ textContent: activityName });
    const prop = Section();
    const struc = Section();
    const searchComp = SearchComponent();
    const table = Table();
    header.s.left.update({
        innerHTML: "",
        child: Tools.icon(ArrowLeft, { class: "w-8 h-8 cursor-pointer" }),
    });
    header.s.left
        .getElement()
        .classList.add("hover:scale-110", "transition-all", "duration-300");
    header.s.right.update({
        class: "hidden",
    });
    const ctrl = new LoggerMainController({ prop, struc, header, searchComp });
    struc.s.header.s.title.update({ textContent: "Structure" });
    let modal = GlobalStates.getInstance().getState("modal");

    const logsList = Tools.div({ class: "w-full h-full", child: table });
    const plusIcon = Tools.icon(Plus, {
        class: "w-12 h-12 mx-4 cursor-pointer hover:scale-110 transition-all duration-300",
    });
    return Tools.div(
        {
            class: "w-full flex flex-col h-[100vh]",
            children: [
                header,
                Tools.div({
                    class: "flex w-full h-full",
                    children: [
                        Tools.div({
                            class: "w-10/12 flex flex-col",
                            children: [
                                Tools.div({
                                    class: "flex items-center justify-between",
                                    children: [plusIcon, searchComp],
                                }),
                                logsList,
                            ],
                        }),
                        Tools.div({
                            class: "flex flex-col h-full",
                            children: [prop, struc],
                        }),
                    ],
                }),
                modal,
            ],
        },
        {},
        {
            header,
            prop,
            struc,
            searchComp,
            ctrl,
        }
    );
};

export const MainPage = () => {
    let lm = LoggerMain();
    let nd = NewDesign();
    let comp = Tools.div({ child: lm });
    let ctrl = new MainPageController({ lm, nd, comp });

    lm.s.header.s.left.update(
        {},
        {
            click: () => ctrl.onGoback(),
        }
    );
    return comp;
};
