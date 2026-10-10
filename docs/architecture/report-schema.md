# Report Definition Schema Specification (v1.0.0)

> **Specification:** `ReportDefinitionSchema v1.0.0`  
> **Validator:** Zod  
> **Location:** `src/lib/types/report-definition.ts`  

---

## 1. Overview

The OpenMIS Report Definition Schema defines a portable, versioned JSON format for sharing and persisting executive dashboard configurations. It is designed to be completely decoupled from server backends and importable across any browser session.

---

## 2. JSON Structure

```json
{
  "version": "1.0.0",
  "id": "rep_9f83a2",
  "title": "Quarterly Sales MIS",
  "description": "Executive review of revenue, gross margins, and category concentration.",
  "createdAt": "2026-10-10T14:30:00.000Z",
  "updatedAt": "2026-10-10T14:45:00.000Z",
  "globalFilters": {
    "dateRange": {
      "column": "order_date",
      "start": "2026-01-01",
      "end": "2026-09-30"
    },
    "categorical": [
      {
        "column": "region",
        "selectedValues": ["North", "West"]
      }
    ]
  },
  "widgets": [
    {
      "id": "wid_1",
      "title": "Total Revenue",
      "subtitle": "Gross invoiced volume",
      "type": "kpi",
      "measure": "amount",
      "aggregation": "SUM",
      "format": "currency",
      "layout": { "w": 4, "h": 2 }
    },
    {
      "id": "wid_2",
      "title": "Sales by Category",
      "type": "bar",
      "dimension": "category",
      "measure": "amount",
      "aggregation": "SUM",
      "sortBy": "value",
      "sortOrder": "desc",
      "topN": 6,
      "colorPalette": "corporate",
      "layout": { "w": 8, "h": 4 }
    }
  ]
}
```

---

## 3. Supported Widget Types & Aggregations

### Chart Types
- `kpi`: Large numerical metric display with optional secondary comparison delta.
- `bar`: Horizontal bar chart for discrete category comparisons.
- `column`: Vertical column chart for categories or discrete periods.
- `line`: Continuous time-series line chart.
- `area`: Filled gradient area chart for volume trends over time.
- `donut`: Part-to-whole composition chart (capped at top-6 slices + 'Other').
- `scatter`: Correlation plot comparing two continuous numerical measures.
- `table`: Tabular data view with column-level sorting and pagination.

### Aggregations
- `SUM`: Exact mathematical summation of non-null numeric values.
- `AVERAGE`: Arithmetic mean: Sum / Count(Non-null values).
- `COUNT`: Total row count.
- `DISTINCT_COUNT`: Number of unique non-null values.
- `MIN`: Minimum numeric or date value.
- `MAX`: Maximum numeric or date value.
- `MEDIAN`: Median value computed from sorted numeric distribution.
