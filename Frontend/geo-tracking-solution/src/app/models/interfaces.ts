export interface Chat {
    chatId: string;
    chatName: string;
    users: Contact[];
}

export interface Contact {
    name: string;
    email: string;
}

export interface ChatMessage {
    timestamp: number;
    sender: string;
    content: string;
}
