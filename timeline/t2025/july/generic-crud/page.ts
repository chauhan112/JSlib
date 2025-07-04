import { ChevronLeft, ChevronRight, Plus, Search } from "lucide";
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
                class: "flex gap-2 items-center justify-between p-2",
                children: [searchIcon, plusIcon],
            }),
        ],
    });
    const lister = Lister();
    return Tools.div(
        {
            class: "h-screen flex flex-col",
            children: [ops, lister],
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
export const Lister = () => {
    let comp = Tools.div({
        class: "grid grid-flow-row auto-rows-auto gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        children: [CardComp(), CardComp(), CardComp(), CardComp(), CardComp()],
    });
    let pagination = Pagination();

    return Tools.div({
        class: "flex flex-col flex-1 overflow-y-auto gap-4",
        children: [pagination, comp],
    });
};
export const Pagination = () => {
    return Tools.comp("div", {
        class: "flex justify-center items-center space-x-4",
        children: [
            Tools.comp("button", {
                key: "prev",
                class: "text-gray-600 hover:text-gray-900 cursor-pointer",
                children: [Tools.icon(ChevronLeft, { class: "w-6 h-6" })],
            }),
            Tools.comp("div", {
                key: "page",
                class: "flex space-x-2",
                textContent: "1/10",
            }),
            Tools.comp("button", {
                key: "next",
                class: "text-gray-600 hover:text-gray-900 cursor-pointer",
                children: [Tools.icon(ChevronRight, { class: "w-6 h-6" })],
            }),
        ],
    });
};
export const CardComp = () => {
    return Tools.comp("div", {
        class: "bg-gray-100 p-5 rounded-lg text-center shadow-md",
        textContent: "Comp",
    });
};
