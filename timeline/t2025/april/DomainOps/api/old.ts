import axios from "axios";

export const BASE_URL = "http://localhost:8000";
export const create = async (
    name: string,
    loc: string[],
    typ: string = "domains"
) => {
    return axios.post(`${BASE_URL}/${typ}/create/`, { name, loc });
};

export const createLogger = async (
    name: string,
    loc: string[],
    domains: string[],
    operation: string
) => {
    return axios.post(`${BASE_URL}/logger/create/`, {
        name,
        loc,
        domains,
        operation,
    });
};

export const readAll = async (loc: string[], typ: string = "domains") => {
    return axios.post(`${BASE_URL}/read`, { loc: [...loc, typ] });
};

export const read = async (
    name: string,
    loc: string[],
    typ: string = "domains"
) => {
    return axios.post(`${BASE_URL}/${typ}/read/`, { name, loc });
};

export const deleteItem = async (
    name: string,
    loc: string[],
    typ: string = "domains"
) => {
    return axios.post(`${BASE_URL}/${typ}/delete/`, { name, loc });
};

export const updateName = async (
    name: string,
    loc: string[],
    newName: string,
    typ: string = "domains"
) => {
    return axios.post(`${BASE_URL}/${typ}/update_name/`, {
        name,
        loc,
        value: newName,
    });
};

export const updateLogger = async (
    name: string,
    loc: string[],
    vals: any = {}
) => {
    return axios.post(`${BASE_URL}/logger/update/`, {
        name,
        loc,
        ...vals,
    });
};

export const readProps = async (
    name: string,
    loc: string[],
    typ: string = "domains"
) => {
    return axios.post(`${BASE_URL}/${typ}/properties/readAll/`, {
        name,
        loc,
    });
};

export const createProperty = async (
    name: string,
    loc: string[],
    key: string,
    value: string,
    typ: string = "domains"
) => {
    console.log(name, loc, key, value, typ);
    return axios.post(`${BASE_URL}/${typ}/properties/create/`, {
        name,
        loc,
        key,
        value,
    });
};

export const deleteProperty = async (
    name: string,
    loc: string[],
    key: string,
    typ: string = "domains"
) => {
    return axios.post(`${BASE_URL}/${typ}/properties/delete/`, {
        name,
        loc,
        key,
    });
};

export const updateProperty = async (
    name: string,
    loc: string[],
    key: string,
    value: string,
    typ: string = "domains"
) => {
    return axios.post(`${BASE_URL}/${typ}/properties/update/`, {
        name,
        loc,
        key,
        value,
    });
};
