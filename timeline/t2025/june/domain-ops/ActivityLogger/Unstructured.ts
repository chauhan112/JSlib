import { GenericForm, Params } from "../Form";
export const ActivityLoggerUnstructured = () => {
    const form = GenericForm();
    let comps: any[] = [
        Params.textArea("did", {
            class: "w-full p-2 rounded-md bg-gray-100 text-black flex-1",
            placeholder: "did",
        }),
        Params.textArea("next", {
            class: "w-full p-2 rounded-md bg-gray-100 text-black flex-1",
            placeholder: "next",
        }),
        Params.inpSubmit(),
    ];
    form.s.handlers.setComponents(comps);
    return form;
};

export const ActivityLoggerController = () => {
    let comp = ActivityLoggerUnstructured();

    return { comp };
};
