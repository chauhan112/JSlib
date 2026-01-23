import { CompactModalCtrl } from "./CompactModel";
import { MultiLayerModalCtrl } from "./multiLayerModal";
import { ContextMenu } from "./ContextMenu";
import { GenericModal } from "./Modal";
import type { GComponent } from "../GComponent";
import { Tools } from "../tools";
import { NotificationCompCtrl } from "./NotificationComp";


type key = "modal" | "contextMenu" | "multiModal" | "compactModal" | "notification";

export class GlobalStates {
    static instance: GlobalStates | null = null;
    private readonly comp: GComponent;
    private constructor() {
        this.states = {} as { [K in key]: any };
        let modal = GenericModal("");
        let mModalCtrl = MultiLayerModalCtrl();
        let contextMenu = ContextMenu([]);
        let compactModal = CompactModalCtrl();
        let notification = new NotificationCompCtrl();
        this.addState("modal", modal);
        this.addState("contextMenu", contextMenu);
        this.addState("multiModal", mModalCtrl);
        this.addState("compactModal", compactModal);
        this.addState("notification", notification);
        this.comp = Tools.div({
            children: [
                modal,
                contextMenu,
                mModalCtrl.modal,
                compactModal.modal,
                notification.comp,
            ],
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
