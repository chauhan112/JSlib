import { File, Folder } from "lucide";
import { Tools } from "../april/tools";
import { Breadcrumb } from "../june/domain-ops/Component";
import axios from "axios";
import { Atool } from "../april/Array";

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
    const curLoc = ["."];
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
    let url = import.meta.env.VITE_API_URL as string;
    console.log(url);
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
