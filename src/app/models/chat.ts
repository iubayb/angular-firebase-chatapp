import { Timestamp } from "@angular/fire/firestore";

export interface Chat {
    id: string;
    userIds: string[];
}

export interface Message {
    body: string;
    senderId: string;
    sender: string;
    time: Date & Timestamp;
}