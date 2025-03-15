class CITTools {
    // Static method to add numbers
    static add(a, b) {
        return a + b;
    }

    // Static method to calculate circle area
    static calculateCircleArea(radius) {
        // Note: We can't access 'this.pi' here because static methods
        // don't have access to instance properties
        const PI = 3.14159;
        return PI * radius * radius;
    }

    // Static method to compare two numbers
    static max(num1, num2) {
        return num1 > num2 ? num1 : num2;
    }

    // Regular instance method
    getPi() {
        return this.pi;
    }
}

class CustomContainer {
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
