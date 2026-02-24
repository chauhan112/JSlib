import type { GComponent } from "../../../../globalComps/GComponent";
import { Tools } from "../../../../globalComps/tools";
import { RandomDataSampleGenerator } from "../data_model";
import type { IPaginatorModel, ILister, IPaginator } from "../interface";
import { Lister } from "./simple";
import { SimplePager } from "../paginators";

export class SimplePagerModel
    extends RandomDataSampleGenerator
    implements IPaginatorModel
{
    page_size: number = 10;
    constructor() {
        super();
        this.set_fields([{ key: "title", type: "string" }]);
        this.generate();
    }
    set_page_size(size: number): void {
        this.page_size = size;
    }
    async get_total() {
        return this.model.data.length / this.page_size;
    }
    async get_page(nr: number) {
        return this.model.data.slice(
            (nr - 1) * this.page_size,
            nr * this.page_size,
        );
    }
}
export class PaginateLister implements ILister {
    lister: ILister;
    paginator: IPaginator;
    model: IPaginatorModel;
    constructor() {
        let pager = new SimplePager();
        pager.setup();
        this.lister = new Lister();
        this.paginator = pager;
        this.model = new SimplePagerModel();
        this.paginator.on_goto = (nr: number) => this.on_go_to_page(nr);
    }
    set_values(data: any[]): void {
        this.lister.set_values(data);
    }
    get_comp(): GComponent {
        return Tools.comp("div", {
            class: "flex flex-col gap-2 w-full justify-center items-start",
            children: [this.paginator.get_comp(), this.lister.get_comp()],
        });
    }
    async update() {
        let total = await this.model.get_total();
        this.paginator.set_total(total);
        this.on_go_to_page(1);
    }
    on_go_to_page(page: number) {
        this.paginator.set_page_nr(page);
        this.model.get_page(page).then((data) => this.lister.set_values(data));
    }
}
