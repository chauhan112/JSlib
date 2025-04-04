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
