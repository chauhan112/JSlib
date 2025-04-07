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
    undoer: Undoers = new Undoers();
    constructor() {
        console.log("DocumentHandler constructor");
        document.addEventListener("click", (e: any) => this.onClick(e));
    }
    onClick(e: any) {
        this.undoer.undo();
    }
}
