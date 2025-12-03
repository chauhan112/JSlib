import { type IComponent, GComponent, Container } from "../GComponent";
import { Tools } from "../tools";
import { Edit, Plus, Trash, X } from "lucide";
import { Modal } from "../Modal";
import {
    createProperty,
    readProps,
    deleteProperty,
    updateProperty,
} from "./api/pythonAnywhere";

export class Table implements IComponent {
    s: { [key: string]: any } = {};
    comp: GComponent | null = null;
    constructor(root?: any) {
        this.s.data = [];
        this.s.header = [];
        this.s.funcs = {
            createHeader: this.createHeader.bind(this),
            createData: this.createData.bind(this),
        };
        this.s.root = root ?? this;
    }
    getElement(): HTMLElement | SVGElement {
        if (this.comp) return this.comp.getElement();
        this.comp = Tools.comp("table", {
            class: "w-full text-left",
            children: [
                this.s.funcs.createHeader(),
                ...this.s.funcs.createData(),
            ],
        });
        return this.comp.getElement();
    }
    getProps(): { [key: string]: any } {
        return this.comp!.getProps();
    }
    createHeader() {
        return Tools.comp("tr", {
            class: "text-gray-500",
            children: this.s.header.map((col: any) =>
                Tools.comp("th", { textContent: col })
            ),
        });
    }
    createData() {
        return this.s.data.map((row: any) =>
            Tools.comp("tr", {
                children: row.map((col: any) =>
                    Tools.comp("td", { textContent: col })
                ),
            })
        );
    }
    appendData(data: any) {
        this.comp!.update({
            children: [
                Tools.comp("tr", {
                    children: data.map((col: any) =>
                        Tools.comp("td", { textContent: col })
                    ),
                }),
            ],
        });
    }
    setData(data: any) {
        this.s.data = data;
        this.comp!.update({
            innerHTML: "",
            children: [
                this.s.funcs.createHeader(),
                ...this.s.funcs.createData(),
            ],
        });
    }
    clearData() {
        this.setData([]);
    }
}

export class AttributeForm implements IComponent {
    s: { [key: string]: any } = {};
    comp: GComponent | null = null;
    constructor(root?: any) {
        this.s.data = [];
        this.s.funcs = {
            close: this.close.bind(this),
            createProps: this.createProps.bind(this),
        };
        this.s.root = root || this;
    }
    close() {
        console.log("close");
    }
    createProps() {
        console.log("createProps");
    }
    getElement(): HTMLElement | SVGElement {
        if (this.comp) return this.comp.getElement();
        const closeBtn = Tools.icon(
            X,
            {
                class: "w-5 hover:bg-red-600 text-gray-200",
            },
            {
                click: () => this.s.funcs.close(),
            }
        );

        const okBtn = Tools.comp(
            "button",
            {
                class: "bg-green-100 px-2 hover:bg-green-500 cursor-pointer",
                textContent: "ok",
            },
            {
                click: () => {
                    this.s.funcs.createProps();
                },
            }
        );

        const keyInput = Tools.input({
            class: "p-1 outline-slate-500 w-full border",
            key: "key",
            placeholder: "Key",
            type: "text",
        });

        const typeSelect = Tools.dropdown([
            {
                value: "string",
                textContent: "string",
            },
            {
                value: "json",
                textContent: "json",
            },
        ]);
        typeSelect.comp!.getElement().classList.toggle("w-full");

        const valueInput = Tools.input(
            {
                class: "p-1 mt-2 w-full outline-slate-500 border",
                key: "value",
                placeholder:
                    "for json, enter {key:`stuff that should be here`}",
            },
            "textarea"
        );

        this.comp = Tools.comp("div", {
            class: "w-full text-left flex flex-col items-end",
            children: [
                closeBtn,
                Tools.comp("div", {
                    class: "bg-white p-3 pb-2 text-black w-full",
                    children: [
                        Tools.div({
                            class: "flex",
                            children: [keyInput, typeSelect, okBtn],
                        }),
                        valueInput,
                    ],
                }),
            ],
        });

        this.s.comps = {
            keyInput,
            typeSelect,
            okBtn,
            valueInput,
            closeBtn,
        };
        return this.comp.getElement();
    }
    getValues() {
        return {
            key: this.s.comps.keyInput.get(),
            type: this.s.comps.typeSelect.get(),
            value: this.s.comps.valueInput.get(),
        };
    }
    setValues(values: { [key: string]: any }) {
        this.s.comps.keyInput.set(values.key);
        this.s.comps.typeSelect.set(values.type);
        this.s.comps.valueInput.set(values.value);
    }
    clearValues() {
        this.setValues({
            key: "",
            type: "string",
            value: "",
        });
    }
    getProps(): { [key: string]: any } {
        return this.comp!.getProps();
    }
}

