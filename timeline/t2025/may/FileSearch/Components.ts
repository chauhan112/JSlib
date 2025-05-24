import { Tools } from "../../april/tools";
import { LocalStorageJSONModel } from "../../april/LocalStorage";
import {
    LightFsWrapper,
    IsoGitWrapper,
    FileSearchModel,
    CloneRepoModal,
} from "./model";
import { StringTool, FileTools, GitTools } from "./tools";
import { AceEditor } from "../Editor/ace";
import { GenericModal } from "./Modal";

export const TITLE = "Clone Git Repo & Search Files";
export const GIT_DIR = "git-search-repo-fs";
export const Allowed_Extensions = [
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".css",
    ".py",
    ".java",
];
export const InputWithLabel = (
    label: string,
    inp: any = {},
    key?: string,
    loc?: string
) => {
    let fnc = {};

    if (loc) {
        let model = new LocalStorageJSONModel(loc);

        if (model.exists([loc])) {
            inp = {
                ...inp,
                value: model.readEntry([loc]),
            };
        }

        fnc = {
            change: (e: any) => {
                model.updateEntry([loc], e.target.value);
            },
        };
    }
    let inpComp = Tools.comp(
        "input",
        {
            key: "input",
            class: "block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500",
            type: "text",
            ...inp,
        },
        fnc
    );
    const activate = (active: boolean) => {
        (inpComp.getElement() as HTMLInputElement).disabled = !active;
    };
    return Tools.div(
        {
            key: key || "w",
            children: [
                Tools.comp("label", {
                    for: label,
                    class: "block text-sm font-medium text-gray-700 mb-1",
                    textContent: label,
                }),
                inpComp,
            ],
        },
        {},
        { activate }
    );
};
export const RepoInput = () => {
    let password = InputWithLabel(
        "Auth Token (Optional):",
        {
            type: "password",
            placeholder: "Personal Access Token (if private)",
        },
        "password"
    );
    password.update({
        child: Tools.comp("p", {
            class: "text-xs text-gray-500 mt-1",
            textContent: "Needed for private repos. Use PAT as password/token.",
        }),
    });
    let wid = Tools.div({
        class: "grid grid-cols-1 md:grid-cols-2 gap-4",
        children: [
            InputWithLabel("Repository HTTPS URL:", {
                placeholder: "https://github.com/user/repo.git",
            }),
            password,
        ],
    });

    return wid;
};
export const ResultArea = () => {
    return Tools.div({
        class: "mt-4",
        children: [
            Tools.comp("h2", {
                class: "text-xl font-semibold mb-2 text-gray-700",
                textContent: "Results:",
            }),
            Tools.div({
                key: "out",
                class: "space-y-1 overflow-auto border border-gray-200 rounded p-3 bg-gray-50",
                children: [
                    Tools.comp("p", {
                        class: "text-gray-400",
                        textContent: "Search results will appear here.",
                    }),
                ],
            }),
            Tools.comp("p", {
                class: "text-sm text-gray-600 mt-2",
            }),
        ],
    });
};
export const DivWrap = (child: any, props: any = {}) => {
    return Tools.div({
        class: "flex flex-col gap-4 w-full ",
        children: [child],
        ...props,
    });
};
export const ListComp = (
    name: string,
    val: any,
    ops: any[] = [
        { textContent: "edit" },
        { textContent: "delete" },
        { textContent: "view" },
    ],
    onClick: any = (val: any, op: any) => {
        console.log("clicked", val, op);
    }
) => {
    let state = {
        onClick,
    };
    return Tools.comp(
        "div",
        {
            class: "flex items-center justify-between p-2 border-b border-gray-200 flex-wrap",
            children: [
                Tools.comp("span", {
                    class: "text-gray-700",
                    textContent: name,
                }),
                Tools.div({
                    class: "flex items-center gap-2",
                    children: ops.map((op) => {
                        return Tools.comp(
                            "button",
                            {
                                class: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded cursor-pointer",
                                ...op,
                            },
                            {
                                click: (e: any, ls: any) => {
                                    state.onClick({
                                        val: ls.s.data,
                                        op: op.textContent,
                                        ls,
                                        e,
                                    });
                                },
                            },
                            {
                                data: val,
                            }
                        );
                    }),
                }),
            ],
        },
        {},
        { val: val, state }
    );
};
export const RepoSelectForm = () => {
    let password = InputWithLabel(
        "Auth Token (Optional):",
        {
            type: "password",
            placeholder: "Personal Access Token (if private)",
        },
        "password"
    );
    password.update({
        class: "flex-1",
        child: Tools.comp("p", {
            class: "text-xs text-gray-500 mt-1",
            textContent: "Needed for private repos. Use PAT as password/token.",
        }),
    });
    let urlInput = InputWithLabel("Repository HTTPS URL:", {
        placeholder: "https://github.com/user/repo.git",
    });
    urlInput.update({
        class: "flex-1",
    });

    const getCurrentlySelectedRepo = () => {
        let repo = urlInput.s.input.component.value.trim();
        return repo;
    };
    let listOps = [
        {
            class: "bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded cursor-pointer",
            textContent: "select",
        },
        {
            class: "bg-red-700 hover:bg-red-800 text-white font-bold py-1 px-2 rounded cursor-pointer",
            textContent: "delete",
        },
        {
            class: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded cursor-pointer",
            textContent: "pull",
        },
    ];

    let loadBtn = Tools.comp("button", {
        key: "loadBtn",
        class: "w-fit bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer",
        textContent: "load repo",
    });
    let clonedRepoContainer = Tools.comp("div", {
        class: "text-gray-400",
    });
    let onClick = ({
        val,
        op,
        ...rest
    }: {
        val: any;
        op: any;
        ls: any;
        e: any;
    }) => {
        if (op === "select") {
            urlInput.s.input.component.value = val.url;
            loadBtn.getElement().click();
        } else if (op === "delete") {
            let res = confirm(
                "Are you sure you want to delete this repository? This action cannot be undone."
            );
            if (res) {
                layout.s.model.deleteRepo(val.url).then(() => {
                    rest.ls.s.parent.s.parent
                        .getElement()
                        .classList.toggle("hidden");
                });
            }
        } else if (op === "pull") {
            // console.log(
            //     "Pulling changes for",
            //     layout.s.model.fileSys.dirlist("/chauhan112/Editor", true)
            // );
            layout.s.model.fetchRepo(val.url);
        }
    };
    const setReposAndFuncs = (repos: { url: string; val: any }[]) => {
        clonedRepoContainer.update({
            innerHTML: "",
            children: repos.map((repo) => {
                return ListComp(repo.url, repo, listOps, onClick);
            }),
        });
    };

    let handlers = {
        onClickOfOpInList: (val: any, op: any) => {
            console.log("clicked-1", val, op);
        },
        getCurrentlySelectedRepo,
        setReposAndFuncs,
    };

    let layout = Tools.div(
        {
            class: "flex flex-col gap-4 w-full p-2",
            children: [
                Tools.comp("h2", {
                    class: "text-xl font-semibold mb-2 text-gray-700",
                    textContent: "Select Repository:",
                }),
                Tools.div({
                    key: "repoInp",
                    class: "flex items-center gap-4 md:flex-row flex-col",
                    children: [
                        Tools.div({
                            key: "wrap",
                            class: "flex flex-1 gap-4 md:flex-row flex-col",
                            children: [urlInput, password],
                        }),
                        loadBtn,
                    ],
                }),
                Tools.div({
                    class: "p-2 border border-gray-200 rounded bg-gray-50",
                    children: [
                        Tools.comp("h2", {
                            class: "text-xl font-semibold mb-2 text-gray-700",
                            textContent: "Cloned Repository:",
                        }),
                        clonedRepoContainer,
                    ],
                }),
            ],
        },
        {},
        {
            inst: {
                urlInput,
                password,
                loadBtn,
            },
            handlers,
        }
    );
    return layout;
};
export const ProjectInfo = () => {
    let valComp = Tools.comp("span", {
        key: "title",
        class: "text-gray-700",
    });
    const modal = GenericModal("Project Info");
    const form = RepoSelectForm();
    valComp.update({
        textContent: form.s.handlers.getCurrentlySelectedRepo(),
    });
    const initialize = () => {
        const curRepo = layout.s.model.getCurrentRepo();
        valComp.update({
            textContent: curRepo,
        });
        form.s.inst.urlInput.s.input.component.value = curRepo;
    };
    const layout = Tools.div(
        {
            class: "flex w-full gap-4 items-center flex-wrap",
            children: [
                Tools.comp(
                    "button",
                    {
                        class: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ",
                        textContent: "set",
                    },
                    {
                        click: (e: any, ls: any) => {
                            modal.s.handlers.display(form);
                            modal.s.handlers.show();
                            console.log(
                                "clicked",
                                ls.s.parent.s.model.listRepos()
                            );
                            form.s.handlers.setReposAndFuncs(
                                ls.s.parent.s.model
                                    .listRepos()
                                    .map((rep: any) => {
                                        return { url: rep[0], val: rep[1] };
                                    })
                            );
                        },
                    }
                ),
                Tools.comp("span", {
                    class: "font-semibold text-gray-700",
                    textContent: "Repo :",
                }),
                valComp,
                modal,
            ],
        },
        {},
        {
            getValue: form.s.handlers.getCurrentlySelectedRepo,
            inst: {
                form,
                modal,
            },
            initialize,
        }
    );
    return layout;
};

