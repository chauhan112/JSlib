import { Tools } from "../tools";
import { AccordionShowMany } from "../Accordion";
import { DocumentHandler } from "../Array";
import { ActivitiesContent } from "./ActivitiesCrud";
import { DomainsContent, OperationsContent } from "./DomainOps";
import { GComponent, IComponent } from "../GComponent";

export class Sidebar implements IComponent {
    accordion: AccordionShowMany;
    s: { [key: string]: any } = {};
    docHandler: DocumentHandler;
    domContent: DomainsContent;
    opsContent: OperationsContent;
    activitiesSection: ActivitiesContent;
    comp: GComponent | null = null;
    constructor(root?: any) {
        let rootComponent = root || this;
        this.accordion = new AccordionShowMany();
        this.docHandler = new DocumentHandler();
        this.domContent = new DomainsContent(rootComponent, this.docHandler);
        this.opsContent = new OperationsContent(rootComponent, this.docHandler);
        this.activitiesSection = new ActivitiesContent(
            rootComponent,
            this.docHandler
        );
        this.accordion.s.funcs.onPlusHandlerOnShow =
            this.onPlusClickShowForm.bind(this);
        this.accordion.s.funcs.onPlusHandlerOnHide =
            this.onPlusClickHideForm.bind(this);
        this.setupAccordion();
        this.domContent.s.parent = this;
        this.opsContent.s.parent = this;
        this.activitiesSection.s.parent = this;
    }

    itemClick(e: any, ls: any) {
        console.log(ls.s.data);
    }

    getElement(): HTMLElement | SVGElement {
        if (this.comp) {
            return this.comp.getElement();
        }
        this.comp = Tools.div({
            class: "w-64 bg-gray-700 text-white p-4 min-h-[100vh] flex flex-col gap-5 overflow-y-auto",
            children: [
                Tools.comp("h1", {
                    class: "text-lg font-bold",
                    textContent: "DOMAIN LOGGER",
                }),
                this.accordion,
            ],
        });
        return this.comp.getElement();
    }
    getProps(): { [key: string]: any } {
        return this.comp!.getProps();
    }
    setupAccordion() {
        this.accordion.getElement();
        this.domContent.init();
        this.opsContent.init();
        this.activitiesSection.init();
        this.accordion.setData([
            {
                title: "Domains",
                content: this.domContent.section.content,
                open: true,
            },
            {
                title: "Operations",
                content: this.opsContent.section.content,
                open: true,
            },
            {
                title: "Activities",
                content: this.activitiesSection.content,
                open: true,
            },
        ]);
    }
    onPlusClickShowForm(e: any, s: any) {
        let section = null;
        if (s.item.title === "Domains") {
            section = this.domContent.section;
            section.form.s.funcs.onSubmit =
                section.onSubmitForCreate.bind(section);
            section.content!.s.formArea.display(section.form);
            section.form.clearValues();
            section.plusIcon = s.s;
        } else if (s.item.title === "Operations") {
            section = this.opsContent.section;
            section.form.s.funcs.onSubmit =
                section.onSubmitForCreate.bind(section);
            section.content!.s.formArea.display(section.form);
            section.form.clearValues();
            section.plusIcon = s.s;
        } else if (s.item.title === "Activities") {
            this.activitiesSection.onPlusClickShowForm();
            this.activitiesSection.more.plusIcon = s.s;
        }
    }
    onPlusClickHideForm(e: any, s: any) {
        if (s.item.title === "Domains") {
            this.domContent.section.content!.s.formArea.clear();
        } else if (s.item.title === "Operations") {
            this.opsContent.section.content!.s.formArea.clear();
        } else if (s.item.title === "Activities") {
            this.activitiesSection.onPlusClickHideForm();
        }
    }
}
