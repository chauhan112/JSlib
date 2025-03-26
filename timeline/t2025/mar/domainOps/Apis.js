import axios from "axios";

export const BASE_URL = "http://localhost:8000";
export const createDomain = async (name, loc) => {
    return axios.post(`${BASE_URL}/domains/create/`, { name, loc });
};

export const getDomains = async (loc) => {
    return axios.post(`${BASE_URL}/domains/readAll/`, { loc });
};

export const deleteDomain = async (name, loc) => {
    return axios.post(`${BASE_URL}/domains/delete/`, { name, loc });
};

export const updateDomainName = async (name, loc, newName) => {
    return axios.post(`${BASE_URL}/domains/update_name/`, {
        name,
        loc,
        value: newName,
    });
};
export const readProps = async (name, loc) => {
    return axios.post(`${BASE_URL}/domains/readAll/`, {
        name,
        loc,
    });
};
