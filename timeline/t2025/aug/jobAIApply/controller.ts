import { Page, JobAddForm, JobCard, ShowJobDetails } from "./page";
import { Tools } from "../../april/tools";
import { GlobalStates } from "../../june/domain-ops/GlobalStates";
import { Model, ModelType } from "./model";
import { GenericCRUDCtrl } from "../../july/generic-crud/page";

export const JobCRUDWrapper = () => {
    let states: any = {};

    const create = async (vals: any) => {
        let model: ModelType = states.model;
        await model.addJob(vals.title, vals.description, vals.url);
    };
    const read = async (id: any) => {
        let model: ModelType = states.model;
        return await model.readJob(id);
    };
    const update = async (id: string, vals: any) => {
        let model: ModelType = states.model;
        await model.updateJob(id, vals);
    };
    const deleteIt = async (id: any) => {
        let model: ModelType = states.model;
        await model.deleteJob(id);
    };
    const readAll = async () => {
        let model: ModelType = states.model;
        return await model.readAllJobs();
    };
    return { states, create, read, update, delete: deleteIt, readAll };
};

export const PageCtrl = () => {
    let comp = Page();
    let addForm = JobAddForm();
    let model = Model();
    let jobDetails = ShowJobDetails();
    let crudCtrl = GenericCRUDCtrl();
    let jobCCrudModel = JobCRUDWrapper();
    const onJobFormSubmit = (e: any, ls: any) => {
        e.preventDefault();
        let vals = addForm.s.get_values();
        model.addJob(vals.title, vals.description, vals.url).then(() => {
            (addForm.getElement() as HTMLFormElement).reset();
            let modal = GlobalStates.getInstance().getState("compactModal");
            modal.hide();
            onJobListRender();
        });
    };

    const states: any = {
        formStruc: [
            {
                type: "input",
                key: "title",
                order: 2,
                params: {
                    required: true,
                    placeholder: "Job Title",
                },
            },
            {
                type: "largeText",
                key: "description",
                order: 4,
                params: {
                    required: true,
                    placeholder: "Job Description",
                },
            },
            {
                oder: 6,
                type: "input",
                key: "link",
                params: {
                    placeholder: "Link to the job",
                },

                order: 6,
            },
        ],
    };
    const onJobAdd = (e: any, ls: any) => {
        states.prevOnPlusClick(e, ls);
        let modal = GlobalStates.getInstance().getState("modal");
        modal.s.modalTitle.update({ textContent: "Add New Job" });
    };
    const onJobShow = (e: any, ls: any) => {
        let job = ls.s.job;
        let modal = GlobalStates.getInstance().getState("multiModal");
        modal.addLayer(jobDetails, job.title);
        jobDetails.s.setJob(job);
    };
    const onJobDelete = (e: any, ls: any) => {
        e.stopPropagation();
        let job = ls.s.job;
        if (confirm(`Delete ${job.title}?`))
            model.deleteJob(job.id).then(onJobListRender);
    };
    const onJobListRender = async () => {
        let jobs = await jobCCrudModel.readAll();
        crudCtrl.funcs.setData(jobs);
    };
    const mergeTheLayout = () => {
        crudCtrl.comp.s.ops
            .getElement()
            .classList.remove(
                "absolute",
                "top-0",
                "left-0",
                "z-10",
                "flex-col"
            );
        crudCtrl.comp.getElement().classList.remove("h-screen");
        crudCtrl.comp.s.ops
            .getElement()
            .classList.add(
                "items-center",
                "justify-between",
                "py-2",
                "text-xl"
            );
        crudCtrl.comp.s.ops.s.inner.update({
            innerHTML: "",
            children: [crudCtrl.comp.s.searchIcon, crudCtrl.comp.s.plusIcon],
        });
        crudCtrl.comp.s.ops.update({
            innerHTML: "",
            children: [
                Tools.div({
                    child: crudCtrl.comp.s.lister.s.pagination,
                }),
                crudCtrl.comp.s.ops.s.inner,
            ],
        });
        crudCtrl.comp.s.ops.s.inner
            .getElement()
            .classList.remove("justify-between");
        crudCtrl.comp.s.ops.s.inner.getElement().classList.add("w-fit");
        crudCtrl.comp.s.lister.update({
            innerHTML: "",
            child: crudCtrl.comp.s.lister.s.comp,
        });
    };

    const getCardComp = (x: any) => {
        let jc = states.previourCardComp(x);
        jc.update({}, { click: onJobShow }, { job: x });
        jc.getElement().classList.add(
            "hover-lift",
            "border",
            "p-6",
            "cursor-pointer",
            "shadow-md"
        );
        jc.getElement().classList.remove("bg-gray-100", "p-5");
        return jc;
    };

    const onSetup = async () => {
        addForm.s.submitBtn.update({}, { click: onJobFormSubmit });
        await crudCtrl.funcs.setup();
        mergeTheLayout();
        crudCtrl.paginationCtrl.setPageSize(100);
        states.previourCardComp = crudCtrl.funcs.getCardComp;
        states.prevOnPlusClick = crudCtrl.dataCrudCtrl.onPlusClicked;
        crudCtrl.comp.s.plusIcon.update(
            {},
            {
                click: onJobAdd,
            }
        );
        crudCtrl.funcs.getCardComp = getCardComp;
        let formCtrl = crudCtrl.formCtrl;
        formCtrl.model.states.onChange = () => {};
        crudCtrl.dataCrudCtrl.states.fields = states.formStruc;
        comp.s.main.update({ innerHTML: "", child: crudCtrl.comp });
        crudCtrl.dataCrudCtrl.states.model = jobCCrudModel;
        jobCCrudModel.states.model = model;
        onJobListRender();
    };
    onSetup();

    return { comp, handlers: { onJobListRender, onSetup }, comps: { addForm } };
};
