type TimestampLike = {
  toDate?: () => Date;
  toMillis?: () => number;
  seconds?: number;
  nanoseconds?: number;
  _seconds?: number;
  _nanoseconds?: number;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isTimestampLike(
  value: unknown,
): value is TimestampLike {
  if (!isObject(value)) {
    return false;
  }

  const hasConversionMethod =
    typeof value.toDate === "function" ||
    typeof value.toMillis === "function";

  const hasPublicTimestampFields =
    typeof value.seconds === "number" &&
    typeof value.nanoseconds === "number";

  const hasAdminTimestampFields =
    typeof value._seconds === "number" &&
    typeof value._nanoseconds === "number";

  return (
    hasConversionMethod ||
    hasPublicTimestampFields ||
    hasAdminTimestampFields
  );
}

function timestampLikeToISOString(
  value: TimestampLike,
): string | null {
  let date: Date;

  if (typeof value.toDate === "function") {
    date = value.toDate();
  } else if (typeof value.toMillis === "function") {
    date = new Date(value.toMillis());
  } else {
    const seconds =
      value.seconds ??
      value._seconds;

    if (typeof seconds !== "number") {
      return null;
    }

    const nanoseconds =
      value.nanoseconds ??
      value._nanoseconds ??
      0;

    date = new Date(
      seconds * 1000 +
        Math.floor(nanoseconds / 1_000_000),
    );
  }

  return Number.isNaN(date.getTime())
    ? null
    : date.toISOString();
}

export function serializeFirestore<T>(
  value: T,
): T {
  if (value == null) {
    return value;
  }

  if (isTimestampLike(value)) {
    return timestampLikeToISOString(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) =>
      serializeFirestore(item),
    ) as T;
  }

  if (value instanceof Date) {
    return value.toISOString() as T;
  }

  if (typeof value === "object") {
    const serialized: Record<string, unknown> = {};

    for (const [key, nestedValue] of Object.entries(value)) {
      serialized[key] =
        serializeFirestore(nestedValue);
    }

    return serialized as T;
  }

  return value;
}