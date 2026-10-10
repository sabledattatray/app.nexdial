export interface MISTemplateWidget {
  id: string;
  type: "kpi" | "bar" | "column" | "line" | "area" | "donut" | "scatter" | "table";
  title: string;
}

export interface MISTemplate {
  id: string;
  name: string;
  category: "sales" | "finance" | "inventory" | "hr" | "operations" | "marketing" | "projects";
  description: string;
  filename: string;
  requiredColumns: string[];
  metrics: string[];
  fictionalRows: number;
  widgets: MISTemplateWidget[];
}

export const MIS_TEMPLATES: MISTemplate[] = [
  {
    id: "sales_mis",
    name: "Sales MIS Dashboard",
    category: "sales",
    description: "Track sales performance by region, rep leaderboard, deal volume, average transaction size, and month-over-month growth.",
    filename: "sales-mis.csv",
    requiredColumns: ["Date", "Sales_Rep", "Region", "Category", "Revenue", "Units_Sold"],
    metrics: ["Total Revenue", "Avg Deal Size", "Total Units", "Regional Breakdown"],
    fictionalRows: 1420,
    widgets: [
      { id: "w1", type: "kpi", title: "Total Revenue" },
      { id: "w2", type: "kpi", title: "Units Sold" },
      { id: "w3", type: "line", title: "Revenue Trend Over Time" },
      { id: "w4", type: "bar", title: "Revenue by Region" },
      { id: "w5", type: "donut", title: "Product Category Split" },
    ],
  },
  {
    id: "finance_expense",
    name: "Finance & Expense Summary",
    category: "finance",
    description: "Analyze departmental expenditure, budget vs actual variance, vendor concentration, and monthly burn rate.",
    filename: "finance-expense.csv",
    requiredColumns: ["Date", "Department", "Vendor", "Category", "Actual_Spend", "Budget_Allocated"],
    metrics: ["Total Spend", "Budget Variance", "Vendor Concentration", "Over-Budget Count"],
    fictionalRows: 980,
    widgets: [
      { id: "w1", type: "kpi", title: "Total Actual Spend" },
      { id: "w2", type: "kpi", title: "Budget Variance" },
      { id: "w3", type: "bar", title: "Spend by Department" },
      { id: "w4", type: "line", title: "Monthly Expense Trend" },
      { id: "w5", type: "donut", title: "Expense Category Split" },
    ],
  },
  {
    id: "inventory_stock",
    name: "Inventory & Stock Status",
    category: "inventory",
    description: "Monitor warehouse stock levels, SKUs nearing depletion, safety stock thresholds, and stock valuation.",
    filename: "inventory-stock.csv",
    requiredColumns: ["SKU", "Item_Name", "Warehouse", "Current_Stock", "Reorder_Level", "Unit_Cost"],
    metrics: ["Total Valuation", "Out of Stock Count", "Reorder Alerts", "Warehouse Fill %"],
    fictionalRows: 850,
    widgets: [
      { id: "w1", type: "kpi", title: "Total Stock Valuation" },
      { id: "w2", type: "kpi", title: "Low Stock Alert SKUs" },
      { id: "w3", type: "bar", title: "Valuation by Warehouse" },
      { id: "w4", type: "donut", title: "Stock Distribution" },
      { id: "w5", type: "table", title: "Reorder Priority List" },
    ],
  },
  {
    id: "hr_headcount",
    name: "HR Headcount & Attendance",
    category: "hr",
    description: "Summarize department headcount, attendance ratios, overtime expenditures, and employee turnover trends.",
    filename: "hr-attendance.csv",
    requiredColumns: ["Employee_ID", "Department", "Role", "Join_Date", "Attendance_Pct", "Overtime_Hours"],
    metrics: ["Total Headcount", "Avg Attendance", "Total Overtime", "Dept Breakdown"],
    fictionalRows: 420,
    widgets: [
      { id: "w1", type: "kpi", title: "Total Headcount" },
      { id: "w2", type: "kpi", title: "Average Attendance" },
      { id: "w3", type: "bar", title: "Headcount by Department" },
      { id: "w4", type: "column", title: "Overtime Hours by Department" },
    ],
  },
  {
    id: "operations_sla",
    name: "Operations & SLA Performance",
    category: "operations",
    description: "Evaluate ticket resolution times, SLA breach rates, operational backlog, and agent efficiency.",
    filename: "operations-sla.csv",
    requiredColumns: ["Ticket_ID", "Created_Date", "Priority", "Resolution_Hours", "SLA_Status", "Agent"],
    metrics: ["SLA Compliance %", "Avg Resolution Time", "Total Tickets", "Breach Count"],
    fictionalRows: 2150,
    widgets: [
      { id: "w1", type: "kpi", title: "SLA Compliance Rate" },
      { id: "w2", type: "kpi", title: "Average Resolution Time" },
      { id: "w3", type: "line", title: "Ticket Volume Trend" },
      { id: "w4", type: "bar", title: "Tickets by Agent" },
      { id: "w5", type: "donut", title: "Priority Breakdown" },
    ],
  },
  {
    id: "marketing_campaign",
    name: "Marketing Campaign Performance",
    category: "marketing",
    description: "Review campaign spend, impressions, click-through rates, lead conversions, and acquisition cost.",
    filename: "marketing-campaigns.csv",
    requiredColumns: ["Campaign_Name", "Channel", "Spend", "Impressions", "Clicks", "Conversions"],
    metrics: ["Total Spend", "Cost Per Acquisition (CPA)", "Overall CTR", "Total Conversions"],
    fictionalRows: 640,
    widgets: [
      { id: "w1", type: "kpi", title: "Total Campaign Spend" },
      { id: "w2", type: "kpi", title: "Total Conversions" },
      { id: "w3", type: "bar", title: "Spend vs Conversions by Channel" },
      { id: "w4", type: "donut", title: "Channel Share" },
    ],
  },
  {
    id: "project_tasks",
    name: "Project & Task Status",
    category: "projects",
    description: "Track task completion rates, blocked items, sprint velocity, and resource workload across projects.",
    filename: "project-tasks.csv",
    requiredColumns: ["Task_ID", "Project_Name", "Assignee", "Status", "Priority", "Estimated_Hours"],
    metrics: ["Completion Rate", "Blocked Tasks", "Total Estimated Hours", "High Priority Count"],
    fictionalRows: 510,
    widgets: [
      { id: "w1", type: "kpi", title: "Task Completion Rate" },
      { id: "w2", type: "kpi", title: "Blocked Tasks" },
      { id: "w3", type: "bar", title: "Tasks by Project" },
      { id: "w4", type: "donut", title: "Status Breakdown" },
    ],
  },
];
