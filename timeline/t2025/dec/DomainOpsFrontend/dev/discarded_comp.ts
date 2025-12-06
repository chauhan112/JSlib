import { Tools } from "../../../april/tools";
import { FormSelectCompCtrl, FormTextareaCtrl } from "../../../aug/jobAIApply/simpleVersion";
import { GenericCRUD } from "../../../july/generic-crud/page";
import { CollectionForm } from "../../../aug/LinksOpener/Page";

export const OpsSection = () => {
    const searchComp = FormSelectCompCtrl("dom op activities");
    const options = [
        { value: "domain", label: "Domain" },
        { value: "operation", label: "Operation" },
        {
            value: "activity", label: "Activity"
        }
    ];
    searchComp.setOptions(options);
    searchComp.setLabel("Domain Ops Activities");
    const nameComp = FormTextareaCtrl("name", "Name", "Enter a name for the domain, operation, or activity");
    return Tools.div({
        class: "w-full flex flex-col gap-2 p-2",
        children: [
            searchComp.comp,
            nameComp.comp,
        ]
    });
}

export const SimpleLayout = () => {
    const opsSection = GenericCRUD();
    const collectionForm = CollectionForm();
    return Tools.div({
        class: "w-full flex gap-2 p-2",
        children: [
            opsSection,
            collectionForm,
        ]
    });
};
