import { File, Folder } from "lucide";
import { Tools } from "../april/tools";
import { Breadcrumb } from "../june/domain-ops/Component";
import axios from "axios";
import { Atool } from "../april/Array";
import { File, Folder, Search, Plus, Settings, LayoutGrid, List as ListIcon } from "lucide";
import LocalStorageSetterCtrl from "../dec/localStorageSetter";

export const KEYS_TO_SAVE: { [key: string]: string } = {
    VITE_API_URL: "http://localhost:8000/run/",
    VITE_DEFAULT_LOCATION: ".",
}

export const SearchBar = () => {
    return Tools.div({
        class: "flex-1 max-w-xl mx-6 relative group",
        children: [
            Tools.icon(Search, {
                class: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors",
                key: "search"
            }),
            Tools.comp("input", {
                key: "searchInput",
                type: "text",
                placeholder: "Search files, folders...",
                class: "w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-gray-400"
            })
        ]
    });
};

export const ViewControls = () => {
    return Tools.div({
        class: "flex items-center gap-1 p-1 bg-gray-100/80 rounded-lg mr-2",
        children: [
            Tools.icon(LayoutGrid, {
                key: "layoutGrid",
                class: "w-8 h-8 p-1.5 bg-white rounded-md shadow-sm text-gray-700 cursor-pointer"
            }),
            Tools.icon(ListIcon, {
                key: "listIcon",
                class: "w-8 h-8 p-1.5 text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
            })
        ]
    });
}

export const Header = () => {
    const searchBar = SearchBar();

    const viewControls = ViewControls();

    const newBtn = Tools.comp("button", {
        class: "flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-xl transition-all shadow-sm active:scale-95",
        children: [
            Tools.icon(Plus, { class: "w-4 h-4" }),
            Tools.comp("span", { textContent: "Upload" })
        ]
    });

    const settingsBtn = Tools.comp("button", {
        class: "w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer",
        children: [Tools.icon(Settings, { class: "w-5 h-5" })]
    });

    return Tools.comp("header", {
        class: "w-full mb-6 flex items-center justify-between px-1",
        children: [

            Tools.div({
                class: "flex items-center gap-3",
                children: [
                    Tools.div({
                        class: "w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg px-8",
                        textContent: "File"
                    }),
                    Tools.comp("h1", {
                        class: "text-lg font-bold text-gray-800",
                        textContent: "Explorer",
                    })
                ]
            }),

            searchBar,

            Tools.div({
                class: "flex items-center gap-3",
                children: [viewControls, newBtn, settingsBtn]
            })
        ],
    }, {}, {
        searchBar,
        viewControls,
        newBtn,
        settingsBtn,
    });
};
export const HeaderV2 = () => {
    const settingsToggle = Tools.comp("button", {
        class:
            "flex items-center space-x-1 px-3 py-1.5 text-sm font-medium bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50",
        type: "button",
        children: [
            Tools.comp("span", { class: "text-gray-600", textContent: "⚙️" }),
            Tools.comp("span", { class: "text-gray-700", textContent: "Settings" }),
        ],
    });

    return Tools.comp("div", {
        children: [
            Tools.comp("header", {
                class: "w-full mb-4 flex items-center justify-between",
                children: [
                    Tools.comp("h1", {
                        class: "text-xl font-semibold text-gray-800",
                        textContent: "My File Explorer",
                    }),
                    settingsToggle,
                ],
            }),
        ],
    });
}

