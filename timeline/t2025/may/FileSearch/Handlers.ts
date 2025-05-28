import { StringTool, FileTools, GitTools } from "./tools";
import { Tools } from "../../april/tools";

export const Allowed_Extensions = [
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".css",
    ".py",
    ".java",
];

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
        this.instances.searchComponent.s.handlers.activate(!busy);
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
    displaySearchResults(results: { path: string; line: number }[]) {
        this.instances.resArea.s.resTitle.s.count.update({
            textContent: ` ${results.length}`,
        });
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
                children: results.map((f: { path: string; line: number }) => {
                    return ResultComponent(f, this.onResultClick.bind(this));
                }),
            });
        }
    }
}
