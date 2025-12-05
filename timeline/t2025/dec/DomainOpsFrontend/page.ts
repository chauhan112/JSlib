import { Tools } from "../../april/tools";
import { MainCtrl as SearchComponentMainCtrl } from "./SearchComponent";
import { ListDisplayer } from "./ListDisplayer";
export const Page = () => {
    const searchComponentCtrl = SearchComponentMainCtrl.searchComponent(
        (e: any, ls: any) => {
            console.log(e, ls);
        },
        (e: any, ls: any) => {
            console.log(e, ls);
        },
        (e: any, ls: any) => {
            let values = searchComponentCtrl.get_values();
            console.log(values);
        }
    );
    searchComponentCtrl.comp.getElement().classList.remove("p-4");
    const listDisplayer = ListDisplayer();
    
    return Tools.div({
        class: "w-full flex-col flex gap-2 p-2 ",
        children: [searchComponentCtrl.comp, listDisplayer],
    });
};