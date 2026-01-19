import { ChevronLeft } from "lucide";
import { Tools } from "../../../globalComps/tools";
import { AppLogoSVG } from "./Logo";
export const Header = () => {
    const { svg } = AppLogoSVG();
    svg.update({ class: "w-[2.6rem] ml-4" });
    const left = Tools.comp("div", {
        child: Tools.icon(ChevronLeft, {
            key: "icon",
            class: "w-8 h-8 cursor-pointer",
        }),
    });
    const right = Tools.comp("div", {
        class: "flex items-center px-2 rounded-full cursor-pointer ",
        child: Tools.icon(ChevronLeft, {
            key: "icon",
            class: "w-8 h-8 cursor-pointer",
        }),
    });
    return Tools.div(
        {
            class: "flex items-center justify-between px-4 bg-[#F5C85F]",
            children: [
                Tools.div({
                    class: "m-2 flex items-center gap-4 ",
                    children: [left, svg],
                }),
                Tools.div({
                    key: "title",
                    class: "text-xl font-bold",
                    textContent: "Domain Ops Logger",
                }),
                right,
            ],
        },
        {},
        { left, right }
    );
};
