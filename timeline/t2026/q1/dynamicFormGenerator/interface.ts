import type { GComponent } from "../../../globalComps/GComponent";
import type { ISComponent as IComponent } from "../../../globalComps/interface";

export interface IField<T> {
    get_value(): T;
    set_value(value: T): void;
    set_default_value(value: T): void;
    is_changed(): boolean;
    get_comp(): GComponent;
    reset_value(): void;
}

export interface IDynamicFormGenerator extends IComponent {
    set_fields(fields: { [key: string]: IField<any> }): void;
    reset_fields(): void;
    is_changed(): boolean;
    get_changed_values(): { [key: string]: any };
    get_all_values(): { [key: string]: any };
    set_values(values: { [key: string]: any }): void;
    on_submit(): void;
    set_default_values(values: { [key: string]: any }): void;
}
