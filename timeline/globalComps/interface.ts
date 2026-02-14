import type { GComponent } from "./GComponent";

export interface ISComponent {
    get_comp(): GComponent;
}

export interface IGComponent {
    get_comp(): GComponent;
    setup(): void;
}
