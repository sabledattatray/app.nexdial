"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  DatasetProfile,
  RowData,
  TransformationStep,
  DataType,
} from "@/domain/dataset/types";
import {
  trimWhitespace,
  normalizeBlanks,
  removeDuplicateRows,
  dropColumn,
  renameColumn,
  overrideColumnType,
} from "@/domain/cleaning/transformations";
import {
  saveSessionLocally,
  loadActiveSessionLocally,
  clearAllLocalSessions,
  StoredSession,
} from "@/lib/storage/dataset-storage";

interface HistorySnapshot {
  rows: RowData[];
  profile: DatasetProfile;
  step: TransformationStep;
}

interface DatasetContextType {
  profile: DatasetProfile | null;
  rows: RowData[];
  rawSnapshot: { rows: RowData[]; headers: string[] } | null;
  transformations: TransformationStep[];
  canUndo: boolean;
  canRedo: boolean;
  isLoading: boolean;
  
  // Actions
  setLoadedDataset: (
    profile: DatasetProfile,
    rows: RowData[],
    rawSnapshot: { rows: RowData[]; headers: string[] }
  ) => void;
  clearDataset: () => void;
  undo: () => void;
  redo: () => void;
  
  // Cleaning Operations
  applyTrimWhitespace: () => void;
  applyNormalizeBlanks: () => void;
  applyRemoveDuplicates: () => void;
  applyDropColumn: (fieldId: string) => void;
  applyRenameColumn: (fieldId: string, newName: string) => void;
  applyOverrideType: (fieldId: string, newType: DataType) => void;
}

const DatasetContext = createContext<DatasetContextType | null>(null);

