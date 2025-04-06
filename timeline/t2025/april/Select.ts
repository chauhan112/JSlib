import { Tools } from "./GComponent";

const makeOption = (option: any) => {
    return Tools.comp("option", {
        value: option.value,
        textContent: option.textContent,
    });
};
export const Select = (options: any[]) => {
    return Tools.comp("select", {
        class: "w-full p-1 rounded-sm bg-gray-100 text-black border border-gray-300 transition-all duration-300",
        children: options.map(makeOption),
    });
};

export const SelectTest = () => {
    let options = [
        {
            value: "",
            textContent: "--- Select an option ---",
        },
        {
            value: "1",
            textContent: "Option 1",
        },
        {
            value: "2",
            textContent: "Option 2",
        },
        {
            value: "3",
            textContent: "Option 3",
        },
    ];
    return Tools.div({
        children: [Select(options)],
    });
};
