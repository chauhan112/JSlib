import { GenericForm, Params } from "../june/domain-ops/Form";
import { InputType } from "../june/domain-ops/Model";

export const DynamicForm = () => {
    const form = GenericForm();
    let options = Object.entries(InputType);
    let comps: any[] = [
        Params.inp("key", {
            class: "w-full p-2 rounded-md bg-gray-100 text-black",
            placeholder: "Enter the key",
        }),
        Params.select(
            "type",
            options.map((op) => [op[1], op[0]])
        ),
        Params.inp("order", {
            class: "w-full p-2 rounded-md bg-gray-100 text-black",
            placeholder: "give the order for sorting",
            type: "number",
            value: 0,
        }),
        Params.inpSubmit(),
    ];

    form.s.handlers.setComponents(comps);
    return form;
};
