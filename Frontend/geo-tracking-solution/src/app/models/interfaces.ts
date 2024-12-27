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

export interface UserInformation {
    email_verified: boolean,
    name: string,
    preferred_username: string,
    given_name: string,
    family_name: string,
    email: string
}

export interface MapType {
    value: string;
    viewValue: string;
}