export class PageHandlers {
    instances: any = {};
    constructor(instances: any) {
        this.instances = instances;
    }

    async cloneIt(url: string, projectName: string) {
        let pn = "/" + StringTool.lstrip(projectName, "/");
        let exists = await this.instances.fileSys.exists(pn);
        if (!exists) {
            await this.instances.fileSys.mkdir(pn, true);
            this.instances.gitWrap.setDir(pn);
            await this.instances.gitWrap.clone(url);
        } else {
            console.log("repo already exists. using the cached data.");
        }
    }
    async onLoad() {
        let repoUrl = this.instances.projectInfo.s.getValue();
        const resp = GitTools.validateAndParseGitHubUrl(repoUrl);
        this.instances.cloneRepoModal.setCurrentRepo(repoUrl);
        this.setBusy(true);
        try {
            if (resp) {
                const { url, projectName } = resp;
                await this.cloneIt(url, projectName);
                let files = await this.instances.fileSys.listfilesWithIgnore(
                    "/" + projectName,
                    [".git"]
                );
                let filesWithAllowedExt = files.filter((f: string) => {
                    return Allowed_Extensions.some((ext) => f.endsWith(ext));
                });
                this.instances.filesSearcher.set_files(filesWithAllowedExt);
                this.updateStatus(
                    `Indexed ${filesWithAllowedExt.length} relevant files. Ready to search.`,
                    false
                );
                this.instances.cloneRepoModal.addRepo(url, projectName);
            } else {
                this.updateStatus("Please enter a valid repository URL.", true);
            }
        } catch (e) {
            this.updateStatus(
                "Error loading/cloning repository: " + e + ".",
                true
            );
        } finally {
            this.setBusy(false);
        }
    }
    setBusy(busy: boolean) {
        this.instances.searchInput.s.activate(!busy);
    }
    updateStatus(message: string, isError = false) {
        if (isError) {
            this.instances.statusDisplay.update({
                textContent: message,
                class: "mb-4 text-sm p-3 rounded border bg-red-100 border-red-300 text-red-800 min-h-[40px]",
            });
        } else {
            this.instances.statusDisplay.update({
                textContent: message,
                class: "mb-4 text-sm p-3 rounded border bg-gray-50 border-gray-200 text-gray-600 min-h-[40px]",
            });
        }
    }
    onResultClick(e: any, ls: any) {
        this.instances.fileModal.s.handlers.toggle();

        this.instances.fileSys.read(ls.s.data.path).then((data: any) => {
            this.instances.editor.s.editor.setLangAndContent(
                FileTools.getExtension(ls.s.data.path),
                data
            );
            this.instances.editor.s.editor.goToLine(ls.s.data.line);
        });
        this.instances.fileModal.s.handlers.display(this.instances.editor);
        this.instances.fileModal.s.modalTitle.update({
            innerHTML: ls.s.data.path,
        });
    }
    onSearch() {
        let term = this.instances.searchInput.s.input.component.value.trim();

        this.instances.filesSearcher.search(term).then((results: any) => {
            if (results.length === 0) {
                this.instances.resArea.s.out.update({
                    innerHTML: "",
                    children: [
                        Tools.comp("p", {
                            class: "text-gray-400",
                            textContent: "No results found",
                        }),
                    ],
                });
            } else {
                this.instances.resArea.s.out.update({
                    innerHTML: "",
                    children: results.map(
                        (f: { path: string; line: number }) => {
                            return ResultComponent(
                                f,
                                this.onResultClick.bind(this)
                            );
                        }
                    ),
                });
            }
        });
    }
}

