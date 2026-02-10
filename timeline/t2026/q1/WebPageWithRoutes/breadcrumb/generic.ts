import type { GComponent } from "../../../../globalComps/GComponent";
import type { IHandler, IDisplayer, IBreadcrumbItem } from "./interface";
import { Tools } from "../../../../globalComps/tools";
import { Atool } from "../../../../t2025/april/Array";

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
        class: "hover:after:w-full relative hover:text-indigo-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-indigo-600 after:transition-all after:duration-300 after:ease-in-out text-blue-600 cursor-pointer ",
        child: Tools.comp("span", {
            textContent: item.name,
        }),
    });
};

export class MockHandler implements IHandler {
    data: IBreadcrumbItem[] = [];
    get_breadcrumb_items(): IBreadcrumbItem[] {
        return [
            { name: "Home", value: "home" },
            { name: "Users", value: "users" },
            { name: "John Doe", value: "john-doe" },
            { name: "Profile", value: "profile" },
            { name: "Settings", value: "settings" },
            { name: "Notifications", value: "notifications" },
            { name: "Security", value: "security" },
            { name: "Privacy", value: "privacy" },
            { name: "Terms of Service", value: "terms-of-service" },
            { name: "Logout", value: "logout" },
        ];
    }
    get_component_for_item(item: IBreadcrumbItem): GComponent {
        return Tools.comp("span", { textContent: item.name });
    }
}

export class GenericDisplayer implements IDisplayer {
    comp: any;
    parent: BreadCrumbInput;
    constructor(parent: BreadCrumbInput) {
        this.parent = parent;
        this.comp = Tools.div({
            class: "flex items-center gap-2 text-center items-center",
        });
    }
    set_comp(comp: any) {
        this.comp = comp;
    }

    display_breadcrumb(items: IBreadcrumbItem[]) {
        this.comp.update({
            innerHTML: "",
            children: this.get_children(items),
        });
    }

    private get_item_component(item: IBreadcrumbItem): GComponent {
        let comp = BreadCrumbItem(item);
        comp.update({}, { click: () => this.on_breadcrumb_item_click(item) });
        return comp;
    }
    private on_breadcrumb_item_click(selectedItem: IBreadcrumbItem) {
        let tillItems = [];
        let data = this.parent.handler.get_breadcrumb_items();
        for (let item of data) {
            tillItems.push(item);
            if (item.value === selectedItem.value) {
                break;
            }
        }

        this.display_breadcrumb(tillItems);
        let ui = this.parent.handler.get_component_for_item(selectedItem);
        this.display_item(ui);
    }
    get_children(data: any[]) {
        return Atool.addInMiddle(
            data.slice(0, -1).map((item) => this.get_item_component(item)),
            Separator,
        ).concat([Separator(), LastComponent(data.at(-1))]);
    }
    display_item(comp: GComponent) {
        console.log(comp);
    }
}

export class BreadCrumbInput {
    displayer: GenericDisplayer = new GenericDisplayer(this);
    handler: IHandler = new MockHandler();
}
