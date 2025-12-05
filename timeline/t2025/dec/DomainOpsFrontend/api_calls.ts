import axios from "axios";
// npm install axios
import { LocalStorageJSONModel } from "../../april/LocalStorage";

const model = new LocalStorageJSONModel("domain-ops-logger");
if (!model.exists(["base_url"])) {
    model.addEntry(["base_url"], "http://127.0.0.1:8000/api/allOps/");
}
const BASE_URL = import.meta.env.VITE_BASE_URL || model.readEntry(["base_url"]);
if (!model.exists(["api_key"])) {
    model.addEntry(["api_key"], "xx");
}
const API_KEY = import.meta.env.VITE_API_KEY || model.readEntry(["api_key"]);

export const backendCall = (op: string, payload: any, op_name: string) => {
    
    return axios.post(
        BASE_URL,
        {
            op: op,
            payload: payload,
            op_name: op_name,
        },
        {
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": API_KEY,
            },
        }
    );
};
