import { Tools } from "../../april/tools";
import { Table } from "../../april/DomainOps/Home";
import { Header } from "./Component";
import { Properties, PropertiesCtrl, Section } from "./Properties";
import { SearchComponent } from "../../may/FileSearch/Search";
import { NewDesign } from "./NewDesign";
import { ArrowLeft, Plus } from "lucide";
import { Atool } from "../../april/Array";
import { GenericForm, Params } from "./Form";
class LoggerMainController {
    inst: any;
    constructor(states: any) {
        this.inst = states;
    }
    toggleRightNav() {
        this.inst.rightNav.getElement().classList.toggle("hidden");
        this.inst.header.s.right.s.icon
            .getElement()
            .classList.toggle("rotate-180");
    }
    setTitle(title: string) {
        this.inst.header.s.title.update({ textContent: title });
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
    const prop = Properties();
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
    header.s.right.s.icon.getElement().classList.add("rotate-180");
    header.s.right.update(
        {},
        {
            click: () => {
                ctrl.toggleRightNav();
            },
        }
    );
    header.s.right.s.icon
        .getElement()
        .classList.add("transition-all", "duration-300");
    struc.s.header.s.title.update({ textContent: "Structure" });
    struc.s.header.s.plus.update(
        {},
        {
            click: () => {
                struc.s.body.update({ innerHTML: "", child: sf });
            },
        }
    );
    const sf = StructureForm();
    const logsList = Tools.div({ class: "w-full h-full", child: table });
    const plusIcon = Tools.icon(Plus, {
        class: "w-12 h-12 mx-4 cursor-pointer hover:scale-110 transition-all duration-300",
    });
    const rightNav = Tools.div({
        class: "flex flex-col min-h-full",
        children: [prop, struc],
    });

    const ctrl = new LoggerMainController({
        prop,
        struc,
        header,
        searchComp,
        table,
        logsList,
        plusIcon,
        rightNav,
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
    return Tools.div(
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
        {
            header,
            prop,
            struc,
            searchComp,
            ctrl,
        }
    );
};

export const StructureForm = () => {
    const form = GenericForm();
    let comps: any[] = [
        Params.inp("test", {
            class: "w-full p-2 rounded-md bg-gray-100 text-black",
            placeholder: "Enter awdd",
        }),
        Params.inp("name", {
            class: "w-full p-2 rounded-md bg-gray-100 text-black",
            placeholder: "Enter name",
        }),
        Params.multi("sle", [
            ["1", "cool"],
            ["2", "coolsd"],
        ]),
        Params.inpSubmit(),
    ];
    form.s.handlers.setComponents(comps);
    form.s.handlers.submit = (e: any, ls: any) => {
        e.preventDefault();
        console.log(form.s.handlers.getValues());
        form.s.handlers.clearValues();
    };
    return form;
};

export const MainPage = () => {
    let lm = LoggerMain();
    let nd = NewDesign();
    let root = nd.s.states;
    const onActivityStepIn = (e: any, ls: any) => {
        const info = ls.s.data.info;
        let activityId = info.id;
        let loc = [
            ...root?.currentLocation,
            root?.model.activity.key,
            activityId,
        ];
        let ctrl: PropertiesCtrl = lm.s.prop.s.ctrl;
        ctrl.setModel(root.model);
        ctrl.setup();
        ctrl.inst.states = nd.s.states;
        ctrl.setup();
        ctrl.getCurrentSpace = () => loc;
        comp.update({ innerHTML: "", child: lm });
        lm.s.ctrl.setTitle(
            info.op.name +
                ": " +
                Atool.join(
                    info.doms.map((x: any) => x.name),
                    ", "
                )
        );
        ctrl.show();
    };

    let comp = Tools.div({ child: nd });
    let ctrl = new MainPageController({ lm, nd, comp });
    nd.s.mainBody.s.bodyContent.s.handlers.activityOps["select"] =
        onActivityStepIn;
    console.log(nd.s.mainBody.s.bodyContent.s.handlers.activityOps);
    lm.s.header.s.left.update(
        {},
        {
            click: () => ctrl.onGoback(),
        }
    );

    return comp;
};
