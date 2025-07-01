import { Tools } from "../../april/tools";
import { PropertiesCtrl } from "./Properties";
import { NewDesign } from "./NewDesign";
import { Atool } from "../../april/Array";
import { LoggerMainController } from "./ActivityLogger/Main";

export const MainPage = () => {
    let newDesign = NewDesign();
    let root = newDesign.s.states;
    let lmCtrl = LoggerMainController(root);

    let comp = Tools.div(
        { child: newDesign },
        {},
        { newDesign, loggerMainCtrl: lmCtrl }
    );
    return comp;
};

export const MainPageController = () => {
    let nd = NewDesign();
    let root = nd.s.states;
    let lmCtrl = LoggerMainController(root);
    let comp = MainPage();

    const onActivityStepIn = (e: any, ls: any) => {
        const info = ls.s.data.info;
        let activityId = info.id;
        let loc = [
            ...root?.currentLocation,
            root?.model.activity.key,
            activityId,
        ];
        lmCtrl.funcs.setCurrentSpace(loc);
        let ctrl: PropertiesCtrl = lmCtrl.comp.s.prop.s.ctrl;
        ctrl.setModel(root.model);
        ctrl.setup();
        ctrl.inst.states = nd.s.states;
        ctrl.setup();
        ctrl.getCurrentSpace = () => loc;
        comp.update({ innerHTML: "", child: lmCtrl.comp });
        lmCtrl.funcs.setTitle(
            info.op.name +
                ": " +
                Atool.join(
                    info.doms.map((x: any) => x.name),
                    ", "
                )
        );
        ctrl.show();
        lmCtrl.strucCtrl.renderAll();
    };

    const onGoback = () => {
        comp.update({ innerHTML: "", child: nd });
    };
    comp.s.newDesign.s.mainBody.s.bodyContent.s.handlers.activityOps["select"] =
        onActivityStepIn;
    lmCtrl.comp.s.header.s.left.update(
        {},
        {
            click: () => onGoback(),
        }
    );

    lmCtrl.funcs.setup();

    let res = { comp, lmCtrl, newDesign: nd };

    return res;
};
