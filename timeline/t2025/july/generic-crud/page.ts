//  npm install lucide
import {
    ChevronLeft,
    ChevronRight,
    Cog,
    EllipsisVertical,
    Plus,
    Search,
} from "lucide";

import { Tools } from "../../../globalComps/tools";
import { GlobalStates } from "../../../globalComps/GlobalStates";
import { StructureSection } from "../../june/domain-ops/ActivityLogger/Structures";
import { type MultiLayerModalStructure } from "../../../globalComps/GlobalStates/multiLayerModal";
import { FormModel, type ModelType, GenericCRUDModel } from "./model";
import { DynamicFormController } from "../../july/DynamicForm";
import { SearchCtrl } from "./search/controller";

export const GenericCRUD = () => {
    const searchIcon = Tools.icon(Search, {
        class: "w-6 h-6 text-gray-500 hover:rotate-90 duration-300 ease-in-out hover:scale-110 transform cursor-pointer",
    });
    const plusIcon = Tools.icon(Plus, {
        class: "w-6 h-6 text-gray-500 hover:rotate-90 duration-300 ease-in-out hover:scale-110 transform cursor-pointer",
    });
    const formIcon = Tools.icon(Cog, {
        class: "w-6 h-6 text-gray-500 hover:rotate-90 duration-300 ease-in-out hover:scale-110 transform cursor-pointer",
    });
    const ops = Tools.div({
        class: "absolute left-0 top-0 flex flex-col gap-2 z-10",
        children: [
            Tools.div({
                key: "inner",
                class: "flex gap-2 items-center justify-between p-2",
                children: [searchIcon, plusIcon, formIcon],
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
            searchIcon,
            plusIcon,
            lister,
            formIcon,
        }
    );
};
export const PaginationCtrl = (pageSize?: number) => {
    const states: any = {
        comp: null,
        pageSize: pageSize ?? 20,
        data: [],
        currentPage: 1,
    };
    const nextPage = () => {
        if (states.currentPage < states.maxPage) states.currentPage++;
        return getCurrentPageData();
    };
    const prevPage = () => {
        if (states.currentPage > 1) states.currentPage--;
        return getCurrentPageData();
    };
    const getCurrentPageData = () => {
        return states.data.slice(
            (states.currentPage - 1) * states.pageSize,
            states.currentPage * states.pageSize
        );
    };
    const goToPage = (page: number) => {
        states.currentPage = page;
        return getCurrentPageData();
    };
    const getMaxPage = () => {
        return Math.ceil(states.data.length / states.pageSize);
    };

    const setData = (
        data: { title: string; id: string; [key: string]: any }[]
    ) => {
        states.data = data;
        states.currentPage = 1;
        states.maxPage = getMaxPage();
        update();
    };
    const setPageSize = (size: number) => {
        states.pageSize = size;
        states.currentPage = 1;
        states.maxPage = getMaxPage();
    };
    const render = (data: any[]) => {};
    const update = () => {
        let pageInfo = states.comp.s.page;
        states.render(getCurrentPageData());
        pageInfo.update({
            textContent: `${states.currentPage}/${states.maxPage}`,
        });
        if (states.maxPage <= 1)
            states.comp.getElement().classList.add("hidden");
        else states.comp.getElement().classList.remove("hidden");
    };
    states.render = render;
    const setup = () => {
        let next = states.comp.s.next;
        let prev = states.comp.s.prev;

        next.update(
            {},
            {
                click: (e: any) => {
                    e.preventDefault();
                    nextPage();
                    update();
                },
            }
        );
        prev.update(
            {},
            {
                click: (e: any) => {
                    e.preventDefault();
                    prevPage();
                    update();
                },
            }
        );
    };

    return {
        states,
        nextPage,
        prevPage,
        goToPage,
        setData,
        setPageSize,
        setup,
        getCurrentPageData,
        render,
    };
};
export const StructureSectionCtrl = (model: ModelType) => {
    const states: any = { comp: null };
    let modal: MultiLayerModalStructure =
        GlobalStates.getInstance().getState("multiModal");
    const renderAll = () => {
        model.readAll().then((res: any) => {
            states.structures = res;
            states.comp.s.setInfos(states.structures);
        });
    };
    const onDelete = (id: string) => {
        if (!confirm("Are you sure?")) return;
        model.delete(id).then(() => renderAll());
    };
    const onEdit = (id: string) => {
        let val = states.structures.find((x: any) => x.id == id);
        let sf = states.comp.s.form;
        modal.addLayer(sf, "Update Structure: " + id);
        states.comp.s.form.s.handlers.submit = onEditSubmit;
        sf.s.handlers.setValues(val);
        sf.update({}, {}, { data: val });
    };
    const onEditSubmit = (e: any, ls: any) => {
        e.preventDefault();
        let prevVal = ls.s.data;
        let newVal = ls.s.handlers.getValues();
        model.update(prevVal.id, newVal).then(() => {
            modal.closeLayer();
            renderAll();
        });
    };
    const onActions = (e: any, ls: any) => {
        let opType = ls.s.data.type;
        if (opType == "delete") {
            onDelete(ls.s.id);
        } else if (opType == "edit") {
            onEdit(ls.s.id);
        }
    };
    const onCreate = (e: any, ls: any) => {
        let form = states.comp.s.form;
        e.preventDefault();
        let vals = form.s.handlers.getValues();
        let valsCopy = { ...vals, order: parseInt(vals.order) };
        form.s.handlers.clearValues();
        model.create(valsCopy).then(() => {
            modal.closeLayer();
            renderAll();
        });
    };
    const onPlusClicked = (e: any, ls: any) => {
        modal.addLayer(states.comp.s.form, "Create Structure");
        states.comp.s.form.s.handlers.submit = onCreate;
        states.comp.s.form.s.handlers.clearValues();
    };
    const setup = () => {
        states.comp.s.table.s.handlers.onOpsClicked = onActions;
    };
    return {
        states,
        renderAll,
        onCreate,
        onActions,
        onEdit,
        onDelete,
        onPlusClicked,
        setup,
    };
};
export const FormStructureCtrl = () => {
    let section = StructureSection();
    section.s.body.getElement().classList.remove("text-white");
    section.s.table.s.dataSection.getElement().classList.remove("text-white");
    const plusBtn = Tools.icon(Plus, {
        class: "w-6 h-6 text-gray-500 hover:rotate-90 duration-300 ease-in-out hover:scale-110 transform cursor-pointer",
    });
    let model = FormModel();
    const sectCtrl = StructureSectionCtrl(model.funcs);
    const setStructures = async (
        data: { key: string; order: number; type: string }[]
    ) => {
        await model.funcs.deleteAll();

        for (let d of data) {
            await model.funcs.create(d);
        }
        sectCtrl.renderAll();
    };
    sectCtrl.states.comp = section;
    sectCtrl.setup();
    let comp = Tools.div({
        class: "flex flex-col gap-2 w-full",
        children: [plusBtn, section.s.table],
    });
    const onOpen = (e: any, ls: any) => {
        let modal = GlobalStates.getInstance().getState("multiModal");
        modal.addLayer(comp, "Structure");
    };

    plusBtn.update(
        {},
        {
            click: sectCtrl.onPlusClicked,
        }
    );
    return {
        comp,
        sectCtrl,
        plusBtn,
        setStructures,
        onOpen,
        model,
    };
};
export const DataCrudCtrl = () => {
    const states: any = {
        formLoaded: false,
        fields: [],
        refresh: () => {},
        model: new GenericCRUDModel(),
        onCreateSubmit: () => {},
    };
    const textArea = Tools.comp("textarea", {
        placeholder: "content goes here",
        class: "h-64 w-full border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
        disabled: true,
    });

    const dataFormCtrl = DynamicFormController();
    const onPlusClicked = async (e: any, ls: any) => {
        let modal = GlobalStates.getInstance().getState("modal");
        renderForm();
        modal.s.handlers.display(dataFormCtrl.comp);
        modal.s.handlers.show();
        modal.s.modalTitle.update({ textContent: "Create" });
        dataFormCtrl.comp.s.handlers.submit = states.onCreateSubmit;
        dataFormCtrl.comp.s.handlers.clearValues();
    };
    const renderForm = () => {
        if (!states.formLoaded) {
            dataFormCtrl.setFields(states.fields);
            states.formLoaded = true;
        }
    };
    const onCreateSubmit = (e: any, ls: any) => {
        e.preventDefault();
        let vals = dataFormCtrl.comp.s.handlers.getValues();
        states.model.create(vals).then(() => {
            states.refresh();
            let modal = GlobalStates.getInstance().getState("modal");
            modal.s.handlers.hide();
        });
    };
    states.onCreateSubmit = onCreateSubmit;
    const onEditSubmit = (e: any, ls: any) => {
        e.preventDefault();
        let prevVal = dataFormCtrl.comp.s.data;
        let curVal = dataFormCtrl.comp.s.handlers.getValues();
        states.model.update(prevVal.id, curVal).then(() => {
            states.refresh();
            let modal = GlobalStates.getInstance().getState("modal");
            modal.s.handlers.hide();
        });
    };
    const onEdit = (e: any, ls: any) => {
        let info = ls.s.data.info;
        let modal = GlobalStates.getInstance().getState("modal");
        modal.s.handlers.display(dataFormCtrl.comp);
        modal.s.handlers.show();
        renderForm();
        modal.s.modalTitle.update({ textContent: "Update" });
        dataFormCtrl.comp.s.handlers.setValues(info);
        dataFormCtrl.comp.s.handlers.submit = onEditSubmit;
        dataFormCtrl.comp.update({}, {}, { data: info });
    };
    const onDelete = (e: any, ls: any) => {
        if (!confirm("Are you sure?")) return;
        states.model.delete(ls.s.data.info.id).then(() => {
            states.refresh();
        });
    };
    const onView = (e: any, ls: any) => {
        let info = ls.s.data.info;
        let modal = GlobalStates.getInstance().getState("modal");
        modal.s.handlers.display(textArea);
        modal.s.handlers.show();
        (textArea.getElement() as HTMLTextAreaElement).value = JSON.stringify(
            info,
            null,
            2
        );
        modal.s.modalTitle.update({ textContent: "Content View" });
    };
    const getOptions = (ls: any) => {
        let options = [
            {
                label: "Edit",
                info: ls.s.data,
                onClick: onEdit,
            },
            {
                label: "Delete",
                info: ls.s.data,
                onClick: onDelete,
            },
            {
                label: "View",
                info: ls.s.data,
                onClick: onView,
            },
        ];
        return options;
    };
    states.getOptions = getOptions;
    const onOpsClicked = (e: any, ls: any) => {
        let cm = GlobalStates.getInstance().getState("contextMenu");
        let options = states.getOptions(ls);
        cm.s.setOptions(options);
        cm.s.displayMenu(e, ls);
    };
    states.onDataClicked = onOpsClicked;
    return {
        onPlusClicked,
        dataFormCtrl,
        states,
        renderForm,
        model: states.model,
        textArea,
    };
};
export const GenericCRUDCtrl = () => {
    const comp = GenericCRUD();
    const dataCrudCtrl = DataCrudCtrl();
    const paginationCtrl = PaginationCtrl(10);
    const formCtrl = FormStructureCtrl();
    const searchCtrl = SearchCtrl();
    const funcs: any = {};
    funcs.onSearchClicked = (e: any, ls: any) => {
        let modal = GlobalStates.getInstance().getState("modal");
        modal.s.handlers.display(searchCtrl.filterCtrl.comp);
        modal.s.handlers.show();
        modal.s.modalTitle.update({ textContent: "Search" });
    };
    funcs.getCardComp = (x: any) =>
        CardComp(x.title, x, dataCrudCtrl.states.onDataClicked);
    funcs.onRender = (data: any[]) => {
        comp.s.lister.s.comp.update({
            innerHTML: "",
            children: data.map((x: any) => {
                return funcs.getCardComp(x);
            }),
        });
    };
    const states: any = {
        data: [],
    };
    dataCrudCtrl.states.refresh = async () => {
        let data = await dataCrudCtrl.states.model.readAll()
        
        funcs.setData(data);
    };

    formCtrl.model.states.onChange = () => {
        formCtrl.model.onChange();
        dataCrudCtrl.states.formLoaded = false;
        formCtrl.model.funcs.readAll().then((data) => {
            dataCrudCtrl.states.fields = data;
        });
    };
    paginationCtrl.states.render = funcs.onRender;
    funcs.setData = (
        data: { title: string; id: string; [key: string]: any }[]
    ) => {
        states.data = data;
        searchCtrl.states.getData = () => states.data;
        searchCtrl.states.setResult = (res: any) => {
            console.log("tempo", res);
            paginationCtrl.setData(res);
        };
        searchCtrl.states.setResult(states.data);
    };
    funcs.setup = async () => {
        comp.s.plusIcon.update(
            {},
            {
                click: dataCrudCtrl.onPlusClicked,
            }
        );
        comp.s.searchIcon.update(
            {},
            {
                click: (e: any, ls: any) => funcs.onSearchClicked(e, ls),
            }
        );
        comp.s.formIcon.update(
            {},
            {
                click: formCtrl.onOpen,
            }
        );
        paginationCtrl.states.comp = comp.s.lister.s.pagination;
        paginationCtrl.setup();
        dataCrudCtrl.model.readAll().then(funcs.setData);
        await formCtrl.setStructures([
            {
                key: "title",
                type: "input",
                order: 0,
            },
        ]);
        searchCtrl.setup();
    };

    return {
        comp,
        states,
        dataCrudCtrl,
        paginationCtrl,
        formCtrl,
        searchCtrl,
        funcs,
    };
};
export const Lister = () => {
    let comp = Tools.div({
        class: "grid grid-flow-row auto-rows-auto gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        children: [CardComp(), CardComp(), CardComp(), CardComp(), CardComp()],
    });
    let pagination = Pagination();

    return Tools.div(
        {
            class: "flex flex-col flex-1 overflow-y-auto gap-4",
            children: [pagination, comp],
        },
        {},
        { pagination, comp }
    );
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
export const CardComp = (
    title: string = "Title",
    data: any = {},
    onOpsClicked?: (e: any, ls: any) => void
) => {
    let titleComp = Tools.comp("div", { textContent: "Title" });
    let opsComp = Tools.comp("div", {
        class: "flex gap-2",
        children: [
            Tools.icon(
                EllipsisVertical,
                {
                    key: "edit",
                    class: "w-6 h-6 text-gray-500 hover:scale-110 transform cursor-pointer",
                },
                {
                    click: (e: any, ls: any) => {
                        onOpsClicked?.(e, ls);
                    },
                },
                {
                    type: "edit",
                }
            ),
        ],
    });
    let comp = Tools.comp(
        "div",
        {
            class: "bg-gray-100 p-5 rounded-lg text-center shadow-md flex  justify-between",
            children: [titleComp, opsComp],
        },
        {},
        { titleComp, opsComp }
    );
    const setTitle = (title: string) => {
        titleComp.update({ textContent: title });
    };
    const setData = (data: any) => {
        opsComp.s.edit.update({}, {}, { data });
        comp.update({}, {}, { data });
    };
    setTitle(title);
    setData(data);

    comp.update({}, {}, { setTitle, setData });
    return comp;
};
