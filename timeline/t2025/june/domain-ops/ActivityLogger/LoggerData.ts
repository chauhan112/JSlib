import { GenericForm, Params } from "../Form";
import { GlobalStates } from "../GlobalStates";
// import { Tools } from "../../../april/tools";
// import { IconNode, Pencil, Trash, Eye } from "lucide";
export const Unstructured = () => {
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

export const ColsSizes = {
    six_cols: "grid grid-cols-6 gap-4",
};

export const Controller = (root: any) => {
    const comp = Unstructured();
    const onPlusClicked = (e: any, ls: any) => {
        let modal = GlobalStates.getInstance().getState("modal");
        modal.s.handlers.display(comp);
        modal.s.handlers.show();
    };

    const renderAll = () => {};
    const onEdit = (id: string) => {};
    const onView = (id: string) => {};
    const onDelete = (id: string) => {};
    const onEditSubmit = (e: any, ls: any) => {};

    return { comp, onPlusClicked };
};
