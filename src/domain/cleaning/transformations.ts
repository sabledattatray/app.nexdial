/**
 * OpenMIS Reversible Data Cleaning & Transformation Reducers
 *
 * Implements PRD Section 7.3:
 * Safe, previewable, reversible operations on working datasets.
 * Maintains immutable original snapshots and generates an event-sourced audit log.
 */

import { RowData, FieldMetadata, TransformationStep, DataType } from "../dataset/types";

export interface CleaningResult {
  updatedRows: RowData[];
  updatedFields: FieldMetadata[];
  step: TransformationStep;
}

export function trimWhitespace(
  rows: RowData[],
  fields: FieldMetadata[]
): CleaningResult {
  let affectedCells = 0;
  const updatedRows = rows.map((row) => {
    const newRow: RowData = {};
    for (const key of Object.keys(row)) {
      const val = row[key];
      if (typeof val === "string") {
        const trimmed = val.trim();
        if (trimmed !== val) affectedCells++;
        newRow[key] = trimmed;
      } else {
        newRow[key] = val;
      }
    }
    return newRow;
  });

  const step: TransformationStep = {
    id: `step_${Date.now()}_trim`,
    type: "trim_whitespace",
    description: `Trimmed leading and trailing whitespace (${affectedCells} cell values modified)`,
    timestamp: new Date().toISOString(),
    beforeRowCount: rows.length,
    afterRowCount: rows.length,
  };

  return { updatedRows, updatedFields: fields, step };
}

export function normalizeBlanks(
  rows: RowData[],
  fields: FieldMetadata[]
): CleaningResult {
  let normalizedCells = 0;
  const updatedRows = rows.map((row) => {
    const newRow: RowData = {};
    for (const key of Object.keys(row)) {
      const val = row[key];
      if (typeof val === "string" && val.trim() === "") {
        normalizedCells++;
        newRow[key] = null;
      } else {
        newRow[key] = val;
      }
    }
    return newRow;
  });

  const step: TransformationStep = {
    id: `step_${Date.now()}_normalize`,
    type: "normalize_blanks",
    description: `Converted ${normalizedCells} blank/whitespace strings to null`,
    timestamp: new Date().toISOString(),
    beforeRowCount: rows.length,
    afterRowCount: rows.length,
  };

  return { updatedRows, updatedFields: fields, step };
}

export function removeDuplicateRows(
  rows: RowData[],
  fields: FieldMetadata[]
): CleaningResult {
  const seen = new Set<string>();
  const updatedRows: RowData[] = [];

  for (const row of rows) {
    const serialized = JSON.stringify(row);
    if (!seen.has(serialized)) {
      seen.add(serialized);
      updatedRows.push(row);
    }
  }

  const removedCount = rows.length - updatedRows.length;

  const step: TransformationStep = {
    id: `step_${Date.now()}_dedupe`,
    type: "remove_duplicates",
    description: `Removed ${removedCount} duplicate rows (${rows.length} → ${updatedRows.length})`,
    timestamp: new Date().toISOString(),
    beforeRowCount: rows.length,
    afterRowCount: updatedRows.length,
  };

  return { updatedRows, updatedFields: fields, step };
}

export function dropColumn(
  rows: RowData[],
  fields: FieldMetadata[],
  fieldId: string
): CleaningResult {
  const targetField = fields.find((f) => f.id === fieldId);
  const targetName = targetField ? targetField.name : fieldId;

  const updatedFields = fields.filter((f) => f.id !== fieldId);
  const updatedRows = rows.map((row) => {
    const newRow = { ...row };
    delete newRow[targetName];
    if (targetField) delete newRow[targetField.originalName];
    return newRow;
  });

  const step: TransformationStep = {
    id: `step_${Date.now()}_drop_${fieldId}`,
    type: "drop_column",
    description: `Dropped column "${targetName}"`,
    affectedFieldId: fieldId,
    timestamp: new Date().toISOString(),
    beforeRowCount: rows.length,
    afterRowCount: rows.length,
  };

  return { updatedRows, updatedFields, step };
}

export function renameColumn(
  rows: RowData[],
  fields: FieldMetadata[],
  fieldId: string,
  newName: string
): CleaningResult {
  const cleanNewName = newName.trim();
  const targetField = fields.find((f) => f.id === fieldId);
  const oldName = targetField ? targetField.name : fieldId;

  const updatedFields = fields.map((f) =>
    f.id === fieldId ? { ...f, name: cleanNewName } : f
  );

  const updatedRows = rows.map((row) => {
    const newRow = { ...row };
    if (oldName in newRow) {
      newRow[cleanNewName] = newRow[oldName];
      delete newRow[oldName];
    }
    return newRow;
  });

  const step: TransformationStep = {
    id: `step_${Date.now()}_rename_${fieldId}`,
    type: "rename_column",
    description: `Renamed column "${oldName}" to "${cleanNewName}"`,
    affectedFieldId: fieldId,
    params: { oldName, newName: cleanNewName },
    timestamp: new Date().toISOString(),
    beforeRowCount: rows.length,
    afterRowCount: rows.length,
  };

  return { updatedRows, updatedFields, step };
}

export function overrideColumnType(
  fields: FieldMetadata[],
  fieldId: string,
  newType: DataType
): { updatedFields: FieldMetadata[]; step: TransformationStep } {
  const targetField = fields.find((f) => f.id === fieldId);
  const oldType = targetField ? targetField.userType : "text";

  const updatedFields = fields.map((f) =>
    f.id === fieldId
      ? {
          ...f,
          userType: newType,
          role:
            newType === "number" || newType === "integer"
              ? ("measure" as const)
              : newType === "date"
              ? ("time_dimension" as const)
              : newType === "identifier"
              ? ("identifier" as const)
              : ("dimension" as const),
        }
      : f
  );

  const step: TransformationStep = {
    id: `step_${Date.now()}_type_${fieldId}`,
    type: "override_type",
    description: `Changed type of "${targetField?.name}" from ${oldType} to ${newType}`,
    affectedFieldId: fieldId,
    params: { oldType, newType },
    timestamp: new Date().toISOString(),
    beforeRowCount: 0,
    afterRowCount: 0,
  };

  return { updatedFields, step };
}
