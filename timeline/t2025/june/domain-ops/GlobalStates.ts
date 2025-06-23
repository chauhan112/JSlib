import { GenericModal } from "../../may/FileSearch/Modal";
export class GlobalStates {
    static instance: GlobalStates;
    private constructor() {
        this.states = {};
        this.addState("modal", GenericModal(""));
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
