import { LocalStorageJSONModel } from "../../april/LocalStorage";
import { v4 as uuidv4 } from "uuid";
export class Model {
    model = new LocalStorageJSONModel("dom-ops-logger");
    create(name: string, loc: string[], typ = "domains") {
        if (this.exists(name, loc, typ)) {
            throw new Error("Domain already exists");
        }
        let idd = uuidv4();
        let newLoc = [...loc, "domains", idd];
        this.model.addEntry(newLoc, { name: name });
    }
    rename(newName: string, loc: string[]) {
        if (!this.model.exists([...loc, "name"])) return;
        this.model.updateEntry([...loc, "name"], newName);
    }
    delete(loc: string[]) {
        this.model.deleteEntry(loc);
    }
    read(loc: string[]) {
        return this.model.readEntry(loc);
    }
    exists(name: string, loc: string[], typ = "domains") {
        let vals = this.model.readEntry([...loc, typ]);
        for (let id in vals) {
            if (vals[id]["name"] == name) {
                return true;
            }
        }
        return false;
    }
    readAll(loc: string[], typ = "domains") {
        let vals = this.model.readEntry([...loc, typ]);
        return vals;
    }
}

export class Domain {
    create(loc: string[], name: string) {}
    read(loc: string[]) {}
    updateName(loc: string[], name: string) {}
    delete(loc: string[]) {}
}

export class Operations {
    create(loc: string[], name: string) {}
    read(loc: string[]) {}
    updateName(loc: string[], name: string) {}
    delete(loc: string[]) {}
}

export class Activity {
    create(loc: string[], name: string) {}
    read(loc: string[]) {}
    updateName(loc: string[], name: string) {}
    delete(loc: string[]) {}
}

export class Logger {
    create(loc: string[], name: string) {}
    read(loc: string[]) {}
    updateName(loc: string[], name: string) {}
    delete(loc: string[]) {}
}

export class LogStructure {
    create(loc: string[], name: string) {}
    read(loc: string[]) {}
    updateName(loc: string[], name: string) {}
    delete(loc: string[]) {}
}

export class Properties {
    create(loc: string[], name: string) {}
    read(loc: string[]) {}
    updateName(loc: string[], name: string) {}
    delete(loc: string[]) {}
}

export class SearchFilters {
    create(loc: string[], name: string) {}
    read(loc: string[]) {}
    updateName(loc: string[], name: string) {}
    delete(loc: string[]) {}
}
