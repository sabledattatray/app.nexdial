/**
 * Automatic Field Type Inference Engine
 *
 * Implements PRD Section 7.4:
 * - Infer types with confidence scores
 * - Detects identifier columns (SKU, Zip, Phone, IDs) and prevents them
 *   from being labeled as numeric measures.
 */

import { DataType, FieldRole } from "./types";

const IDENTIFIER_NAME_PATTERNS = [
  /(^|[_ -])(id|uuid|guid)([_ -]|$)/i,
  /_id$/i,
  /id$/i,
  /(^|[_ -])(sku|code|zip|postal|pin|ssn|ein)([_ -]|$)/i,
  /(^|[_ -])(phone|mobile|telephone|fax|contact_no)([_ -]|$)/i,
  /(account|order|invoice|ticket|customer|employee|user|item|product|policy|txn|transaction)[_ -]?(no|num|number|id|code)/i,
];

const DATE_NAME_PATTERNS = [
  /\b(date|datetime|timestamp|time|dob|created_at|updated_at|order_date|due_date)\b/i,
  /_date$/i,
  /_at$/i,
];

// ISO, YYYY-MM-DD, DD/MM/YYYY, MM/DD/YYYY, YYYY/MM/DD
const DATE_STRING_PATTERNS = [
  /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/,
  /^\d{1,2}[/-]\d{1,2}[/-]\d{2,4}$/,
  /^\d{4}[/-]\d{1,2}[/-]\d{1,2}$/,
];

const BOOLEAN_VALUES = new Set([
  "true",
  "false",
  "1",
  "0",
  "yes",
  "no",
  "y",
  "n",
  "t",
  "f",
]);

export interface InferredFieldResult {
  type: DataType;
  confidence: number;
  role: FieldRole;
}

export function isIdentifierByName(fieldName: string): boolean {
  return IDENTIFIER_NAME_PATTERNS.some((pattern) => pattern.test(fieldName.trim()));
}

export function isDateByName(fieldName: string): boolean {
  return DATE_NAME_PATTERNS.some((pattern) => pattern.test(fieldName.trim()));
}

export function isLikelyDateString(val: string): boolean {
  const trimmed = val.trim();
  if (trimmed.length < 6 || trimmed.length > 35) return false;
  if (!DATE_STRING_PATTERNS.some((pat) => pat.test(trimmed))) return false;
  const parsed = Date.parse(trimmed);
  return !isNaN(parsed);
}

export function inferFieldType(
  fieldName: string,
  sampleValues: unknown[]
): InferredFieldResult {
  const cleanName = fieldName.trim();
  const nameIsIdentifier = isIdentifierByName(cleanName);
  const nameIsDate = isDateByName(cleanName);

  // Filter out null / undefined / empty string
  const validValues = sampleValues.filter(
    (v) => v !== null && v !== undefined && String(v).trim() !== ""
  );

  if (validValues.length === 0) {
    return {
      type: nameIsIdentifier ? "identifier" : nameIsDate ? "date" : "text",
      confidence: 0.5,
      role: nameIsIdentifier ? "identifier" : nameIsDate ? "time_dimension" : "dimension",
    };
  }

  // 1. Check if name strongly indicates an identifier (e.g. Phone, Zip, Order_ID)
  if (nameIsIdentifier) {
    return {
      type: "identifier",
      confidence: 0.95,
      role: "identifier",
    };
  }

  let booleanCount = 0;
  let integerCount = 0;
  let numberCount = 0;
  let dateCount = 0;
  const uniqueValues = new Set<string>();

  for (const raw of validValues) {
    const str = String(raw).trim();
    uniqueValues.add(str.toLowerCase());

    // Boolean check
    if (typeof raw === "boolean" || BOOLEAN_VALUES.has(str.toLowerCase())) {
      booleanCount++;
    }

    // Date check
    if (raw instanceof Date || isLikelyDateString(str)) {
      dateCount++;
    }

    // Numeric check
    // Allow clean numbers, currencies ($450, €20), and commas (1,240.50)
    const cleanedNumStr = str.replace(/^[$\u20AC\u00A3\u20B9]/, "").replace(/,/g, "").trim();
    if (cleanedNumStr !== "" && !isNaN(Number(cleanedNumStr))) {
      numberCount++;
      if (/^-?\d+$/.test(cleanedNumStr)) {
        integerCount++;
      }
    }
  }

  const total = validValues.length;
  const boolRatio = booleanCount / total;
  const dateRatio = dateCount / total;
  const numRatio = numberCount / total;
  const intRatio = integerCount / total;
  const uniqueRatio = uniqueValues.size / total;

  // 2. High Boolean Ratio
  if (boolRatio >= 0.85) {
    return {
      type: "boolean",
      confidence: boolRatio,
      role: "dimension",
    };
  }

  // 3. High Date Ratio
  if (dateRatio >= 0.75 || (nameIsDate && dateRatio >= 0.5)) {
    return {
      type: "date",
      confidence: Math.max(dateRatio, nameIsDate ? 0.9 : 0.75),
      role: "time_dimension",
    };
  }

  // 4. Numeric / Integer Ratio
  if (numRatio >= 0.85) {
    // If every integer is unique and total rows > 20, check if it behaves like a sequential row ID
    if (intRatio >= 0.85 && uniqueRatio >= 0.95 && total >= 20 && nameIsIdentifier) {
      return {
        type: "identifier",
        confidence: 0.9,
        role: "identifier",
      };
    }

    const isInt = intRatio >= 0.85;
    return {
      type: isInt ? "integer" : "number",
      confidence: numRatio,
      role: "measure",
    };
  }

  // 5. Categorical vs Free Text
  // If cardinality is low (e.g. unique ratio < 0.3 or unique count <= 20) -> categorical
  if (uniqueRatio <= 0.3 || uniqueValues.size <= 25) {
    return {
      type: "categorical",
      confidence: 0.85,
      role: "dimension",
    };
  }

  // Default: Free Text
  return {
    type: "text",
    confidence: 0.8,
    role: "dimension",
  };
}
