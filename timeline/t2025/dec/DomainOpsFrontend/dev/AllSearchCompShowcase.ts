import { Tools } from "../../../april/tools";
import { SimpleSearchUI2, SimpleSearchUI} from "../../../july/generic-crud/search/ui";
import { SimpleSearchComp } from "../../../aug/jobAIApply/page";
import {SearchComp as SearchComp2} from "../../../june/domain-ops/Component";
import {FilterUI} from "../../../july/generic-crud/search/ui";
import { Dropdown, DropdownCtrl } from "../components/atomic";

export class MainCtrl {
    static dropdown(options: { value: string; label: string }[]) {
        const dropdown = new DropdownCtrl();
        dropdown.set_comp(Dropdown(options));
        return dropdown;
    }
}

export const AllSearchComp = () => {
    const searchCompCtrl = MainCtrl.dropdown([
        { value: "domain", label: "Domain" },
        { value: "operation", label: "Operation" },
        {
            value: "activity", label: "Activity"
        }
    ]);

    let row = Tools.div({
        class: "w-full flex-row flex gap-2 p-2",
        children: [SimpleSearchComp(), searchCompCtrl.comp],
    });
    return Tools.div({
        class: "w-full flex-col flex gap-2 p-2 ",
        children: [row,   FilterUI(), SimpleSearchUI(), SimpleSearchUI2(), SearchComp2()],
    });
};