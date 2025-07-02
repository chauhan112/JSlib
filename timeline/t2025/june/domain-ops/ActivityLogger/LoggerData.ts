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
    six_cols: {
        class: "grid grid-cols-6 gap-4",
    },
    did_next_cols_header: {
        class: "grid grid-cols-[40px_2fr_2fr_1fr_1fr_100px] gap-4 px-4 py-2 bg-[#6D5E4B] text-white rounded-t-md font-medium text-sm sticky top-0 mt-6",
    },
    did_next_cols_data: {
        class: "grid grid-cols-[40px_2fr_2fr_1fr_1fr_100px] gap-4 px-4 py-3 items-center border-b border-[#E7DAB8]/70 text-sm text-gray-700 last:border-b-0",
    },
    action: {
        class: "hover:cursor-pointer hover:scale-110 transition-all duration-300",
    },
    actionWrapper: {
        class: "flex justify-end space-x-3 text-[#4A8C71]",
    },
};

export const Controller = (root: any) => {
    const comp = Unstructured();
    const onPlusClicked = (e: any, ls: any) => {
        let modal = GlobalStates.getInstance().getState("modal");
        modal.s.handlers.display(comp);
        modal.s.handlers.show();
    };
    console.log(root);
    const renderAll = () => {};
    const onEdit = (id: string) => {};
    const onView = (id: string) => {};
    const onDelete = (id: string) => {};
    const onEditSubmit = (e: any, ls: any) => {};

    return { comp, onPlusClicked };
};
