import type { IconNode } from "lucide";
import type { GComponent } from "../../../globalComps/GComponent";
import type { IGroupComponent } from "./interface";
import { CardCompSmall, GLMGroup } from "./group_comp";
import { Tools } from "../../../globalComps/tools";

export class BigCardGroup implements IGroupComponent {
    comp = GLMGroup("", "");

    set_name(name: string): void {
        this.comp.s.titleComp.update({ textContent: name });
        this.comp.s.subtitleComp.update({ textContent: "" });
    }

    set_icon(icon: IconNode): void {
        this.comp.s.iconComp.update({
            children: [
                Tools.icon(icon, { class: "w-5 h-5 text-[var(--warning)]" }),
            ],
        });
    }

    get_comp(): GComponent {
        return this.comp;
    }
}

export class ListGroup implements IGroupComponent {
    main_comp = GLMGroup("", "");
    values: any[] = [];
    listComps: any[] = [];
    private title_getter: (data: any) => string = (data: any) =>
        data?.title || "";
    private subtitle_getter: (data: any) => string = (data: any) =>
        data?.subtitle || "";

    set_title_getter(func: (data: any) => string): void {
        this.title_getter = func;
    }
    set_subtitle_getter(func: (data: any) => string): void {
        this.subtitle_getter = func;
    }
    set_name(name: string): void {
        this.main_comp.s.titleComp.update({ textContent: name });
    }
    set_icon(icon: IconNode): void {
        this.main_comp.s.iconComp.update({
            children: [
                Tools.icon(icon, { class: "w-5 h-5 text-[var(--warning)]" }),
            ],
        });
    }

    set_subtitle(title: string): void {
        this.main_comp.s.subtitleComp.update({ textContent: title });
    }

    set_values(data: any[]): void {
        this.values = data;
        this.update();
    }
    get_comp(): GComponent {
        return this.main_comp;
    }

    cardCompCreator(data: any) {
        let comp = CardCompSmall(
            this.title_getter(data),
            this.subtitle_getter(data),
        );
        comp.update({}, { click: () => this.on_click(data) });
        return comp;
    }

    update() {
        this.listComps = this.values.map((d: any) => this.cardCompCreator(d));
        this.main_comp.s.listerComp.update({
            innerHTML: "",
            children: this.listComps.map((comp) => comp),
        });
        this.main_comp.s.countComp.update({
            textContent: "" + this.values.length + " items",
        });
    }
    on_click(data: any) {
        console.log("hello", data);
    }
}
