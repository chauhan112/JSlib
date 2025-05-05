import { Tools } from "../../april/tools";
import { CircleCheck } from "lucide";

export const CardComponent = () => {
    return Tools.div({
        class: "tool-card bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center",
        children: [
            Tools.icon(CircleCheck, {
                class: "w-16 h-16 text-blue-500 mb-4",
            }),
            Tools.comp("h2", {
                class: "text-xl font-semibold mb-2",
                textContent: "Task Manager",
            }),
            Tools.comp("p", {
                class: "text-gray-600 text-sm mb-4 flex-grow",
                textContent:
                    "Organize your daily tasks and boost productivity.",
            }),
            Tools.comp("a", {
                class: "mt-auto inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-5 rounded-md transition-colors duration-300",
                textContent: "Launch Tool",
                href: "#task-manager",
            }),
        ],
    });
};
