import { Tools } from "../../april/tools";
import { InputWithLabel } from "./LabeledInput";
import {
    LightFsWrapper,
    IsoGitWrapper,
    FileSearchModel,
    CloneRepoModal,
} from "./model";

import { AceEditor } from "../Editor/ace";
import { GenericModal } from "./Modal";
import { SearchComponent } from "./Search";

export const TITLE = "Clone Git Repo & Search Files";
export const GIT_DIR = "git-search-repo-fs";
import { PageHandlers } from "./Handlers";

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
    let valComp = Tools.comp("a", {
        key: "title",
        class: "text-red-500 hover:text-red-700",
        target: "_blank",
    });
    const modal = GenericModal("Project Info");
    const form = RepoSelectForm();
    valComp.update({
        href: form.s.handlers.getCurrentlySelectedRepo(),
        textContent: form.s.handlers.getCurrentlySelectedRepo(),
    });
    const initialize = () => {
        const curRepo = layout.s.model.getCurrentRepo();
        valComp.update({
            href: curRepo,
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

export const Page = () => {
    let statusDisplay = Tools.div({
        class: "mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-200 min-h-[40px]",
        textContent:
            "Enter repo details and click load. Cloned data will be cached in your browser's IndexedDB.",
    });
    let searchComponent = SearchComponent();

    searchComponent.s.comps.searchBtn.update(
        {},
        {
            click: (e: any, ls: any) => {
                let vals = searchComponent.s.handlers.getValues();
                handlers.onSearch(vals.word, vals.caseSensitive, vals.reg);
            },
        }
    );
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
    fileModal.s.wrap.getElement().classList.toggle("h-screen");
    let handlers = new PageHandlers({
        fileSys,
        gitWrap,
        filesSearcher,
        searchComponent,
        resArea,
        statusDisplay,
        projectInfo,
        fileModal,
        editor,
        cloneRepoModal,
    });

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
        children: [
            projectInfo,
            statusDisplay,
            searchComponent,
            resArea,
            fileModal,
        ],
    });
};
