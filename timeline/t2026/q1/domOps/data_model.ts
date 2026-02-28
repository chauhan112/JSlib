import type { IDatamodel } from "../lister/interface";
import { v4 as uuidv4 } from "uuid";
import type {
    Activity,
    Domain,
    FilterItem,
    IDomOpsModel,
    Operation,
    StructureItem,
} from "./interface";
import {
    LocalStorageDataModel,
    RandomDataSampleGenerator,
} from "../lister/data_model";

export class InMemoryDataMode<T> implements IDatamodel<T> {
    data: T[] = [];
    async read_all() {
        return this.data;
    }
    async read(id: string) {
        return this.data.find((item: any) => item.id === id);
    }
    async create(data: T) {
        let id = uuidv4();
        let newItem = { ...data, id };
        this.data.push(newItem);
        return newItem;
    }
    async update(id: string, data: Partial<T>) {
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

export class DomOpsModelRandom implements IDomOpsModel {
    dom: IDatamodel<any> = new InMemoryDataMode<Domain>();
    ops: IDatamodel<any> = new InMemoryDataMode<Operation>();
    act: IDatamodel<any>;
    structure: RandomDataSampleGenerator = new RandomDataSampleGenerator();
    logger_data: RandomDataSampleGenerator = new RandomDataSampleGenerator();
    filter: IDatamodel<any>;
    constructor() {
        let act = new RandomDataSampleGenerator();
        let filter = new RandomDataSampleGenerator();
        this.structure.set_fields([
            { key: "key", type: "string" },
            { key: "value", type: "string" },
            { key: "order", type: "number" },
            {
                key: "type",
                type: "option",
                options: ["string", "number", "date", "boolean", "text"],
            },
        ]);
        this.logger_data.set_fields([
            { key: "first name", type: "string" },
            { key: "last name", type: "string" },
            { key: "age", type: "number" },
            { key: "email", type: "email" },
            { key: "password", type: "password" },
            { key: "is male", type: "boolean" },
        ]);
        act.set_fields([{ key: "name", type: "string" }]);
        filter.set_fields([
            { key: "key", type: "string" },
            { key: "value", type: "string" },
            { key: "parent", type: "string" },
        ]);
        this.structure.generate();
        this.logger_data.generate();

        act.set_fields([{ key: "name", type: "string" }]);
        filter.set_fields([
            { key: "key", type: "string" },
            { key: "value", type: "string" },
            { key: "parent", type: "string" },
        ]);
        filter.generate();
        act.generate();

        this.act = act;
        this.filter = filter;
    }
    get_domain_model(): IDatamodel<Domain> {
        return this.dom as IDatamodel<Domain>;
    }
    get_operation_model(): IDatamodel<Operation> {
        return this.ops as IDatamodel<Operation>;
    }
    get_activity_model(): IDatamodel<Activity> {
        return this.act as IDatamodel<Activity>;
    }
    get_structure_model(): IDatamodel<StructureItem> {
        return this.structure as IDatamodel<StructureItem>;
    }
    get_logger_data_model(): IDatamodel<any> {
        return this.logger_data as IDatamodel<any>;
    }
    get_filter_model(): IDatamodel<FilterItem> {
        return this.filter as IDatamodel<FilterItem>;
    }
}

export class DevModel extends DomOpsModelRandom {
    loc: any[] = [];
    constructor() {
        super();
        this.filter = new LocalStorageDataModel("domOps-filter");
        this.act = new LocalStorageDataModel("domOps-act");
        this.dom = new LocalStorageDataModel("domOps-dom");
        this.ops = new LocalStorageDataModel("domOps-ops");
        this.act.read_all = () => this.read_all_act();
        this.dom.read_all = () => this.read_all_dom();
        this.ops.read_all = () => this.read_all_ops();
        this.act.create = (data: any) => this.create_act(data);
        this.dom.create = (data: any) => this.create_dom(data);
        this.ops.create = (data: any) => this.create_ops(data);
    }
    private async read_all(model: LocalStorageDataModel) {
        return model.data.filter((item) => {
            if (this.loc.length === 0) {
                if (!item.parent) return true;
            } else {
                let last = this.loc[this.loc.length - 1];
                if (item.parent === last.id) {
                    return true;
                }
            }
            return false;
        });
    }

    private async create(model: LocalStorageDataModel, data: any) {
        let id = uuidv4();
        let parent = {};
        if (this.loc.length > 0) {
            parent = { parent: this.loc[this.loc.length - 1].id };
        }
        model.data.push({ ...data, id, ...parent });
        model.write_to_storage();
    }

    create_act(data: any) {
        return this.create(this.act as LocalStorageDataModel, data);
    }
    create_dom(data: any) {
        return this.create(this.dom as LocalStorageDataModel, data);
    }
    create_ops(data: any) {
        return this.create(this.ops as LocalStorageDataModel, data);
    }
    read_all_act() {
        return this.read_all(this.act as LocalStorageDataModel);
    }
    read_all_dom() {
        return this.read_all(this.dom as LocalStorageDataModel);
    }
    read_all_ops() {
        return this.read_all(this.ops as LocalStorageDataModel);
    }
}

export class DomOpsModelInMemory implements IDomOpsModel {
    get_domain_model(): IDatamodel<Domain> {
        return new InMemoryDataMode<Domain>();
    }
    get_operation_model(): IDatamodel<Operation> {
        return new InMemoryDataMode<Operation>();
    }
    get_activity_model(): IDatamodel<Activity> {
        return new InMemoryDataMode<Activity>();
    }
    get_structure_model(): IDatamodel<StructureItem> {
        return new InMemoryDataMode<StructureItem>();
    }
    get_logger_data_model(): IDatamodel<any> {
        return new InMemoryDataMode<any>();
    }
    get_filter_model(): IDatamodel<FilterItem> {
        throw new Error("Method not implemented.");
    }
}

export class DomOpsModelDirectus implements IDomOpsModel {
    get_domain_model(): IDatamodel<Domain> {
        throw new Error("Method not implemented.");
    }
    get_operation_model(): IDatamodel<Operation> {
        throw new Error("Method not implemented.");
    }
    get_activity_model(): IDatamodel<Activity> {
        throw new Error("Method not implemented.");
    }
    get_structure_model(): IDatamodel<StructureItem> {
        throw new Error("Method not implemented.");
    }
    get_logger_data_model(): IDatamodel<any> {
        throw new Error("Method not implemented.");
    }
    get_filter_model(): IDatamodel<FilterItem> {
        throw new Error("Method not implemented.");
    }
}
