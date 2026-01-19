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
        class: "bg-white rounded-lg shadow-md p-4 md:p-6",
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
                class: "mb-8",
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
    repoListCtrl: ListDisplayerCtrl = ListDisplayerMainCtrl.listDisplayer([], 10, this.on_repo_clicked, this.on_more_ops_clicked, [{label: "pull"}, {label: "delete"}]);
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
    }
    private async on_submit_clone_form(e: Event) {
        e.preventDefault();
        let form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const values = Object.fromEntries(formData.entries());
        let gitUrl_or_sshlink = values.url as string;
        this.comp.s.cloneForm.s.cloneBtn.update({
            disabled: true,
            textContent: "Cloning...",
        });
        try {
            let res = await this.git_clone(gitUrl_or_sshlink);
            this.comp.s.cloneForm.s.cloneBtn.update({
                textContent: "Clone",
                disabled: false,
            });
            form.reset();
            this.populate_repo_list();
        } catch (error) {
            console.error(error);
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
    on_more_ops_clicked(data: any, label: string) {
        console.log(data, label);
    }
}