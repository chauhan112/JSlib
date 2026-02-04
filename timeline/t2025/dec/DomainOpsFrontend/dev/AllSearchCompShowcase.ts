import { Tools } from "../../../../globalComps/tools";
import { SimpleSearchUI2, SimpleSearchUI} from "../../../july/generic-crud/search/ui";
import { SimpleSearchComp } from "../../../aug/jobAIApply/page";
import {SearchComp as SearchComp2} from "../../../june/domain-ops/Component";
import {FilterUI} from "../../../july/generic-crud/search/ui";
import { MainCtrl as AtomicMainCtrl } from "../components/atomic";

export const AllSearchComp = () => {
    const searchCompCtrl = AtomicMainCtrl.dropdown([
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