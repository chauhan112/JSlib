// npm install prettier

import { GComponent } from "../../april/GComponent";
import { Tools } from "../../april/tools";
import prettier from "prettier";
import * as parserEstree from "prettier/plugins/estree";
import * as parserTypescript from "prettier/plugins/typescript";
import { CopyTools } from "./copyTools";

export const ALLOWED_ATTRIBUTES = new Set([
    "for",
    "placeholder",
    "type",
    "href",
    "disabled",
    "required",
    "key",
    "class",
]);
export class HTMLParseAndMyLib {
    unprocessAttrs = new Set<string>();
    private readonly parser = new DOMParser();
    node: Document | null = null;
    set_text(text: string) {
        this.node = this.parser.parseFromString(text, "text/html");
    }
    parseCode() {
        let ele = this.node!.body;
        return this._parseCode(ele);
    }
    private _parse2Code(ele: HTMLElement): GComponent {
        let attrs: any = {};
        for (const attr of ele.attributes) {
            if (ALLOWED_ATTRIBUTES.has(attr.name)) {
                attrs[attr.name] = attr.value;
            } else {
                this.unprocessAttrs.add(attr.name);
            }
        }

        let tagName = ele.tagName.toLocaleLowerCase();
        if (tagName === "body") tagName = "div";
        if (tagName === "svg") return Tools.comp("div", { innerHTML: "svg" });

        let processedChildren: (GComponent | Text)[] = [];
        for (const childNode of Array.from(ele.childNodes)) {
            if (childNode.nodeType === Node.ELEMENT_NODE) {
                const childElement = childNode as HTMLElement;
                if (childElement.tagName === "SCRIPT") continue;
                processedChildren.push(this._parse2Code(childElement));
            } else if (childNode.nodeType === Node.TEXT_NODE) {
                processedChildren.push(childNode as Text);
            }
        }
        if (processedChildren.length > 0) {
            return Tools.comp(tagName, {
                ...attrs,
                children: processedChildren,
            });
        }

        return Tools.comp(tagName, attrs);
    }
    async parseToString(copyTextToClipboard: boolean = false) {
        let ele = this.node!.body;

        let code = await this.parse2String(ele);
        let parser = "typescript";

        const formattedCode = await prettier.format(code, {
            parser: parser,
            plugins: [parserTypescript, parserEstree.default],
        });
        if (copyTextToClipboard) {
            CopyTools.copyTextToClipboard(formattedCode);
        }
        return formattedCode;
    }
    private checkForAttrs(ele: HTMLElement) {
        let attrs: any = {};
        for (const attr of ele.attributes) {
            if (ALLOWED_ATTRIBUTES.has(attr.name)) {
                attrs[attr.name] = attr.value;
            } else {
                this.unprocessAttrs.add(attr.name);
            }
        }

        let tagName = ele.tagName.toLocaleLowerCase();
        if (tagName === "body") tagName = "div";
        if (tagName === "svg") return `Tools.comp("div", { innerHTML: "svg" })`;

        let processedChildren: (HTMLElement | string)[] = [];
        for (const childNode of Array.from(ele.childNodes)) {
            if (childNode.nodeType === Node.ELEMENT_NODE) {
                const childElement = childNode as HTMLElement;
                if (childElement.tagName === "SCRIPT") continue;
                processedChildren.push(this._parse2String(childElement));
            } else if (childNode.nodeType === Node.TEXT_NODE) {
                let va = (childNode as Text).textContent;
                if (va) {
                    va = va.trim();
                }
                if (va !== "") attrs["textContent"] = va;
            }
        }
        console.log("processedChildren", processedChildren);
        if (processedChildren.length > 0) {
            return `Tools.comp("${tagName}", { ${this.keyValToString(
                attrs
            )} children: [${processedChildren.join(",")}] })`;
        }

        return `Tools.comp("${tagName}", {${this.keyValToString(attrs)}})`;
    }
    keyValToString(keyVal: { [key: string]: string }): string {
        let res: string[] = [];
        for (const key in keyVal) {
            if (keyVal.hasOwnProperty(key)) {
                res.push(`${key}: "${keyVal[key]}"`);
            }
        }
        let resStr = res.join(", ");
        if (resStr.length > 0) {
            resStr += ", ";
        }
        return resStr;
    }
}
export const Page = () => {
    let inpComp = Tools.comp("textarea", {
        class: "h-[80vh] w-full border p-2 rounded-md bg-gray-100 text-black",
        placeholder: "Enter HTML code",
    });
    const setValue = (comp: GComponent, val: string) => {
        (comp.getElement() as HTMLTextAreaElement).value = val;
    };
    setValue(
        inpComp,
        `<main class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Main Content Area</h1>
    <p>Scroll down to see the sticky header in action.</p>
    <div class="h-screen"></div>
    <p>Continue scrolling...</p>
    <div class="h-screen"></div>
</main>`
    );
    const getValue = (comp: GComponent) => {
        return (comp.getElement() as HTMLTextAreaElement).value;
    };
    let outComp = Tools.comp("textarea", {
        class: "h-[80vh] w-full border p-2 rounded-md bg-gray-100 text-black",
        placeholder: "Result will appear here",
    });
    const htmlToString = new HTMLParseAndMyLib();
    return Tools.div(
        {
            class: "bg-gray-100 min-h-screen flex flex-col items-center justify-center p-4 w-full",
            children: [
                Tools.comp("h1", {
                    class: "text-3xl font-semibold",
                    textContent: "HTML to MyLib",
                }),
                Tools.div({
                    class: "flex flex-1 flex-wrap md:flex-nowrap w-full items-center justify-center",
                    children: [
                        inpComp,
                        Tools.comp(
                            "button",
                            {
                                class: "mx-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300",
                                textContent: "Convert to MyLib",
                            },
                            {
                                click: (e: any, ls: any) => {
                                    htmlToString.set_text(getValue(inpComp));
                                    htmlToString.parseToString().then((res) => {
                                        setValue(outComp, res);
                                    });
                                    if (htmlToString.unprocessAttrs.size > 0) {
                                        alert(
                                            "Unprocessed attributes: " +
                                                Array.from(
                                                    htmlToString.unprocessAttrs
                                                ).join(", ")
                                        );
    }
                                },
                            }
                        ),
                        outComp,
                    ],
                }),
            ],
        },
        {},
        {
            ins: { inpComp, outComp },
            getValue,
            setValue,
        }
    );
};
