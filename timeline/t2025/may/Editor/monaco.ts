// Import the editor core
import { editor as monacoEditor, IPosition } from "monaco-editor";
import { Tools } from "../../april/tools";
import { GComponent } from "../../april/GComponent";

export class EditorModel {
    private editor: monacoEditor.IStandaloneCodeEditor | null = null;
    private readonly comp: GComponent;
    constructor(comp: GComponent) {
        this.comp = comp;
    }
    lang: string = "plaintext";
    setLangAndContent(lang: string, value: string = "") {
        if (!this.editor) {
            this.editor = monacoEditor.create(
                this.comp.getElement(),
                {
                    value: value,
                    language: lang,
                    theme: "vs-dark",
                    automaticLayout: true,
                    minimap: { enabled: false },
                },
                {}
            );
            this.lang = lang;
        } else {
            if (lang !== this.lang) {
                const newModel = monacoEditor.createModel(value, lang);
                const oldModel = this.editor.getModel();
                this.editor.setModel(newModel);
                if (oldModel) {
                    oldModel.dispose();
                }
                this.goToLine(1);
                this.lang = lang;
            } else {
                this.setValue(value);
            }
        }
    }
    setValue(value: string) {
        this.editor!.getModel()!.setValue(value);
    }

    goToLine(lineNumber: number) {
        const model = this.editor!.getModel();
        const totalLines = model!.getLineCount();
        let validLineNumber = Math.max(1, Math.min(lineNumber, totalLines));
        const position: IPosition = {
            lineNumber: validLineNumber,
            column: 1,
        };
        this.editor!.setPosition(position);
        this.editor!.revealPositionInCenterIfOutsideViewport(position);
        this.editor!.focus();
    }
    getValue() {
        return this.editor?.getModel()?.getValue();
    }
}

export const EditorView = () => {
    const editorContainer = Tools.comp("div", {
        id: "editor-container",
        class: "flex w-full flex-1 border border-gray-300 box-border",
    });
    const editorModel = new EditorModel(editorContainer);
    editorModel.setLangAndContent("javascript");

    return Tools.div(
        {
            class: "flex flex-col h-screen",
            children: [editorContainer],
        },
        {},
        {
            editor: editorModel,
        }
    );
};
