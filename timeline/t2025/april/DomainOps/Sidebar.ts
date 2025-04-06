import { Tools } from "../GComponent";
import { AccordionShowMany } from "../Accordion";
import { Section } from "./Section";
import { GForm, gformTest } from "../GForm";

const accordion = new AccordionShowMany();

accordion.s.funcs.onPlusHandlerOnShow = (e: any, s: any) => {
    if (s.item.title === "Domains") {
        domainSection.content!.s.formArea.display(domainSection.form);
        domainSection.form.s.funcs.onSubmit =
            domainSection.onSubmitForCreate.bind(domainSection);
        domainSection.form.clearValues();
        domainSection.plusIcon = s.s;
    } else if (s.item.title === "Operations") {
        operationsSection.content!.s.formArea.display(operationsForm);
        operationsSection.form.s.funcs.onSubmit =
            operationsSection.onSubmitForCreate.bind(operationsSection);
        operationsSection.form.clearValues();
        operationsSection.plusIcon = s.s;
    } else if (s.item.title === "Activities") {
        activitiesSection.content!.s.formArea.display(activitiesForm);
    }
};
accordion.s.funcs.onPlusHandlerOnHide = (e: any, s: any) => {
    if (s.item.title === "Domains") {
        domainSection.content!.s.formArea.clear();
    } else if (s.item.title === "Operations") {
        operationsSection.content!.s.formArea.clear();
    } else if (s.item.title === "Activities") {
        activitiesSection.content!.s.formArea.clear();
    }
};
accordion.getElement();

const makeDomainForm = () => {
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
};

const makeOperationsForm = () => {
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
};

const makeActivitiesForm = () => {
    const form = new GForm();
    form.s.data = [
        {
            key: "domain",
            class: "w-full p-1 rounded-sm bg-gray-100 text-black",
        },
        {
            key: "operations",
            placeholder: "Enter operations",
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
};
const operationsForm = makeOperationsForm();
const activitiesForm = makeActivitiesForm();

const domainSection = new Section("domains", makeDomainForm());
const operationsSection = new Section("operations", operationsForm);
const activitiesSection = new Section("logger", activitiesForm);

domainSection.fillList();
operationsSection.fillList();
operationsSection.funcs = {
    updateName: (val: any) => val.operation,
    createInfo: (val: any) => val.operation,
    valuesForForm: (val: any) => {
        return { operation: val.name };
    },
};
activitiesSection.fillList();

accordion.setData([
    {
        title: "Domains",
        content: domainSection.content,
        open: true,
    },
    {
        title: "Operations",
        content: operationsSection.content,
        open: true,
    },
    {
        title: "Activities",
        content: activitiesSection.content,
        open: false,
    },
]);

export const sidebar = Tools.div({
    class: "w-64 bg-gray-700 text-white p-4 min-h-[100vh] flex flex-col gap-5 overflow-y-auto",
    children: [
        Tools.comp("h1", {
            class: "text-lg font-bold",
            textContent: "DOMAIN LOGGER",
        }),
        accordion,
    ],
});
