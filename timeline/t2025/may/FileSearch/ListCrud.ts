import { GComponent, type IComponent } from "../../../globalComps/GComponent";
import { Tools } from "../../../globalComps/tools";

export class ListCrud {
    private viewFunc: (label: string, val: any) => IComponent;
    private onClick: (args: { val: any; op: string; ls: any; e: any }) => void;
    private ops: any[] = [
        { textContent: "edit" },
        { textContent: "delete" },
        { textContent: "view" },
    ];
    private labelFunc: (val: any) => string = this.getDefaultLabel;
    private layout: GComponent | undefined;
    constructor() {
        this.viewFunc = this.defaultViewFunc;
        this.onClick = (args: { val: any; op: string; ls: any; e: any }) => {
            console.log("clicked", args.val, args.op);
        };
    }
    setOps(ops: any[]) {
        this.ops = ops;
    }
    getDefaultLabel(val: any) {
        return "item";
    }
    setListElementViewFunc(func: (val: any) => IComponent) {
        this.viewFunc = func;
    }
    setOnClickHandler(
        onClick: (args: { val: any; op: string; ls: any; e: any }) => void
    ) {
        this.onClick = onClick;
    }
    defaultViewFunc(label: string, val: any): IComponent {
        return Tools.comp(
            "div",
            {
                class: "flex items-center justify-between p-2 border-b border-gray-200 flex-wrap",
                children: [
                    Tools.comp("span", {
                        class: "text-gray-700",
                        textContent: label,
                    }),
                    Tools.div({
                        class: "flex items-center gap-2",
                        children: this.ops.map((op: any) => {
                            return this.defaultOpViewFunc(val, op);
                        }),
                    }),
                ],
            },
            {},
            { val: val }
        );
    }
    defaultOpViewFunc(val: any, op: any = {}): IComponent {
        return Tools.comp(
            "button",
            {
                class: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded cursor-pointer",
                ...op,
            },
            {
                click: (e: any, ls: any) => {
                    this.onClick({
                        val: ls.s.data,
                        op: op.textContent,
                        ls,
                        e,
                    });
                },
            },
            {
                data: val,
            }
        );
    }
    getLayout() {
        return Tools.div(
            {
                class: "flex flex-col w-full",
            },
            {},
            {
                comps: {},
                handlers: {},
            }
        );
    }
    addItem(val: any) {}
    removeItem(val: any) {}
    updateItem(val: any) {}
    clearList() {}
    getList() {
        return [];
    }
}
