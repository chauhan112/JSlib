export class Model {
    data: any;
    constructor() {
        this.data = this.readFormStorage();
    }
    addEntry(location: string[], value: any) {
        let x = this.data;
        for (let i = 0; i < location.length; i++) {
            let key = location[i];
            if (!x.hasOwnProperty(key)) {
                let data;
                data = {};
                if (i == location.length - 1) data = value;
                x[key] = data;
            }
            x = x[key];
        }
        this.writeToStorage();
    }
    deleteEntry(location: string[]) {
        let newLoc = location.slice(0, location.length - 1);
        let data = this.readEntry(newLoc);
        let lastKey = location[location.length - 1];
        delete data[lastKey];
        this.writeToStorage();
    }
    updateEntry(location: string[], value: any) {
        if (location.length == 0) return;
        let newLoc = [...location];
        let lastKey = newLoc.pop();
        let vals = this.readEntry(newLoc);
        vals[lastKey!] = value;
        this.writeToStorage();
    }
    readEntry(location: string[]) {
        let x = this.data;
        for (let key of location) {
            if (!x.hasOwnProperty(key)) {
                throw new Error("Key does not exist");
            }
            x = x[key];
        }
        return x;
    }
    readFormStorage() {
        return {};
    }
    writeToStorage() {}
    get_keys(location: string[]) {
        return Object.keys(this.readEntry(location));
    }
    exists(location: string[]) {
        try {
            this.readEntry(location);
            return true;
        } catch {
            return false;
        }
    }
}

export class LocalStorageJSONModel extends Model {
    key: string;
    data: any;
    constructor(key?: string) {
        super();
        this.key = key || "LocalStorageModel";
        this.data = this.readFormStorage();
    }
    readFormStorage() {
        let x = localStorage.getItem(this.key);
        if (x) return JSON.parse(x);
        return {};
    }
    writeToStorage() {
        localStorage.setItem(this.key, JSON.stringify(this.data));
    }
}
