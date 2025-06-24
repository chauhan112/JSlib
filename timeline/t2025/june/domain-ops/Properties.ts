import { Tools } from "../../april/tools";
import { SmallCRUDops } from "./SimpleCrudOps";
import {
    Test,
    AttributeForm,
    PropertySection,
} from "../../april/DomainOps/PropertySection";
import { Plus } from "lucide";
import { GlobalStates } from "./GlobalStates";
export const CreateForm = () => {};

export const Properties = () => {
    const props = new PropertySection();
    props.getElement();
    const header = Header();
    const table = Tools.container({
        class: "p-2 w-full text-white",
        child: Test.table(),
    });
    const form = new AttributeForm();
    form.getElement();
    let comp = Tools.div(
        {
            class: "flex flex-col items-center w-fit bg-[#1ABC9C] h-full",
            children: [header, table],
        },
        {},
        { header, table, form }
    );
    form.s.comps.closeBtn.getElement().classList.add("hidden");

    header.s.plus.update(
        {},
        {
            click: (e: any, ls: any) => {
                let modal = GlobalStates.getInstance().getState("modal");
                modal.s.modalTitle.update({ textContent: "Create Attribute" });
                modal.s.handlers.display(form);
                modal.s.handlers.show();
            },
        }
    );

    return comp;
};

const Header = () => {
    return Tools.div({
        class: "flex bg-slate-700 gap-2 font-bold items-center w-80  border-white border-b",
        children: [
            Tools.div({
                class: "bg-slate-700 py-2 text-xl font-bold w-full text-center text-white",
                textContent: "Properties",
            }),
            Tools.icon(Plus, {
                key: "plus",
                class: " text-white hover:text-gray-300 cursor-pointer w-8 h-8 mr-2",
            }),
        ],
    });
};
