import { Tools } from "../../april/tools";
import { Header } from "../../april/DomainOps/Home";
import { AppLogo } from "./Logo";
import { createNS, SVGCreator } from "./SVGCreator";
export const Home = () => {
    return Tools.div({
        class: "w-full h-full flex flex-col items-center justify-center",
        children: [Navigation(), PageContent(), RightSidebar()],
    });
};
export const PageContent = () => {
    return Tools.div({
        class: "w-full h-full flex flex-col items-center justify-center",
        textContent: "Header page",
    });
};
// export const Header = () => {
//     return Tools.div({
//         class: "w-full h-full flex flex-col items-center justify-center",
//         textContent: "Header page",
//     });
// };

export const Navigation = () => {
    return Tools.div({
        class: "w-full h-full flex flex-col items-center justify-center",
        children: [AppLogo()],
    });
};

export const Footer = () => {
    return Tools.div({
        class: "w-full h-full flex flex-col items-center justify-center",
        textContent: "Header page",
    });
};

export const RightSidebar = () => {
    return Tools.div({
        class: "w-full h-full flex flex-col items-center justify-center",
        textContent: "Table page",
    });
};

export const Table = () => {
    return Tools.div({
        class: "w-full h-full flex flex-col items-center justify-center",
        textContent: "Table page",
    });
};
