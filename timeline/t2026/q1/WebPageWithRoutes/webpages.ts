import type { GComponent } from "../../../globalComps/GComponent";
import { Tools } from "../../../globalComps/tools";
import { SimpleHeader } from "./headers";
import type { IContainer, IHeader, IWebPage } from "./interface";

export class GenericContainer implements IContainer {
    comp: GComponent;
    constructor(comp: GComponent) {
        this.comp = comp;
    }
    display(comp: GComponent): void {
        this.comp.update({ innerHTML: "", child: comp });
    }
    get_comp(): GComponent {
        return this.comp;
    }
}

const SimpleWebPageComp = () => {
    const header = Tools.comp("nav", {
        class: "bg-white border-b border-gray-200 sticky top-0 z-10",
    });
    const body = Tools.comp("main", {
        class: "flex max-w-7xl pb-6 sm:px-6 lg:px-8 flex-col",
    });
    return Tools.div(
        {
            class: "flex flex-col bg-gray-50 text-slate-800 min-h-screen",
            children: [header, body],
        },
        {},
        { header, body },
    );
};

export class SimpleWebPage implements IWebPage {
    comp = SimpleWebPageComp();
    header: IHeader = new SimpleHeader();
    constructor() {
        this.get_header().display(this.header.get_comp());
        this.header.set_title("Simple Web Page");
    }
    get_body(): IContainer {
        return new GenericContainer(this.comp.s.body);
    }
    get_header(): IContainer {
        return new GenericContainer(this.comp.s.header);
    }
    get_comp(): GComponent {
        return this.comp;
    }
}

export class WebPageWithSideBar implements IWebPage {
    get_body(): IContainer {
        throw new Error("Method not implemented.");
    }
    get_header(): IContainer {
        throw new Error("Method not implemented.");
    }
    get_comp(): GComponent {
        throw new Error("Method not implemented.");
    }
    get_side_bar(): IContainer {
        throw new Error("Method not implemented.");
    }
}

export class WebPageWithBreadcrumb implements IWebPage {
    get_body(): IContainer {
        throw new Error("Method not implemented.");
    }
    get_header(): IContainer {
        throw new Error("Method not implemented.");
    }
    get_comp(): GComponent {
        throw new Error("Method not implemented.");
    }
    get_breadcrumb(): IContainer {
        throw new Error("Method not implemented.");
    }
}

export class WebPageWithRoutes implements IWebPage {
    get_body(): IContainer {
        throw new Error("Method not implemented.");
    }
    get_header(): IContainer {
        throw new Error("Method not implemented.");
    }
    get_comp(): GComponent {
        throw new Error("Method not implemented.");
    }
}
