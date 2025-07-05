import { LocalStorageJSONModel } from "../../april/LocalStorage";
import { Atool } from "../../april/Array";
import { v4 as uuidv4 } from "uuid";
export type ModelType = {
    readAll: () => Promise<any>;
    read: (id: any) => Promise<any>;
    create: (vals: any) => Promise<any>;
    update: (id: any, val: any) => Promise<any>;
    delete: (id: any) => Promise<any>;
};
export class GenericCRUDModel {
    model: LocalStorageJSONModel | null = null;
    currentLoc: string[] = [];
    onChange: () => void = () => {};
    constructor(data_model_name: string = "GenericCRUDModel") {
        this.model = new LocalStorageJSONModel(data_model_name);
    }
    setCurrentLoc(loc: string[]) {
        this.currentLoc = loc;
    }
    async create(vals: any) {
        this.model?.addEntry(this.currentLoc, vals);
        this.onChange();
    }
    async read(id: string) {
        return this.model?.readEntry([...this.currentLoc, id]);
    }
    async update(id: string, vals: any) {
        this.model?.updateEntry([...this.currentLoc, id], vals);
        this.onChange();
    }
    async delete(id: string) {
        this.model?.deleteEntry([...this.currentLoc, id]);
        this.onChange();
    }
    async exists(id: string) {
        return this.model?.exists([...this.currentLoc, id]);
    }
    async readAll() {
        return this.model?.readEntry(this.currentLoc);
    }
}
export const FormModel = () => {
    function sortValsAndReassignOrder(vals: any) {
        let valsArr = Object.values(vals);
        valsArr.sort((a: any, b: any) => a.order - b.order);
        let n = 0;
        for (let v of valsArr as any) {
            vals[v.id]["order"] = n;
            n += 2;
        }
        return vals;
    }
    let states: any = { structures: {} };
    const readAll = async () => {
        return Atool.sorted(
            Object.values(states.structures),
            (a: any, b: any) => a.order - b.order
        );
    };
    const onDelete = async (id: any) => {
        if (states.structures[id]) delete states.structures[id];
        states.onChange();
    };
    const update = async (id: any, vals: any) => {
        if (states.structures[id]) {
            states.structures[id] = {
                ...states.structures[id],
                ...vals,
            };
        }
        states.onChange();
    };
    const exists = async (val: any) => {
        for (let key in states.structures) {
            let v = states.structures[key];
            if (v.key == val.key) return true;
        }
        return false;
    };
    const create = async (vals: any) => {
        if (await exists(vals)) {
            throw new Error("Key already exists");
        }
        let id = uuidv4();
        states.structures[id] = { ...vals, id: id };
        states.onChange();
    };
    const read = async (id: any) => {
        return states.structures[id];
    };
    const onChange = () => {
        states.structures = sortValsAndReassignOrder(states.structures);
    };
    states.onChange = onChange;
    return {
        funcs: {
            read,
            readAll,
            create,
            update,
            delete: onDelete,
        },
        sortValsAndReassignOrder,
        states,
        exists,
        onChange,
    };
};