export class PropertySection implements IComponent {
    s: { [key: string]: any } = {};
    comp: Container | null = null;
    modal: Modal | null = null;
    attributeForm: AttributeForm | null = null;
    constructor(root?: any) {
        this.s.data = [];
        this.modal = new Modal(root);
        this.modal.getElement();
        this.attributeForm = new AttributeForm();
        this.attributeForm.getElement();
        this.attributeForm.s.funcs.close = () => this.modal!.hide();
        this.attributeForm.s.funcs.createProps = this.createProps.bind(this);
        this.s.root = root || this;
        this.s.funcs = {
            editProperty: this.onEditProperty.bind(this),
            deleteProperty: this.deleteProperty.bind(this),
        };
    }
    onEditProperty(row: any) {
        const isString = typeof row.data[1] === "string";
        this.attributeForm!.setValues({
            key: row.data[0],
            type: isString ? "string" : "json",
            value: isString ? row.data[1] : JSON.stringify(row.data[1]),
        });
        this.modal!.display(this.attributeForm!);
        this.attributeForm!.s.funcs.createProps =
            this.onEditPropertySubmit.bind(this);
    }
    onEditPropertySubmit() {
        const values = this.attributeForm!.getValues();
        console.log(values);
        if (this.s.currentInfo) {
            updateProperty(
                this.s.currentInfo.data.key,
                [],
                values.key,
                values.type === "json"
                    ? JSON.parse(values.value)
                    : values.value,
                this.s.currentInfo.typ
            ).then(() => {
                this.attributeForm!.s.funcs.close();
                this.attributeForm!.clearValues();
                this.fetchProperties();
            });
        }
    }
    deleteProperty(row: any) {
        if (confirm("Are you sure you want to delete this property?")) {
            deleteProperty(row.cat.data.key, [], row.data[0], row.cat.typ).then(
                () => {
                    this.fetchProperties();
                }
            );
        }
    }
    createProps() {
        this.attributeForm!.s.comps.okBtn.getElement().classList.toggle(
            "hidden"
        );

        if (this.s.currentInfo) {
            const values = this.attributeForm!.getValues();
            createProperty(
                this.s.currentInfo.data.key,
                [],
                values.key,
                values.type === "json"
                    ? JSON.parse(values.value)
                    : values.value,
                this.s.currentInfo.typ
            )
                .then(() => {
                    this.attributeForm!.s.funcs.close();
                    this.attributeForm!.clearValues();
                    this.fetchProperties();
                })
                .finally(() => {
                    this.attributeForm!.s.comps.okBtn.getElement().classList.toggle(
                        "hidden"
                    );
                });
        }
    }
    getElement(): HTMLElement | SVGElement {
        if (this.comp) return this.comp.getElement();
        this.s.comps = {};
        this.s.comps.header = this.createHeader();
        const table = new Table(this.s.root);
        table.s.header = ["Key", "Value", "Action"];
        table.s.data = [
            // ["created", "2025-01-01"],
            // ["modified", "2025-01-01"],
        ];
        this.s.comps.table = table;
        table.s.funcs.createData = this.createData.bind(this);
        this.s.comps.table.getElement();
        this.s.comps.main = Tools.comp("div", {
            class: "w-full text-left",
            children: [
                this.s.comps.header,
                Tools.container({ class: "p-2", child: table }),
                this.modal,
            ],
        });
        this.comp = Tools.container({});
        return this.comp.getElement();
    }
    getProps(): { [key: string]: any } {
        return this.comp!.getProps();
    }
    createHeader() {
        return Tools.div({
            class: "p-3 flex bg-slate-700 gap-2 font-bold items-center",
            children: [
                Tools.div({
                    class: "text-white",
                    textContent: "Attributes",
                }),
                Tools.comp("input", {
                    class: "m-1 rounded-full ps-2 bg-white",
                    placeholder: "Search",
                }),
                Tools.icon(
                    Plus,
                    { class: " text-white hover:text-gray-300" },
                    {
                        click: () => this.onPlusClicked(),
                    }
                ),
            ],
        });
    }
    onPlusClicked() {
        this.attributeForm!.clearValues();
        this.modal!.display(this.attributeForm!);
        this.attributeForm!.s.funcs.createProps = this.createProps.bind(this);
    }
    createData() {
        return this.s.comps.table.s.data.map((row: any) =>
            Tools.comp("tr", {
                children: row
                    .map((col: any) => Tools.comp("td", { textContent: col }))
                    .concat([
                        Tools.comp("td", {
                            class: "flex gap-2",
                            children: [
                                Tools.icon(
                                    Edit,
                                    {
                                        class: " hover:text-gray-300",
                                    },
                                    {
                                        click: (e: any, ls: any) =>
                                            this.s.funcs.editProperty({
                                                data: row,
                                                cat: this.s.currentInfo,
                                            }),
                                    }
                                ),
                                Tools.icon(
                                    Trash,
                                    {
                                        class: " hover:text-gray-300",
                                    },
                                    {
                                        click: (e: any, ls: any) =>
                                            this.s.funcs.deleteProperty({
                                                data: row,
                                                cat: this.s.currentInfo,
                                            }),
                                    }
                                ),
                            ],
                        }),
                    ]),
            })
        );
    }
    show() {
        this.comp!.comp.update({
            class: "w-96 min-h-full border-l border-gray-200 ",
        });
        this.comp!.display(this.s.comps.main);
    }
    hide() {
        this.comp!.comp.update({
            class: "",
        });
        this.comp!.clear();
    }
    fetchProperties() {
        const currentInfo = this.s.currentInfo;
        if (currentInfo) {
            readProps(currentInfo.data.key, [], currentInfo.typ).then((res) => {
                const data = [];
                for (const key in res.data) {
                    data.push([key, res.data[key]]);
                }
                this.s.comps.table.setData(data);
            });
        }
    }
}

export class Test {
    static table() {
        const table = new Table();
        table.s.data = [
            ["created", "2025-01-01", "--"],
            ["modified", "2025-01-01", "--"],
            ["name", "Raja", "Edit,Delete"],
        ];
        table.s.header = ["Key", "Value", "Action"];
        table.getElement();
        return table;
    }
}