export const FileExplorer = () => {
    const classes = {
        file: { class: "h-16 w-16 text-gray-500" },
        folder: { class: "h-16 w-16 text-blue-500" },
    };

    const handlers = {
        onClick: (e: any, ls: any) => {
            console.log(ls.s.data.name, ls.s.data.type);
        },
        onBreadCrumbClick: (e: any, ls: any) => {
            console.log(ls.s.data);
        },
    };
    const fileOrFolderIcon = (
        name: string,
        type: "file" | "folder" = "file",
        id?: any
    ) => {
        let icon = Folder;
        if (type === "file") icon = File;
        return Tools.div({
            class: "flex flex-col items-center justify-start p-2 rounded-lg hover:bg-gray-100 transition-colors text-center cursor-pointer",
            children: [
                Tools.icon(
                    icon,
                    { ...classes[type] },
                    {
                        click: (e: any, ls: any) => handlers.onClick(e, ls),
                    },
                    {
                        data: { name, id, type },
                    }
                ),
                Tools.div({
                    class: "mt-2 text-sm text-gray-700 break-all",
                    textContent: name,
                }),
            ],
        });
    };
    const breadCrumb = Breadcrumb();
    breadCrumb.s.handlers.compCreator = (item: any) => {
        const comp = Tools.div(
            {
                ...breadCrumb.s.niceClass,
                child: Tools.comp("span", {
                    href: item.href,
                    textContent: item.name,
                }),
            },
            {
                click: (e: any, ls: any) => {
                    handlers.onBreadCrumbClick(e, ls);
                },
            },
            {
                data: item,
            }
        );
        comp.getElement().classList.add("cursor-pointer");
        return comp;
    };
    const curLoc = [localStorage.getItem("VITE_DEFAULT_LOCATION") as string || import.meta.env.VITE_DEFAULT_LOCATION as string || "."];
    breadCrumb.s.handlers.setData(
        curLoc.map((name, index) => ({ name, href: "#", index }))
    );

    const fileOrFolderContainer = Tools.div({ class: "flex flex-wrap gap-4" });

    const setContent = (files: string[], folders: string[]) => {
        let content = folders.map((f: string) => fileOrFolderIcon(f, "folder"));
        for (const f of files) {
            content.push(fileOrFolderIcon(f));
        }
        fileOrFolderContainer.update({ innerHTML: "", children: content });
    };

    setContent(
        ["file1", "file2", "file3", "file4", "file5", "file6"],
        ["folder1", "folder2", "folder3", "folder4", "folder5"]
    );

    return Tools.div(
        {
            children: [breadCrumb, fileOrFolderContainer],
        },
        {},
        {
            handlers,
            curLoc,
            fileOrFolderContainer,
            setContent,
            classes,
            breadCrumb,
        }
    );
};

export const LocalExpController = () => {
    let comp = FileExplorer();
    //  load from .env
    let url = localStorage.getItem("VITE_API_URL") as string || import.meta.env.VITE_API_URL as string || "http://localhost:8000/run/";

    const load = async () => {
        axios
            .post(url, {
                name: "folder/dirList",
                params: [Atool.join(comp.s.curLoc, "/")],
            })
            .then((response) => {
                const { files, folders } = response.data;
                comp.s.setContent(files, folders);
            })
            .catch((error) => {
                console.log(error);
                comp.s.setContent([], []);
            });
    };
    load();
    const updateBreadcrumb = () => {
        let loc = comp.s.curLoc.map((name: string, index: number) => {
            if (index === 0) return { name: "root", href: "#", index };
            return { name, href: "#", index };
        });
        comp.s.breadCrumb.s.handlers.setData(loc);
    };
    const onClick = (e: any, ls: any) => {
        const info = ls.s.data;
        if (info.type === "folder") {
            if (info.name === ".") return;
            if (info.name === "..") {
                if (comp.s.curLoc.length === 1) return;
                comp.s.curLoc.pop();
            } else comp.s.curLoc.push(info.name);
            load();
            updateBreadcrumb();
        }
    };
    const onBreadCrumbClick = (e: any, ls: any) => {
        const info = ls.s.data;
        comp.s.curLoc = comp.s.curLoc.slice(0, info.index + 1);
        load();
        updateBreadcrumb();
    };

    comp.s.handlers.onBreadCrumbClick = onBreadCrumbClick;

    comp.s.handlers.onClick = onClick;
    return {
        comp,
        url,
        onClick,
    };
};
