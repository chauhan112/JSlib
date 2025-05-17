import { Tools } from "../../april/tools";
import { LocalStorageJSONModel } from "../../april/LocalStorage";
import { LightFsWrapper, IsoGitWrapper, FileSearchModel } from "./model";
import { StringTool, FileTools } from "./tools";
import { AceEditor } from "../Editor/ace";

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
            InputWithLabel(
                "Repository HTTPS URL:",
                {
                    placeholder: "https://github.com/user/repo.git",
                },
                "repo",
                "wid.s.repo.s.input.component.value"
            ),
            password,
        ],
    });

    return wid;
};
export const FileModel = (closeFunc: (e: any, ls: any) => void) => {
    const fileName = Tools.comp("h3", {
        class: "text-lg font-semibold text-gray-800 break-all",
        textContent: "FileName",
    });
    const codeSec = Tools.div({
        class: "flex items-center justify-between p-4 border-b border-gray-200",
        children: [
            fileName,
            Tools.comp(
                "button",
                {
                    class: "text-gray-500 hover:text-gray-800 text-2xl font-bold",
                    textContent: "X",
                },
                {
                    click: closeFunc,
                }
            ),
        ],
    });
    const codeArea = Tools.div({ class: "p-2 overflow-y-auto" });
    return Tools.div(
        {
            class: "fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50 hidden",
            child: Tools.div({
                class: "bg-white rounded-lg shadow-xl w-full max-h-[90vh] flex flex-col",
                children: [codeSec, codeArea],
            }),
        },
        {},
        {
            fileName,
            codeArea,
        }
    );
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
                class: "space-y-1 overflow-y-auto border border-gray-200 rounded p-3 bg-gray-50",
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
export class GitTools {
    static validateAndParseGitHubUrl(urlInput: string) {
        const githubHttpsRegex =
            /^https:\/\/github\.com\/([a-zA-Z0-9-]+\/[a-zA-Z0-9.-]+)\.git$/;

        if (typeof urlInput !== "string") {
            return null;
        }

        const match = githubHttpsRegex.exec(urlInput);

        if (match === null) {
            return null;
        } else {
            const fullUrl = match[0];
            const projectName = match[1];

            return {
                url: fullUrl,
                projectName: projectName,
            };
        }
    }
}
export const Page = () => {
    let actionBtn = Tools.div({
        child: Tools.comp(
            "button",
            {
                key: "btn",
                class: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center",
                children: [
                    Tools.comp("span", {
                        key: "text",
                        textContent: "Load/Clone Repository",
                    }),
                    Tools.div({
                        key: "loader",
                        id: "loader",
                        class: "loader hidden",
                    }),
                ],
            },
            {
                click: () => {
                    onLoad();
                },
            }
        ),
    });
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
    let repoInput = RepoInput();
    let resArea = ResultArea();
    let editor = AceEditor();
    const fileSys = new LightFsWrapper(GIT_DIR);
    const gitWrap = new IsoGitWrapper(fileSys);
    const filesSearcher = new FileSearchModel(fileSys);

    let fileModal = FileModel((e: any, ls: any) => {
        fileModal.getElement().classList.toggle("hidden");
    });

    const cloneIt = async (url: string, projectName: string) => {
        let pn = "/" + StringTool.lstrip(projectName, "/");
        let exists = await fileSys.exists(pn);
        if (!exists) {
            await fileSys.mkdir(pn, true);
            gitWrap.setDir(pn);
            await gitWrap.clone(url);
        } else {
            console.log("repo already exists. using the cached data.");
        }
    };
    const onLoad = async () => {
        let repoUrl = repoInput.s.repo.s.input.component.value.trim();
        const resp = GitTools.validateAndParseGitHubUrl(repoUrl);
        setBusy(true, "Initializing...");
        try {
            if (resp) {
                const { url, projectName } = resp;
                await cloneIt(url, projectName);
                console.log("repo cloned.");
                let files = await fileSys.listfilesWithIgnore(
                    "/" + projectName,
                    [".git"]
                );
                let filesWithAllowedExt = files.filter((f) => {
                    return Allowed_Extensions.some((ext) => f.endsWith(ext));
                });
                filesSearcher.set_files(filesWithAllowedExt);
                updateStatus(
                    `Indexed ${filesWithAllowedExt.length} relevant files. Ready to search.`,
                    false
                );
            } else {
                updateStatus("Please enter a valid repository URL.", true);
            }
        } catch (e) {
            updateStatus("Error loading/cloning repository: " + e + ".", true);
        } finally {
            setBusy(false, "all done.");
        }
    };
    const setBusy = (busy: boolean, message: string = "Loading...") => {
        console.log("setBusy", busy);
        searchInput.s.activate(!busy);
        actionBtn.s.btn.getElement().disabled = busy;
        if (busy) {
            actionBtn.s.btn.s.text.update({
                textContent: message,
            });
        } else {
            actionBtn.s.btn.s.text.update({
                textContent: "Load/Clone Repository",
            });
        }
        actionBtn.s.btn.s.loader.getElement().classList.toggle("hidden", !busy);
    };
    const updateStatus = (message: string, isError = false) => {
        if (isError) {
            statusDisplay.update({
                textContent: message,
                class: "mb-4 text-sm p-3 rounded border bg-red-100 border-red-300 text-red-800 min-h-[40px]",
            });
        } else {
            statusDisplay.update({
                textContent: message,
                class: "mb-4 text-sm p-3 rounded border bg-gray-50 border-gray-200 text-gray-600 min-h-[40px]",
            });
        }
    };
    const resultComponent = (f: { path: string; line: number }) => {
        return Tools.comp(
            "button",
            {
                textContent: f.path,
                class: "p-2 border-b border-gray-100 bg-white hover:bg-indigo-50 text-sm cursor-pointer rounded flex w-full text-ellipsis",
            },
            {
                click: (e: any, ls: any) => {
                    fileModal.getElement().classList.toggle("hidden");

                    fileSys.read(ls.s.data.path).then((data) => {
                        editor.s.editor.setLangAndContent(
                            FileTools.getExtension(ls.s.data.path),
                            data
                        );
                        editor.s.editor.goToLine(ls.s.data.line);
                    });
                    fileModal.s.codeArea.update({
                        innerHTML: "",
                        children: [editor],
                    });
                    fileModal.s.fileName.update({
                        innerHTML: ls.s.data.path,
                    });
                },
            },
            {
                data: f,
            }
        );
    };
    const onSearch = () => {
        let term = searchInput.s.input.component.value.trim();

        filesSearcher.search(term).then((results) => {
            if (results.length === 0) {
                resArea.s.out.update({
                    innerHTML: "",
                    children: [
                        Tools.comp("p", {
                            class: "text-gray-400",
                            textContent: "No results found",
                        }),
                    ],
                });
            } else {
                resArea.s.out.update({
                    innerHTML: "",
                    children: results.map(
                        (f: { path: string; line: number }) => {
                            return resultComponent(f);
                        }
                    ),
                });
            }
        });
    };

    searchInput.s.input.update(
        {},
        {
            change: (e: any) => {
                onSearch();
            },
        }
    );
    return Tools.div(
        {
            class: "flex flex-col gap-4",
            children: [
                repoInput,
                actionBtn,
                statusDisplay,
                searchInput,
                resArea,
                fileModal,
            ],
        },
        {},
        {
            funcs: {
                onLoad,
                setBusy,
                updateStatus,
                onSearch,
                resultComponent,
            },
            ins: {},
        }
    );
};
