import { LocalStorageJSONModel } from "../../april/LocalStorage";
import { v4 as uuidv4 } from "uuid";
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
    updateName(loc: string[], name: string) {
        if (!this.model?.exists([...loc, "name"])) return;
        this.model.updateEntry([...loc, "name"], name);
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
    model: LocalStorageJSONModel | null = null;
    setModel(model: LocalStorageJSONModel) {
        this.model = model;
    }
    create(loc: string[], name: string) {}
    read(loc: string[]) {}
    updateName(loc: string[], name: string) {}
    delete(loc: string[]) {}
    exists(name: string, loc: string[]) {
        return Tools.exists(name, loc, this.model!, "activity");
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

export class LogStructure {
    model: LocalStorageJSONModel | null = null;
    setModel(model: LocalStorageJSONModel) {
        this.model = model;
    }
    create(loc: string[], name: string) {}
    read(loc: string[]) {}
    updateName(loc: string[], name: string) {}
    delete(loc: string[]) {}
}

export class Properties {
    model: LocalStorageJSONModel | null = null;
    setModel(model: LocalStorageJSONModel) {
        this.model = model;
    }
    create(loc: string[], name: string) {}
    read(loc: string[]) {}
    updateName(loc: string[], name: string) {}
    delete(loc: string[]) {}
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
