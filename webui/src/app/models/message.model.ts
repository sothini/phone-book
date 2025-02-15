import { Contact } from "./contact.model";

export interface Message {
    id: number;
    user_id: number;
    type: string;
    body: string;
    contact: Contact;
    to: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface MessagesResponse {
    data: Message[];
}
