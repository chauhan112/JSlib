import { GComponent } from "../../april/GComponent";
import { Tools } from "../../april/tools";
import { GenericModal } from "../../may/FileSearch/Modal";
import { ContextMenu } from "./ContextMenu";
import { MultiLayerModalCtrl } from "../../july/generic-crud/multiLayerModal";

export class GlobalStates {
    static instance: GlobalStates | null = null;
    private readonly comp: GComponent;
    private constructor() {
        this.states = {};
        let modal = GenericModal("");
        let mModalCtrl = MultiLayerModalCtrl();
        let contextMenu = ContextMenu([]);
        this.addState("modal", modal);
        this.addState("contextMenu", contextMenu);
        this.addState("multiModal", mModalCtrl);
        this.comp = Tools.div({
            children: [modal, contextMenu, mModalCtrl.modal],
        });
        this.addToBody();
    }
    private addToBody() {
        document.body.appendChild(this.comp.getElement());
    }

    static getInstance() {
        GlobalStates.instance ??= new GlobalStates();
        return GlobalStates.instance;
    }
    states: any = {};
    setStates(states: any) {
        this.states = states;
    }
    addState(key: string, value: any) {
        this.states[key] = value;
    }
    getState(key: string) {
        return this.states[key];
    }
}
