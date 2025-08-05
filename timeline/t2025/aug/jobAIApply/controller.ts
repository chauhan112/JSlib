import { Page, JobAddForm, JobCard, ShowJobDetails } from "./page";
import { GlobalStates } from "../../june/domain-ops/GlobalStates";
import { Model } from "./model";
export const PageCtrl = () => {
    let comp = Page();
    let addForm = JobAddForm();
    let model = Model();
    let jobDetails = ShowJobDetails();
    const onJobFormSubmit = (e: any, ls: any) => {
        e.preventDefault();
        let vals = addForm.s.get_values();
        model.addJob(vals.title, vals.description, vals.url).then(() => {
            (addForm.getElement() as HTMLFormElement).reset();
            let modal = GlobalStates.getInstance().getState("compactModal");
            modal.hide();
        });
        onJobListRender();
    };
    const onJobAdd = (e: any, ls: any) => {
        let modal = GlobalStates.getInstance().getState("compactModal");
        modal.setTitle("Add New Job");
        modal.display(addForm);
        modal.show();
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
        let jobs = await model.readAllJobs();
        comp.s.jobList.update({
            innerHTML: "",
            children: jobs.map((job: any) => {
                let jc = JobCard(job);
                jc.update({}, { click: onJobShow }, { job });
                jc.s.deleteIcon.update({}, { click: onJobDelete }, { job });
                return jc;
            }),
        });
    };
    const onSetup = () => {
        comp.s.searchTools.s.addBtn.update({}, { click: onJobAdd });
        addForm.s.submitBtn.update({}, { click: onJobFormSubmit });
        onJobListRender();
    };
    onSetup();

    return { comp, handlers: { onJobListRender, onSetup }, comps: { addForm } };
};