export function DatasetProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<DatasetProfile | null>(null);
  const [rows, setRows] = useState<RowData[]>([]);
  const [rawSnapshot, setRawSnapshot] = useState<{ rows: RowData[]; headers: string[] } | null>(null);
  const [transformations, setTransformations] = useState<TransformationStep[]>([]);
  const [undoStack, setUndoStack] = useState<HistorySnapshot[]>([]);
  const [redoStack, setRedoStack] = useState<HistorySnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted session on initial mount
  useEffect(() => {
    let isMounted = true;
    loadActiveSessionLocally("active").then((saved) => {
      if (isMounted && saved) {
        setProfile(saved.profile);
        setRows(saved.rows);
        setRawSnapshot(saved.rawSnapshot);
        setTransformations(saved.transformations || []);
      }
      if (isMounted) setIsLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Save changes to IndexedDB
  const persistSession = useCallback(
    (
      newProfile: DatasetProfile | null,
      newRows: RowData[],
      newSnapshot: { rows: RowData[]; headers: string[] } | null,
      newTransforms: TransformationStep[]
    ) => {
      if (!newProfile || !newSnapshot) {
        clearAllLocalSessions();
        return;
      }
      const session: StoredSession = {
        id: "active",
        profile: newProfile,
        rows: newRows,
        rawSnapshot: newSnapshot,
        transformations: newTransforms,
        updatedAt: new Date().toISOString(),
      };
      saveSessionLocally(session);
    },
    []
  );

  const setLoadedDataset = useCallback(
    (
      newProfile: DatasetProfile,
      newRows: RowData[],
      newSnapshot: { rows: RowData[]; headers: string[] }
    ) => {
      setProfile(newProfile);
      setRows(newRows);
      setRawSnapshot(newSnapshot);
      setTransformations([]);
      setUndoStack([]);
      setRedoStack([]);
      persistSession(newProfile, newRows, newSnapshot, []);
    },
    [persistSession]
  );

  const clearDataset = useCallback(() => {
    setProfile(null);
    setRows([]);
    setRawSnapshot(null);
    setTransformations([]);
    setUndoStack([]);
    setRedoStack([]);
    clearAllLocalSessions();
  }, []);

  // Helper to commit state with undo tracking
  const pushState = useCallback(
    (
      newRows: RowData[],
      newFields: DatasetProfile["fields"],
      step: TransformationStep
    ) => {
      if (!profile) return;
      const currentSnapshot: HistorySnapshot = {
        rows,
        profile,
        step,
      };

      setUndoStack((prev) => [...prev, currentSnapshot]);
      setRedoStack([]); // Clear redo on new action

      const newProfile: DatasetProfile = {
        ...profile,
        metadata: {
          ...profile.metadata,
          rowCount: newRows.length,
          columnCount: newFields.length,
        },
        fields: newFields,
      };

      const newTransforms = [...transformations, step];

      setRows(newRows);
      setProfile(newProfile);
      setTransformations(newTransforms);
      persistSession(newProfile, newRows, rawSnapshot, newTransforms);
    },
    [profile, rows, transformations, rawSnapshot, persistSession]
  );

  const undo = useCallback(() => {
    if (undoStack.length === 0 || !profile) return;
    const last = undoStack[undoStack.length - 1];
    const newUndo = undoStack.slice(0, -1);

    const redoSnapshot: HistorySnapshot = {
      rows,
      profile,
      step: transformations[transformations.length - 1],
    };

    setRedoStack((prev) => [...prev, redoSnapshot]);
    setUndoStack(newUndo);

    const newTransforms = transformations.slice(0, -1);
    setRows(last.rows);
    setProfile(last.profile);
    setTransformations(newTransforms);
    persistSession(last.profile, last.rows, rawSnapshot, newTransforms);
  }, [undoStack, profile, rows, transformations, rawSnapshot, persistSession]);

  const redo = useCallback(() => {
    if (redoStack.length === 0 || !profile) return;
    const next = redoStack[redoStack.length - 1];
    const newRedo = redoStack.slice(0, -1);

    const undoSnapshot: HistorySnapshot = {
      rows,
      profile,
      step: next.step,
    };

    setUndoStack((prev) => [...prev, undoSnapshot]);
    setRedoStack(newRedo);

    const newTransforms = [...transformations, next.step];
    setRows(next.rows);
    setProfile(next.profile);
    setTransformations(newTransforms);
    persistSession(next.profile, next.rows, rawSnapshot, newTransforms);
  }, [redoStack, profile, rows, transformations, rawSnapshot, persistSession]);

  // Cleaning Handlers
  const applyTrimWhitespace = useCallback(() => {
    if (!profile) return;
    const res = trimWhitespace(rows, profile.fields);
    pushState(res.updatedRows, res.updatedFields, res.step);
  }, [profile, rows, pushState]);

  const applyNormalizeBlanks = useCallback(() => {
    if (!profile) return;
    const res = normalizeBlanks(rows, profile.fields);
    pushState(res.updatedRows, res.updatedFields, res.step);
  }, [profile, rows, pushState]);

  const applyRemoveDuplicates = useCallback(() => {
    if (!profile) return;
    const res = removeDuplicateRows(rows, profile.fields);
    pushState(res.updatedRows, res.updatedFields, res.step);
  }, [profile, rows, pushState]);

  const applyDropColumn = useCallback(
    (fieldId: string) => {
      if (!profile) return;
      const res = dropColumn(rows, profile.fields, fieldId);
      pushState(res.updatedRows, res.updatedFields, res.step);
    },
    [profile, rows, pushState]
  );

  const applyRenameColumn = useCallback(
    (fieldId: string, newName: string) => {
      if (!profile) return;
      const res = renameColumn(rows, profile.fields, fieldId, newName);
      pushState(res.updatedRows, res.updatedFields, res.step);
    },
    [profile, rows, pushState]
  );

  const applyOverrideType = useCallback(
    (fieldId: string, newType: DataType) => {
      if (!profile) return;
      const res = overrideColumnType(profile.fields, fieldId, newType);
      pushState(rows, res.updatedFields, res.step);
    },
    [profile, rows, pushState]
  );

  return (
    <DatasetContext.Provider
      value={{
        profile,
        rows,
        rawSnapshot,
        transformations,
        canUndo: undoStack.length > 0,
        canRedo: redoStack.length > 0,
        isLoading,
        setLoadedDataset,
        clearDataset,
        undo,
        redo,
        applyTrimWhitespace,
        applyNormalizeBlanks,
        applyRemoveDuplicates,
        applyDropColumn,
        applyRenameColumn,
        applyOverrideType,
      }}
    >
      {children}
    </DatasetContext.Provider>
  );
}

export function useDataset() {
  const context = useContext(DatasetContext);
  if (!context) {
    throw new Error("useDataset must be used within a DatasetProvider");
  }
  return context;
}
