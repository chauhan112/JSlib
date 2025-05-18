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
}
