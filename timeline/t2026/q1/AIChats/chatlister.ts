import { Tools } from "../../../globalComps/tools";
import type { IChatComp, MessageItem } from "./interface";
import { marked } from "marked";
// bun add marked
import type { GComponent } from "../../../globalComps/GComponent";
import { Headset, MessageSquare, MoreHorizontal, Send, User, X } from "lucide";
import type { IDatamodel } from "../lister/interface";
import { LocalStorageDataModel } from "../lister/data_model";
import "./chat.css";
export const TwoPeopleChatComp = () => {
    let header = Tools.div({
        class: "bg-gray-50 border-b p-4 font-semibold text-gray-800 flex flex-col justify-center",
    });
    let msgContainer = Tools.div({
        class: "flex-1 p-4 overflow-y-auto chat-scroll flex flex-col gap-4 bg-white",
    });
    return Tools.div(
        {
            class: "flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden",
            children: [header, msgContainer],
        },
        {},
        { header, msgContainer },
    );
};

export class Bubble {
    comp = Tools.div({});
    is_open: boolean = false;
    get_comp(): GComponent {
        return this.comp;
    }

    on_click(): void {
        if (this.is_open) {
            this.comp.set_props({ class: "hidden" });
            this.is_open = false;
        } else {
            this.comp.set_props({ class: "" });
            this.is_open = true;
        }
    }
}

export class TwoPeopleChatComponent implements IChatComp {
    username: string = "User";
    comp = TwoPeopleChatComp();

    get_comp(): GComponent {
        return this.comp;
    }

    set_user_name(name: string): void {
        this.username = name;
        this.comp.s.header.set_props({
            innerHTML: `<span>Chatting as: <span class="text-blue-600">${name}</span></span>`,
        });
    }

    set_messages(msgs: MessageItem[]): void {
        this.comp.s.msgContainer.set_props({ innerHTML: "" });
        msgs.forEach((msg) => this.add_a_message(msg));
    }

    add_a_message(msg: MessageItem): void {
        const isMe = msg.user.name === this.username;
        const msgUI = this.create_msg_ui(msg, isMe);

        this.comp.s.msgContainer.set_props({ child: msgUI });
        console.log(this.comp.s.msgContainer);
        const el = this.comp.s.msgContainer.getElement();
        el.scrollTop = el.scrollHeight;
    }

    private create_msg_ui(msg: MessageItem, isMe: boolean): GComponent {
        const alignClass = isMe
            ? "self-end flex-row-reverse"
            : "self-start flex-row";
        const bgClass = isMe
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-800";
        const radiusClass = isMe ? "rounded-br-none" : "rounded-bl-none";

        const iconCom = Tools.div({
            class: "w-8 h-8 rounded-full bg-gray-200 border flex items-center justify-center flex-shrink-0 text-gray-600 shadow-sm",
            children: [Tools.icon(msg.user.icon, { class: "w-4 h-4" })],
        });

        const bubble = Tools.div({
            class: `p-3 rounded-2xl text-sm shadow-sm ${bgClass} ${radiusClass} prose prose-sm max-h-80 overflow-y-auto`,
            innerHTML: marked.parse(msg.content),
        });

        return Tools.div({
            class: `flex items-end gap-2 max-w-[85%] ${alignClass}`,
            children: [iconCom, bubble],
        });
    }
}
// class ManyPeopleChatComponent {
//     constructor() {
//         this.container = document.createElement("div");
//         this.container.className =
//             "flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden";

//         this.header = document.createElement("div");
//         this.header.className =
//             "bg-indigo-600 text-white p-4 font-semibold shadow-sm flex items-center gap-2";

//         this.messagesContainer = document.createElement("div");
//         this.messagesContainer.className =
//             "flex-1 p-4 overflow-y-auto chat-scroll flex flex-col gap-3 bg-gray-50";

//         this.container.appendChild(this.header);
//         this.container.appendChild(this.messagesContainer);
//     }

//     get_comp() {
//         return this.container;
//     }

//     set_group_name(name) {
//         this.header.innerHTML = `<i data-lucide="users" class="w-5 h-5"></i> <span>${name}</span>`;
//     }

//     _getColorForName(name) {
//         const colors = [
//             "bg-red-100 text-red-900",
//             "bg-green-100 text-green-900",
//             "bg-yellow-100 text-yellow-900",
//             "bg-purple-100 text-purple-900",
//             "bg-pink-100 text-pink-900",
//             "bg-teal-100 text-teal-900",
//         ];
//         let hash = 0;
//         for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
//         return colors[hash % colors.length];
//     }

//     set_messages(msgs) {
//         this.messagesContainer.innerHTML = "";
//         msgs.forEach((msg) => {
//             const bgClass = this._getColorForName(msg.user.name);

//             const msgWrapper = document.createElement("div");
//             msgWrapper.className = `flex flex-col self-start max-w-[90%] gap-1`;

