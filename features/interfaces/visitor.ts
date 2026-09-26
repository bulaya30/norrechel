export interface Visitor {
    id?: string
    visitorId : string
    ip: string
    sessionId : string,
    visitorCount: number,
    country : string,
    city : string,
    device: object,
    date: Date,
    lastSeenAt: Date
    lastSessionAt: Date,
    deletedAt?: string | object
    updatedAt?: string | object
    createdAt?: string | object
}

export interface VisitorInput {
    visitorId : string;
    sessionId : string;
}