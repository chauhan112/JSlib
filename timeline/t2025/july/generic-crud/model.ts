import { LocalStorageJSONModel } from "../../april/LocalStorage";
export class GenericCRUDModel {
    model: LocalStorageJSONModel | null = null;
    constructor(data_model_name: string = "GenericCRUDModel") {
        this.model = new LocalStorageJSONModel(data_model_name);
    }
    async create(loc: string[], vals: any) {}
    async read(loc: string[], id: string) {}
    async update(loc: string[], id: string, vals: any) {}
    async delete(loc: string[], id: string) {}
    async exists(loc: string[], id: string) {}
    async readAll(loc: string[]) {}
}
