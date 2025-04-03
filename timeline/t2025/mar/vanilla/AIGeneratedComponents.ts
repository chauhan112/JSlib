import { GComponent } from "./Components";
import { IComponent } from "./interfaces";
export class Accordion implements IComponent {
    handlers: { [key: string]: (...args: any[]) => void } = {};
    states: { [key: string]: any } = {};
    props: { [key: string]: string } = {};
    accordionComp: GComponent = new GComponent();

    constructor() {
        this.accordionComp.typ = "div";
        this.states.items = [];
        this.states.openIndex = null; // Track which item is open
    }

    render(): HTMLElement {
        this.accordionComp.props = {
            class: "w-full max-w-md mx-auto",
        };

        // Create container for accordion items
        this.states.itemsContainer = new GComponent();
        this.states.itemsContainer.typ = "div";

        this.states.itemsContainer.update({
            class: "space-y-2",
        });
        this.renderItems();
        this.accordionComp
            .getElement()
            ?.appendChild(this.states.itemsContainer.render());

        return this.accordionComp.render();
    }

    private renderItems() {
        // Clear existing items
        this.states.itemsContainer.getElement()?.replaceChildren();

        // Create each accordion item
        this.states.items.forEach((item: any, index: number) => {
            const itemComp = new GComponent();
            itemComp.typ = "div";

            itemComp.update({
                class: "border border-gray-300 rounded-lg overflow-hidden",
            });

            // Create header (clickable part)
            const header = new GComponent();
            header.typ = "button";
            header.update(
                {
                    class: `w-full px-4 py-3 text-left font-medium flex justify-between items-center 
                       ${
                           this.states.openIndex === index
                               ? "bg-gray-100"
                               : "bg-white"
                       }`,
                    textContent: item.title,
                },
                {},
                {
                    click: () => this.toggleItem(index),
                }
            );

            // Create chevron icon
            const chevron = new GComponent();
            chevron.typ = "span";

            chevron.update({
                class: `transform transition-transform ${
                    this.states.openIndex === index ? "rotate-180" : ""
                }`,
                innerHTML: "▼",
            });

            header.getElement()?.appendChild(chevron.getElement()!);

            // Create content area
            const content = new GComponent();
            content.typ = "div";
            content.update({
                class: `px-4 py-2 bg-white transition-all duration-300 ease-in-out 
                       ${this.states.openIndex === index ? "block" : "hidden"}`,
                textContent: item.content,
            });

            // Build the item structure
            itemComp.getElement()?.appendChild(header.render());
            itemComp.getElement()?.appendChild(content.render());

            // Add item to container
            this.states.itemsContainer
                .getElement()
                ?.appendChild(itemComp.render());
        });
    }

    toggleItem(index: number) {
        // If clicking the open item, close it. Otherwise, open the clicked item
        this.states.openIndex = this.states.openIndex === index ? null : index;
        this.renderItems(); // Re-render to reflect changes
    }

    setItems(items: Array<{ title: string; content: string }>) {
        this.states.items = items;
        if (this.states.itemsContainer) {
            this.renderItems();
        }
    }

    update(
        props?: { [key: string]: string },
        state?: { [key: string]: any },
        handlers?: { [key: string]: (...args: any[]) => void }
    ): void {
        this.accordionComp.update(props, state, handlers);
    }

    getElement(): HTMLElement | null {
        return this.accordionComp.getElement();
    }
}
