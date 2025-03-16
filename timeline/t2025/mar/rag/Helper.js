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
            if (obj1.hasOwnProperty(key)) {
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

        // Return a Proxy to handle property access
        return new Proxy(this, {
            get(target, prop) {
                // Check if it's a method of the class
                if (typeof target[prop] === "function") {
                    return target[prop].bind(target);
                }
                // Check #a first
                if (Object.prototype.hasOwnProperty.call(target.#a, prop)) {
                    return target.#a[prop];
                }
                // Then check #b
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
                    target.#a[prop] = value; // Add to #a by default
                }
                return true; // Indicate success
            },
        });
    }
}
