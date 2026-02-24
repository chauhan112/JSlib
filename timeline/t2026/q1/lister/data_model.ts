import { LocalStorageJSONModel } from "../../../t2025/april/LocalStorage";
import { DirectusModel } from "../directus/model";
import type { IDatamodel } from "./interface";
import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker"; // bun add -d @faker-js/faker

export class InMemoryDataModel implements IDatamodel<any> {
    data: any[] = [];
    constructor() {
        for (let i = 0; i < 40; i++) {
            this.create({ title: `Test ${i}` });
        }
    }
    async read_all() {
        return this.data;
    }
    async read(id: string) {
        return this.data.find((item: any) => item.id === id);
    }
    async create(data: any) {
        let id = uuidv4();
        let newItem = { ...data, id };
        this.data.push(newItem);
        return;
    }
    async update(id: string, data: any) {
        let item = this.data.find((item: any) => item.id === id);
        if (!item) {
            throw new Error(`Item with id ${id} not found`);
        }
        let updatedItem = { ...item, ...data };
        this.data = this.data.map((item: any) =>
            item.id === id ? updatedItem : item,
        );
        return updatedItem;
    }
    async deleteIt(id: string) {
        this.data = this.data.filter((item: any) => item.id !== id);
    }
}

export class LocalStorageDataModel implements IDatamodel<any> {
    data: any[] = [];
    localStorageKey: string;
    private read_from_storage() {
        const data = localStorage.getItem(this.localStorageKey);
        return data ? JSON.parse(data) : null;
    }
    private write_to_storage() {
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.data));
    }
    constructor(localStorageKey: string) {
        this.localStorageKey = localStorageKey;
        this.data = this.read_from_storage() || [];
    }
    async read_all() {
        return this.data;
    }
    async read(id: string) {
        return this.data.find((item: any) => item.id === id);
    }
    async create(data: any) {
        let id = uuidv4();
        this.data.push({ ...data, id });
        this.write_to_storage();
    }
    async update(id: string | number, data: any) {
        const item = this.data.find((item: any) => item.id === id);
        if (!item) {
            throw new Error(`Item with id ${id} not found`);
        }
        const updatedItem = { ...item, ...data };
        this.data = this.data.map((item: any) =>
            item.id === id ? updatedItem : item,
        );
        this.write_to_storage();
    }
    async deleteIt(id: string) {
        this.data = this.data.filter((item: any) => item.id !== id);
        this.write_to_storage();
    }
}

export interface IDirectusInfoGetter {
    get_url(): string;
    get_token(): string;
}

export class TokenFromLocalStorage implements IDirectusInfoGetter {
    model: LocalStorageJSONModel;
    directus_url_key_loc: string[] = ["global", "directus-url"];
    directus_token_key_loc: string[] = ["global", "directus-token"];
    constructor(storageKey: string) {
        this.model = new LocalStorageJSONModel(storageKey);
    }
    get_url() {
        if (!this.model.exists(this.directus_url_key_loc)) return "";
        const url = this.model.readEntry(this.directus_url_key_loc);
        if (url.endsWith("/")) return url.slice(0, -1);
        return url;
    }
    get_token() {
        if (!this.model.exists(this.directus_token_key_loc)) return "";
        return this.model.readEntry(this.directus_token_key_loc);
    }
}

export class DirectusTableModel implements IDatamodel<any> {
    private table: DirectusModel;
    tokenGetter: IDirectusInfoGetter;
    tableName: string;
    columns: string[] = [];
    constructor(tableName: string, tokenGetter: IDirectusInfoGetter) {
        this.tokenGetter = tokenGetter;
        this.table = new DirectusModel();
        this.table.set_url_and_token(
            this.tokenGetter.get_url(),
            this.tokenGetter.get_token(),
        );
        this.tableName = tableName;
    }
    set_table_name(table_name: string) {
        this.tableName = table_name;
    }
    async read_all() {
        if (!this.table.token) return [];
        const data = await this.table.get_all(this.tableName, this.columns);
        return data.data;
    }
    async read(id: string) {
        if (!this.table.token) throw new Error("No token");
        const data = await this.table.get_by_id(this.tableName, id);
        return data.data;
    }
    async create(data: any) {
        if (!this.table.token) throw new Error("No token");
        const resp = await this.table.create(this.tableName, data);
        return resp.data;
    }
    async update(id: string, data: any) {
        if (!this.table.token) throw new Error("No token");
        const resp = await this.table.update(this.tableName, id, data);
        return resp.data;
    }
    async deleteIt(id: string) {
        if (!this.table.token) throw new Error("No token");
        await this.table.delete(this.tableName, id);
    }
    async read_all_with(keys_vals: { [key: string]: string }) {
        if (!this.table.token) return [];
        this.table.query = `filter=${JSON.stringify(keys_vals)}`;
        const data = await this.table.get_all(this.tableName, this.columns);
        this.table.query = "";
        return data.data;
    }
}

export class DirectorTableWithPagination implements IDatamodel<any> {
    pageNr: number = 1;
    // model: IPaginator;
    read_all(): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
    read(id: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    create(data: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    update(id: string | number, data: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    deleteIt(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    get_page(nr: number): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
    get_total_pages(): number {
        return 1;
    }
}

export type RandomGeneratorType =
    | "string"
    | "number"
    | "boolean"
    | "date"
    | "text"
    | "email"
    | "password"
    | "text"
    | "option";

export type RandomFieldGeneratorType = {
    key: string;
    type: RandomGeneratorType;
    options?: string[];
};

export class RandomDataSampleGenerator implements IDatamodel<any> {
    fields: RandomFieldGeneratorType[] = [];
    total: number = 100;
    model = new InMemoryDataModel();
    set_fields(fields: RandomFieldGeneratorType[]): void {
        this.fields = fields;
    }
    generate() {
        this.model.data = [];
        for (let i = 0; i < this.total; i++) {
            let data: any = {};
            for (let j = 0; j < this.fields.length; j++) {
                data[this.fields[j].key] = this.get_random_value(
                    this.fields[j],
                );
            }
            this.create(data);
        }
    }
    read_all(): Promise<any[]> {
        return this.model.read_all();
    }
    read(id: string): Promise<any> {
        return this.model.read(id);
    }
    create(data: any): Promise<any> {
        return this.model.create(data);
    }
    update(id: string, data: any): Promise<any> {
        return this.model.update(id, data);
    }
    deleteIt(id: string): Promise<void> {
        return this.model.deleteIt(id);
    }
    get_random_value(field: RandomFieldGeneratorType) {
        switch (field.type) {
            case "string":
                return faker.lorem.word();
            case "number":
                return faker.number.int(100); // Updated from datatype.number
            case "boolean":
                return faker.datatype.boolean();
            case "date":
                return faker.date.recent();
            case "text":
                return faker.lorem.text();
            case "email":
                return faker.internet.email();
            case "password":
                return faker.internet.password();
            case "text":
                return faker.lorem.text();
            case "option":
                return this.getRandomValue(field.options || []);
            default:
                return null;
        }
    }
    private getRandomValue(array: any[]): any | undefined {
        if (array.length === 0) {
            return undefined;
        }
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }
}
