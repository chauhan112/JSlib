import { GlobalStates } from "../../../../globalComps/GlobalStates";
import { Tools } from "../../../../globalComps/tools";
import { ListDisplayerCtrl, MainCtrl as ListDisplayerMainCtrl } from "../../../../t2025/dec/DomainOpsFrontend/components/ListDisplayer";
export const ManagePage = () => {
    let cloneForm = Tools.comp("form", {
        class: "flex flex-col sm:flex-row gap-3",
        children: [
            Tools.comp("input", {
                type: "text",
                name: "url",
                required: "",
                placeholder: "https://github.com/user/repo",
                class:
                    "flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base",
            }),
            Tools.comp("button", {
                key: "cloneBtn",
                type: "submit",
                class:
                    "bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors font-medium w-full sm:w-auto cursor-pointer",
                textContent: "Clone",
            }),
        ],
    });
    let deleteAllBtn = Tools.comp("button", {
        class:
            "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded-md transition-colors text-sm font-semibold w-full sm:w-auto cursor-pointer",
        textContent: "Delete All",
    });
    let repoList = Tools.div({ class: "flex flex-col gap-2" });
    return Tools.comp("div", {
        class: "bg-white rounded-lg shadow-md p-4 md:p-6 flex flex-col h-full",
        children: [
            Tools.comp("section", {
                class: "mb-8",
                children: [
                    Tools.comp("h2", {
                        class: "text-lg font-semibold mb-3 text-gray-700",
                        textContent: "Clone New Repository",
                    }),
                    cloneForm,
                ],
            }),
            Tools.comp("section", {
                class: "mb-8 flex flex-1 flex-col",
                children: [
                    Tools.comp("h2", {
                        class: "text-lg font-semibold mb-3 text-gray-700",
                        textContent: "Cloned Repositories",
                    }),
                    repoList,
                ],
            }),
            Tools.comp("section", {
                class: "pt-6 border-t border-gray-100",
                children: [
                    Tools.comp("div", {
                        class:
                            "flex flex-col sm:flex-row items-center justify-between gap-4",
                        children: [
                            Tools.comp("div", {
                                class: "flex flex-row items-center gap-2",
                                children: [
                                    Tools.comp("div", {
                                        class: "font-bold text-red-500 flex items-center",
                                        textContent: "Danger Zone:",
                                    }),
                                    Tools.comp("div", {
                                        class:
                                            "text-xs md:text-sm text-gray-500 text-center sm:text-left flex items-center",
                                        textContent: "This action cannot be undone.",
                                        
                                    })
                                ],
                            }),
                            deleteAllBtn,
                        ],
                    }),
                ],
            }),
        ],
    }, {}, {
        deleteAllBtn, cloneForm, repoList,
    });
}

export class ManagePageCtrl {
    comp: any;
    repoListCtrl: ListDisplayerCtrl = ListDisplayerMainCtrl.listDisplayer([], 10, this.on_repo_clicked.bind(this), 
        this.on_more_ops_clicked.bind(this), [{label: "pull"}, {label: "delete"}]);
    setup() {
        this.comp = ManagePage();
        this.comp.s.deleteAllBtn.update({}, { click: this.on_delete_all.bind(this) });
        this.comp.s.cloneForm.update({}, { submit: this.on_submit_clone_form.bind(this) });
        this.repoListCtrl.title_getter = (data: any) => data.name;
        this.comp.s.repoList.update({ innerHTML: "", child: this.repoListCtrl.comp });
        this.populate_repo_list();
    }
    async fetch_repos_list() {
        return [{name: "repo1"}, {name: "repo2"}, {name: "repo3"}, {name: "repo4"}, ];
    }
    async git_clone(gitUrl_or_sshlink: string) {
        console.log("git_clone", gitUrl_or_sshlink);
        return {response: {error: "failed to clone repository"}};
    }
    private async on_submit_clone_form(e: Event) {
        e.preventDefault();
        let form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const values = Object.fromEntries(formData.entries());
        let gitUrl_or_sshlink = values.url as string;
        this.comp.s.cloneForm.s.cloneBtn.update({
            textContent: "Cloning...",
        });
        try {
            await this.git_clone(gitUrl_or_sshlink);
            this.comp.s.cloneForm.s.cloneBtn.update({
                textContent: "Clone",
            });
            form.reset();
            this.populate_repo_list();
            GlobalStates.getInstance().states.notification.addToast("repository cloned successfully", "repository cloned successfully", "success");
        } catch (error: any) {
            GlobalStates.getInstance().states.notification.addToast("failed to clone repository", error?.response?.data?.detail as string, "error");
            this.comp.s.cloneForm.s.cloneBtn.update({
                textContent: "Clone",
            })
            return;
        }
    }
    
    async delete_all() {
        console.log("delete all");
        return "deleted all";
    }
    private async on_delete_all() {
        if (confirm("Are you sure you want to delete all repositories?")) {
            let res = await this.delete_all();
            console.log(res);
            this.populate_repo_list();
            GlobalStates.getInstance().states.notification.addToast("all repositories deleted successfully", "all repositories deleted successfully", "success");
        }
    }
    populate_repo_list() {
        this.fetch_repos_list().then((res: any) => {
            this.repoListCtrl.set_data(res);
            this.repoListCtrl.update();
        });
    }
    on_repo_clicked(data: any) {
        console.log(data);
    }
    private async on_more_ops_clicked(data: {name: string, url: string}, label: string) {
        try{
            if (label === "pull") {
                await this.git_pull(data);
                GlobalStates.getInstance().states.notification.addToast("repository pulled successfully", "", "success");
            } else if (label === "delete") {
                await this.git_delete(data);
                this.populate_repo_list();
                GlobalStates.getInstance().states.notification.addToast("repository deleted successfully", "", "success");
            }
        } catch (error: any) {
            GlobalStates.getInstance().states.notification.addToast("failed to " + label, error?.response?.data?.detail as string, "error");
        }
    }
    async git_pull(data: {name: string, url: string}) {
        console.log("git_pull", data.name);
        return {response: {error: "failed to pull repository"}};
    }
    async git_delete(data: {name: string, url: string}) {
        console.log("git_delete", data.name);
        return {response: {error: "failed to delete repository"}};
    }
}