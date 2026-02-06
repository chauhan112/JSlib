import type { GComponent } from "../../../../../../globalComps/GComponent";
import { GenericHeader } from "./generic";
import type { CenterCompItem, IHeader, RightCompItem, IconWithBadge as IconWithBadgeType } from "./interface";
import { Header as HeaderComp, IconWithBadge, MiddleLinkItem } from "./comp";
import { Tools } from "../../../../../../globalComps/tools";
import { type IconNode } from "lucide";


export class HeaderCtrl {
    comp: GComponent;
    header: IHeader = new GenericHeader();
    constructor() {
        this.comp = HeaderComp();
    }
    update() {
        this.comp.s.title.update({textContent: this.header.get_header()});
        let center_links = this.header.get_center_links().map((link) => this.get_center_links(link));
        if (center_links.length > 0) {
            this.comp.s.middle_links.update({ innerHTML: "", children: center_links});
            (this.comp.s.middle_links.getElement() as HTMLDivElement).classList.add("md:flex");
        }else{
            (this.comp.s.middle_links.getElement() as HTMLDivElement).classList.remove("md:flex");
        }
        let right_links = this.header.get_right_links().map((link) => this.get_right_links(link));
        if (right_links.length > 0) {
            this.comp.s.right_links.update({ innerHTML: "", children: right_links});            
            (this.comp.s.right_links.getElement() as HTMLDivElement).classList.add("md:flex");
        }else{
            (this.comp.s.right_links.getElement() as HTMLDivElement).classList.remove("md:flex");
        }
    }

    get_center_links(center_link: CenterCompItem): GComponent {
        if (typeof center_link === "string") {
            return MiddleLinkItem(center_link);
        }
        return MiddleLinkItem("center_link");
    }
    get_right_links(right_link: RightCompItem): GComponent {
        if (typeof right_link === "string") {
            return MiddleLinkItem(right_link);
        }else if ((right_link as IconWithBadgeType).kind === "icon_with_badge") {
            let p = right_link as IconWithBadgeType;
            return IconWithBadge(p.icon, p.badge);
        } 
        return Tools.comp("span", {
            innerHTML: "",
            children: [Tools.icon((right_link as IconNode), { key: "icon", 
                class: "w-6 h-6 hover:text-gray-500 cursor-pointer"  })],
        });
    }


    get_comp(): GComponent {
        return this.comp;
    }
}