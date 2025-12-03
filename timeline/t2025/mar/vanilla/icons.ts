import { GComponent } from "./Components";
import { type IComponent } from "./interfaces";
export class GIcon implements IComponent {
    states: { [key: string]: any } = {};
    iconComp: GComponent = new GComponent();
    constructor() {
        this.setIcon(PlusIcon);
    }

    update(
        props: { [key: string]: string },
        state: { [key: string]: any },
        handlers: { [key: string]: (...args: any[]) => void }
    ): void {
        this.iconComp.update(props, state, handlers);
    }
    getElement(): HTMLElement {
        return this.iconComp.getElement();
    }
    setIcon(icon: (className: string) => string) {
        this.states.icon = icon;
        this.iconComp.update({
            innerHTML: this.states.icon("w-6 h-6"),
        });
    }
    setIconClass(className: string) {
        this.states.iconClass = className;
        this.iconComp.update({
            className: this.states.iconClass,
        });
    }
}

export const PlusIcon = (className: string = "w-6 h-6") => {
    return `<svg xmlns="http://www.w3.org/2000/svg" class="${className}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>`;
};

export const DownArrowIcon = (className: string = "w-6 h-6") => {
    return `<svg xmlns="http://www.w3.org/2000/svg" class="${className}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>`;
};
