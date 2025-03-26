export class CITTools {
    static readonly removeKeys = (obj: Record<string, any>, keys: string[]) => {
        let newObj = { ...obj };
        for (const key of keys) {
            if (newObj.hasOwnProperty(key)) {
                delete newObj[key];
            }
        }
        return newObj;
    };
    static updateObject(obj1: Record<string, any>, obj2: Record<string, any>) {
        for (let key in obj2) {
            if (!obj1.hasOwnProperty(key)) {
                obj1[key] = obj2[key];
                continue;
            }
            if (Array.isArray(obj1[key])) {
                if (Array.isArray(obj2[key])) {
                    obj1[key] = obj2[key];
                } else {
                    CITTools.updateObject(obj1[key], obj2[key]);
                }
                continue;
            }

            if (
                typeof obj1[key] === "object" &&
                typeof obj2[key] === "object" &&
                obj1[key] !== null &&
                obj2[key] !== null
            ) {
                CITTools.updateObject(obj1[key], obj2[key]);
            } else {
                obj1[key] = obj2[key];
            }
        }
        return { ...obj1 };
    }
}
