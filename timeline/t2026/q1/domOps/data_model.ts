import type { IDatamodel } from "../lister/interface";
import { v4 as uuidv4 } from "uuid";
import type {
    Activity,
    Domain,
    FilterItem,
    IDomOpsModel,
    IDomsOpsFilter,
    IFilterSelector,
    IListerFilter,
    Operation,
    StructureItem,
} from "./interface";
import { LocalStorageDataModel } from "../lister/data_model";
import { LocalStorageJSONModel } from "../../../t2025/april/LocalStorage";

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

export class DevModelItem extends LocalStorageDataModel {
    parent: string = "";
    set_parent(parent: string) {
        this.parent = parent;
    }
    async read_all() {
        if (!this.parent) {
            return this.data.filter(
                (item: any) => item.parent === "" || !item.parent,
            );
        }
        return this.data.filter((item: any) => item.parent === this.parent);
    }
    async create(data: any) {
        let id = uuidv4();
        this.data.push({ ...data, id, parent: this.parent });
        this.write_to_storage();
    }
}

export class LocalStorageAtLoc implements IDatamodel<any> {
    model: LocalStorageJSONModel;
    loc: string[] = [];
    key: string = "";
    constructor(model: LocalStorageJSONModel) {
        this.model = model;
    }
    set_loc(loc: string[]) {
        this.loc = loc;
    }
    async read_all() {
        if (this.model.exists(this.loc)) {
            let vals = this.model.readEntry(this.loc);
            return vals.filter((item: any) => item.parent === this.key);
        }
        return [];
    }
    async read(id: string) {
        if (this.model.exists(this.loc)) {
            let vals = this.model.readEntry(this.loc);
            return vals.find(
                (item: any) => item.id === id && item.parent === this.key,
            );
        }
        return undefined;
    }
    async create(data: { label: string; value: string }) {
        let id = uuidv4();
        let vals = await this.read_all();
        vals.push({ ...data, id, parent: this.key });
        this.update_and_override(vals);
        return { ...data, id };
    }
    async update(id: string | number, data: any) {
        let vals = await this.read_all();
        let item = vals.find((item: any) => item.id === id);
        if (!item) {
            throw new Error(`Item with id ${id} not found`);
        }
        let updatedItem = { ...item, ...data };
        vals = vals.map((item: any) => (item.id === id ? updatedItem : item));
        this.update_and_override(vals);
        return updatedItem;
    }
    async deleteIt(id: string): Promise<void> {
        let vals = await this.read_all();
        vals = vals.filter((item: any) => item.id !== id);
        this.update_and_override(vals);
    }
    update_and_override(vals: any[]) {
        if (this.model.exists(this.loc)) {
            this.model.updateEntry(this.loc, vals);
        } else {
            this.model.addEntry(this.loc, vals);
        }
    }
}

export class LocalStorageSelector implements IFilterSelector {
    model: LocalStorageJSONModel | null = null;
    locs = ["selectors"];
    key = "";
    set_key(key: string) {
        this.key = key;
    }
    set_selected_filter(filter: FilterItem) {
        this.model?.addEntry([...this.locs, this.key], filter);
    }
    get_selected_filter() {
        if (this.model?.exists([...this.locs, this.key])) {
            return this.model?.readEntry([...this.locs, this.key]);
        }
        return null;
    }
}

export class LocalStorageFilterForADomOpAct implements IListerFilter {
    model: LocalStorageAtLoc;
    selector: LocalStorageSelector;
    item_id: string = "";
    id_suffix: string = "";

    constructor(model: LocalStorageJSONModel, suffix: string = "") {
        this.model = new LocalStorageAtLoc(model);
        this.model.loc = ["filters"];
        this.id_suffix = suffix;
        this.selector = new LocalStorageSelector();
        this.selector.model = model;
        this.set_item_id("");
    }

    set_item_id(id: string) {
        this.item_id = id + this.id_suffix;
        this.selector.set_key(this.item_id);
        this.model.key = this.item_id;
    }

    get_selector(): IFilterSelector {
        return this.selector;
    }

    get_model(): IDatamodel<FilterItem> {
        return this.model;
    }
}

export class SimpleLocalStorageDomOpsFilter implements IDomsOpsFilter {
    model: LocalStorageJSONModel;
    activity: LocalStorageFilterForADomOpAct;
    domain: LocalStorageFilterForADomOpAct;
    operation: LocalStorageFilterForADomOpAct;
    constructor(key: string) {
        this.model = new LocalStorageJSONModel(key);
        this.activity = new LocalStorageFilterForADomOpAct(this.model);
        this.domain = new LocalStorageFilterForADomOpAct(this.model, "-dom");
        this.operation = new LocalStorageFilterForADomOpAct(this.model, "-ops");
    }
    get_activity(): IListerFilter {
        return this.activity;
    }
    get_domain(): IListerFilter {
        return this.domain;
    }
    get_operation(): IListerFilter {
        return this.operation;
    }
    set_key(key: string) {
        this.activity.set_item_id(key);
        this.domain.set_item_id(key);
        this.operation.set_item_id(key);
    }
}

export class DevModel implements IDomOpsModel {
    dom: IDatamodel<any>;
    ops: IDatamodel<any>;
    act: IDatamodel<any>;
    structure: IDatamodel<any>;
    logger_data: IDatamodel<any>;
    filter: SimpleLocalStorageDomOpsFilter;
    constructor() {
        this.filter = new SimpleLocalStorageDomOpsFilter("domOps-filter");
        this.act = new DevModelItem("domOps-act");
        this.dom = new DevModelItem("domOps-dom");
        this.ops = new DevModelItem("domOps-ops");
        this.structure = new DevModelItem("domOps-structure");
        this.logger_data = new DevModelItem("domOps-logger-data");
    }
    get_filter_model(): IDomsOpsFilter {
        return this.filter;
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

    set_parent(parent: string) {
        for (const model of [
            this.dom,
            this.ops,
            this.act,
            this.structure,
            this.logger_data,
        ]) {
            (model as DevModelItem).set_parent(parent);
        }
        this.filter.set_key(parent);
    }
}
