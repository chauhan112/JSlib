import type { GComponent } from "../../../globalComps/GComponent";
import { Tools } from "../../../globalComps/tools";
import type { IHeader } from "./interface";
const CenteredHeader = () => {
    const title = Tools.comp("div", {
        class: "text-2xl font-black tracking-tighter uppercase",
        textContent: "Nexus",
    });
    return Tools.comp(
        "header",
        {
            class: "bg-white shadow-sm",
            children: [
                Tools.comp("div", {
                    class: "max-w-7xl mx-auto px-4 py-4 flex items-center justify-between",
                    children: [title],
                }),
            ],
        },
        {},
        { title },
    );
};
export class SimpleHeader implements IHeader {
    comp = CenteredHeader();
    title: string = "";
    set_title(title: string): void {
        this.title = title;
        this.comp.s.title.update({ textContent: title });
    }
    get_comp(): GComponent {
        return this.comp;
    }
}

export class ClickableHeader extends SimpleHeader {
    constructor() {
        super();
        this.comp.s.title
            .getElement()
            .classList.add("cursor-pointer", "select-none");
        this.comp.s.title.update({}, { click: () => this.on_click() });
    }

    on_click(): void {}
}

export class HeaderWithGoBack implements IHeader {
    set_title(title: string): void {
        throw new Error("Method not implemented.");
    }
    get_comp(): GComponent {
        throw new Error("Method not implemented.");
    }
}

export class HeaderWithRightMenus implements IHeader {
    set_title(title: string): void {
        throw new Error("Method not implemented.");
    }
    get_comp(): GComponent {
        throw new Error("Method not implemented.");
    }
}
