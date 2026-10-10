/**
 * OpenMIS IndexedDB Local Storage Adapter
 *
 * Implements PRD Section 7.10:
 * Stores dataset profile and working rows in browser IndexedDB.
 * Safe, zero-network, local persistence.
 */

import { openDB, IDBPDatabase } from "idb";
import { DatasetProfile, RowData, TransformationStep } from "@/domain/dataset/types";

const DB_NAME = "openmis_local_storage";
const DB_VERSION = 1;
const DATASET_STORE = "active_datasets";

export interface StoredSession {
  id: string;
  profile: DatasetProfile;
  rows: RowData[];
  rawSnapshot: {
    rows: RowData[];
    headers: string[];
  };
  transformations: TransformationStep[];
  updatedAt: string;
}

async function getDatabase(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(DATASET_STORE)) {
        db.createObjectStore(DATASET_STORE, { keyPath: "id" });
      }
    },
  });
}

export async function saveSessionLocally(session: StoredSession): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const db = await getDatabase();
    await db.put(DATASET_STORE, session);
  } catch (err) {
    console.warn("Failed to persist session to IndexedDB:", err);
  }
}

export async function loadActiveSessionLocally(sessionId = "active"): Promise<StoredSession | null> {
  if (typeof window === "undefined") return null;
  try {
    const db = await getDatabase();
    const session = await db.get(DATASET_STORE, sessionId);
    return session || null;
  } catch (err) {
    console.warn("Failed to load session from IndexedDB:", err);
    return null;
  }
}

export async function clearAllLocalSessions(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const db = await getDatabase();
    await db.clear(DATASET_STORE);
  } catch (err) {
    console.warn("Failed to clear IndexedDB:", err);
  }
}