//             const nameLabel = document.createElement("span");
//             nameLabel.className =
//                 "text-xs font-medium text-gray-500 ml-1 flex items-center gap-1";
//             nameLabel.innerHTML = `<i data-lucide="${msg.user.icon}" class="w-3 h-3"></i> ${msg.user.name}`;

//             const bubble = document.createElement("div");
//             bubble.className = `px-3 py-2 rounded-xl md-content text-sm shadow-sm ${bgClass}`;
//             bubble.innerHTML = marked.parse(msg.content);

//             msgWrapper.appendChild(nameLabel);
//             msgWrapper.appendChild(bubble);
//             this.messagesContainer.appendChild(msgWrapper);
//         });
//         lucide.createIcons({ root: this.container });
//         this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
//     }
// }

// class AIChatComponent extends TwoPeopleChatComponent {
//     set_api_and_model(api, model) {
//         this.header.innerHTML = `
//                     <div class="flex items-center gap-2 text-indigo-700 font-bold">
//                         <i data-lucide="bot" class="w-5 h-5"></i>
//                         <span>AI Assistant</span>
//                     </div>
//                     <div class="text-xs text-gray-500 font-normal mt-1 flex items-center gap-1">
//                         <span class="bg-gray-200 px-2 py-0.5 rounded-full">API: ${api}</span>
//                         <span class="bg-gray-200 px-2 py-0.5 rounded-full">Model: ${model}</span>
//                     </div>
//                 `;
//     }
// }

// // ==========================================
// // NEW: AIChatComponentWithThink
// // ==========================================
// class AIChatComponentWithThink extends AIChatComponent {
//     // Overriding set_messages to support the 'think' tag
//     set_messages(msgs) {
//         this.messagesContainer.innerHTML = "";

//         msgs.forEach((msg) => {
//             const isMe = msg.user.name === this.userName;
//             const alignClass = isMe
//                 ? "self-end flex-row-reverse"
//                 : "self-start flex-row";
//             const bgClass = isMe
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-100 text-gray-800";

//             // Changed items-end to items-start so avatars stick to the top for long AI responses
//             const msgWrapper = document.createElement("div");
//             msgWrapper.className = `flex items-start gap-2 max-w-[95%] ${alignClass}`;

//             const iconDiv = document.createElement("div");
//             iconDiv.className =
//                 "w-8 h-8 rounded-full bg-gray-200 border flex items-center justify-center flex-shrink-0 text-gray-600 shadow-sm mt-1";
//             iconDiv.innerHTML = `<i data-lucide="${msg.user.icon}" class="w-4 h-4"></i>`;

//             const bubble = document.createElement("div");
//             // Adjusted border radiuses for items-start layout
//             bubble.className = `p-3 rounded-2xl shadow-sm flex flex-col gap-2 ${bgClass} ${isMe ? "rounded-tr-none" : "rounded-tl-none"}`;

//             // --- RENDER THINKING BLOCK ---
//             if (msg.think && !isMe) {
//                 const thinkContainer = document.createElement("details");
//                 // By default open, or you can remove 'open' attribute to collapse by default
//                 thinkContainer.setAttribute("open", "");
//                 thinkContainer.className =
//                     "bg-black/5 rounded-lg border border-black/10 text-xs text-gray-600 w-full";

//                 thinkContainer.innerHTML = `
//                             <summary class="cursor-pointer px-3 py-2 font-medium flex items-center gap-2 hover:bg-black/5 rounded-t-lg transition select-none">
//                                 <i data-lucide="brain-circuit" class="w-4 h-4 text-indigo-500"></i>
//                                 <span class="flex-1">Thought Process</span>
//                                 <i data-lucide="chevron-down" class="w-3 h-3 opacity-50 transition-transform"></i>
//                             </summary>
//                             <div class="px-3 py-2 border-t border-black/10 md-content bg-white/50 rounded-b-lg overflow-x-auto text-gray-500">
//                                 ${marked.parse(msg.think)}
//                             </div>
//                         `;

//                 // Add a little JS logic for rotating the chevron when collapsed/expanded
//                 thinkContainer.addEventListener("toggle", (e) => {
//                     const chevron = thinkContainer.querySelector(
//                         '[data-lucide="chevron-down"]',
//                     );
//                     if (thinkContainer.open)
//                         chevron.style.transform = "rotate(0deg)";
//                     else chevron.style.transform = "rotate(-90deg)";
//                 });

//                 bubble.appendChild(thinkContainer);
//             }

//             // --- RENDER STANDARD CONTENT ---
//             const contentDiv = document.createElement("div");
//             contentDiv.className = "md-content text-sm";
//             contentDiv.innerHTML = marked.parse(msg.content);
//             bubble.appendChild(contentDiv);

