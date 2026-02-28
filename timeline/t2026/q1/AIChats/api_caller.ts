export class GLMCaller {
    private api_key: string;
    private model: string;
    constructor(model = "glm-4.7") {
        this.api_key = "";
        this.model = model;
    }
    set_api_key(api_key: string) {
        this.api_key = api_key;
    }
    async get_response(prev_messages: string) {
        if (!this.api_key) throw new Error("No API key");
        const url = "https://api.z.ai/v1/chat/completions";

        const messages = [
            {
                role: "user",
                content: prev_messages,
            },
        ];
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.api_key}`,
            },
            body: JSON.stringify({
                model: this.model,
                messages: messages,
            }),
        });
        const data = await response.json();
        return data.choices[0].message.content;
    }
}

export class DevCaller {
    private api_key: string;
    private model: string;
    constructor(model = "glm-4.7") {
        this.api_key = "";
        this.model = model;
    }
    set_api_key(api_key: string) {
        this.api_key = api_key;
    }
    async get_response(prev_messages: string) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 sec

        return "Hello! How can we help you today?";
    }
}
