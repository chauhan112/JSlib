import type { GComponent } from "../../../../../globalComps/GComponent";
import type { ListItem } from "../crud_list/interface";
import type {
    ISearchHandler,
    IDatamodel,
    IResultDisplayer,
    IFilter,
    IFilterModel,
    FilterType,
    ActiveComponents,
    ISearchInput,
} from "./interface";
import { Tools } from "../../../../../globalComps/tools";

export class GenericFilterModel implements IFilterModel {
    values: FilterType[] = [];
    constructor() {
        this.values = [
            { name: "name", value: "name" },
            { name: "description", value: "description" },
            { name: "status", value: "status" },
            { name: "createdOn", value: "createdOn" },
            { name: "modifiedOn", value: "modifiedOn" },
        ];
    }
    read_all(): FilterType[] {
        return this.values;
    }
    read(name: string): FilterType {
        return this.values.find((value: FilterType) => value.name === name)!;
    }
    create(name: string, value: any): void {
        this.values.push({ name, value });
    }
    update(name: string, new_value: any): void {
        this.values = this.values.map((value: FilterType) =>
            value.name === name ? { name, value: new_value } : value,
        );
    }
    delete(name: string): void {
        this.values = this.values.filter(
            (value: FilterType) => value.name !== name,
        );
    }
}

export class GenericFilter implements IFilter {
    comp: GComponent;
    model: IFilterModel;
    store_locally: boolean = false;
    constructor() {
        this.model = new GenericFilterModel();
        this.comp = Tools.div({
            class: "flex flex-col gap-2",
            textContent: "Filter",
        });
    }
    get_comp(): GComponent {
        return this.comp;
    }
    storeLocally(value: boolean): void {
        this.store_locally = value;
    }
}

export class ResultDisplayer implements IResultDisplayer {
    display_data(data: ListItem[]) {
        console.log("displaying data", data);
    }
}

export class DataModel implements IDatamodel {
    async get_data() {
        return [];
    }
}

export class SearchHandler implements ISearchHandler {
    data: ListItem[] = [];
    set_data(data: ListItem[]) {
        this.data = data;
    }
    async on_search(words: any[]) {
        console.log("parameters of search", words);
        return this.data;
    }
    parse_chip_value(value: string) {
        let query: any = {};
        if (value.includes(":")) {
            const [key, val] = value.split(":");

            if (val.startsWith(">")) {
                query[key] = { $gt: Number(val.substring(1)) };
            } else if (val.startsWith("<")) {
                query[key] = { $lt: Number(val.substring(1)) };
            } else {
                query[key] = val;
            }
        } else {
            if (!query.$or) query.$or = [];
            query.$or.push({ description: { $regex: value, $options: "i" } });
        }
        return query;
    }
}

export class SearchInput implements ISearchInput{
    active_comp: ActiveComponents = {
        search: true,
        filter: true,
        create: true,
    };
    data: IDatamodel = new DataModel();
    resultDisplayer: IResultDisplayer = new ResultDisplayer();
    handler: ISearchHandler = new SearchHandler();
    filter: IFilter = new GenericFilter();
    constructor() {
        this.filter.model = new GenericFilterModel();
    }
}