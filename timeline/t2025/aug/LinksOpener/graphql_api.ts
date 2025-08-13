export let APILoc = "http://127.0.0.1:8000/graphql";

export const makePostRequest = (url: string, data: any) => {
    return fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    }).then((resp) => resp.json());
};

export class GraphApiCalls {
    static async updateCollection(id: string, title: string) {
        const query = `
            mutation UpdateCollection($id: ID!, $name: String!) {
                updateCollection(
                  collectionInput: {
                    id: $id
                    name: $name
                  }
                )
            }
        `;
        const resp = await makePostRequest(APILoc, {
            query,
            variables: {
                id,
                name: title,
            },
        });
        return resp;
    }
    static async readAllCollections() {
        const query = "{ allCollections {id name}}";
        const resp = await makePostRequest(APILoc, {
            query,
        });
        return resp;
    }
    static async createCollection(name: string) {
        // const query = `
        //     mutation addCollection($name: String!) {
        //         updateCollection(
        //           collectionInput: {
        //             id: $id
        //             name: $name
        //           }
        //         )
        //     }
        // `;
        const query = `mutation{addCollection(collectionInput: {name:"${name}"}){id}}`;
        const resp = await makePostRequest(APILoc, {
            query,
        });
        return resp;
    }
    static async deleteCollection(id: any) {
        const query = `mutation{deleteCollection(id:${id})}`;
        const resp = await makePostRequest(APILoc, {
            query,
        });
        return resp;
    }

    static async deleteLink(id: any) {
        const query = `mutation{deleteLink(id:${id})}`;
        const resp = await makePostRequest(APILoc, {
            query,
        });
        return resp;
    }

    static async updateLink(id: any, title: string, url: string) {
        const query = `mutation{deleteLink(id:${id}, title:"${title}", url:"${url}")}`;
        const resp = await makePostRequest(APILoc, {
            query,
        });
        return resp;
    }

    static async createLink(collectionId: any, title: string, url: string) {
        const query = `mutation{addLink(linkInput:{collectionId:${collectionId}, title:"${title}", url:"${url}"}){id, title, url}}`;
        const resp = await makePostRequest(APILoc, {
            query,
        });
        return resp;
    }
}
