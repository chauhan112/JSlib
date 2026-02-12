import type { GComponent } from "../../../globalComps/GComponent";
import { type IComponent, type IPagination } from "./interface";
import { Tools } from "../../../globalComps/tools";

interface IPageBtn extends IComponent {
    page: number;
    active: boolean;
    on_click(page: number): void;
    update_ui(): void;
}

const PageBtn = (page: number) => {
    return Tools.comp("button", {
        class: "px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors",
        textContent: `${page}`,
    });
};

class GPageBtn implements IPageBtn {
    page: number = 0;
    comp: GComponent;
    parent: IPagination;
    active: boolean = false;
    constructor(parent: IPagination) {
        this.parent = parent;
        this.comp = PageBtn(this.page);
    }
    get_comp(): GComponent {
        return this.comp;
    }
    setup() {
        this.update_ui();
    }
    on_click(page: number) {
        this.parent.goto(page);
    }
    update_ui() {
        this.comp.update({ textContent: `${this.page}` });
        this.comp.getElement().classList.toggle("bg-gray-600", this.active);
    }
}

export class ClassicPagination implements IPagination {
    current_page: number = 1;
    total: number = 0;
    page_size: number = 10;
    comp: any = Tools.comp("nav", {
        class: "flex justify-center items-center gap-2",
    });

    creator(page: number): IPageBtn {
        let btn = new GPageBtn(this);
        btn.page = page;
        return btn;
    }
    goto(page: number): void {
        this.current_page = page;
        this.update_ui();
    }
    update_for_page(page: number): void {
        throw new Error("Method not implemented.");
    }
    update_ui(): void {
        let currentPage1 = this.current_page;
        let totalPages1 = Math.ceil(this.total / this.page_size);
        // html += `<button onclick="goToPage(1)" class="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors ${currentPage1 === 1 ? "opacity-50 cursor-not-allowed" : ""}">First</button>`;

        // html += `<button onclick="goToPage(${currentPage1 - 1})" class="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors ${currentPage1 === 1 ? "opacity-50 cursor-not-allowed" : ""}">←</button>`;

        // let children = [];
        // for (let i = 1; i <= totalPages1; i++) {
        //     if (
        //         i === 1 ||
        //         i === totalPages1 ||
        //         (i >= currentPage1 - 1 && i <= currentPage1 + 1)
        //     ) {
        //         html += `<button onclick="goToPage(${i})" class="px-4 py-2 ${i === currentPage1 ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"} text-white rounded-lg transition-colors font-semibold">${i}</button>`;
        //     } else if (i === currentPage1 - 2 || i === currentPage1 + 2) {
        //         html += `<span class="px-2 text-gray-500">...</span>`;
        //     }
        // }

        // html += `<button onclick="goToPage(${currentPage1 + 1})" class="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors ${currentPage1 === totalPages1 ? "opacity-50 cursor-not-allowed" : ""}">→</button>`;

        // html += `<button onclick="goToPage(${totalPages1})" class="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors ${currentPage1 === totalPages1 ? "opacity-50 cursor-not-allowed" : ""}">Last</button>`;

        this.comp.update({ innerHTML: "" });
    }
    set_total(total: number): void {
        throw new Error("Method not implemented.");
    }
    get_comp(): GComponent {
        throw new Error("Method not implemented.");
    }
    setup(): void {
        throw new Error("Method not implemented.");
    }
}
