import axios from "axios";

export const backendCall = (url: string, payload: any, api_key: string) => {
    return axios.post(url, payload, {
        headers: {
            "Content-Type": "application/json",
            "X-API-Key": api_key,
        },
    });
};

export const add_url = (main_url: string, sub_url: string) => {
    let url = main_url.trim();
    if (!url.endsWith("/")) {
        url += "/";
    }
    return url + sub_url;
};
