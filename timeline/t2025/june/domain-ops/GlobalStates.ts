import { GComponent } from "../../april/GComponent";
import { Tools } from "../../april/tools";
import { GenericModal } from "../../may/FileSearch/Modal";
export class GlobalStates {
    static instance: GlobalStates;
    private comp: GComponent;
    private constructor() {
        this.states = {};
        let modal = GenericModal("");
        this.addState("modal", modal);
        this.comp = Tools.div({
            children: [modal],
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
