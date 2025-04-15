import axios from "axios";

// export const BASE_URL =
//     "https://lordrajababu.pythonanywhere.com/domains-operations-activities-logger";
export const BASE_URL =
    "http://localhost:5000/domains-operations-activities-logger";
export const create = async (
    name: string,
    loc: string[],
    typ: string = "domains"
) => {
    let newTimeId = "" + new Date().getTime();

    let exists = await axios.post(`${BASE_URL}/existsInField`, {
        field: "name",
        val: name,
        loc: [...loc, typ],
    });

    if (exists.data.exists) {
        throw new Error("Name already exists in the field");
    }

    return axios.post(`${BASE_URL}/create`, {
        loc: [...loc, typ, newTimeId],
        val: {
            name,
            id: newTimeId,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            properties: {},
            "sub-section": {},
        },
    });
};

export const createActivity = async (
    name: string,
    loc: string[],
    domains: string[],
    operation: string
) => {
    let newTimeId = "" + new Date().getTime();
    let typ = "activities";
    let exists = await axios.post(`${BASE_URL}/existsInField`, {
        field: "name",
        val: name,
        loc: [...loc, typ],
    });

    if (exists.data.exists) {
        throw new Error("Name already exists in the field");
    }

    return axios.post(`${BASE_URL}/create`, {
        loc: [...loc, typ, newTimeId],
        val: {
            name,
            id: newTimeId,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            properties: {},
            domains,
            operation,
            "sub-section": {},
        },
    });
};

export const readAll = async (loc: string[], typ: string = "domains") => {
    let eleExists = await exists([...loc, typ]);
    if (!eleExists) {
        return { data: {} };
    }
    let res = await axios.post(`${BASE_URL}/mapp`, {
        loc: [...loc, typ],
        fields: ["name"],
    });
    return res;
};

export const read = async (
    name: string,
    loc: string[],
    typ: string = "domains"
) => {
    return axios.post(`${BASE_URL}/read`, { loc: [...loc, typ, name] });
};

export const deleteItem = async (
    name: string,
    loc: string[],
    typ: string = "domains"
) => {
    return await axios.post(`${BASE_URL}/delete`, { loc: [...loc, typ, name] });
};

export const updateName = async (
    name: string,
    loc: string[],
    newName: string,
    typ: string = "domains"
) => {
    return await axios.post(`${BASE_URL}/update`, {
        loc: [...loc, typ, name, "name"],
        val: newName,
    });
};

export const update = async (
    name: string,
    loc: string[],
    vals: any = {},
    typ: string = "domains"
) => {
    let bkOps = [];
    for (let key in vals) {
        bkOps.push([[...loc, typ, name, key], vals[key]]);
    }
    return await axios.post(`${BASE_URL}/bulkUpdate`, {
        data: bkOps,
    });
};

export const readProps = async (
    name: string,
    loc: string[],
    typ: string = "domains"
) => {
    return await axios.post(`${BASE_URL}/read`, {
        loc: [...loc, typ, name, "properties"],
    });
};

export const createProperty = async (
    name: string,
    loc: string[],
    key: string,
    value: string,
    typ: string = "domains"
) => {
    return await axios.post(`${BASE_URL}/create`, {
        loc: [...loc, typ, name, "properties", key],
        val: value,
    });
};

export const deleteProperty = async (
    name: string,
    loc: string[],
    key: string,
    typ: string = "domains"
) => {
    return await axios.post(`${BASE_URL}/delete`, {
        loc: [...loc, typ, name, "properties", key],
    });
};

export const updateProperty = async (
    name: string,
    loc: string[],
    key: string,
    value: string,
    typ: string = "domains"
) => {
    return await axios.post(`${BASE_URL}/update`, {
        loc: [...loc, typ, name, "properties", key],
        val: value,
    });
};

export const updateActivity = async (
    name: string,
    loc: string[],
    vals: any = {}
) => {
    return update(name, loc, vals, "activities");
};

export const exists = async (loc: string[]) => {
    let res = await axios.post(`${BASE_URL}/exists`, {
        loc,
    });
    return res.data.exists;
};

export class CRUD {
    static read(loc: string[]) {
        return axios.post(`${BASE_URL}/read`, { loc });
    }
    static update(loc: string[], vals: any) {
        return axios.post(`${BASE_URL}/update`, { loc, val: vals });
    }
    static create(loc: string[], vals: any) {
        return axios.post(`${BASE_URL}/create`, { loc, val: vals });
    }
    static delete(loc: string[]) {
        return axios.post(`${BASE_URL}/delete`, { loc });
    }
    static async exists(loc: string[]) {
        let res = await axios.post(`${BASE_URL}/exists`, {
            loc,
        });
        return res.data.exists;
    }
}

export class LoggerData {
    static read(loc: string[], structured: boolean = false) {
        if (structured) return CRUD.read([...loc, "logs", "sdata"]);
        return CRUD.read([...loc, "logs", "udata"]);
    }
    static update(
        loc: string[],
        key: string,
        vals: any,
        structured: boolean = false
    ) {
        if (structured)
            return CRUD.update([...loc, "logs", "sdata", key], vals);
        return CRUD.update([...loc, "logs", "udata"], vals);
    }
    static create(loc: string[], vals: any, structured: boolean = false) {
        if (structured) return CRUD.create([...loc, "logs", "sdata"], vals);
        return CRUD.create([...loc, "logs", "udata"], vals);
    }
    static delete(loc: string[], key: string, structured: boolean = false) {
        if (structured) return CRUD.delete([...loc, "logs", "sdata", key]);
        return CRUD.delete([...loc, "logs", "udata"]);
    }
}

export class LoggerDataStructures {
    static read(loc: string[]) {
        return CRUD.read([...loc, "logs", "structures"]);
    }
    static update(loc: string[], key: string, vals: any) {
        return CRUD.update([...loc, "logs", "structures", key], vals);
    }
    static create(loc: string[], vals: any) {
        return CRUD.create([...loc, "logs", "structures"], vals);
    }
    static delete(loc: string[], key: string) {
        return CRUD.delete([...loc, "logs", "structures", key]);
    }
}
