import { CrudList } from "../../../t2026/DeploymentCenter/apps/domOps/crud_list";
import type {
    IRouteController,
    IApp,
} from "../../../t2026/DeploymentCenter/interfaces";
import type { GComponent } from "../../../globalComps/GComponent";
import { DirectusModel } from "../directus/model";
import { GenericCrudModel } from "../../DeploymentCenter/apps/domOps/crud_list/generic_interface";
import { Tools } from "../../../globalComps/tools";
import { PageWithGoBackComp } from "../domOps/pages/PageWithGoBackComp";
import { TwoPeopleChatComponent, ChatBubbleComponent } from "./chatlister";
import { Bot, Headset } from "lucide";
import type { MessageItem, User } from "./interface";
import { GLMCaller, DevCaller } from "./api_caller";

export class AIChatModel extends GenericCrudModel {
    model = new DirectusModel();
    tableName = "ai_chats";
    async read_all() {
        if (!this.model.token) return [];
        const data = await this.model.get_all(this.tableName);
        this.data = data.data;
        return this.data.map((item: any) => ({
            title: item.title,
            id: item.id,
            original: item,
        }));
    }
    async read(id: string) {
        if (!this.model.token) throw new Error("No token");
        const data = await this.model.get_by_id(this.tableName, id);
        return {
            title: data.data.title,
            id: data.data.id,
            original: data.data,
        };
    }
}

export class CursorChatParser {
    get_messages(content: string): MessageItem[] {
        let lines = content.split("\n");
        let msgs = [];
        let msg = "";
        for (let line of lines) {
            if (line.startsWith("_**")) {
                msgs.push(msg);
                msg = line + "\n";
            } else msg += line + "\n";
        }
        msgs.push(msg);
        return msgs.slice(1).map((msg) => this.single_msg_parser(msg));
    }
    single_msg_parser(msg: string): MessageItem {
        let lines = msg.split("\n");
        let head = lines[0];
        let user: User = {
            name: "User",
            type: "Person",
            icon: Headset,
        };
        let name = head.substring(3, head.length - 3);
        if (name.startsWith("Agent")) {
            user = {
                name: "Agent",
                type: "Bot",
                icon: Bot,
            };
        }
        console.log(user);
        return {
            user,
            content: lines.slice(1, -1).join("\n"),
        };
    }
}

export class AIChats implements IRouteController {
    crud = new CrudList();
    initialized: boolean = false;
    infos: IApp = {
        name: "AIChats",
        href: "/ai-chats",
        subtitle: "conv with ai",
        params: ["directus-url", "directus-token", "glm-api"],
    };
    comp: GComponent = Tools.div({});
    model = new AIChatModel();
    page = new PageWithGoBackComp();
    chat = new TwoPeopleChatComponent();
    parser = new CursorChatParser();
    bubble = new ChatBubbleComponent();
    glm = new DevCaller();
    setup() {
        this.crud.model.model = this.model;
        this.crud.model.searchCtrl.search.active_comp.create = false;
        this.crud.model.searchCtrl.search.active_comp.filter = false;
        this.crud.model.contextMenuOptions.get_options = () => [];
        this.page.on_go_back = () => {
            this.comp.set_props({ innerHTML: "", children: [this.crud.comp] });
        };
        this.bubble.currentUser = {
            name: "User",
            type: "Person",
            icon: Headset,
        };
        this.crud.setup();
    }
    matches_path(path: string): boolean {
        return path === this.infos.href;
    }

    get_component(params: any): GComponent {
        if (!this.initialized) {
            let url = params["directus-url"];
            let token = params["directus-token"];
            let api_key = params["glm-api"];

            if (url.endsWith("/")) url = url.slice(0, -1);
            this.model.model.set_url_and_token(url, token);
            this.initialized = true;
            this.crud.listDisplayerCtrl.on_card_clicked =
                this.on_clicked.bind(this);
            this.glm.set_api_key(api_key);
            this.bubble.on_send = async (msg: string) => {
                const input: HTMLInputElement =
                    this.bubble.inputArea.querySelector("input")!;
                let msgItem: MessageItem = {
                    user: { name: "User", type: "Person", icon: Headset },
                    content: msg,
                };
                await this.bubble.model?.create(msgItem);
                input.value = "";

                await this.bubble.send_a_mes(msgItem);

                let res = await this.glm.get_response(msg);
                let chatMsg: MessageItem = {
                    user: { name: "Agent", type: "Bot", icon: Bot },
                    content: res,
                };
                this.bubble.model?.create(chatMsg);
                await this.bubble.send_a_mes(chatMsg);
            };
            this.comp.set_props({ innerHTML: "", children: [this.crud.comp] });
            document.body.appendChild(this.bubble.get_comp());
            this.bubble.set_title("User");
            this.crud.fetch_data_and_update();
        }

        return this.comp;
    }
    on_clicked(data: any): void {
        this.chat.set_user_name("User");

        this.chat.set_messages(this.parser.get_messages(data.original.content));
        this.display(data.title, this.chat.get_comp());
    }
    private display(title: string, comp: GComponent): void {
        this.page.set_title(title);
        this.page.display(comp);
        this.comp.set_props({ innerHTML: "", children: [this.page.comp] });
    }
    set_info(info: IApp): void {
        this.infos = info;
    }
    get_info(): IApp {
        return this.infos;
    }
}
