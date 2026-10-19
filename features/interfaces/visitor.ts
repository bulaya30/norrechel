export interface VisitorDevice {
  os?: {
    name?: string;
    version?: string;
  };

  browser?: {
    name?: string;
    version?: string;
    major?: string;
  };

  device?: {
    vendor?: string;
    model?: string;
    type?: string;
  };
}

export interface Visitor {
  id?: string;
  visitorId: string;
  ip: string;
  sessionId: string;
  visitorCount: number;
  country: string;
  city: string;
  device: VisitorDevice;
  date: Date;
  lastSeenAt: Date;
  lastSessionAt: Date;
  deletedAt?: string | object;
  updatedAt?: string | object;
  createdAt?: string | object;
}

export interface VisitorInput {
  visitorId: string;
  sessionId: string;
}