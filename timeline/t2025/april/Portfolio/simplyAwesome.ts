import { Tools } from "../tools";
import { GComponent, IComponent } from "../GComponent";
import clsx from "clsx";
import {
    GraduationCap,
    IconNode,
    BriefcaseBusiness,
    FileText,
    Github,
    Linkedin,
    Pi,
} from "lucide";
import "./style1.css";
import { Undoers } from "../Array";
import axios from "axios";

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

export class Page implements IComponent {
    s: { [key: string]: any } = {};
    comp: GComponent | null = null;
    undoer: Undoers = new Undoers();
    constructor() {
        this.s.comps = {};
        this.s.infos = {
            sections: ["About Me", "Resume", "Portfolio", "Contact"],
            skills: [
                "Frontend (40%)",
                "Backend (20%)",
                "Artificial Intelligence (40%)",
            ],
            stats: [
                { nr: 7, text: "years of experience" },
                { nr: 40, text: "hours of coding per week" },
                { nr: 50, text: "Projects done" },
            ],
            educations: [
                {
                    title: "Angewandte Mathematik und Informatik",
                    company: "FH Aachen",
                    date: "Sep 2018 - Feb 2022",
                },
                {
                    title: "Studienkolleg / Feststellungsprüfung",
                    company: "FH Kiel",
                    date: "2018 ",
                },
            ],
            experiences: [
                {
                    date: "Oct 2022 - present",
                    title: "Professional Development & Independent Projects",
                    company: "Self-Development",
                },
                {
                    date: "Sep 2022 - Sep 2024",
                    title: "Low Code Developer",
                    company: "European Computer Telecoms AG",
                },
                {
                    date: "Sep 2021 - Feb 2022",
                    title: "HiWi",
                    company: "Access e.V.",
                },
                {
                    date: "Sep 2018 - Aug 2021",
                    title: "Ausbildung MATSE",
                    company: "Access e.V.",
                },
            ],
            projects: [
                {
                    title: "Imagine Art",
                    tech: "Stable Diffusion, Next.js, Tailwind css",
                    link: "#",
                },
                {
                    title: "Soul Gen",
                    tech: "Stable Diffusion, Vite, SCSS",
                    link: "#",
                },
                {
                    title: "HeyGen",
                    tech: "GANS, TTS, NLP, MERN",
                    link: "#",
                },
                {
                    title: "DESCRIPT",
                    tech: "GENAI, TTS, Computer Vision",
                    link: "#",
                },
                {
                    title: "Plasbit",
                    tech: "Mern, Meteorjs, web3",
                    link: "#",
                },
                {
                    title: "Stelareum",
                    tech: "twig, laminas, coinbaseapi",
                    link: "#",
                },
            ],
            links: [
                { icon: Github, link: "https://github.com/chauhan112" },
                {
                    icon: Linkedin,
                    link: "https://www.linkedin.com/in/raja-babu-chauhan-7506b3222/",
                },
                { icon: FileText, link: "https://twitter.com/iamjamesm" },
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
            class: "w-full h-full flex flex-col items-center justify-center pb-8",
            children: [this.s.comps.ripple, this.header(), this.getMainPage()],
        });

        this.comp = c;
        return c.getElement();
    }
    getProps(): { [key: string]: any } {
        return this.comp!.getProps();
    }
    getMainPage() {
        return Tools.div({
            class: "w-[95%] h-full flex gap-4 items-start justify-center flex-col md:flex-row md:w-10/12",
            children: [this.getNavbar(), this.getContent()],
        });
    }
    header() {
        return Tools.div({
            class: "w-full text-4xl font-bold flex justify-between p-4 ",
            children: [
                Tools.comp("h1", {
                    textContent: "Raja Babu",
                    child: Tools.comp("span", {
                        class: "titleBack232342526",
                        textContent: " Chauhan",
                    }),
                }),
                Tools.div({ textContent: "Portfolio" }),
            ],
        });
    }
    getNavbar() {
        return Tools.comp("ul", {
            class: "flex list-none items-start text-2xl font-mono flex-col sticky top-0  w-min z-2",
            children: this.s.infos.sections.map((val: string) => {
                return Tools.comp(
                    "li",
                    {
                        class: " cursor-pointer flex hover:bg-gray-100/50 p-1 rounded-md bg-white/80 w-full",
                        children: [
                            Tools.comp("button", {
                                class: "cursor-pointer w-full text-left",
                                textContent: val,
                            }),
                            Tools.comp("div", {
                                key: "arrow",
                                class: "flex w-[30px] h-[30px] transparent rounded-full flex-shrink-0 ml-4 border border-dashed items-center justify-center",
                            }),
                        ],
                    },
                    {
                        click: (e: any, ls: any) => {
                            this.undoer.undo();
                            let cc = this.s.comps[ls.s.data];
                            cc.component.scrollIntoView({ behavior: "smooth" });
                            ls.s.arrow.update({
                                textContent: ">",
                            });
                            this.undoer.add(() => {
                                ls.s.arrow.update({
                                    textContent: "",
                                });
                            });
                        },
                    },
                    {
                        data: val,
                    }
                );
            }),
        });
    }
    getContent() {
        this.s.comps = {
            ...this.s.comps,
            "About Me": this.intro(),
            Resume: this.educationAndExperience(),
            Portfolio: this.works(),
            Contact: this.contact(),
        };
        return Tools.div({
            class: "flex flex-col gap-4 ",
            children: [
                this.s.comps["About Me"],
                this.s.comps.Resume,
                this.s.comps.Portfolio,
                this.s.comps.Contact,
            ],
        });
    }
    intro() {
        this.s.comps.typing.comp.update({
            class: "text-xl font-mono absolute bottom-2 left-4 bg-gray-100/50 ",
        });
        return CardComp({
            children: [
                Tools.div({
                    class: "flex flex-col flex-1 gap-8 mt-4 md:flex-row",
                    children: [
                        Tools.div({
                            class: "relative h-fit",
                            children: [
                                this.s.comps.typing,
                                Tools.comp("img", {
                                    class: "min-w-[256px] h-[256px] rounded-full border-2 border-dashed border-black/20",
                                    src: "",
                                }),
                            ],
                        }),
                        Tools.div({
                            class: "flex flex-col h-full",
                            children: [
                                FancyTitle("About Me"),
                                Tools.div({
                                    class: "text-4xl font-mono mt-4 font-bold ",
                                    textContent: "AI & Software Engineer",
                                }),
                                Tools.comp("p", {
                                    textContent:
                                        "Crafting the future of web & AI · Software Visionary · AI Innovator · Turning ideas into reality.",
                                }),
                                Tools.div({
                                    class: "flex gap-4 mt-4 flex-wrap",
                                    children: this.s.infos.skills.map(PillComp),
                                }),
                            ],
                        }),
                    ],
                }),
                Tools.div({
                    class: "flex gap-4 mt-4 flex-wrap",
                    children: this.s.infos.stats.map((x: any) => {
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
                                            textContent: " + ",
                                        }),
                                        Tools.comp("div", {
                                            textContent: x.text,
                                        }),
                                    ],
                                }),
                            ],
                        });
                    }),
                }),
            ],
        });
    }
    educationAndExperience() {
        return CardComp({
            children: [
                FancyTitle("Resume"),
                Tools.div({
                    class: "text-4xl font-mono font-bold ",
                    textContent: "Education & Experience",
                }),
                Tools.div({
                    class: "flex gap-4 mt-4 flex-wrap ",
                    children: [
                        TimelineComp(this.s.infos.educations, GraduationCap),
                        TimelineComp(
                            this.s.infos.experiences,
                            BriefcaseBusiness
                        ),
                    ],
                }),
            ],
        });
    }
    works() {
        return CardComp({
            children: [
                FancyTitle("Portfolio"),
                Tools.div({
                    class: "text-4xl font-mono font-bold ",
                    textContent: "My Latest Works",
                }),
                Tools.div({
                    class: "flex flex-wrap justify-center ",
                    children: this.s.infos.projects.map((x: any) => {
                        return Tools.comp("a", {
                            class: "relative w-[400px] p-4 rounded-md bg-gray-100/80 h-[200px] mt-2 ml-2 cursor-pointer hover:bg-gray-200/80",
                            children: [
                                Tools.comp("p", {
                                    class: "absolute flex text-sm justify-end top-2 right-2",
                                    textContent: x.tech,
                                }),
                                Tools.comp("div", {
                                    class: "flex text-2xl font-bold items-center justify-center h-full",
                                    textContent: x.title,
                                }),
                            ],
                            href: x.link,
                        });
                    }),
                }),
            ],
        });
    }
    contact() {
        let contactStatus = Tools.div({});
        return CardComp({
            children: [
                FancyTitle("Contact Me"),
                Tools.comp("ul", {
                    class: "flex flex-wrap gap-4 list-none ",
                    children: [
                        PillComp("Email: rajababuchauhan500@gmail.com"),
                        PillComp("Phone: +49 162 7078024"),
                    ],
                }),
                Tools.comp(
                    "form",
                    {
                        class: "flex flex-col gap-4 mt-4 ",
                        children: [
                            Row(
                                {
                                    class: "flex gap-4 flex-wrap",
                                },
                                Tools.comp("input", {
                                    class: "border-b border-dashed border-black/20  p-2 flex-1 focus:outline-none",
                                    placeholder: "Name",
                                    name: "name",
                                    required: true,
                                }),
                                Tools.comp("input", {
                                    class: "border-b border-dashed border-black/20  p-2 flex-1 focus:outline-none",
                                    placeholder: "E-mail",
                                    type: "email",
                                    name: "email",
                                    required: true,
                                })
                            ),
                            Tools.comp("input", {
                                class: "border-b border-dashed border-black/20  p-2 flex-1 focus:outline-none",
                                placeholder: "Subject",
                                name: "subject",
                                required: true,
                            }),
                            Tools.comp("textarea", {
                                class: "focus:outline-none border-b border-dashed border-black/20 resize-y p-2 h-[142px]",
                                placeholder: "Message",
                                name: "message",
                                required: true,
                            }),
                            Button(),
                            contactStatus,
                        ],
                        action: "https://formspree.io/f/xwplzpyv",
                        method: "POST",
                    },
                    {
                        submit: (e: any, ls: any) => {
                            e.preventDefault();
                            let fd = new FormData(e.target);
                            axios
                                .post(e.target.action, fd)
                                .then((res: any) => {
                                    contactStatus.update({
                                        textContent: `Thanks for your message! We will get back to you soon.`,
                                        class: "mt-4 p-3 rounded text-sm bg-green-100 border border-green-400 text-green-700",
                                    });
                                    e.target.reset();
                                })
                                .catch((err: any) => {
                                    console.error(
                                        "Form submission error:",
                                        err
                                    );
                                    contactStatus.update({
                                        textContent: `Oops! There was a problem submitting your form: ${err.message}`,
                                        class: "mt-4 p-3 rounded text-sm  bg-red-100 border border-red-400 text-red-700",
                                    });
                                });
                        },
                    }
                ),
            ],
        });
    }
}

