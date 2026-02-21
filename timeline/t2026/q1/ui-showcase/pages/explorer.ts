import type { GComponent } from "../../../../globalComps/GComponent";
import { FileExplorer } from "../../../../t2025/july/FileExplorer";
import type { ITreeComponent, LabelValueItem } from "../interface";
import { InMemoryExplorerModel } from "../generics";
import type { ISComponent } from "../../../../globalComps/interface";
import { Breadcrumb } from "../../breadcrumb/generic";
import type { IBreadcrumbItem } from "../../breadcrumb/interface";
import { Tools } from "../../../../globalComps/tools";

export class ExplorerComp implements ITreeComponent {
    comp: any = FileExplorer();
    constructor() {
        this.comp.s.handlers.onClick = (e: any, ls: any) => {
            if (ls.s.data.type === "folder")
                this.on_folder_clicked(ls.s.data.id);
            else this.on_file_clicked(ls.s.data.id);
        };
        this.set_items([], []);
        this.comp.s.breadCrumb.update({ innerHTML: "", class: "" });
    }
    set_items(folders: LabelValueItem[], files: LabelValueItem[]): void {
        let content = folders.map((f: LabelValueItem) =>
            this.comp.s.fileOrFolderIcon(f.label, "folder", f),
        );
        for (const f of files) {
            content.push(this.comp.s.fileOrFolderIcon(f.label, "file", f));
        }
        this.comp.s.fileOrFolderContainer.update({
            innerHTML: "",
            children: content,
        });
    }
    on_folder_clicked(folder: LabelValueItem): void {
        console.log(folder, "folder clicked");
    }
    on_file_clicked(file: LabelValueItem): void {
        console.log(file, "file clicked");
    }
    get_comp(): GComponent {
        return this.comp;
    }
}

export class ExplorerPage implements ISComponent {
    explorer = new ExplorerComp();
    model = new InMemoryExplorerModel();
    breadcrumb = new Breadcrumb();
    display_area = Tools.div({
        class: "flex-1 flex flex-col gap-2",
    });
    get_comp(): GComponent {
        return Tools.comp("div", {
            class: "flex flex-col gap-4",
            children: [this.explorer.get_comp(), this.display_area],
        });
    }
    setup() {
        this.update();
        this.explorer.on_folder_clicked = this.on_folder_clicked.bind(this);
        this.explorer.comp.s.breadCrumb.update({
            innerHTML: "",
            child: this.breadcrumb.get_comp(),
        });
        this.breadcrumb.on_click = this.on_breadcrumb_item_click.bind(this);
    }
    async on_folder_clicked(folder: LabelValueItem) {
        await this.model.cd(folder.value);
        this.update();
    }
    private async update() {
        this.display_area.update({ innerHTML: "" });
        let vals = await this.model.list_dir();
        let folders = vals.folders.map((f: string) => ({ label: f, value: f }));
        let files = vals.files.map((f: string) => ({ label: f, value: f }));
        this.explorer.set_items(folders, files);
        let loc = await this.model.get_location();
        loc = ["root", ...loc];
        this.breadcrumb.set_values(
            loc.map((f: string, idx: number) => ({ name: f, value: idx })),
        );
    }
    private async on_breadcrumb_item_click(item: IBreadcrumbItem) {
        let loc = await this.model.get_location();
        loc = loc.slice(0, item.value as number);
        this.model.goto_location(loc);
        this.update();
    }
}
