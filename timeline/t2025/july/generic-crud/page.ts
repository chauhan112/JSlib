import { Plus, Search } from "lucide";
import { Tools } from "../../april/tools";
import { GlobalStates } from "../../june/domain-ops/GlobalStates";
export const SearchSystem = () => {
    return Tools.comp("form", {
        class: "flex w-full",
        children: [
            Tools.comp("input", {
                class: "bg-gray-200 py-2 px-4 focus:outline-none flex-1",
                name: "search",
                placeholder: "Search...",
            }),
            Tools.comp("button", {
                class: "bg-blue-500  py-2 px-4 focus:outline-none",
                type: "submit",
                textContent: "Search",
            }),
        ],
    });
};

export const GenericCRUD = () => {
    const searchSystem = SearchSystem();
    const searchIcon = Tools.icon(Search, {
        class: "w-6 h-6 text-gray-500 hover:rotate-90 duration-300 ease-in-out hover:scale-110 transform cursor-pointer",
    });
    const plusIcon = Tools.icon(Plus, {
        class: "w-6 h-6 text-gray-500 hover:rotate-90 duration-300 ease-in-out hover:scale-110 transform cursor-pointer",
    });
    const ops = Tools.div({
        class: "absolute left-0 top-0 flex flex-col gap-2 z-10",
        children: [
            Tools.div({
                class: "flex flex-col gap-2 items-center justify-between p-2",
                children: [searchIcon, plusIcon],
            }),
        ],
    });
    return Tools.div(
        {
            class: "h-screen flex",
            children: [ops],
        },
        {},
        {
            ops,
            searchSystem,
            searchIcon,
            plusIcon,
        }
    );
};

export const GenericCRUDCtrl = () => {
    const comp = GenericCRUD();
    const onPlusClicked = (e: any, ls: any) => {};

    const onSearchClicked = (e: any, ls: any) => {
        let modal = GlobalStates.getInstance().getState("modal");
        modal.s.handlers.display(comp.s.searchSystem);
        modal.s.handlers.show();
        modal.s.modalTitle.update({ textContent: "Search" });
    };
    const setup = () => {
        comp.s.plusIcon.update(
            {},
            {
                click: onPlusClicked,
            }
        );
        comp.s.searchIcon.update(
            {},
            {
                click: onSearchClicked,
            }
        );
    };
    return {
        comp,
        funcs: { onPlusClicked, onSearchClicked, setup },
    };
};

export const Lister = () => {};

export const CardComp = (x: any) => {};
