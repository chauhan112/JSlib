import { Tools } from "../tools";
import { GComponent, IComponent } from "../GComponent";
import clsx from "clsx";
import "./style1.css";

export class RippleLines implements IComponent {
    s: { [key: string]: any } = {};
    comp: GComponent | null = null;
    constructor(lineWidth: number = 1, nrOfLines: number = 4) {
        this.s.nrOfLines = nrOfLines;
        this.s.lineWidth = lineWidth;
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
                        "--width-of-ripple": `${this.s.lineWidth}px`,
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
    }
    getElement(): HTMLElement | SVGElement {
        if (this.comp) {
            return this.comp.getElement();
        }
        this.s.comp.textComp = Tools.comp("span", {});
        const c = Tools.div({
            class: "text-2xl font-mono",
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
        this.s.infos = {
            sections: ["About Me", "Resume", "Portfolio", "Blog", "Contact"],
            skills: [
                "Frontend (40%)",
                "Backend (20%)",
                "Artificial Intelligence (40%)",
            ],
            stats: [
                { nr: 7, text: "years of experience" },
                { nr: 40, text: "hours of coding" },
                { nr: 50, text: "Projects done" },
            ],
        };
    }
    getElement(): HTMLElement | SVGElement {
        if (this.comp) {
            return this.comp.getElement();
        }
        this.s.comps.ripple = new RippleLines();
        this.s.comps.typing = new Typing();

        this.s.comps.ripple.getElement();
        this.s.comps.typing.getElement();

        const c = Tools.div({
            class: "w-full h-full flex flex-col items-center justify-center",
            children: [this.s.comps.ripple, this.getMainPage()],
        });

        this.comp = c;
        return c.getElement();
    }
    getProps(): { [key: string]: any } {
        return this.comp!.getProps();
    }
    getMainPage() {
        return Tools.div({
            class: "w-full h-full flex gap-4 items-start justify-center",
            children: [this.getNavbar(), this.getContent()],
        });
    }
    getNavbar() {
        return Tools.comp("ul", {
            class: "flex wrap list-none items-start text-2xl font-mono flex-col",
            children: this.s.infos.sections.map((val: string) => {
                return Tools.comp("li", { textContent: val });
            }),
        });
    }
    getContent() {
        return Tools.div({
            class: "w-full h-full flex flex-col gap-4 ",
            children: [
                this.intro(),
                this.educationAndExperience(),
                this.works(),
                this.contact(),
            ],
        });
    }

    intro() {
        let FancyTitleComp = new FancyTitle("About Me");
        FancyTitleComp.getElement();
        this.s.comps.typing.comp.update({
            class: "text-xl font-mono absolute bottom-2 left-4 bg-gray-100/50 ",
        });
        return Tools.div({
            // class: "w-fit",
            children: [
                Tools.div({
                    class: "flex gap-8 mt-4 p-2 rounded-md shadow-[0_8px_26px_0_rgba(22,24,26,0.07)] hover:shadow-[0_8px_32px_0_rgba(22,24,26,0.11)] bg-white/80",
                    children: [
                        Tools.div({
                            class: "relative h-fit",
                            children: [
                                this.s.comps.typing,
                                Tools.comp("img", {
                                    class: "min-w-[256px] h-[256px] rounded-full border-2 border-dashed border-black/20",
                                    src: "https://dtoyoda10.vercel.app/data/images/avatar.jpg",
                                }),
                            ],
                        }),
                        Tools.div({
                            class: "flex flex-col h-full",
                            children: [
                                FancyTitleComp,
                                Tools.div({
                                    class: "text-4xl font-mono mt-4 font-bold ",
                                    textContent: "AI & Software Engineer",
                                }),
                                Tools.comp("p", {
                                    textContent:
                                        "Crafting the future of web & AI · Software Visionary · AI Innovator · Turning ideas into reality.",
                                }),
                                Tools.div({
                                    class: "flex gap-4 mt-4 wrap ",
                                    children: this.s.infos.skills.map(
                                        (x: string) => {
                                            return Tools.comp("span", {
                                                class: "py-2 border-1 border-dashed rounded-full px-4 inline-block border-black/20 w-max flex-shrink-0",
                                                textContent: x,
                                            });
                                        }
                                    ),
                                }),
                                Tools.div({
                                    class: "flex flex-col gap-4 mt-4 wrap sm:flex-row",
                                    children: this.s.infos.stats.map(
                                        (x: any) => {
                                            return Tools.div({
                                                class: "flex gap-2 w-max flex-shrink-0 ",
                                                children: [
                                                    Tools.comp("span", {
                                                        class: "text-4xl font-bold",
                                                        textContent: x.nr,
                                                    }),
                                                    Tools.comp("div", {
                                                        class: "font-mono",
                                                        children: [
                                                            Tools.comp("span", {
                                                                textContent:
                                                                    " + ",
                                                            }),
                                                            Tools.comp("div", {
                                                                textContent:
                                                                    x.text,
                                                            }),
                                                        ],
                                                    }),
                                                ],
                                            });
                                        }
                                    ),
                                }),
                            ],
                        }),
                    ],
                }),
                Tools.div(),
            ],
        });
    }

    educationAndExperience() {
        let FancyTitleComp = new FancyTitle("Resume");
        FancyTitleComp.getElement();
        return Tools.div({
            children: [
                FancyTitleComp,
                Tools.comp("ul", {
                    class: "list-disc",
                    children: [
                        Tools.comp("li", {
                            textContent:
                                "Bachelor of Science in Computer Science",
                        }),
                        Tools.comp("li", {
                            textContent:
                                "Software Engineer at XYZ Company (2020 - Present)",
                        }),
                    ],
                }),
            ],
        });
    }
    works() {
        let FancyTitleComp = new FancyTitle("Portfolio");
        FancyTitleComp.getElement();
        return Tools.div({
            children: [
                FancyTitleComp,
                Tools.comp("ul", {
                    class: "list-disc",
                    children: [
                        Tools.comp("li", {
                            textContent:
                                "Bachelor of Science in Computer Science",
                        }),
                        Tools.comp("li", {
                            textContent:
                                "Software Engineer at XYZ Company (2020 - Present)",
                        }),
                    ],
                }),
            ],
        });
    }
    contact() {
        let FancyTitleComp = new FancyTitle("Contact Me");
        FancyTitleComp.getElement();
        return Tools.div({
            children: [
                FancyTitleComp,
                Tools.comp("ul", {
                    class: "list-disc",
                    children: [
                        Tools.comp("li", {
                            textContent:
                                "Bachelor of Science in Computer Science",
                        }),
                        Tools.comp("li", {
                            textContent:
                                "Software Engineer at XYZ Company (2020 - Present)",
                        }),
                    ],
                }),
            ],
        });
    }
}
