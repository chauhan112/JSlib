import type { GComponent } from "../../../../globalComps/GComponent";
import { EnumCtrl, EnumeratedLister } from "../../lister/listers";
import type { ISComponent } from "../../../../globalComps/interface";
import { SearchComponent } from "../../view_crud_list/searchComp";
import type { IInputCompCtrl } from "../../../../t2025/dec/DomainOpsFrontend/components/atomic";
import { Tools } from "../../../../globalComps/tools";
import { DefaultSearcher } from "../../domOps/pages/search_comp";
import type { ILister } from "../../lister/interface";

export interface ISearchParser {
    parse(value: string): any;
    unparse(value: any): string;
}

export class SimpleParser implements ISearchParser {
    parse(value: string): any {
        if (value.includes(":")) {
            const [key, val] = value.split(":");
            return { [key]: val };
        }
        return value;
    }
    unparse(value: any): string {
        if (typeof value === "string") return value;
        let value_str = "";
        for (let key in value) {
            value_str += `${key}:${value[key]}`;
        }
        return value_str;
    }
}

export class SearcherInputCtrl implements IInputCompCtrl, ISComponent {
    comp: any;
    parser: ISearchParser = new SimpleParser();
    ctrl = new SearchComponent();
    constructor() {
        this.ctrl.parse_chip_value = (value: string) =>
            this.parser.parse(value);
        this.ctrl.set_values = (values: string[]) => this.set_value(values);
        this.ctrl.setup();
        this.comp = this.ctrl.get_comp();
        this.ctrl.on_search = async (words) => this.on_search(words);
    }
    get_value() {
        return this.ctrl.get_values();
    }
    set_value(value: any[]): void {
        for (let val of value) {
            if (val.trim() === "") continue;
            let pval = this.parser.unparse(val);
            let chip = this.ctrl.get_chip(pval);
            this.comp.s.chips.update({ child: chip });
            this.ctrl.inp_comp_ctrl.clear_value();
            this.ctrl.chipsValue.push(pval);
        }
    }
    clear_value(): void {
        this.ctrl.clear();
    }
    get_comp(): GComponent {
        return this.comp;
    }
    on_search(words: any[]): void {}
}

export class ListerSearcher implements ILister {
    title_getter = (data: any) => data?.title || "";
    search_comp_ctrl = new SearcherInputCtrl();
    lister = new EnumeratedLister<any>();
    comp: GComponent;
    searcher: DefaultSearcher = new DefaultSearcher();
    private values: any[] = [];
    constructor() {
        this.comp = Tools.comp("div", {
            class: "flex flex-col gap-2 w-full",
            children: [
                this.search_comp_ctrl.get_comp(),
                this.lister.get_comp(),
            ],
        });
        this.lister.cardCompCreator = (data: any, idx: number) =>
            this.cardCompCreator(data, idx);
        this.search_comp_ctrl.on_search = (words) => this.on_search(words);
    }

    async on_search(words: any[]) {
        let data = this.values;
        let res = await this.searcher.search(words, data);
        this.lister.set_values(res);
    }
    set_values(data: any[]): void {
        this.values = [...data];
        this.lister.set_values(data);
    }

    cardCompCreator(data: any, idx: number): ISComponent {
        const cardCompCtrl = new EnumCtrl(idx + 1, data, []);
        return cardCompCtrl;
    }
    get_comp(): GComponent {
        return this.comp;
    }
}
