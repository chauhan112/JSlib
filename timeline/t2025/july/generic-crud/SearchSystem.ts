// npm install sift
import sift from "sift";
export enum SearchType {
    ValStringSearch = "ValStringSearch",
    Mongo = "Mongo",
    LocSearch = "LocSearch",
    KeyValSearch = "KeyValSearch",
    Sort = "Sort",
}
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
    caseless = "caseless",
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
        if (type === "caseless")
            return b.toLowerCase().includes(a.toLowerCase());
    }
    static isObj(obj: any) {
        return typeof obj === "object";
    }
    static isArr(obj: any) {
        return Array.isArray(obj);
    }
    static caseRegexCompare(
        wordToSearch: string,
        text: string,
        reg: boolean = false,
        caseSensitive: boolean = false
    ) {
        if (caseSensitive)
            return Comparer.compare(wordToSearch, text, ComparerType.in);
        if (reg) Comparer.compare(wordToSearch, text, ComparerType.regex);
        return Comparer.compare(wordToSearch, text, ComparerType.caseless);
    }
}
export class DicOperation {
    static readEntry(location: string[], data: any) {
        let x = data;
        for (let key of location) {
            if (!x.hasOwnProperty(key)) {
                throw new Error("Key does not exist");
            }
            x = x[key];
        }
        return x;
    }
    static exists(location: string[], data: any) {
        let x = data;
        for (let key of location) {
            if (!x.hasOwnProperty(key)) {
                return false;
            }
            x = x[key];
        }
        return true;
    }
}
export class DicSearchSystem {
    data: any = {};
    setData(data: any) {
        this.data = data;
    }
    siftSearch(params: any) {
        let res = ArraySearch.siftSearch(
            params,
            Object.entries(this.data).map(([key, value]) => ({ key, value }))
        );
        return res.map((el: { key: string; value: any }) => el.key);
    }
    stringSearch(
        text: string,
        caseSensitive: boolean = false,
        reg: boolean = false
    ) {
        return ArraySearch.stringSearch(this.data, text, caseSensitive, reg);
    }
    keyValSearch(
        text: string,
        caseSensitive: boolean = false,
        reg: boolean = false
    ) {
        return ArraySearch.stringSearch(
            Object.entries(this.data),
            text,
            caseSensitive,
            reg
        );
    }
    locSearch(
        loc: string[],
        params: { word: string; case: boolean; reg: boolean }
    ) {
        let res = [];
        for (const key in this.data) {
            if (loc.length === 0) {
                if (
                    Comparer.caseRegexCompare(
                        params.word,
                        key,
                        params.reg,
                        params.case
                    )
                ) {
                    res.push(key);
                }
            } else if (DicOperation.exists(loc, this.data[key])) {
                let val = DicOperation.readEntry(loc, this.data[key]);
                if (
                    Comparer.caseRegexCompare(
                        params.word,
                        val,
                        params.reg,
                        params.case
                    )
                ) {
                    res.push(key);
                }
            }
        }
        return res;
    }
    static search(params: { type: SearchType; params: any }, data: any) {
        let searcher = new DicSearchSystem();
        searcher.setData(data);
        switch (params.type) {
            case SearchType.Mongo:
                return searcher.siftSearch(params.params);
            case SearchType.ValStringSearch:
                return searcher.stringSearch(
                    params.params.word,
                    params.params.case,
                    params.params.reg
                );
            case SearchType.KeyValSearch:
                return searcher.keyValSearch(
                    params.params.word,
                    params.params.case,
                    params.params.reg
                );
            case SearchType.LocSearch:
                return searcher.locSearch(params.params.loc, params.params);
        }
        return [];
    }
}
export class ArraySearch {
    static siftSearch(params: any, data: any[]) {
        return data.filter(sift(params));
    }
    static stringSearch(
        data: any[],
        text: string,
        caseSensitive: boolean = false,
        reg: boolean = false
    ) {
        if (text === "") return data;
        return data.filter((val: any) => {
            let value = JSON.stringify(val);
            return Comparer.caseRegexCompare(text, value, reg, caseSensitive);
        });
    }
    static keyValSearch(
        data: any[],

        params: { key: string; word: string; case: boolean; reg: boolean }
    ) {
        return data.filter((val: any) => {
            return Comparer.caseRegexCompare(
                params.word,
                val[params.key],
                params.reg,
                params.case
            );
        });
    }
    sequenceSearch(params: any) {}
    static locSearch(
        data: any[],
        loc: string[],
        params: { word: string; case: boolean; reg: boolean }
    ) {
        return data.filter((val: any) => {
            return (
                DicOperation.exists(loc, val) &&
                Comparer.caseRegexCompare(
                    params.word,
                    DicOperation.readEntry(loc, val),
                    params.reg,
                    params.case
                )
            );
        });
    }
    static anyLocSearch(
        data: any[],
        loc: string[],
        params: { word: any; type: ComparerType }
    ) {
        return data.filter((val: any) => {
            return (
                DicOperation.exists(loc, val) &&
                Comparer.compare(params.word, val, params.type)
            );
        });
    }
}
export class Sorter {
    static valSortAsString(data: any[]) {
        return data.map((val) => JSON.stringify(val)).sort();
    }
    static locSort(
        data: any[],
        params: { loc: string[]; defaultValue: any; desc: boolean }
    ) {
        const getVal = (val: any, loc: string[]) => {
            if (DicOperation.exists(loc, val))
                return DicOperation.readEntry(loc, val);
            return params.defaultValue;
        };
        let res = [...data].sort((a: any, b: any) => {
            let valA = getVal(a, params.loc);
            let valB = getVal(b, params.loc);
            if (valA < valB) return -1;
            if (valA > valB) return 1;
            return 0;
        });
        if (params.desc) res.reverse();
        return res;
    }
}
export class Reader {
    static readAt(index: number, data: any[]) {
        return data[index];
    }
}
export class Mapper {
    stringify() {}
    lengthCalc() {}
}

export class Filter {
    static ArrayConcatSearch(
        params: { type: SearchType; params: any }[],
        data: any[]
    ) {
        let res = data;
        for (const searchParam of params) {
            switch (searchParam.type) {
                case SearchType.ValStringSearch:
                    res = ArraySearch.stringSearch(
                        res,
                        searchParam.params.word,
                        searchParam.params.case,
                        searchParam.params.reg
                    );
                    break;
                case SearchType.KeyValSearch:
                    res = ArraySearch.keyValSearch(res, searchParam.params);
                    break;
                case SearchType.LocSearch:
                    res = ArraySearch.locSearch(
                        res,
                        searchParam.params.loc,
                        searchParam.params.params
                    );
                    break;
                case SearchType.Mongo:
                    res = ArraySearch.siftSearch(searchParam.params, res);
                    break;
                case SearchType.Sort:
                    res = Sorter.locSort(res, searchParam.params);
                    break;
            }
        }
        return res;
    }
}
