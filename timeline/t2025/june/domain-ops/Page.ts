import { Tools } from "../../../globalComps/tools";
import { Header } from "../../april/DomainOps/Home";
import { AppLogo } from "./Logo";

import { SearchComp } from "./Component";
import { ChevronRight } from "lucide";
export const Home = () => {
    return Tools.div({
        class: "h-screen flex ",
        children: [Navigation(), PageContent()],
    });
};
export const PageContent = () => {
    return Tools.div({
        class: "w-full",
        children: [
            Header(),
            Tools.div({
                class: "flex",
                children: [Table(), RightSidebar()],
            }),
        ],
    });
};

// export const Header = () => {
//     return Tools.div({
//         class: "w-full h-full flex flex-col items-center justify-center",
//         textContent: "Header page",
//     });
// };

export const Navigation = () => {
    const logo = AppLogo();
    logo.s.svgComp.update({ class: "w-[2.6rem]" });
    logo.getElement().classList.add("w-full", "my-8");
    return Tools.div({
        class: "flex flex-col items-center w-2/12 bg-[#1ABC9C]",
        children: [
            logo,
            Tools.div({
                class: "w-full border-y py-1 px-2",
                children: [SearchComp()],
            }),
            Tools.div({
                class: "w-full border-b py-1 flex",
                children: [
                    Tools.icon(ChevronRight, { class: "w-6 h-6" }),
                    Tools.div({ textContent: "Domains" }),
                ],
            }),
            Tools.div({
                class: "w-full border-b py-1 flex",
                children: [
                    Tools.icon(ChevronRight, { class: "w-6 h-6" }),
                    Tools.div({ textContent: "Operations" }),
                ],
            }),
        ],
    });
};

export const RightSidebar = () => {
    return Tools.div({
        class: "flex flex-col items-center justify-center  w-4/12",
        textContent: "Right Side",
    });
};

export const Table = () => {
    return Tools.div({
        class: "w-full h-full flex flex-col items-center justify-center",
        textContent: "Table page",
    });
};
