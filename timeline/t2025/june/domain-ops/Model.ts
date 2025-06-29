import { LocalStorageJSONModel } from "../../april/LocalStorage";
import { v4 as uuidv4 } from "uuid";
import { SetWrapper } from "../../april/Array";
import { HashMapDataStructure } from "../HashMap";

export class Model {
    model = new LocalStorageJSONModel("dom-ops-logger");
    domain: Domain = new Domain();
    operations: Operations = new Operations();
    activity: Activity = new Activity();
    logger: Logger = new Logger();
    logStructure: LogStructure = new LogStructure();
    properties: Properties = new Properties();
    searchFilters: SearchFilters = new SearchFilters();
    constructor() {
        this.domain.setModel(this.model);
        this.operations.setModel(this.model);
        this.activity.setModel(this.model);
        this.activity.parent = this;

        this.logger.setModel(this.model);
        this.logStructure.setModel(this.model);
        this.properties.setModel(this.model);
        this.searchFilters.setModel(this.model);
    }
}

export class Tools {
    static exists(
        name: string,
        loc: string[],
        model: LocalStorageJSONModel,
        typ = "domains"
    ) {
        if (!model.exists([...loc, typ])) {
            return false;
        }
        let vals = model.readEntry([...loc, typ]);
        for (let id in vals) {
            if (vals[id]["name"] == name) {
                return true;
            }
        }
        return false;
    }
}

export class Domain {
    model: LocalStorageJSONModel | null = null;
    key: string = "domains";
    setModel(model: LocalStorageJSONModel) {
        this.model = model;
    }
    create(loc: string[], name: string) {
        if (this.exists(name, loc)) {
            throw new Error("Domain already exists");
        }
        let idd = uuidv4();
        let newLoc = [...loc, this.key, idd];
        this.model?.addEntry(newLoc, { name: name });
    }
    read(id: string, loc: string[]) {
        if (!this.model?.exists([...loc, this.key, id])) {
            throw new Error("Domain does not exist");
        }
        return this.model.readEntry([...loc, this.key, id]);
    }
    readAll(loc: string[]) {
        if (!this.model?.exists([...loc, this.key])) return [];
        return this.model?.readEntry([...loc, this.key]);
    }
    updateName(loc: string[], id: string, name: string) {
        let path = [...loc, this.key, id, "name"];
        if (!this.model?.exists(path)) return;
        this.model.updateEntry(path, name);
    }
    delete(id: string, loc: string[]) {
        if (!this.model?.exists([...loc, this.key, id])) {
            throw new Error("Domain does not exist");
        }
        this.model.deleteEntry([...loc, this.key, id]);
    }
    exists(name: string, loc: string[]) {
        return Tools.exists(name, loc, this.model!, this.key);
    }
    readNameAndId(loc: string[]) {
        if (!this.model?.exists([...loc, this.key])) return [];
        let vals = this.model.readEntry([...loc, this.key]);
        let result: { name: string; id: string }[] = [];
        for (let id in vals) {
            result.push({ name: vals[id]["name"], id: id });
        }
        return result;
    }
}

export class Operations extends Domain {
    key: string = "operations";
}

export class Activity {
    key: string = "activity";
    dom: string = "domains";
    ops: string = "operation";
    model: LocalStorageJSONModel | null = null;
    parent: Model | null = null;
    setModel(model: LocalStorageJSONModel) {
        this.model = model;
    }
    create(
        loc: string[],
        name: string,
        operation: string,
        domains: string[],
        infos?: any
    ) {
        if (this.exists(domains, operation, loc)) {
            throw new Error("Domain already exists");
        }

        let idd = uuidv4();
        let newLoc = [...loc, this.key, idd];
        this.model?.addEntry(newLoc, {
            name: name,
            [this.dom]: domains,
            [this.ops]: operation,
            ...infos,
        });
    }
    isEqual(doms: string[], op: string, dom2: string[], op2: string) {
        if (op !== op2) return false;
        if (doms.length !== dom2.length) return false;
        return SetWrapper.difference(new Set(doms), new Set(dom2)).size === 0;
    }
    read(loc: string[], id: string) {
        return this.model?.readEntry([...loc, this.key, id]);
    }
    update(
        loc: string[],
        id: string,
        doms: string[],
        ops: string,
        infos?: any
    ) {
        if (!this.model?.exists([...loc, this.key, id])) {
            throw new Error("Activity does not exist");
        }
        let path = [...loc, this.key, id];
        let curActivity = this.read(loc, id);

        if (doms.length > 0) {
            curActivity[this.dom] = doms;
        }
        if (ops) {
            curActivity[this.ops] = ops;
        }
        curActivity = { ...curActivity, ...infos };
        this.model?.updateEntry(path, curActivity);
    }
    delete(loc: string[], id: string) {
        if (!this.model?.exists([...loc, this.key, id])) {
            throw new Error("Activity does not exist");
        }
        this.model.deleteEntry([...loc, this.key, id]);
    }
    exists(doms: string[], ops: string, loc: string[]) {
        if (!this.model?.exists([...loc, this.key])) {
            return false;
        }
        let vals = this.model.readEntry([...loc, this.key]);
        for (let id in vals) {
            if (
                this.isEqual(vals[id][this.dom], vals[id][this.ops], doms, ops)
            ) {
                return true;
            }
        }
        return false;
    }
    readAll(loc: string[]) {
        if (!this.model?.exists([...loc, this.key])) return [];
        let vals = this.model.readEntry([...loc, this.key]);
        let result: {
            domains: { name: string; id: string }[];
            operation: { name: string; id: string };
            id: string;
            name: string;
        }[] = [];
        let allDoms = this.parent?.domain.readNameAndId(loc);
        let allOps = this.parent?.operations.readNameAndId(loc);
        let domMap = new HashMapDataStructure();
        let opMap = new HashMapDataStructure();
        allDoms?.forEach((dom) => {
            domMap.add(dom.id, dom.name);
        });
        allOps?.forEach((op) => {
            opMap.add(op.id, op.name);
        });
        for (let id in vals) {
            let doms: { name: string; id: string }[] = [];
            vals[id][this.dom].forEach((domId: string) => {
                doms.push({ name: domMap.read(domId), id: domId });
            });
            let opId = vals[id][this.ops];
            let opName = opMap.read(opId);
            result.push({
                domains: doms,
                operation: { name: opName, id: opId },
                id,
                name: vals[id]["name"],
            });
        }
        return result;
    }
}

