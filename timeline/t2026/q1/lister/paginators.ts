import type { GComponent } from "../../../globalComps/GComponent";
import { Pagination } from "../../../t2025/july/generic-crud/page";
import type { IPaginator } from "./interface";

export class SimplePager implements IPaginator {
    comp = Pagination();
    total = 0;
    pageNr = 1;
    setup() {
        this.comp.s.prev.update({}, { click: () => this.prev() });
        this.comp.s.next.update({}, { click: () => this.next() });
    }
    prev() {
        console.log("prev");
        if (this.pageNr > 1) {
            this.pageNr--;
            this.update();
            this.on_goto(this.pageNr);
        }
    }
    next() {
        if (this.pageNr < this.total) {
            this.pageNr++;
            this.update();
            this.on_goto(this.pageNr);
        }
    }
    update() {
        this.comp.s.page.update({
            textContent: `${this.pageNr}/${this.total}`,
        });
        if (this.total <= 1) this.comp.getElement().classList.add("hidden");
        else this.comp.getElement().classList.remove("hidden");
    }
    set_total(total: number): void {
        this.total = total;
        this.update();
    }
    on_goto(nr: number): void {}
    get_comp(): GComponent {
        return this.comp;
    }
    set_page_nr(nr: number): void {
        this.pageNr = nr;
        this.update();
    }
}
