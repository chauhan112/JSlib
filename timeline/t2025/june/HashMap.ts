class HashMapDataStructure {
    data: any = {};
    add(key: string, value: any, overwrite = false) {
        if (!overwrite && this.exists(key)) {
            return;
        }
        this.data[key] = value;
    }
    deleteKey(key: string) {
        if (this.exists(key)) {
            delete this.data[key];
        }
    }
    exists(key: string) {
        return this.data.hasOwnProperty(key);
    }
    read(key: string) {
        return this.data[key];
    }
    readAllKeys() {
        return Object.keys(this.data);
    }
    create_new() {
        return new HashMapDataStructure();
    }
    clear() {
        for (let member in this.data) delete this.data[member];
    }
    size() {
        return this.readAllKeys().length;
    }
}
