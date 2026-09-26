import type { Timestamp } from "firebase-admin/firestore";

export function timestampToISOString(
  value: Timestamp | null | undefined,
): string | null {
  return value?.toDate().toISOString() ?? null;
}