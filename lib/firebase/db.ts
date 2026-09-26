import "server-only";

import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import {
  FieldValue,
  getFirestore,
  type Firestore,
  type Query,
  type DocumentData,
} from "firebase-admin/firestore";

import type { ServiceAccount } from "firebase-admin";



// ==============================
// ENV VALIDATION
// ==============================
const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
} = process.env;

if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
  throw new Error("Missing Firebase environment variables");
}

// ==============================
// FIREBASE INIT
// ==============================
const serviceAccount: ServiceAccount = {
  projectId: FIREBASE_PROJECT_ID,
  clientEmail: FIREBASE_CLIENT_EMAIL,
  privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
};

const app: App =
  getApps().length === 0
    ? initializeApp({
        credential: cert(serviceAccount),
      })
    : getApps()[0];

// ==============================
// DB INSTANCES
// ==============================
const firestore: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);

// ==============================
// TYPES
// ==============================
type FirestoreData = object;

type OrderDirection = "asc" | "desc";

interface GetOptions {
  where?: WhereFilter[];
  orderByField?: string | null;
  orderDirection?: OrderDirection;
  limit?: number;
}

interface WhereFilter {
  field: string;
  operator?: FirebaseFirestore.WhereFilterOp;
  value: unknown;
}


type FirestoreDoc<T> = T & {
  id: string;
};

// ==============================
// HELPERS
// ==============================
function cleanUndefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  ) as Partial<T>;
}

// ==============================
// CRUD OPERATIONS
// ==============================
function generateId(
  collection: string,
): string {
  if (!collection.trim()) {
    throw new Error(
      "Collection name is required",
    );
  }

  return firestore
    .collection(collection)
    .doc()
    .id;
}
async function add<T extends FirestoreData>(
  collection: string,
  data: T,
  docId?: string,
): Promise<FirestoreDoc<T>> {
  const payload = {
    ...cleanUndefined(data),
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  const col = firestore.collection(collection);

  if (docId) {
    await col.doc(docId).set(payload);

    return {
      id: docId,
      ...data,
    };
  }

  const docRef = await col.add(payload);

  return {
    id: docRef.id,
    ...data,
  };
}

async function findById<T extends FirestoreData>(
  collection: string,
  id: string,
): Promise<FirestoreDoc<T> | null> {
  const doc = await firestore
    .collection(collection)
    .doc(id)
    .get();

  if (!doc.exists) {
    return null;
  }

  return {
    id: doc.id,
    ...(doc.data() as T),
  };
}

async function get<T extends FirestoreData>(
  collection: string,
  options: GetOptions = {},
): Promise<FirestoreDoc<T>[]> {
  const {
    where = [],
    orderByField = null,
    orderDirection = "desc",
    limit,
  } = options;

  const col = firestore.collection(collection);

  let query: Query<DocumentData> = col;

  // Filters
  for (const filter of where) {
    if (
      filter.value === undefined ||
      filter.value === null
    ) {
      continue;
    }

    query = query.where(
      filter.field,
      filter.operator ?? "==",
      filter.value,
    );
  }

  // Ordering
  if (orderByField) {
    query = query.orderBy(
      orderByField,
      orderDirection,
    );
  }

  // Limit
  if (limit && limit > 0) {
    query = query.limit(limit);
  }

  const snapshot = await query.get();

  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as T),
  }));
}

async function update<T extends FirestoreData>(
  collection: string,
  id: string,
  data: Partial<T>
): Promise<boolean> {
  await firestore
    .collection(collection)
    .doc(id)
    .update({
      ...cleanUndefined(data),
      updatedAt: FieldValue.serverTimestamp(),
    });

  return true;
}

async function remove(collection: string, id: string): Promise<boolean> {
  await firestore.collection(collection).doc(id).delete();
  return true;
}

async function exists(
  collection: string,
  field: string,
  value: unknown
): Promise<boolean> {
  if (field === "id" && typeof value === "string") {
    const doc = await firestore.collection(collection).doc(value).get();
    return doc.exists;
  }

  const snap = await firestore
    .collection(collection)
    .where(field, "==", value)
    .limit(1)
    .get();

  return !snap.empty;
}



// ==============================
// EXPORTS
// ==============================
const db = {
  generateId,
  add,
  findById,
  get,
  update,
  remove,
  exists,
};

export default db;
export { auth, firestore };