export class GlobalStates {
    static instance: GlobalStates;
    private constructor() {}
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
}
