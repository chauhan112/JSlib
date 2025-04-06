import { Tools } from "./GComponent";
import { AccordionShowMany } from "./Accordion";

import { GForm, gformTest } from "./GForm";
import { Test } from "./ListWithCrud";
import {
    getDomains,
    createDomain,
    deleteDomain,
    updateDomainName,
} from "../mar/domainOps/Apis";

const accordion = new AccordionShowMany();

accordion.s.funcs.onPlusHandlerOnShow = (e: any, s: any) => {
    if (s.item.title === "Domains") {
        domainContent.s.formArea.display(domainForm);
        domainForm.s.funcs.onSubmit = onSubmitForCreate;
        domainForm.clearValues();
    } else if (s.item.title === "Operations") {
        operationsContent.s.formArea.display(operationsForm);
    } else if (s.item.title === "Activities") {
        activitiesContent.s.formArea.display(activitiesForm);
    }
};
accordion.s.funcs.onPlusHandlerOnHide = (e: any, s: any) => {
    if (s.item.title === "Domains") {
        domainContent.s.formArea.clear();
    } else if (s.item.title === "Operations") {
        operationsContent.s.formArea.clear();
    } else if (s.item.title === "Activities") {
        activitiesContent.s.formArea.clear();
    }
};
const onEditSubmit = (e: any, s: any) => {
    e.preventDefault();
    console.log(s.values);
    if (s.values.domain !== domainForm.s.currentData.name) {
        updateDomainName(
            domainForm.s.currentData.key,
            [],
            s.values.domain
        ).then((res: any) => {
            fillList();
            s.form.clearValues();
            domainContent.s.formArea.clear();
        });
    }
};
accordion.getElement();
const domainList = Test.listWithCrud();
domainList.s.funcs.contextMenuClick = (e: any, s: any) => {
    if (s.item.name === "Delete") {
        if (confirm("Are you sure you want to delete this domain?")) {
            deleteDomain(s.data.key, []).then((res: any) => {
                fillList();
            });
        }
    } else if (s.item.name === "Edit") {
        domainContent.s.formArea.display(domainForm);
        domainForm.s.funcs.onSubmit = onEditSubmit;
        domainForm.s.currentData = s.data;
        domainForm.setValues({ domain: s.data.name });
    }
};
const fillList = () => {
    getDomains([]).then((res: any) => {
        let domains = res.data.map((item: any) => {
            return { name: item[1], key: item[0] };
        });
        domainList.setData(domains);
    });
};
fillList();
const domainContent = Tools.div({
    class: "w-full h-full",
    children: [
        Tools.container({
            key: "formArea",
        }),
        domainList,
    ],
});
const operationsContent = Tools.div({
    class: "w-full h-full",
    children: [
        Tools.container({
            key: "formArea",
        }),
        Test.listWithCrud(),
    ],
});
const activitiesContent = Tools.div({
    class: "w-full h-full",
    children: [
        Tools.container({
            key: "formArea",
        }),
        Test.listWithCrud(),
    ],
});
const onSubmitForCreate = (e: any, s: any) => {
    e.preventDefault();
    let plusIcon = accordion.comp!.props.children[0].s.title.s.plus;
    createDomain(s.values.domain, []).then((res: any) => {
        plusIcon.component.dispatchEvent(new Event("click"));
        s.form.clearValues();
        fillList();
    });
};
const makeDomainForm = () => {
    const form = new GForm();
    form.s.data[0].props.placeholder = "domain name";
    form.s.data[0].props.class = "w-full p-1 rounded-sm bg-gray-100 text-black";
    form.s.data[1].props.class = "w-full p-1 rounded-md bg-blue-500 text-white";
    form.getElement();
    return form;
};

const domainForm = makeDomainForm();
const operationsForm = gformTest();
const activitiesForm = gformTest();
accordion.setData([
    {
        title: "Domains",
        content: domainContent,
        open: true,
    },
    {
        title: "Operations",
        content: operationsContent,
        open: true,
    },
    {
        title: "Activities",
        content: activitiesContent,
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
