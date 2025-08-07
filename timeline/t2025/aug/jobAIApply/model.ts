const makePostRequest = (url: string, data: any) => {
    return fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    }).then((resp) => resp.json());
};

export type ModelType = {
    addJob: (title: string, description: string, url: string) => Promise<any>;
    readAllJobs: () => Promise<any>;
    deleteJob: (id: string) => Promise<any>;
    updateJob: (id: string, newData: any) => Promise<any>;
    setUrl: (url: string) => Promise<any>;
    readJob: (id: string) => Promise<any>;
};

export const Model = () => {
    const state: any = {
        url: "http://127.0.0.1:8000/run/",
    };
    const setUrl = (url: string) => {
        state.url = url;
    };

    const readJob = (id: string) => {
        return makePostRequest(state.url, {
            name: "readAsDic",
            params: ["Job", id],
        });
    };

    const addJob = (title: string, description: string, url: string = "") => {
        return makePostRequest(state.url, {
            name: "addData",
            params: ["Job", { title, description, link: url }],
        });
    };

    const readAllJobs = () => {
        return makePostRequest(state.url, {
            name: "readAll",
            params: ["Job"],
        });
    };

    const deleteJob = (id: string) => {
        return makePostRequest(state.url, {
            name: "deleteDataWithId",
            params: ["Job", id],
        });
    };

    const updateJob = (id: string, newData: any) => {
        if (!newData) return;
        return makePostRequest(state.url, {
            name: "updateData",
            params: ["Job", id, { ...newData }],
        });
    };

    return { addJob, readAllJobs, setUrl, deleteJob, updateJob };
};
