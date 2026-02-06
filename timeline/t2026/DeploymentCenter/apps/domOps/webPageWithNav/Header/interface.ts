import type { IconNode } from "lucide";
import type { GComponent } from "../../../../../../globalComps/GComponent";

export type HrefComp = {
    kind: "href";
    label: string;
    href: string;
}

export type ComplexIconComp = {
    kind: "complex_icon";
    label: string;
    icon: IconNode;
    icon_position: "left" | "right" | "top" | "bottom";
}

export interface IComponent{
    get_component(): GComponent;
}

export type IconWithBadge = {
    kind: "icon_with_badge";
    icon: IconNode;
    badge: string;
}

export type CenterCompItem = HrefComp | ComplexIconComp | IComponent | string;

export type RightCompItem = HrefComp | IComponent | string | IconWithBadge | IconNode;

export interface IHeader {
    get_header: () => string;
    get_subtitle: () => string;
    get_logo: () => string;
    get_center_links: () => CenterCompItem[];
    get_right_links: () => RightCompItem[];
    center_click(comp: CenterCompItem): void;
    right_click(comp: RightCompItem): void;
    has_back_button: boolean;
    back_button_click: () => void;
}

export type ComponentType = "Icon" | "Text" | "Button";
export type BackgroundType = "white" | "gray" | "dark";