export const PillComp = (x: string) => {
    return Tools.comp("span", {
        class: "py-2 border-1 border-dashed rounded-full px-4 inline-block border-black/20 w-max flex-shrink-0",
        textContent: x,
    });
};

export const PillCompExp = (x: string) => {
    return Tools.comp("span", {
        class: "py-2 border-1 border-dashed rounded-full px-4 inline-block border-black/20 w-max flex-shrink-0 pillEdExp2312433",
        textContent: x,
    });
};

export const TimelineComp = (items: any[], icon: IconNode) => {
    return Tools.div({
        class: "flex-1 pl-6 border-l-2 border-dashed border-black/20",
        children: [
            Tools.icon(icon, { class: "mb-2" }),

            ...items.map((x: any) => {
                return Tools.div({
                    class: "my-4",
                    children: [
                        PillCompExp(x.date),
                        Tools.comp("p", {
                            textContent: x.title,
                        }),
                        Tools.comp("span", {
                            class: "text-sm text-gray-800 ",
                            textContent: " @ " + x.company,
                        }),
                    ],
                });
            }),
        ],
    });
};

export const CardComp = (x: any) => {
    return Tools.div({
        class: "flex flex-col gap-8 p-8 rounded-md shadow-[0_8px_26px_0_rgba(22,24,26,0.07)] hover:shadow-[0_8px_32px_0_rgba(22,24,26,0.11)] bg-white/80",
        ...x,
    });
};

export const FancyTitle = (title: string, props: any = {}) => {
    return Tools.div({
        class: "relative mt-4",
        children: [
            Tools.div({
                class: "flex font-bold",
                textContent: "// " + title,
            }),
            Tools.div({
                class: "absolute bottom-0 left-0 opacity-15 text-4xl font-bold titleBack232342526",
                textContent: title,
            }),
        ],
        ...props,
    });
};

export const Row = (props: any = {}, ...x: any[]) => {
    return Tools.div({
        class: "flex gap-4",
        children: x,
        ...props,
    });
};

export const Button = () => {
    return Tools.comp("button", {
        class: "border border-dashed border-black/20 rounded-md p-2 w-fit cursor-pointer hover:bg-black/10",
        textContent: "Send Message",
        type: "submit",
    });
};