export const ResultComponent = (
    f: { path: string; line: number },
    onClick: (e: any, ls: any) => void
) => {
    return Tools.comp(
        "button",
        {
            textContent: f.path,
            class: "p-2 border-b border-gray-100 bg-white hover:bg-indigo-50 text-sm cursor-pointer rounded flex w-full text-ellipsis",
        },
        {
            click: onClick,
        },
        {
            data: f,
        }
    );
};

export const Page = () => {
    let statusDisplay = Tools.div({
        class: "mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-200 min-h-[40px]",
        textContent:
            "Enter repo details and click load. Cloned data will be cached in your browser's IndexedDB.",
    });
    let searchInput = InputWithLabel("Search Term:", {
        type: "search",
        placeholder: "Enter search term...",
        disabled: true,
        class: "block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-200 disabled:cursor-not-allowed",
    });
    let resArea = ResultArea();
    let editor = AceEditor();
    let projectInfo = ProjectInfo();

    const fileSys = new LightFsWrapper(GIT_DIR);
    const gitWrap = new IsoGitWrapper(fileSys);
    const filesSearcher = new FileSearchModel(fileSys);
    const cloneRepoModal = new CloneRepoModal(GIT_DIR, fileSys, gitWrap);
    projectInfo.update({}, {}, { model: cloneRepoModal });
    projectInfo.s.inst.form.update({}, {}, { model: cloneRepoModal });

    projectInfo.s.initialize();
    let fileModal = GenericModal("File Content");
    let handlers = new PageHandlers({
        fileSys,
        gitWrap,
        filesSearcher,
        searchInput,
        resArea,
        statusDisplay,
        projectInfo,
        fileModal,
        editor,
        cloneRepoModal,
    });

    searchInput.s.input.update(
        {},
        {
            change: (e: any) => {
                handlers.onSearch();
            },
        }
    );
    projectInfo.s.inst.form.s.repoInp.s.loadBtn.update(
        {},
        {
            click: (e: any, ls: any) => {
                handlers.onLoad();
                projectInfo.s.inst.modal.s.handlers.close();
                projectInfo.s.title.update({
                    textContent: projectInfo.s.getValue(),
                });
            },
        }
    );
    if (projectInfo.s.getValue()) {
        handlers.onLoad();
    }
    return Tools.div({
        class: "flex flex-col gap-4 w-full md:w-auto md:flex-1",
        children: [projectInfo, statusDisplay, searchInput, resArea, fileModal],
    });
};
