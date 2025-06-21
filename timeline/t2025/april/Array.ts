export class Atool {
    static join(array: any[], separator: string) {
        return array.join(separator);
    }
    static addInMiddle(array: any[], value: any) {
        const newArray = [];
        for (let i = 0; i < array.length; i++) {
            newArray.push(array[i]);
            if (i < array.length - 1) {
                if (typeof value === "function") {
                    newArray.push(value());
                } else {
                    newArray.push(value);
                }
            }
        }
        return newArray;
    }
}

export class Undoers {
    array: any[] = [];
    state: any = {};
    undo() {
        for (const func of this.array) {
            func();
        }
        this.clear();
    }
    clear() {
        this.array = [];
    }
    add(value: any) {
        this.array.push(value);
    }
}

export class DocumentHandler {
    static instance: DocumentHandler | null = null;
    undoer: Undoers = new Undoers();
    private constructor() {
        document.addEventListener("click", (e: any) => this.onClick(e));
    }
    onClick(e: any) {
        this.undoer.undo();
    }
    static getInstance() {
        DocumentHandler.instance ??= new DocumentHandler();
        return DocumentHandler.instance;
    }
}

export class ObjectTools {
    static getKeys(obj: any) {
        return Object.keys(obj);
    }
    static getValues(obj: any) {
        return Object.values(obj);
    }
    static getEntries(obj: any) {
        return Object.entries(obj);
    }
    static getKeysAndValues(obj: any) {
        return Object.entries(obj).map(([key, value]) => [key, value]);
    }
}
