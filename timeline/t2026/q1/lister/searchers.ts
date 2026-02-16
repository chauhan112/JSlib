import type { GComponent } from "../../../globalComps/GComponent";
import type { ISearch, ISearchComponent, ISearchParam } from "./interface";

export class SimpleTextContainSearch implements ISearch {
    and_search(words: ISearchParam[]): any[] {
        return words;
    }
    or_search(words: ISearchParam[]): any[] {
        return words;
    }
}

export class DatabaseSearcher implements ISearch {
    and_search(words: ISearchParam[]): any[] {
        return words;
    }
    or_search(words: ISearchParam[]): any[] {
        return words;
    }
}

export class AdvanceTextParseSearch implements ISearch {
    and_search(words: ISearchParam[]): any[] {
        return words;
    }
    or_search(words: ISearchParam[]): any[] {
        return words;
    }
}

export class TextSearchComp implements ISearchComponent {
    get_search_values(): ISearchParam[] {
        throw new Error("Method not implemented.");
    }
    on_search(): void {
        throw new Error("Method not implemented.");
    }
    get_comp(): GComponent {
        throw new Error("Method not implemented.");
    }
}

export class ConcatSearchComp implements ISearchComponent {
    get_search_values(): ISearchParam[] {
        throw new Error("Method not implemented.");
    }
    on_search(): void {
        throw new Error("Method not implemented.");
    }
    get_comp(): GComponent {
        throw new Error("Method not implemented.");
    }
}
