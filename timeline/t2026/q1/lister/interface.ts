import type { GComponent } from "../../../globalComps/GComponent";
import type { ISComponent } from "../../../globalComps/interface";

export interface ILister {
    set_values(data: any[]): void;
    get_comp(): GComponent;
}

export type SearchType =
    | "contains"
    | "equals"
    | "startsWith"
    | "endsWith"
    | "regex";

export type ISearchParam = {
    word: string;
    type: string;
};

export interface ISearch {
    and_search(words: ISearchParam[]): any[];
    or_search(words: ISearchParam[]): any[];
}

export interface ISearchComponent extends ISComponent {
    get_search_values(): ISearchParam[];
    on_search(): void;
}

export interface IPaginator {
    get_page(nr: number): any[];
    get_total_pages(): number;
}

export interface IPaginatorComp extends ISComponent {
    on_goto(nr: number): void;
}

export interface IDatamodel<T> {
    read_all(): Promise<T[]>;
    read(id: string): Promise<T | undefined>;
    create(data: Partial<T>): Promise<T>;
    update(id: string | number, data: Partial<T>): Promise<T>;
    deleteIt(id: string): Promise<void>;
}

export interface INavigator {
    navigate(route: string, params?: any): void;
}

export interface IRouter {
    get_element(path: string, params?: any): GComponent | null;
}

export interface IRouterPath extends IRouter {
    add_path(path: string, comp_func: (params: any) => GComponent): void;
    relative_route(route: string, params?: any): void;
    abs_route(route: string): void;
}

export interface IParamParse {
    get_current_url_params(pattern: string): { [key: string]: string } | null;
}
