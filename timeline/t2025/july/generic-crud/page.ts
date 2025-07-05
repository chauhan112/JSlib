//  npm install lucide
import { ChevronLeft, ChevronRight, Cog, Plus, Search } from "lucide";
import { Tools } from "../../april/tools";
import { GlobalStates } from "../../june/domain-ops/GlobalStates";
import { StructureSection } from "../../june/domain-ops/ActivityLogger/Structures";
import { MultiLayerModel } from "./multiLayerModal";
import { FormModel, ModelType } from "./model";
import { DynamicFormController } from "../../july/DynamicForm";

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
    const formIcon = Tools.icon(Cog, {
        class: "w-6 h-6 text-gray-500 hover:rotate-90 duration-300 ease-in-out hover:scale-110 transform cursor-pointer",
    });
    const ops = Tools.div({
        class: "absolute left-0 top-0 flex flex-col gap-2 z-10",
        children: [
            Tools.div({
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
            searchSystem,
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
        if (states.maxPage == 1)
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
    let modal: MultiLayerModel =
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
export const GenericCRUDCtrl = () => {
    const comp = GenericCRUD();
    const dataFormCtrl = DynamicFormController();
    const onPlusClicked = async (e: any, ls: any) => {
        let modal = GlobalStates.getInstance().getState("modal");
        if (!states.formLoaded) {
            dataFormCtrl.setFields(await formCtrl.model.funcs.readAll());
            states.formLoaded = true;
        }
        modal.s.handlers.display(dataFormCtrl.comp);
        modal.s.handlers.show();
        modal.s.modalTitle.update({ textContent: "Create" });
    };
    const states = {
        formLoaded: false,
    };
    const paginationCtrl = PaginationCtrl(100);
    const formCtrl = FormStructureCtrl();
    const onSearchClicked = (e: any, ls: any) => {
        let modal = GlobalStates.getInstance().getState("modal");

        modal.s.handlers.display(comp.s.searchSystem);
        modal.s.handlers.show();
        modal.s.modalTitle.update({ textContent: "Search" });
    };
    const onRender = (data: any[]) => {
        comp.s.lister.s.comp.update({
            innerHTML: "",
            children: data.map((x: any) => {
                let c = CardComp();
                c.update({ textContent: x.title }, {}, { data: x });
                return c;
            }),
        });
    };
    formCtrl.setStructures([
        {
            key: "title",
            type: "input",
            order: 0,
        },
    ]);

    formCtrl.model.states.onChange = () => {
        formCtrl.model.onChange();
        states.formLoaded = false;
    };
    paginationCtrl.states.render = onRender;
    const setData = (
        data: { title: string; id: string; [key: string]: any }[]
    ) => {
        paginationCtrl.setData(data);
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
        comp.s.formIcon.update(
            {},
            {
                click: formCtrl.onOpen,
            }
        );
        const dummyData: any = [];
        for (let i = 0; i < 100; i++) {
            dummyData.push({ title: `Item ${i + 1}`, id: `id-${i + 1}` });
        }
        paginationCtrl.states.comp = comp.s.lister.s.pagination;
        paginationCtrl.setup();
        setData(dummyData);
    };

    comp.s.plusIcon.update(
        {},
        {
            click: onPlusClicked,
        }
    );
    return {
        comp,
        funcs: { onPlusClicked, onSearchClicked, setup, setData, onRender },
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
export const CardComp = () => {
    return Tools.comp("div", {
        class: "bg-gray-100 p-5 rounded-lg text-center shadow-md",
        textContent: "Comp",
    });
};
