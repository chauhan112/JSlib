import type { IconNode } from "lucide";

export type User = {
    name: string;
    type: "Person" | "Bot";
    icon: IconNode;
};

export type MessageItem = {
    user: User;
    content: string;
};

export interface IComponent {
    get_comp(): HTMLElement;
}

export class TwoPeopleChatComponent implements IComponent {
    // show the message on two side. User on right and Other person on Left
    get_comp(): HTMLElement {
        throw new Error("Method not implemented.");
    }
    set_user_name(name: string): void {
        throw new Error("Method not implemented.");
    }
    set_messages(msgs: MessageItem[]): void {
        // (content is of type markdown)
        throw new Error("Method not implemented.");
    }
}

export class ManyPeopleChatComponent implements IComponent {
    // show the messages on same side but wiht different colors
    get_comp(): HTMLElement {
        throw new Error("Method not implemented.");
    }
    set_group_name(name: string): void {
        throw new Error("Method not implemented.");
    }
    set_messages(msgs: MessageItem[]): void {
        // (content is of type markdown)
        throw new Error("Method not implemented.");
    }
}

export class AIChatComponent extends TwoPeopleChatComponent {
    set_api_and_model(api: string, model: string): void {
        // i will be using glm-4.7 for now
        throw new Error("Method not implemented.");
    }
}

export class ChatBubbleComponent implements IComponent {
    // this is a floating which will appear on the page on right bottom
    get_comp(): HTMLElement {
        throw new Error("Method not implemented.");
    }
    set_messages(msgs: MessageItem[]): void {
        // (content is of type markdown)
        throw new Error("Method not implemented.");
    }
    set_title(name: string): void {
        throw new Error("Method not implemented.");
    }
    //  not sure what else methods are required may be send messages or connecte to a model or something
}
