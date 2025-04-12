import { Tools } from "../tools";
import { GComponent, IComponent } from "../GComponent";
import clsx from "clsx";

export class RippleLines implements IComponent {
    s: { [key: string]: any } = {};
    comp: GComponent | null = null;
    constructor(lineWidth: number = 2, nrOfLines: number = 4) {
        this.s.nrOfLines = nrOfLines;
        this.s.lineWidth = lineWidth;
        this.s.styles = `
         @keyframes ripple {
            from { top: -10%; }
            to { top: 100%; }
        }
        
        .ripple-line:before {
            content: '';
            position: absolute;
            right: -1px;
            background: linear-gradient(transparent, rgba(0, 0, 0, 0.5));
            width: ${this.s.lineWidth}px;
            top: -80px;
            height: 80px;
            -webkit-animation: ripple 8s linear infinite;
            animation: ripple 8s linear infinite;
            animation-delay: var(--delay, 0s);
        }
        `;
        this.s.styleComp = Tools.comp("style", {
            type: "text/css",
            textContent: this.s.styles,
        });
        document.head.appendChild(this.s.styleComp.getElement());
    }
    getElement(): HTMLElement | SVGElement {
        if (this.comp) {
            return this.comp.getElement();
        }
        let k = 100 / (this.s.nrOfLines + 1);
        const c = Tools.div({
            class: "fixed top-0 left-0 w-full h-full z-[-1] delay-200",
            children: Array.from({ length: this.s.nrOfLines }, (_, i) => {
                return Tools.div({
                    class: clsx(
                        `absolute top-0 left-0 h-full border border-[#dcdfe2] ripple-line`
                    ),
                    style: {
                        width: `${(i + 1) * k}%`,
                        "--delay": `${i * 2}s`,
                    },
                });
            }),
        });
        this.comp = c;
        return c.getElement();
    }
    getProps(): { [key: string]: any } {
        return this.comp!.getProps();
    }
}

export class Typing implements IComponent {
    s: { [key: string]: any } = {};
    comp: GComponent | null = null;
    constructor() {
        this.s.content = ["Hello World", "I am Raja"];
        this.s.params = {
            typingSpeed: 100,
            deletingSpeed: 50,
            pauseBetween: 1500,
            cursor: "_",
            charIndex: 0,
            contentIndex: 0,
            isDeleting: false,
            isTyping: true,
        };
        this.s.comp = {};
        this.s.styles = `    
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
        .animate-blink {
            animation: blink 0.7s step-end infinite;
        }
        `;
        this.s.comp.styleComp = Tools.comp("style", {
            type: "text/css",
            textContent: this.s.styles,
        });
        document.head.appendChild(this.s.comp.styleComp.getElement());
    }
    getElement(): HTMLElement | SVGElement {
        if (this.comp) {
            return this.comp.getElement();
        }
        this.s.comp.textComp = Tools.comp("span", {});
        const c = Tools.div({
            class: "text-2xl font-mono ",
            children: [
                this.s.comp.textComp,
                Tools.comp("span", {
                    class: "ml-1 animate-blink inline-block",
                    textContent: this.s.params.cursor,
                }),
            ],
        });
        this.comp = c;
        c.getElement();
        this.start();
        return c.getElement();
    }
    getProps(): { [key: string]: any } {
        return this.comp!.getProps();
    }
    start() {
        const currentContent = this.s.content[this.s.params.contentIndex];
        if (
            !this.s.params.isDeleting &&
            this.s.params.charIndex <= currentContent.length
        ) {
            this.s.comp.textComp.update({
                textContent: currentContent.substring(
                    0,
                    this.s.params.charIndex
                ),
            });
            this.s.params.charIndex++;
            setTimeout(this.start.bind(this), this.s.params.typingSpeed);
        } else if (this.s.params.isDeleting && this.s.params.charIndex >= 0) {
            this.s.comp.textComp.update({
                textContent: currentContent.substring(
                    0,
                    this.s.params.charIndex
                ),
            });
            this.s.params.charIndex--;
            setTimeout(this.start.bind(this), this.s.params.deletingSpeed);
        } else if (
            !this.s.params.isDeleting &&
            this.s.params.charIndex > currentContent.length
        ) {
            setTimeout(() => {
                this.s.params.isDeleting = true;
                this.start();
            }, this.s.params.pauseBetween);
        } else if (this.s.params.isDeleting && this.s.params.charIndex < 0) {
            this.s.params.isDeleting = false;
            this.s.params.contentIndex =
                (this.s.params.contentIndex + 1) % this.s.content.length;
            setTimeout(this.start.bind(this), this.s.params.typingSpeed);
        }
    }
}

export class StyleComp implements IComponent {
    s: { [key: string]: any } = {};
    comp: GComponent | null = null;
    constructor(content: string) {
        this.s.styles = content;
        document.head.appendChild(this.getElement());
    }
    getElement(): HTMLElement | SVGElement {
        if (this.comp) {
            return this.comp.getElement();
        }
        this.s.comp = Tools.comp("style", {
            type: "text/css",
            textContent: this.s.styles,
        });
        return this.s.comp.getElement();
    }
    getProps(): { [key: string]: any } {
        return this.comp!.getProps();
    }
}

export class FancyTitle implements IComponent {
    s: { [key: string]: any } = {};
    comp: GComponent | null = null;
    constructor(content: string = "Hello World") {
        this.s.content = content;
        this.s.styleComp = new StyleComp(`
            .titleBack232342526 {
                -webkit-text-fill-color: transparent;
                -webkit-text-stroke-width: 1px;
                -webkit-text-stroke-color: black;
            }
        `);
    }
    getProps(): { [key: string]: any } {
        return this.comp!.getProps();
    }
    getElement(): HTMLElement | SVGElement {
        if (this.comp) {
            return this.comp.getElement();
        }
        const c = Tools.div({
            class: "relative mt-4",
            children: [
                Tools.div({
                    class: "flex font-bold",
                    textContent: "// " + this.s.content,
                }),
                Tools.div({
                    class: "absolute bottom-0 left-0 opacity-15 text-4xl font-bold titleBack232342526",
                    textContent: this.s.content,
                }),
            ],
        });
        this.comp = c;
        return c.getElement();
    }
}

export class Page implements IComponent {
    s: { [key: string]: any } = {};
    comp: GComponent | null = null;
    constructor() {
        this.s.comps = {};
    }
    getElement(): HTMLElement | SVGElement {
        if (this.comp) {
            return this.comp.getElement();
        }
        this.s.comps.ripple = new RippleLines(2, 5);
        this.s.comps.typing = new Typing();
        this.s.comps.ripple.getElement();
        this.s.comps.typing.getElement();
        const c = Tools.div({
            class: "w-full h-full flex flex-col items-center justify-center",
            children: [this.s.comps.ripple],
        });

        this.comp = c;
        return c.getElement();
    }
    getProps(): { [key: string]: any } {
        throw new Error("Method not implemented.");
    }
    getMainPage() {}
    getNavbar() {}
    getContent() {}
}
