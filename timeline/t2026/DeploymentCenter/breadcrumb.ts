import { Tools } from "../../globalComps/tools";
import { Atool } from "../../t2025/april/Array";

export interface IBreadcrumbItem {
    name: string;
    href?: string;
}

export const Separator = () => {
    return Tools.comp("span", {
        class: "mx-0 mb-1",
        textContent: "›",
    });
};

export const LastComponent = (item: any) => {
    return Tools.div({
        class: "hover:after:w-full relative text-green-600 font-medium",
        textContent: item.name,
    });
};

export const BreadCrumbItem = (item: any) => {
    return Tools.div({
        class: "hover:after:w-full relative hover:text-indigo-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-indigo-600 after:transition-all after:duration-300 after:ease-in-out",
        child: Tools.comp("a", {
            href: item.href ?? "#",
            textContent: item.name,
        }),
    });
};

export class BreadcrumbCtrl {
    comp: any;
    data: IBreadcrumbItem[] = [];
    constructor() {
        this.set_comp(Tools.div({
            class: "flex items-center gap-2 text-center items-center",
        }));
    }
    set_comp(comp: any) {
        this.comp = comp;
    }
    set_data(data: any[]) {
        this.data = data;
    }
    setup() {
        this.render();
    }
    render() {
        this.comp.update({
            children: this.get_children(this.data),
        });
    }
    get_children(data: any[]) {
        return Atool.addInMiddle(
            data.slice(0, -1).map(BreadCrumbItem),
            Separator
        );
    }
}

export class MainCtrl {
    static breadcrumb(data: IBreadcrumbItem[]) {
        const breadcrumbCtrl = new BreadcrumbCtrl();
        breadcrumbCtrl.set_data(data);
        breadcrumbCtrl.setup();
        return breadcrumbCtrl;
    }
}