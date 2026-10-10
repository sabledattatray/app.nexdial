/**
 * OpenMIS IndexedDB Report Storage Adapter
 *
 * Implements PRD Section 7.10:
 * Stores and manages saved report configurations locally in browser IndexedDB.
 */

import { openDB, IDBPDatabase } from "idb";
import { ReportDefinition } from "@/domain/report/schema";

const DB_NAME = "openmis_local_storage";
const DB_VERSION = 2;
const DATASET_STORE = "active_datasets";
const REPORT_STORE = "saved_reports";

async function getDatabase(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(DATASET_STORE)) {
        db.createObjectStore(DATASET_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(REPORT_STORE)) {
        db.createObjectStore(REPORT_STORE, { keyPath: "id" });
      }
    },
  });
}

export async function saveReportLocally(report: ReportDefinition): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const db = await getDatabase();
    await db.put(REPORT_STORE, report);
  } catch (err) {
    console.warn("Failed to persist report to IndexedDB:", err);
  }
}

export async function loadReportLocally(id: string): Promise<ReportDefinition | null> {
  if (typeof window === "undefined") return null;
  try {
    const db = await getDatabase();
    const report = await db.get(REPORT_STORE, id);
    return report || null;
  } catch (err) {
    console.warn("Failed to load report from IndexedDB:", err);
    return null;
  }
}

export async function listSavedReportsLocally(): Promise<ReportDefinition[]> {
  if (typeof window === "undefined") return [];
  try {
    const db = await getDatabase();
    const reports = await db.getAll(REPORT_STORE);
    return reports || [];
  } catch (err) {
    console.warn("Failed to list reports from IndexedDB:", err);
    return [];
  }
}

export async function deleteReportLocally(id: string): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const db = await getDatabase();
    await db.delete(REPORT_STORE, id);
  } catch (err) {
    console.warn("Failed to delete report from IndexedDB:", err);
  }
}
