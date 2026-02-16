import type { GComponent } from "../../../globalComps/GComponent";
import type { IPaginator, IPaginatorComp } from "./interface";

export class FrontendPaginator implements IPaginator {
    private data: any[] = [];
    get_page(nr: number): any[] {
        throw new Error("Method not implemented.");
    }
    get_total_pages(): number {
        throw new Error("Method not implemented.");
    }
    set_data(data: any[]): void {
        this.data = data;
    }
}

export class DirectusPaginator implements IPaginator {
    get_page(nr: number): any[] {
        throw new Error("Method not implemented.");
    }
    get_total_pages(): number {
        throw new Error("Method not implemented.");
    }
}

export class PaginatorCompSimple implements IPaginatorComp {
    on_goto(nr: number): void {
        throw new Error("Method not implemented.");
    }
    get_comp(): GComponent {
        throw new Error("Method not implemented.");
    }
    next(): void {}
    prev(): void {}
}

export class PaginatorCompWithGoto implements IPaginatorComp {
    on_goto(nr: number): void {
        throw new Error("Method not implemented.");
    }
    get_comp(): GComponent {
        throw new Error("Method not implemented.");
    }
    next(): void {}
    prev(): void {}
}
