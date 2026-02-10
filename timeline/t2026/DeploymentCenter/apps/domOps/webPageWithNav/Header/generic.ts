import type { CenterCompItem, IHeader, RightCompItem } from "./interface";

export class GenericHeader implements IHeader {
    has_back_button: boolean = false;
    header: string = "Header";
    subtitle: string = "Subtitle";
    logo: string = "Logo";
    get_center_links(): CenterCompItem[] {
        return [];
    }
    get_right_links(): RightCompItem[] {
        return [];
    }
    center_click(comp: CenterCompItem): void {
        console.log(comp);
    }
    right_click(comp: RightCompItem): void {
        console.log(comp);
    }
    back_button_click(): void {
        console.log("back button clicked");
    }
}
