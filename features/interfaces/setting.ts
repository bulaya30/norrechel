import { Timestamp } from "firebase-admin/firestore"

export type ThemeType = 'dark' | 'default'

export type Setting = {
    id? : string,
    uid : string,
    theme: ThemeType,
    active?: boolean,
    deletedAt?: Timestamp
    updatedAt?: Timestamp
    createdAt?: Timestamp
}