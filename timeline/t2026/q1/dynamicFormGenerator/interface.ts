import type { IGComponent as IComponent } from "../../../globalComps/interface";
import type { GComponent } from "../../../globalComps/GComponent";

export interface IField<T> {
    get_value(): T;
    set_value(value: T): void;
    set_default_value(value: T): void;
    is_changed(): boolean;
    get_comp(): GComponent;
}

export interface IDynamicFormGenerator<T> extends IComponent {
    get_fields(): { [key: string]: IField<T> };
    get_comp(): GComponent;
    reset_fields(): void;
    is_changed(): boolean;
    get_changed_values(): { [key: string]: T };
    get_all_values(): { [key: string]: T };
    set_values(values: { [key: string]: T }): void;
}
