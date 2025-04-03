export interface IComponent {
    states: { [key: string]: any };

    update(
        props?: { [key: string]: string },
        state?: { [key: string]: any },
        handlers?: { [key: string]: (...args: any[]) => void },
        stateUpdate?: boolean
    ): void;
    getElement(): HTMLElement;
}
