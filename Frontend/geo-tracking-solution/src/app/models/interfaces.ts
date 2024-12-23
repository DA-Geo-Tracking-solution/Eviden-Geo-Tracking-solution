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
    chatId: string,
    timestamp: number,
    messageId: string,
    authorEmail: string,
    content: string
}
