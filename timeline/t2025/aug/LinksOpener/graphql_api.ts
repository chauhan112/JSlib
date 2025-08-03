let APILoc = "https://localhost:8000/graphql";

class GraphApiCalls {
    static async updateCollection(id: string, title: string) {
        const query = `mutation{updateCollection(collectionInput: {id:"${id}",name:"${title}"})}`;
        const resp = await fetch(APILoc, {
            body: query,
        });
        return resp.json();
    }
    static async readAllCollections() {
        const resp = await fetch(APILoc, {
            body: `query{allCollections{id name}}`,
        });
        return resp.json();
    }
    static async createCollectio(name: string) {
        const query = `mutation{addCollection(collectionInput: {name:"${name}"}){id}}`;
        const resp = await fetch(APILoc, {
            body: query,
        });
        return resp.json();
    }
    static async deleteCollection(id: any) {
        const query = `mutation{deleteCollection(id:${id})}`;
        const resp = await fetch(APILoc, {
            body: query,
        });
        return resp.json();
    }

    static async deleteLink(id: any) {
        const query = `mutation{deleteLink(id:${id})}`;
        const resp = await fetch(APILoc, {
            body: query,
        });
        return resp.json();
    }

    static async updateLink(id: any, title: string, url: string) {
        const query = `mutation{deleteLink(id:${id}, title:"${title}", url:"${url}")}`;
        const resp = await fetch(APILoc, {
            body: query,
        });
        return resp.json();
    }

    static async createLink(collectionId: any, title: string, url: string) {
        const query = `mutation{addLink(linkInput:{collectionId:${collectionId}, title:"${title}", url:"${url}"}){id, title, url}}`;
        const resp = await fetch(APILoc, {
            body: query,
        });
        return resp.json();
    }
}
