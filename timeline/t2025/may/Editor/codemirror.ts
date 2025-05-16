// npm install codemirror @codemirror/state @codemirror/view @codemirror/commands @codemirror/language @codemirror/lang-javascript @codemirror/lang-python @codemirror/lang-html @codemirror/lang-css @codemirror/theme-one-dark

import "./codeMirror.css";
import { EditorState, Compartment } from "@codemirror/state";
import {
    EditorView,
    keymap,
    lineNumbers,
    highlightActiveLineGutter,
    highlightSpecialChars,
    drawSelection,
    dropCursor,
    rectangularSelection,
    crosshairCursor,
    highlightActiveLine,
    // foldGutter,
} from "@codemirror/view";
import {
    defaultKeymap,
    history,
    historyKeymap,
    indentWithTab,
    // foldKeymap,
} from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { oneDark } from "@codemirror/theme-one-dark";
import { Tools } from "../../april/tools";
import { GComponent } from "../../april/GComponent";

export class CodeMirrorModel {
    private editor: EditorView | null = null;
    private readonly comp: GComponent;
    private readonly languageConf: Compartment = new Compartment();

    constructor(comp: GComponent) {
        this.comp = comp;
    }
    setUpExtensions() {
        const customTheme = EditorView.theme({
            "&": {
                // Targets the root .cm-editor element
                fontSize: "18px",
            },

            ".cm-gutters": {
                backgroundColor: "#000000 !important",
                color: "#abb2bf",
                borderRight: "1px solid rgb(36, 74, 146) !important",
                marginRight: "4px",
                paddingRight: "4px",
            },

            ".cm-activeLineGutter": {
                backgroundColor: "#3a3f4b",
            },
        });
        const basicExtensions = [
            lineNumbers(),
            highlightActiveLineGutter(),
            highlightSpecialChars(),
            history(),
            drawSelection(),
            dropCursor(),
            EditorState.allowMultipleSelections.of(true),
            rectangularSelection(),
            crosshairCursor(),
            highlightActiveLine(),
            keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
            oneDark,
            customTheme,
            // foldGutter({}),
        ];
        return basicExtensions;
    }
    getLanguageExtension(lang: string) {
        switch (lang) {
            case "python":
                return python();
            case "py":
                return python();
            case "html":
                return html();
            case "css":
                return css();
            case "javascript":
                return javascript({ jsx: false, typescript: false });
            case "js":
                return javascript({ jsx: false, typescript: false });
            case "jsx":
                return javascript({ jsx: false, typescript: false });
            case "tsx":
                return javascript({ jsx: true, typescript: true });
            case "ts":
                return javascript({ jsx: false, typescript: true });
            case "typescript":
                return javascript({ jsx: false, typescript: true });
            default:
                return [];
        }
    }
    setLangAndContent(lang: string, value: string = "") {
        if (!this.editor) {
            const basicExtensions = this.setUpExtensions();
            const startState = EditorState.create({
                doc: value,
                extensions: [
                    ...basicExtensions,
                    this.languageConf.of(this.getLanguageExtension(lang)),
                ],
            });
            this.editor = new EditorView({
                state: startState,
                parent: this.comp.getElement(),
            });
        } else {
            this.editor.dispatch({
                changes: {
                    from: 0,
                    to: this.editor.state.doc.length,
                    insert: value,
                },
                effects: this.languageConf.reconfigure(
                    this.getLanguageExtension(lang)
                ),
            });
        }
    }
    setValue(value: string) {
        this.editor!.dispatch({
            changes: {
                from: 0,
                to: this.editor!.state.doc.length,
                insert: value,
            },
        });
    }

    goToLine(lineNumber: number) {
        if (!this.editor || isNaN(lineNumber) || lineNumber < 1) {
            console.warn("Invalid line number or editor not ready.");
            return;
        }
        const line = this.editor.state.doc.line(
            Math.min(lineNumber, this.editor.state.doc.lines)
        );
        this.editor.dispatch({
            selection: { anchor: line.from },
            effects: EditorView.scrollIntoView(line.from, { y: "center" }),
        });
        this.editor.focus();
    }
    getValue(): string {
        return this.editor!.state.doc.toString();
    }
}

export const CodeMirrorEditor = () => {
    const editorContainer = Tools.comp("div", {
        id: "editor-container",
        class: "flex w-full flex-1 border border-gray-300 box-border",
    });
    const editorModel = new CodeMirrorModel(editorContainer);
    editorModel.setLangAndContent("javascript");

    return Tools.div(
        {
            class: "flex flex-col h-screen w-full",
            children: [editorContainer],
        },
        {},
        {
            editor: editorModel,
        }
    );
};
