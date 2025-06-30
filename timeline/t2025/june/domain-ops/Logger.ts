import { Tools } from "../../april/tools";
import { Table } from "../../april/DomainOps/Home";
import { Header } from "./Component";
import { FlexTable, Properties, PropertiesCtrl, Section } from "./Properties";
import { SearchComponent } from "../../may/FileSearch/Search";
import { NewDesign } from "./NewDesign";
import { ArrowLeft, Plus } from "lucide";
import { Atool } from "../../april/Array";
import { GenericForm, Params } from "./Form";
import { InputType, Model } from "./Model";
import { GlobalStates } from "./GlobalStates";

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
    setup() {
        this.inst.header.s.right.update(
            {},
            {
                click: this.toggleRightNav.bind(this),
            }
        );
        let form = this.inst.struc.s.form;
        form.s.handlers.submit = this.onCreate.bind(this);
    }
    onCreate(e: any, ls: any) {
        let form = this.inst.struc.s.form;
        e.preventDefault();
        let vals = form.s.handlers.getValues();
        let valsCopy = { ...vals, order: parseInt(vals.order) };
        form.s.handlers.clearValues();
        let model: Model = this.inst.model;
        model.logStructure.create(this.getCurrentSpace(), valsCopy);
    }
    getCurrentSpace() {
        return [
            ...this.inst.root?.currentLocation,
            this.inst.root?.model.activity.key,
        ];
    }

    activityStepIn(e: any, ls: any) {
        let root = this.inst.root;
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
        {
            header,
            prop,
            struc,
            searchComp,
            ctrl,
        }
    );
    ctrl.inst.comp = comp;
    return comp;
};
export const StructureForm = () => {
    const form = GenericForm();
    let options = Object.entries(InputType);
    let comps: any[] = [
        Params.inp("key", {
            class: "w-full p-2 rounded-md bg-gray-100 text-black",
            placeholder: "Enter the key",
        }),
        Params.select(
            "inputType",
            options.map((op) => [op[1], op[0]])
        ),
        Params.inp("order", {
            class: "w-full p-2 rounded-md bg-gray-100 text-black",
            placeholder: "give the order for sorting",
            type: "number",
            value: 0,
        }),
        Params.inpSubmit(),
    ];
    form.s.handlers.setComponents(comps);
    return form;
};

export const StructureSection = () => {
    const section = Section();
    const sf = StructureForm();
    const table = FlexTable(["key", "inputType", "order"]);
    section.s.body.update({ child: table });
    section.s.header.s.title.update({ textContent: "Structure" });
    section.s.header.s.plus.update(
        {},
        {
            click: () => {
                let modal = GlobalStates.getInstance().getState("modal");
                modal.s.handlers.display(sf);
                modal.s.handlers.show();
            },
        }
    );

    section.update({}, {}, { table, form: sf });

    return section;
};
export const MainPage = () => {
    let lm = LoggerMain();
    let nd = NewDesign();
    let root = nd.s.states;
    const onActivityStepIn = (e: any, ls: any) => {};
    let comp = Tools.div({ child: nd }, {}, { newDesign: nd, loggerMain: lm });
    let ctrl = new MainPageController({ lm, nd, comp });
    nd.s.mainBody.s.bodyContent.s.handlers.activityOps["select"] =
        onActivityStepIn;
    lm.s.header.s.left.update(
        {},
        {
            click: () => ctrl.onGoback(),
        }
    );
    lm.s.ctrl.inst.root = root;
    lm.s.ctrl.setup();
    return comp;
};
