import { Tools } from "../../../../t2025/april/tools";
import { backendCall } from "../../../../t2025/dec/DomainOpsFrontend/api_calls";
import { ListDisplayerCtrl, MainCtrl as ListDisplayerMainCtrl } from "../../../../t2025/dec/DomainOpsFrontend/components/ListDisplayer";
export const ManagePage = () => {
    let cloneForm = Tools.comp("form", {
        class: "flex flex-col sm:flex-row gap-3",
        children: [
            Tools.comp("input", {
                type: "text",
                required: "",
                placeholder: "https://github.com/user/repo",
                class:
                    "flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base",
            }),
            Tools.comp("button", {
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
    backend_url: string = "";
    api_key: string = "";
    repoListCtrl: ListDisplayerCtrl = ListDisplayerMainCtrl.listDisplayer([], 10, this.on_repo_clicked, this.on_more_ops_clicked, [{label: "pull"}, {label: "delete"}]);
    setup() {
        this.comp = ManagePage();
        this.comp.s.deleteAllBtn.update({}, { click: this.on_delete_all });
        this.comp.s.cloneForm.update({}, { submit: this.on_submit_clone_form });
        this.repoListCtrl.title_getter = (data: any) => data.name;
        this.comp.s.repoList.update({ innerHTML: "", child: this.repoListCtrl.comp });
        this.populate_repo_list();
    }
    async fetch_repos_list() {
        return [{name: "repo1"}, {name: "repo2"}, {name: "repo3"}, {name: "repo4"}, ];
    }
    on_submit_clone_form(e: Event) {
        e.preventDefault();
        console.log("submit clone form");
    }
    on_delete_all() {
        console.log("delete all");
    }
    call_backend(op: string, payload: any) {
        return backendCall(op, payload, "git-cloner");
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