/**
 * OpenMIS Derived Metrics & Ratio Calculator
 *
 * Implements PRD Section 7.6:
 * Verified calculations for % change, variance, margin, and period comparisons.
 */

import { safeDivide } from "./aggregations";

export interface DerivedCalculationResult {
  value: number | null;
  formula: string;
  formattedText: string;
  isPositive?: boolean;
  caveat?: string;
}

export function calculatePercentageChange(
  current: number,
  baseline: number
): DerivedCalculationResult {
  if (baseline === 0) {
    return {
      value: null,
      formula: "((Current - Baseline) / Baseline) * 100",
      formattedText: "N/A (Baseline was 0)",
      caveat: "Percentage change is undefined when baseline is zero.",
    };
  }

  const diff = current - baseline;
  const ratio = safeDivide(diff, Math.abs(baseline));

  if (ratio === null) {
    return {
      value: null,
      formula: "((Current - Baseline) / Baseline) * 100",
      formattedText: "N/A",
      caveat: "Unable to calculate ratio.",
    };
  }

  const pct = Math.round(ratio * 1000) / 10;
  return {
    value: pct,
    formula: `((${current.toLocaleString()} - ${baseline.toLocaleString()}) / |${baseline.toLocaleString()}|) * 100`,
    formattedText: `${pct > 0 ? "+" : ""}${pct.toFixed(1)}%`,
    isPositive: pct >= 0,
  };
}

export function calculateMargin(
  revenue: number,
  cost: number
): DerivedCalculationResult {
  const profit = revenue - cost;
  const marginRatio = safeDivide(profit, revenue);

  if (marginRatio === null) {
    return {
      value: null,
      formula: "(Revenue - Cost) / Revenue",
      formattedText: "N/A",
      caveat: "Margin undefined when revenue is zero.",
    };
  }

  const marginPct = Math.round(marginRatio * 1000) / 10;
  return {
    value: marginPct,
    formula: `(${revenue.toLocaleString()} - ${cost.toLocaleString()}) / ${revenue.toLocaleString()}`,
    formattedText: `${marginPct.toFixed(1)}%`,
    isPositive: marginPct >= 0,
  };
}

export function calculateRatio(
  numerator: number,
  denominator: number,
  label = "Ratio"
): DerivedCalculationResult {
  const res = safeDivide(numerator, denominator);
  if (res === null) {
    return {
      value: null,
      formula: `${label} = Numerator / Denominator`,
      formattedText: "N/A",
      caveat: "Denominator is zero.",
    };
  }

  const rounded = Math.round(res * 100) / 100;
  return {
    value: rounded,
    formula: `${numerator.toLocaleString()} / ${denominator.toLocaleString()}`,
    formattedText: `${rounded}:1`,
    isPositive: rounded >= 1,
  };
}
