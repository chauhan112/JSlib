import { Tools } from "../../april/tools";
import { PropertiesCtrl } from "./Properties";
import { NewDesignCtrl } from "./NewDesign";
import { Atool } from "../../april/Array";
import { ActivityMainController } from "./ActivityLogger/Main";
import { Model } from "./Model";

export const MainPageController = () => {
    let model = new Model();
    let root: any = { model };
    let newDesignCtrl = NewDesignCtrl(root);
    let activityMainCtrl = ActivityMainController(root);
    let comp = Tools.div({ child: newDesignCtrl.comp });

    const onActivityStepIn = (e: any, ls: any) => {
        const info = ls.s.data.info;
        let activityId = info.id;
        let loc = [
            ...root.newDesignCtrl.states.currentLocation,
            root.model.activity.key,
            activityId,
        ];
        activityMainCtrl.funcs.setCurrentSpace(loc);
        let ctrl: PropertiesCtrl = activityMainCtrl.comp.s.prop.s.ctrl;
        ctrl.setModel(root.model);
        ctrl.setup();
        ctrl.inst.states = newDesignCtrl.comp.s.states;
        ctrl.setup();
        ctrl.getCurrentSpace = () => loc;
        comp.update({ innerHTML: "", child: activityMainCtrl.comp });
        activityMainCtrl.funcs.setTitle(
            info.op.name +
                ": " +
                Atool.join(
                    info.doms.map((x: any) => x.name),
                    ", "
                )
        );
        ctrl.show();
        activityMainCtrl.strucCtrl.renderAll();
    };

    const onGoback = () => {
        comp.update({ innerHTML: "", child: newDesignCtrl.comp });
    };
    newDesignCtrl.actCtrl.activityOps["select"] = onActivityStepIn;
    activityMainCtrl.comp.s.header.s.left.update(
        {},
        {
            click: () => onGoback(),
        }
    );

    root.comp = comp;
    root.newDesignCtrl = newDesignCtrl;
    root.lmCtrl = activityMainCtrl;

    newDesignCtrl.funcs.setup();
    activityMainCtrl.funcs.setup();
    return root;
};
