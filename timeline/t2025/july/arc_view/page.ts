import { Tools } from "../../april/tools";
import { LocalStorageJSONModel } from "../../april/LocalStorage";
import "./style.css";
export const Page = () => {
    const inpArea = Tools.comp("textarea", {
        class: "w-full h-48 border-2 border-black shadow-lg p-2",
        placeholder: "Input area",
    });

    const viewContainer = Tools.comp("div", {
        class: "border-2 border-black shadow-lg items-center justify-center",
    });
    const btn = Tools.comp("button", {
        class: "bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded cursor-pointer",
        textContent: "Visualize",
    });
    return Tools.comp(
        "div",
        {
            class: "w-full items-center justify-center flex gap-4 mt-4 flex-wrap",
            children: [
                Tools.comp("div", {
                    class: "flex flex-col gap-2 max-w-2/3",
                    children: [inpArea, btn],
                }),
                viewContainer,
            ],
        },
        {},
        {
            viewContainer,
            btn,
            inpArea,
        }
    );
};

export const PageCtrl = () => {
    let comp = Page();
    let model = new LocalStorageJSONModel("arc-view");
    const colorMap: any = {
        0: "bg-black",
        1: "bg-[#1E93FF]",
        2: "bg-[#F93C31]",
        3: "bg-[#4FCC30]",
        4: "bg-[#FFDC00]",
        5: "bg-[#999999]",
        6: "bg-[#E53AA3]",
        7: "bg-[#FF851B]",
        8: "bg-[#87D8F1]",
        9: "bg-[#921231]",
    };
    function drawGrid(gridData: number[][]) {
        const numRows = gridData.length;
        const numCols = gridData[0] ? gridData[0].length : 0;

        let screenHeight = window.innerHeight - 100;
        const cellSize = `${Math.round(screenHeight / numRows)}px`;

        let children: any = [];
        gridData.forEach((row: number[]) => {
            row.forEach((cellValue: number) => {
                const cell = Tools.div({
                    class: "GridCell border border-gray-700 flex items-center justify-center text-white",
                    child: Tools.comp("span", {
                        textContent: cellValue.toString(),
                        class: "hidden GridCellValue",
                    }),
                });
                const colorClass = colorMap[cellValue];
                if (colorClass) {
                    cell.getElement().classList.add(colorClass);
                } else {
                    console.warn(
                        `Unknown color code: ${cellValue}. Defaulting to black.`
                    );
                    cell.getElement().classList.add("bg-black"); // Default or error color
                }
                children.push(cell);
            });
        });
        const container = Tools.div({
            class: "grid",
            children,
        });

        container.getElement().style.gridTemplateColumns = `repeat(${numCols}, ${cellSize})`;
        container.getElement().style.gridAutoRows = cellSize;
        return container;
    }
    const onLoad = () => {
        if (model.exists(["gridData"])) {
            const gridData = model.readEntry(["gridData"]);
            if (gridData) comp.s.inpArea.getElement().value = gridData;
        } else {
            const gridData = JSON.stringify([
                [0, 6, 8, 8, 8, 4],
                [6, 4, 6, 4, 6, 4],
                [8, 4, 6, 8, 8, 8],
                [6, 4, 6, 4, 6, 4],
                [8, 6, 8, 8, 8, 4],
            ]);
            comp.s.inpArea.getElement().value = gridData;
            model.addEntry(["gridData"], gridData);
        }
    };
    onLoad();
    comp.s.btn.update(
        {},
        {
            click: () => {
                let val = comp.s.inpArea.getElement().value;
                const gridData = JSON.parse(val || "[]");
                const container = drawGrid(gridData);
                comp.s.viewContainer.update({
                    innerHTML: "",
                    child: container,
                });
                model.updateEntry(["gridData"], val);
            },
        }
    );

    return { comp, colorMap, drawGrid };
};
