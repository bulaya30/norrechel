import { Timestamp } from "firebase-admin/firestore";

export interface System {
    id?: string;
    locked: boolean;
    date: Date;
    active?: boolean;
    deletedAt?: Timestamp
    updatedAt?: Timestamp
    createdAt?: Timestamp
}

export interface SystemInput {
    locked: boolean;
}