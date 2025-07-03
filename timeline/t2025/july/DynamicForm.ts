import { GenericForm, Params } from "../june/domain-ops/Form";
import { InputType } from "../june/domain-ops/Model";

export const DynamicFormController = () => {
    const comp = GenericForm();

    const applyIfNotExists = (obj: any, key: string, val: any) => {
        if (obj && !obj[key]) {
            obj[key] = val;
        }
    };
    const setFields = (
        fields: { type: InputType; key: string; params: any }[]
    ) => {
        let fieldComps: any = [];
        let defValues = {
            inp: {
                class: "w-full p-2 rounded-md bg-gray-100 text-black",
            },
            textArea: {
                class: "w-full p-2 rounded-md bg-gray-100 text-black flex-1",
            },
        };

        for (const field of fields) {
            if (!field.key) {
                continue;
            }
            let params = { ...field.params };
            if (field.type == InputType.Input) {
                applyIfNotExists(params, "class", defValues.inp.class);
                applyIfNotExists(params, "placeholder", "Enter " + field.key);
                fieldComps.push(Params.inp(field.key, params));
            } else if (field.type == InputType.Select) {
                fieldComps.push(Params.select(field.key, field.params));
            } else if (field.type == InputType.LargeText) {
                applyIfNotExists(params, "class", defValues.textArea.class);
                applyIfNotExists(params, "placeholder", "Enter " + field.key);
                fieldComps.push(Params.textArea(field.key, params));
            }
        }
        fieldComps.push(Params.inpSubmit());
        comp.s.handlers.setComponents(fieldComps);
    };

    return { comp, setFields };
};
