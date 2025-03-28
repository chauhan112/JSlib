export class CITTools {
    static removeKeys = (obj, keys) => {
        let newObj = { ...obj };
        for (const key of keys) {
            if (newObj.hasOwnProperty(key)) {
                delete newObj[key];
            }
        }
        return newObj;
    };
    static updateObject(obj1, obj2) {
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

export class CustomContainer {
    #a;
    #b;

    constructor(objA, objB) {
        this.#a = objA || {};
        this.#b = objB || {};

        return new Proxy(this, {
            get(target, prop) {
                if (typeof target[prop] === "function") {
                    return target[prop].bind(target);
                }

                if (Object.prototype.hasOwnProperty.call(target.#a, prop)) {
                    return target.#a[prop];
                }

                if (Object.prototype.hasOwnProperty.call(target.#b, prop)) {
                    return target.#b[prop];
                }
                return undefined;
            },
            set(target, prop, value) {
                if (Object.prototype.hasOwnProperty.call(target.#a, prop)) {
                    target.#a[prop] = value;
                } else if (
                    Object.prototype.hasOwnProperty.call(target.#b, prop)
                ) {
                    target.#b[prop] = value;
                } else {
                    target.#a[prop] = value;
                }
                return true;
            },
        });
    }
}
// Array.isArray;
