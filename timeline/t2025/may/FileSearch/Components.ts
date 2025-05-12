import { Tools } from "../../april/tools";
export const title = "Clone Git Repo & Search Files";
export const Allowed_Extensions = [".js", ".jsx", ".ts", ".tsx", ".css"];
export const InputWithLabel = (label: string, inp: any = {}, key?: string) => {
    return Tools.div({
        key: key || "w",
        children: [
            Tools.comp("label", {
                for: label,
                class: "block text-sm font-medium text-gray-700 mb-1",
                textContent: label,
            }),
            Tools.comp("input", {
                key: "input",
                class: "block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500",
                type: "text",
                ...inp,
            }),
        ],
    });
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
    return Tools.div({
        class: "grid grid-cols-1 md:grid-cols-2 gap-4",
        children: [
            InputWithLabel(
                "Repository HTTPS URL:",
                {
                    placeholder: "https://github.com/user/repo.git",
                },
                "repo"
            ),
            password,
        ],
    });
};
export const FileModel = () => {};
export const ResultArea = () => {
    return Tools.div({
        class: "mt-4",
        children: [
            Tools.comp("h2", {
                class: "text-xl font-semibold mb-2 text-gray-700",
                textContent: "Results:",
            }),
            Tools.div({
                class: "space-y-1 max-h-96 overflow-y-auto border border-gray-200 rounded p-3 bg-gray-50",
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
                class: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center",
                children: [
                    Tools.comp("span", {
                        textContent: "Load/Clone Repository",
                    }),
                    Tools.div({
                        id: "loader",
                        class: "loader hidden",
                    }),
                ],
            },
            {
                click: () => {
                    console.log("clicked");
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

    const onLoad = () => {
        let repoUrl = repoInput.s.repo.s.input.component.value.trim();

        console.log(GitTools.validateAndParseGitHubUrl(repoUrl));
    };
    const setBusy = () => {};
    const updateStatus = () => {};
    const handleLoadRepo = () => {};
    const clearFolder = () => {};

    return Tools.div({
        class: "flex flex-col gap-4",
        children: [
            repoInput,
            actionBtn,
            statusDisplay,
            searchInput,
            ResultArea(),
            // FileModel(),
        ],
    });
};