export class Logger {
    model: LocalStorageJSONModel | null = null;
    setModel(model: LocalStorageJSONModel) {
        this.model = model;
    }
    create(loc: string[], name: string) {}
    read(loc: string[]) {}
    updateName(loc: string[], name: string) {}
    delete(loc: string[]) {}
}
export type InputType =
    | "input"
    | "largeText"
    | "file"
    | "select"
    | "date"
    | "time"
    | "number"
    | "checkbox";

export class LogStructure {
    model: LocalStorageJSONModel | null = null;
    key = "structure";
    setModel(model: LocalStorageJSONModel) {
        this.model = model;
    }
    create(loc: string[], name: string, type: InputType, order: number) {
        if (this.model?.exists([...loc, this.key, name])) {
            throw new Error("Log already exists");
        }
        let idd = uuidv4();
        let vals = this.model?.readEntry([...loc, this.key]);
        vals[idd] = { name, type, order, id: idd };
        this.sortValsAndReassignOrder(vals);
        this.model?.addEntry([...loc, this.key], vals);
        return idd;
    }
    sortValsAndReassignOrder(vals: any) {
        let valsArr = Object.values(vals);
        valsArr.sort((a: any, b: any) => a.order - b.order);
        let n = 0;
        for (let v of valsArr as any) {
            vals[v.id]["order"] = n;
            n += 2;
        }
        return vals;
    }
    read(loc: string[]) {
        let vals = this.model?.readEntry([...loc, this.key]);
        return Object.values(vals);
    }
    updateIds(loc: string[], id: string, newVal: any) {
        let vals = this.model?.readEntry([...loc, this.key]);
        vals[id] = { ...vals[id], ...newVal };
        this.sortValsAndReassignOrder(vals);
        this.model?.updateEntry([...loc, this.key], vals);
    }
    delete(loc: string[], id: string) {
        let vals = this.model?.readEntry([...loc, this.key]);
        delete vals[id];
        this.sortValsAndReassignOrder(vals);
        this.model?.updateEntry([...loc, this.key], vals);
    }
}

export class Properties {
    model: LocalStorageJSONModel | null = null;
    key = "properties";
    setModel(model: LocalStorageJSONModel) {
        this.model = model;
    }
    create(loc: string[], key: string, value: any) {
        if (this.model?.exists([...loc, this.key, key])) {
            throw new Error("Property already exists");
        }
        this.model?.addEntry([...loc, this.key, key], value);
    }
    read(loc: string[], key: string) {
        return this.model?.readEntry([...loc, this.key, key]);
    }
    update(loc: string[], key: string, value: any) {
        this.model?.updateEntry([...loc, this.key, key], value);
    }
    delete(loc: string[], key: string) {
        this.model?.deleteEntry([...loc, this.key, key]);
    }
    readAll(loc: string[]) {
        if (!this.model?.exists([...loc, this.key])) return [];

        const res: {
            key: string;
            value: any;
        }[] = [];

        const vals = this.model.readEntry([...loc, this.key]);
        for (let key in vals) {
            res.push({
                key: key,
                value: vals[key],
            });
        }
        return res;
    }
}

export class SearchFilters {
    model: LocalStorageJSONModel | null = null;
    setModel(model: LocalStorageJSONModel) {
        this.model = model;
    }
    create(loc: string[], name: string) {}
    read(loc: string[]) {}
    updateName(loc: string[], name: string) {}
    delete(loc: string[]) {}
}