//             msgWrapper.appendChild(iconDiv);
//             msgWrapper.appendChild(bubble);
//             this.messagesContainer.appendChild(msgWrapper);
//         });

//         lucide.createIcons({ root: this.messagesContainer });
//         this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
//     }
// }

export class ChatBubbleComponent {
    container: HTMLDivElement;
    btn: HTMLButtonElement;
    window: HTMLDivElement;
    header: HTMLDivElement;
    messagesContainer: HTMLDivElement;
    inputArea: HTMLFormElement;
    isOpen: boolean = false;
    currentUser: any = { name: "You", icon: "user" };
    model: IDatamodel<MessageItem> | null = null;
    constructor() {
        this.container = document.createElement("div");
        this.container.className =
            "fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3";

        this.btn = Tools.comp(
            "button",
            {
                class: "w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-blue-700 transition transform hover:scale-105",
                child: Tools.icon(MessageSquare, { class: "w-6 h-6" }),
            },
            { click: () => this.toggle() },
        ).getElement() as HTMLButtonElement;

        this.window = document.createElement("div");
        this.window.className =
            "hidden flex-col w-80 h-[28rem] bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200 origin-bottom-right transition-all";

        this.header = document.createElement("div");
        this.header.className =
            "bg-blue-600 text-white p-4 font-semibold flex justify-between items-center shadow-md z-10";

        this.messagesContainer = document.createElement("div");
        this.messagesContainer.className =
            "flex-1 p-4 overflow-y-auto chat-scroll flex flex-col gap-3 bg-gray-50";

        this.inputArea = Tools.comp("form", {
            class: "border-t border-gray-200 p-3 flex gap-2 bg-white",
            children: [
                Tools.comp("input", {
                    type: "text",
                    class: "flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition",
                    placeholder: "Type a message...",
                    required: true,
                }),
                Tools.comp("button", {
                    type: "submit",
                    class: "bg-blue-600 text-white w-9 h-9 flex items-center justify-center rounded-full hover:bg-blue-700 transition flex-shrink-0",
                    child: Tools.icon(Send, { class: "w-4 h-4" }),
                }),
            ],
        }).getElement() as HTMLFormElement;
        this.inputArea.onsubmit = (e) => this.sendMessage(e);

        this.window.appendChild(this.header);
        this.window.appendChild(this.messagesContainer);
        this.window.appendChild(this.inputArea);

        this.container.appendChild(this.window);
        this.container.appendChild(this.btn);

        this.isOpen = false;
        this.currentUser = { name: "You", type: "Person", icon: User };
        this.set_model(new LocalStorageDataModel("chat_messages") as any);
    }

    get_comp() {
        return this.container;
    }

    toggle() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.window.classList.remove("hidden");
            this.window.classList.add("flex");
            this.btn.innerHTML = Tools.icon(X, {
                class: "w-5 h-5",
            }).getElement().outerHTML;
            this.messagesContainer.scrollTop =
                this.messagesContainer.scrollHeight;
        } else {
            this.window.classList.add("hidden");
            this.window.classList.remove("flex");
            this.btn.innerHTML = Tools.icon(MessageSquare, {
                class: "w-5 h-5",
            }).getElement().outerHTML;
        }
    }

    set_title(name: string) {
        this.header.innerHTML =
            `<span>${name}</span> ` +
            Tools.comp("button", {
                child: Tools.icon(MoreHorizontal, { class: "w-4 h-4" }),
            }).getElement().outerHTML;
    }

    set_model(model: any) {
        this.model = model;
        this.model!.read_all().then((msgs) => {
            if (msgs.length === 0) {
                this.model!.create({
                    user: { name: "Support", type: "Person", icon: Headset },
                    content: "Hello! How can we help you today?",
                });
            }
            this.set_messages(msgs);
        });
    }

    set_messages(msgs: MessageItem[]) {
        this.messagesContainer.innerHTML = "";
        msgs.forEach(async (msg) => {
            const isMe = msg.user.name === this.currentUser.name;
            const alignClass = isMe
                ? "self-end bg-blue-600 text-white rounded-br-sm"
                : "self-start bg-white border border-gray-200 text-gray-800 rounded-bl-sm";

            const div = document.createElement("div");
            div.className = `px-3 py-2 rounded-2xl max-w-[85%] text-sm md-content shadow-sm ${alignClass}`;
            div.innerHTML = await marked.parse(msg.content);
            this.messagesContainer.appendChild(div);
        });
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    private sendMessage(e: Event) {
        e.preventDefault();

        const input: HTMLInputElement = this.inputArea.querySelector("input")!;
        const text = input.value.trim();

        if (!text || !this.model) return;
        this.on_send(text);
        input.value = "";
    }
    on_send(msg: string) {
        this.model!.create({ user: this.currentUser, content: msg }).then(() =>
            this.model!.read_all().then((msgs) => this.set_messages(msgs)),
        );
    }
}
