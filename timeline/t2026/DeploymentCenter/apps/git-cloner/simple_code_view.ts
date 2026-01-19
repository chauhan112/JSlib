import { ArrowLeft } from "lucide";
import { Tools } from "../../../../globalComps/tools";
import { MainCtrl as RouteWebPageMainCtrl } from "../../../../t2025/dec/DomainOpsFrontend/route/controller";


const var_file_status = Tools.comp("span", {
    class: "truncate ml-4 max-w-[150px] md:max-w-none",
    textContent: "Ready",
});

export const SimpleCodeView = () => {
    const goBackBtn = Tools.icon(ArrowLeft, { class: "w-8 h-8 cursor-pointer" })
    const code_container = Tools.comp("div", {
        class: "font-mono text-xs md:text-sm min-w-full pb-4",
        children: [
            Tools.comp("div", {
                class: "text-slate-500 text-center mt-10 p-4",
                textContent: "Select a repository and file to view content...",
            }),
        ],
    });
    return Tools.comp("div", {
        class: "flex h-full flex-col gap-4",
        children: [
            goBackBtn,
            Tools.comp("div", {
                class:
                    "flex-1 bg-slate-900 border border-slate-700 rounded-lg relative overflow-hidden flex flex-col shadow-inner",
                children: [
                    Tools.comp("div", {
                        class:
                            "bg-slate-800 px-4 py-2 border-b border-slate-700 text-xs text-slate-400 flex justify-between items-center shrink-0",
                        children: [
                            Tools.comp("span", {
                                class: "font-semibold text-slate-300",
                                textContent: "Code",
                            }),
                            var_file_status,
                        ],
                    }),
                    Tools.comp("div", {
                        class: "flex-1 overflow-auto bg-[#1f2937]",
                        children: [code_container],
                    }),
                ],
            }),
        ],
    }, {}, {
        goBackBtn,
        code_container,
    });
}
function renderCode(els:any, text:string, highlightLineNum:number) {
    els.fileContentDisplay.innerHTML = '';
    const lines = text.split('\n');
    
    lines.forEach((line, index) => {
        const lineNum = index + 1;
        const row = document.createElement('div');
        row.className = `line-row ${lineNum == highlightLineNum ? 'highlight-line' : ''}`;
        row.id = `line-${lineNum}`;
        
        const numSpan = document.createElement('div');
        numSpan.className = 'line-num';
        numSpan.innerText = lineNum.toString();

        const contentSpan = document.createElement('div');
        contentSpan.className = 'line-content';
        contentSpan.innerText = line; 

        row.appendChild(numSpan);
        row.appendChild(contentSpan);
        els.fileContentDisplay.appendChild(row);
    });

    if (highlightLineNum) {
        setTimeout(() => {
            const el = document.getElementById(`line-${highlightLineNum}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
}

export class SimpleCodeViewCtrl {
    comp: any;
    setup() {
        this.comp = SimpleCodeView();
        this.comp.s.goBackBtn.update({}, { click: () => this.go_back() });
    }
    go_back() {
        RouteWebPageMainCtrl.go_back(2);
    }
}