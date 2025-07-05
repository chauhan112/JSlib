import { IComponent } from "../../april/GComponent";
import { GlobalStates } from "../../june/domain-ops/GlobalStates";
export const MultiLayerModalCtrl = () => {
    let modal = GlobalStates.getInstance().getState("modal");
    let stack: { comp: IComponent; title: string }[] = [];
    const showLayer = (layer: IComponent, title: string) => {
        modal.s.modalTitle.update({ textContent: title });
        modal.s.handlers.display(layer);
        modal.s.handlers.show();
    };

    const addLayer = (layer: IComponent, title: string) => {
        stack.push({ comp: layer, title });
        showLayer(layer, title);
    };

    const closeLayer = () => {
        if (stack.length === 0) modal.s.handlers.hide();
        let layer = stack.pop();
        if (layer) showLayer(layer.comp, layer.title);
    };
    return { showLayer, closeLayer, stack, addLayer };
};
