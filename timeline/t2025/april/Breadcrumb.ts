import { GComponent, IComponent } from "./GComponent";
import { Atool } from "./Array";
import { Tools } from "./tools";

export class Breadcrumb implements IComponent {
    s: { [key: string]: any } = {};
    comp: GComponent | null = null;
    data: { name: string; href: string }[] = [];
    constructor() {
        this.data = [];
    }
    getElement() {
        if (this.comp) {
            return this.comp.getElement();
        }
        this.comp = Tools.div({
            class: "flex items-center gap-2 text-center items-center",
            children: this.getParams(this.data),
        });
        return this.comp.getElement();
    }
    setData(data: { name: string; href: string; more?: any }[]) {
        this.data = data;
        this.getElement();

        this.comp!.update({
            innerHTML: "",
            children: this.getParams(this.data),
        });
    }
    private getParams(data: { name: string; href: string; more?: any }[]) {
        let params = Atool.addInMiddle(
            data.slice(0, -1).map((item) => {
                return Tools.div({
                    class: "hover:after:w-full relative hover:text-indigo-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-indigo-600 after:transition-all after:duration-300 after:ease-in-out",
                    child: Tools.comp("a", {
                        href: item.href,
                        textContent: item.name,
                    }),
                });
            }),
            () => {
                return Tools.comp("span", {
                    class: "mx-0 mb-1",
                    textContent: "›",
                });
            }
        );
        let last = data[data.length - 1];
        if (!last) {
            return params;
        }
        const lastComp = Tools.div({
            class: "hover:after:w-full relative text-green-600 font-medium",
            textContent: last.name,
        });
        params.push(
            Tools.comp("span", {
                class: "mx-0 mb-1",
                textContent: "›",
            })
        );
        params.push(lastComp);
        return params;
    }
    getProps() {
        return this.comp!.getProps();
    }
}

let breadcrumb = new Breadcrumb();
breadcrumb.setData([
    { name: "Home", href: "#" },
    { name: "Library", href: "#" },
    { name: "Data", href: "#" },
]);
