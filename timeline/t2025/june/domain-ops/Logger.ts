import { Tools } from "../../april/tools";
import { PropertiesCtrl } from "./Properties";
import { NewDesignCtrl } from "./NewDesign";
import { Atool } from "../../april/Array";
import { LoggerMainController } from "./ActivityLogger/Main";
import { Model } from "./Model";

export const MainPageController = () => {
    let model = new Model();
    let root: any = { model };
    let newDesignCtrl = NewDesignCtrl(root);
    let lmCtrl = LoggerMainController(root);
    let comp = Tools.div({ child: newDesignCtrl.comp });

    const onActivityStepIn = (e: any, ls: any) => {
        const info = ls.s.data.info;
        let activityId = info.id;
        let loc = [
            ...root.newDesignCtrl.states.currentLocation,
            root.model.activity.key,
            activityId,
        ];
        lmCtrl.funcs.setCurrentSpace(loc);
        let ctrl: PropertiesCtrl = lmCtrl.comp.s.prop.s.ctrl;
        ctrl.setModel(root.model);
        ctrl.setup();
        ctrl.inst.states = newDesignCtrl.comp.s.states;
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
        comp.update({ innerHTML: "", child: newDesignCtrl.comp });
    };
    newDesignCtrl.actCtrl.activityOps["select"] = onActivityStepIn;
    lmCtrl.comp.s.header.s.left.update(
        {},
        {
            click: () => onGoback(),
        }
    );

    root.comp = comp;
    root.newDesignCtrl = newDesignCtrl;
    root.lmCtrl = lmCtrl;

    newDesignCtrl.funcs.setup();
    lmCtrl.funcs.setup();
    return root;
};
