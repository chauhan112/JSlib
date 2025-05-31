import { GComponent } from "../../april/GComponent";
import { Tools } from "../../april/tools";

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
        return this._parse2Code(ele);
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
    parseToString() {
        let ele = this.node!.body;
        return this._parse2String(ele);
    }
    _parse2String(ele: HTMLElement): string {
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

export class TestCases {
    static test1() {
        const html = `<div class="test" for="input1" placeholder="Enter text">
                        <span>Text content</span>
                        <input type="text" required />
                      </div>`;
        const parser = new HTMLParseAndMyLib();
        parser.set_text(html);
        const code = parser.parseCode();
        console.log(code);
        console.log("Unprocessed attributes:", parser.unprocessAttrs);
    }
}
