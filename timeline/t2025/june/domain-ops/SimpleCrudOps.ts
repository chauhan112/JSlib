import { Tools } from "../../../globalComps/tools";
import { GComponent } from "../../../globalComps/GComponent";
import { NavChild } from "./Component";
export const SmallCRUDops = (ops: any[], form: GComponent) => {
    form.getElement().classList.add("hidden");

    const onMainBodyClick = (e: any, ls: any) => {};
    const onMenuOptionClick = (e: any, ls: any) => {};
    let state = {
        onMainBodyClick,
        onMenuOptionClick,
    };
    const getNavItem = (item: any) => {
        return NavChild({
            ...item,
            onMainBodyClick: (e: any, ls: any) => {
                state.onMainBodyClick(e, ls);
            },
            onMenuOptionClick: (e: any, ls: any) => {
                state.onMenuOptionClick(e, ls);
            },
        });
    };
    const navItem = Tools.div({
        class: "w-full flex flex-col items-center px-2 gap-2",
        key: "navItems",
        children: ops.map(getNavItem),
    });
    const updateNavItems = (items: any[]) => {
        navItem.update({
            innerHTML: "",
            children: items.map(getNavItem),
        });
    };
    return Tools.div(
        {
            class: "w-full",
            children: [
                Tools.comp("button", {
                    key: "createBtn",
                    textContent: "+ create new",
                    class: "text-2xl w-full flex items-center justify-center py-4 hover:border cursor-pointer",
                }),
                form,
                navItem,
            ],
        },
        {},
        { updateNavItems, state }
    );
};
