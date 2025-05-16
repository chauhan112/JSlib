// npm install ace-builds
// setup in vite.config.ts
// import { viteStaticCopy } from 'vite-plugin-static-copy';
// viteStaticCopy({
//     targets: [
//         {
//             src: 'node_modules/ace-builds/src-noconflict',
//             dest: 'assets'
//         }
//     ]
// });

import ace, { Editor } from "ace-builds";

import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-tomorrow";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/mode-json";

import "ace-builds/src-noconflict/ext-language_tools";
import { Tools } from "../../april/tools";
import { GComponent } from "../../april/GComponent";

ace.config.set("basePath", "/node_modules/ace-builds/src-noconflict/");

export class AceEditorModel {
    editor: Editor;
    private readonly comp: GComponent;
    constructor(comp: GComponent) {
        this.comp = comp;
        this.editor = ace.edit(this.comp.getElement());
        this.editor.setTheme("ace/theme/eclipse");
        this.editor.session.setMode("ace/mode/javascript");
        this.editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true,
            fontSize: "1.2rem",
            showPrintMargin: false,
        });
    }
    getLanguageExtension(lang: string) {
        switch (lang) {
            case "py":
                return "ace/mode/python";
            case "js":
                return "ace/mode/javascript";
            case "jsx":
                return "ace/mode/javascript";
            case "tsx":
                return "ace/mode/typescript";
            case "ts":
                return "ace/mode/typescript";
            case "json":
                return "ace/mode/json";
            case "text":
                return "ace/mode/text";
            case "txt":
                return "ace/mode/text";
            default:
                return "ace/mode/" + lang;
        }
    }
    setLangAndContent(lang: string, value: string = "") {
        this.editor.session.setMode(this.getLanguageExtension(lang));
        this.setValue(value);
    }
    setValue(value: string) {
        this.editor.setValue(value, -1);
        this.editor.focus();
    }

    goToLine(lineNumber: number) {
        this.editor.gotoLine(lineNumber, 0, true);
        this.editor.focus();
    }
    getValue(): string {
        return this.editor.getValue();
    }
}

export const AceEditor = () => {
    const editorContainer = Tools.comp("div", {
        id: "editor-container",
        class: "flex w-full flex-1 border border-gray-300 box-border",
    });
    const editorModel = new AceEditorModel(editorContainer);
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
