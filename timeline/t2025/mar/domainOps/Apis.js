import axios from "axios";

export const BASE_URL = "http://localhost:8000";
export const create = async (name, loc, typ = "domains") => {
    return axios.post(`${BASE_URL}/${typ}/create/`, { name, loc });
};

export const readAll = async (loc, typ = "domains") => {
    return axios.post(`${BASE_URL}/${typ}/readAll/`, { loc });
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
export const readProps = async (name, loc, typ = "domains") => {
    return axios.post(`${BASE_URL}/${typ}/readAll/`, {
        name,
        loc,
    });
};
