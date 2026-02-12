export class DirectusModel {
    base_url: string = "https://db.rajababu.space";
    token: string = "";

    set_url_and_token(url: string, token: string): void {
        this.base_url = url;
        this.token = token;
    }

    async get_count(collection: string) {
        const url = `${this.base_url}/items/${collection}?aggregate[count]=*`;
        console.log(url, this.headers);
        const response = await fetch(url, {
            headers: this.headers,
        });
        return response.json();
    }

    private get headers() {
        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
        };
    }

    async get_all(
        collection: string,
        fields: string[] = [],
        page: number = 1,
        page_size: number = 1000,
    ): Promise<any> {
        // Directus uses 'limit' for page size
        let url = `${this.base_url}/items/${collection}?page=${page}&limit=${page_size}`;

        if (fields.length > 0) {
            url += `&fields=${fields.join(",")}`;
        }

        const response = await fetch(url, {
            headers: this.headers,
        });
        return response.json();
    }

    async get_by_id(collection: string, id: string): Promise<any> {
        const url = `${this.base_url}/items/${collection}/${id}`;
        const response = await fetch(url, {
            headers: this.headers,
        });
        return response.json();
    }

    async create(collection: string, data: any): Promise<any> {
        const url = `${this.base_url}/items/${collection}`;
        const response = await fetch(url, {
            headers: this.headers,
            method: "POST",
            body: JSON.stringify(data),
        });
        return response.json();
    }

    async update(collection: string, id: string, data: any): Promise<any> {
        const url = `${this.base_url}/items/${collection}/${id}`;
        const response = await fetch(url, {
            headers: this.headers,
            method: "PATCH", // Directus uses PATCH for updates
            body: JSON.stringify(data),
        });
        return response.json();
    }

    async delete(collection: string, id: string): Promise<any> {
        const url = `${this.base_url}/items/${collection}/${id}`;
        const response = await fetch(url, {
            headers: this.headers,
            method: "DELETE",
        });

        if (response.status === 204) return null;
        return response.json().catch(() => null);
    }

    async search(
        collection: string,
        query: string,
        fields: string[] = [],
    ): Promise<any> {
        let url = `${this.base_url}/items/${collection}?search=${encodeURIComponent(query)}`;
        if (fields.length > 0) {
            url += `&fields=${fields.join(",")}`;
        }
        const response = await fetch(url, {
            headers: this.headers,
            method: "GET",
        });
        return response.json();
    }

    async get_column_names(collection: string): Promise<any> {
        const url = `${this.base_url}/fields/${collection}`;
        const response = await fetch(url, {
            headers: this.headers,
            method: "GET",
        });
        return response.json();
    }
}
