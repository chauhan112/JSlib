import axios from "axios";

export const BASE_URL = "http://localhost:8000";
export const create = async (name, loc, typ = "domains") => {
    return axios.post(`${BASE_URL}/${typ}/create/`, { name, loc });
};
export const createLogger = async (name, loc, domains, operation) => {
    return axios.post(`${BASE_URL}/logger/create/`, {
        name,
        loc,
        domains,
        operation,
    });
};

export const readAll = async (loc, typ = "domains") => {
    return axios.post(`${BASE_URL}/${typ}/readAll/`, { loc });
};

export const read = async (name, loc, typ = "domains") => {
    return axios.post(`${BASE_URL}/${typ}/read/`, { name, loc });
};

export const deleteItem = async (name, loc, typ = "domains") => {
    return axios.post(`${BASE_URL}/${typ}/delete/`, { name, loc });
};

export const updateName = async (name, loc, newName, typ = "domains") => {
    return axios.post(`${BASE_URL}/${typ}/update_name/`, {
        name,
        loc,
        value: newName,
    });
};

export const updateLogger = async (name, loc, vals) => {
    return axios.post(`${BASE_URL}/loggers/update/`, {
        name,
        loc,
        ...vals,
    });
};

export const readProps = async (name, loc, typ = "domains") => {
    return axios.post(`${BASE_URL}/${typ}/readAll/`, {
        name,
        loc,
    });
};
