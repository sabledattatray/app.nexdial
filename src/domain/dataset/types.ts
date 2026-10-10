/**
 * OpenMIS Dataset & Profiling Domain Types
 *
 * Designed per PRD Section 7.1, 7.2, 7.4, 10
 */

export type DataType =
  | "number"
  | "integer"
  | "boolean"
  | "date"
  | "categorical"
  | "text"
  | "identifier";

export type FieldRole =
  | "measure"
  | "dimension"
  | "identifier"
  | "time_dimension";

export interface ValueFrequency {
  value: string;
  count: number;
  percentage: number;
}

export interface FieldMetadata {
  id: string; // Stable unique ID (does not change if column is renamed)
  name: string; // Display name
  originalName: string; // Raw name from spreadsheet header
  inferredType: DataType;
  userType: DataType; // Overridden type if user changed it
  confidence: number; // 0 to 1 confidence score
  role: FieldRole;
  sampleValues: unknown[];
  
  // Statistical Profile (PRD Section 7.2)
  nullCount: number;
  emptyStringCount: number;
  missingPercentage: number;
  distinctCount: number;
  
  // Numeric Stats (only populated if numeric)
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
  
  // Date Stats (only populated if date)
  minDate?: string;
  maxDate?: string;
  
  // Categorical Stats (top 5 most frequent)
  topValues?: ValueFrequency[];
}

export interface DatasetMetadata {
  id: string;
  name: string;
  rowCount: number;
  columnCount: number;
  sourceFormat: "csv" | "xlsx";
  sheetName?: string;
  availableSheets?: string[];
  sizeBytes: number;
  importedAt: string;
}

export interface DataQualityWarning {
  id: string;
  fieldId?: string;
  fieldName?: string;
  severity: "info" | "warning" | "critical";
  title: string;
  description: string;
  recommendedAction?: string;
}

export interface DatasetProfile {
  metadata: DatasetMetadata;
  fields: FieldMetadata[];
  duplicateRowsCount: number;
  qualityScore: number; // 0 to 100 overall health score
  warnings: DataQualityWarning[];
}

export type RowData = Record<string, unknown>;

export interface DatasetSnapshot {
  metadata: DatasetMetadata;
  fields: FieldMetadata[];
  rows: RowData[];
}

// Reversible Transformation Stack (PRD Section 7.3)
export type TransformationType =
  | "trim_whitespace"
  | "normalize_blanks"
  | "remove_duplicates"
  | "drop_column"
  | "rename_column"
  | "override_type"
  | "filter_rows";

export interface TransformationStep {
  id: string;
  type: TransformationType;
  description: string;
  timestamp: string;
  affectedFieldId?: string;
  params?: Record<string, unknown>;
  beforeRowCount: number;
  afterRowCount: number;
}
