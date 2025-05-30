import { GForm } from "../GForm";
import { Section } from "./Section";

export class DomainsContent {
    section: Section;
    s: { [key: string]: any } = {};
    constructor(root?: any) {
        let rootComponent = root || this;
        this.section = new Section(
            rootComponent,
            "domains",
            this.makeDomainForm()
        );
        this.section.s.parent = this;
    }
    makeDomainForm() {
        const form = new GForm();
        form.s.data = [
            {
                key: "domain",
                placeholder: "domain name",
                class: "w-full p-1 rounded-sm bg-gray-100 text-black",
            },
            {
                type: "submit",
                textContent: "Submit",
                class: "w-full p-1 rounded-md bg-blue-500 text-white",
            },
        ];
        form.getElement();
        return form;
    }
    init() {
        this.section.fillList();
    }
}
export class OperationsContent {
    section: Section;

    s: { [key: string]: any } = {};
    constructor(root?: any) {
        let rootComponent = root || this;

        this.section = new Section(
            rootComponent,
            "operations",
            this.makeOperationsForm()
        );
        this.section.funcs = {
            ...this.section.funcs,
            updateNameData: (val: any) => val.operation,
            createInfoData: (val: any) => val.operation,
            valuesForFormData: (val: any) => {
                return { operation: val.name };
            },
        };
        this.s.root = root;
    }
    makeOperationsForm() {
        const form = new GForm();
        form.s.data = [
            {
                key: "operation",
                placeholder: "operation name",
                class: "w-full p-1 rounded-sm bg-gray-100 text-black",
            },
            {
                type: "submit",
                textContent: "Submit",
                class: "w-full p-1 rounded-md bg-blue-500 text-white",
            },
        ];
        form.getElement();
        return form;
    }
    init() {
        this.section.fillList();
    }
}
