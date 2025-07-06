// npm install sift
import sift from "sift";

export enum ComparerType {
    lt = "lt",
    gt = "gt",
    lte = "lte",
    gte = "gte",
    eq = "eq",
    neq = "neq",
    in = "in",
    nin = "nin",
    regex = "regex",
    word = "word",
}
export class Comparer {
    static compare(a: any, b: any, type: ComparerType) {
        if (type === "lt") return a < b;
        if (type === "gt") return a > b;
        if (type === "lte") return a <= b;
        if (type === "gte") return a >= b;
        if (type === "eq") return a === b;
        if (type === "neq") return a !== b;
        if (type === "in") return a.includes(b);
        if (type === "nin") return !a.includes(b);
        if (type === "regex") return new RegExp(b).test(a);
        if (type === "word") return new RegExp(b).test("\b" + a + "\b");
    }
    static locExists(obj: any, loc: string[]) {}
    static isObj(obj: any) {
        return typeof obj === "object";
    }
    static isArr(obj: any) {
        return Array.isArray(obj);
    }
}

class DataSetter {
    data: any[] = [];
    constructor(data: any[]) {
        this.data = data;
    }
    setData(data: any[]) {
        this.data = data;
    }
}
export class DicSearchSystem extends DataSetter {
    siftSearch(params: any) {
        let vals = Object.values(this.data);
        return vals.filter(sift(params));
    }
}
export class ArraySearch extends DataSetter {
    search(params: any) {}
    sequenceSearch(params: any) {}
}
export class Sorter extends DataSetter {
    sort(params: any) {}
}
export class Reader extends DataSetter {
    readAt(index: number) {
        return this.data[index];
    }
}
export class Mapper extends DataSetter {
    stringify() {}
    lengthCalc() {}
}

export class Filter {
    static filter(params: { type: string; params: any }[], data: any[]) {}
}
