import { Tools } from "../../april/tools";

export const MainPage = () => {
    return Tools.div({
        class: "w-full h-full flex flex-col items-center justify-center",
        textContent: "Discord page",
    });
};
