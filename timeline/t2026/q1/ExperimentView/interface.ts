import type { ISComponent } from "../../../globalComps/interface";

export interface IPage extends ISComponent {
    child_page_init(): void;
}
