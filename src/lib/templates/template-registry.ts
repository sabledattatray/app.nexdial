export interface MISTemplateWidget {
  id: string;
  type:
    | "kpi"
    | "bar"
    | "horizontal_bar"
    | "column"
    | "line"
    | "area"
    | "donut"
    | "pie"
    | "waterfall"
    | "gauge"
    | "funnel"
    | "scatter"
    | "table"
    | "slicer";
  title: string;
  gridSpan?: "half" | "full";
  measureField?: string;
  dimensionField?: string;
  secondaryMeasureField?: string;
  aggregation?: "sum" | "count" | "avg" | "min" | "max";
  topN?: number;
}

export type TemplateLayoutStyle =
  | "boardroom"
  | "trend_focus"
  | "split"
  | "kpi_heavy"
  | "matrix"
  | "compact";

export type TemplateColorTheme =
  | "indigo"
  | "emerald"
  | "blue"
  | "violet"
  | "amber"
  | "rose"
  | "cyan"
  | "slate";

export interface MISTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  filename: string;
  requiredColumns: string[];
  metrics: string[];
  fictionalRows: number;
  layoutStyle: TemplateLayoutStyle;
  colorTheme: TemplateColorTheme;
  widgets: MISTemplateWidget[];
}

export const MIS_TEMPLATES: MISTemplate[] = [
  {
    id: "executive_boardroom",
    name: "Executive C-Suite Boardroom",
    category: "Executive & Board",
    description: "High-level CFO/CEO executive briefing with top-line gross margin, net income, operating expenses, and department efficiency.",
    filename: "executive-boardroom.csv",
    requiredColumns: ["Period", "Department", "Gross_Revenue", "Operating_Expenses", "Net_Income", "Headcount"],
    metrics: ["Total Revenue", "Operating Expenses", "Net Income", "Total Headcount"],
    fictionalRows: 15,
    layoutStyle: "boardroom",
    colorTheme: "indigo",
    widgets: [
      { id: "eb1", type: "kpi", title: "Gross Revenue", measureField: "Gross_Revenue", aggregation: "sum" },
      { id: "eb2", type: "kpi", title: "Operating Expenses", measureField: "Operating_Expenses", aggregation: "sum" },
      { id: "eb3", type: "kpi", title: "Net Income", measureField: "Net_Income", aggregation: "sum" },
      { id: "eb4", type: "kpi", title: "Total Headcount", measureField: "Headcount", aggregation: "sum" },
      { id: "eb_slicer", type: "slicer", title: "Filter by Department", dimensionField: "Department", gridSpan: "half" },
      { id: "eb_waterfall", type: "waterfall", title: "Department Net Income Bridge", dimensionField: "Department", measureField: "Net_Income", gridSpan: "half" },
      { id: "eb5", type: "line", title: "Net Income by Period", dimensionField: "Period", measureField: "Net_Income", gridSpan: "full" },
      { id: "eb6", type: "bar", title: "Expenses by Department", dimensionField: "Department", measureField: "Operating_Expenses" },
      { id: "eb7", type: "donut", title: "Revenue Share by Dept", dimensionField: "Department", measureField: "Gross_Revenue" },
      { id: "eb_table", type: "table", title: "Department Financials Data Grid", dimensionField: "Department", measureField: "Gross_Revenue", gridSpan: "full" },
    ],
  },
  {
    id: "sales_mis",
    name: "Sales Leaderboard & Revenue MIS",
    category: "Sales & Revenue",
    description: "Track sales performance by region, rep leaderboard, deal volume, average transaction size, and month-over-month growth.",
    filename: "sales-mis.csv",
    requiredColumns: ["Date", "Sales_Rep", "Region", "Category", "Revenue", "Units_Sold"],
    metrics: ["Total Revenue", "Units Sold", "Average Revenue", "Regional Deals"],
    fictionalRows: 24,
    layoutStyle: "trend_focus",
    colorTheme: "blue",
    widgets: [
      { id: "s1", type: "kpi", title: "Total Sales Revenue", measureField: "Revenue", aggregation: "sum" },
      { id: "s2", type: "kpi", title: "Units Sold", measureField: "Units_Sold", aggregation: "sum" },
      { id: "s3", type: "kpi", title: "Deal Volume Count", measureField: "Revenue", aggregation: "count" },
      { id: "s_slicer", type: "slicer", title: "Filter by Region", dimensionField: "Region", gridSpan: "half" },
      { id: "s_leaderboard", type: "horizontal_bar", title: "Sales Rep Leaderboard", dimensionField: "Sales_Rep", measureField: "Revenue", gridSpan: "half" },
      { id: "s4", type: "line", title: "Daily Sales Revenue Trend", dimensionField: "Date", measureField: "Revenue", gridSpan: "full" },
      { id: "s5", type: "pie", title: "Regional Revenue Share", dimensionField: "Region", measureField: "Revenue" },
      { id: "s6", type: "donut", title: "Product Category Split", dimensionField: "Category", measureField: "Revenue" },
      { id: "s_table", type: "table", title: "Sales Rep Performance Grid", dimensionField: "Sales_Rep", measureField: "Revenue", gridSpan: "full" },
    ],
  },
  {
    id: "finance_expense",
    name: "Finance & Budget Expense Summary",
    category: "Accounting & Finance",
    description: "Analyze departmental expenditure, budget vs actual variance, vendor concentration, and monthly burn rate.",
    filename: "finance-expense.csv",
    requiredColumns: ["Date", "Department", "Vendor", "Category", "Actual_Spend", "Budget_Allocated"],
    metrics: ["Total Spend", "Budget Allocated", "Variance", "Vendors"],
    fictionalRows: 16,
    layoutStyle: "split",
    colorTheme: "emerald",
    widgets: [
      { id: "f1", type: "kpi", title: "Total Actual Spend", measureField: "Actual_Spend", aggregation: "sum" },
      { id: "f2", type: "kpi", title: "Budget Allocated", measureField: "Budget_Allocated", aggregation: "sum" },
      { id: "f_slicer", type: "slicer", title: "Filter by Department", dimensionField: "Department", gridSpan: "half" },
      { id: "f_waterfall", type: "waterfall", title: "Department Spend Variance Walk", dimensionField: "Department", measureField: "Actual_Spend", gridSpan: "full" },
      { id: "f3", type: "horizontal_bar", title: "Spend by Department", dimensionField: "Department", measureField: "Actual_Spend" },
      { id: "f4", type: "line", title: "Monthly Expense Trend", dimensionField: "Date", measureField: "Actual_Spend" },
      { id: "f5", type: "donut", title: "Expense Category Split", dimensionField: "Category", measureField: "Actual_Spend" },
      { id: "f_table", type: "table", title: "Department Budget Summary Grid", dimensionField: "Department", measureField: "Actual_Spend", gridSpan: "full" },
    ],
  },
  {
    id: "saas_mrr_churn",
    name: "SaaS Recurring Revenue & Churn",
    category: "SaaS & Subscriptions",
    description: "B2B SaaS metrics tracking Monthly Recurring Revenue (MRR), expansion revenue, customer churn, and subscriber cohorts.",
    filename: "saas-mrr-churn.csv",
    requiredColumns: ["Month", "Plan_Tier", "New_MRR", "Expansion_MRR", "Churn_MRR", "Active_Subscribers", "Net_MRR"],
    metrics: ["Net MRR", "Expansion MRR", "Churn MRR", "Active Subscribers"],
    fictionalRows: 12,
    layoutStyle: "kpi_heavy",
    colorTheme: "violet",
    widgets: [
      { id: "sm1", type: "kpi", title: "Total Net MRR", measureField: "Net_MRR", aggregation: "sum" },
      { id: "sm2", type: "kpi", title: "Expansion MRR", measureField: "Expansion_MRR", aggregation: "sum" },
      { id: "sm3", type: "kpi", title: "Churn MRR", measureField: "Churn_MRR", aggregation: "sum" },
      { id: "sm4", type: "kpi", title: "Active Subscribers", measureField: "Active_Subscribers", aggregation: "sum" },
      { id: "sm_slicer", type: "slicer", title: "Plan Tier Slicer", dimensionField: "Plan_Tier", gridSpan: "half" },
      { id: "sm_gauge", type: "gauge", title: "Net MRR Attainment Gauge", measureField: "Net_MRR", gridSpan: "half" },
      { id: "sm5", type: "line", title: "Net MRR Trajectory", dimensionField: "Month", measureField: "Net_MRR", gridSpan: "full" },
      { id: "sm6", type: "horizontal_bar", title: "MRR by Plan Tier", dimensionField: "Plan_Tier", measureField: "Net_MRR" },
      { id: "sm7", type: "donut", title: "Subscriber Share by Tier", dimensionField: "Plan_Tier", measureField: "Active_Subscribers" },
      { id: "sm_table", type: "table", title: "Plan Tier Performance Table", dimensionField: "Plan_Tier", measureField: "Net_MRR", gridSpan: "full" },
    ],
  },
  {
    id: "inventory_stock",
    name: "Inventory & Stock Status",
    category: "Supply Chain & Warehousing",
    description: "Monitor warehouse stock levels, SKUs nearing depletion, safety stock thresholds, and stock valuation.",
    filename: "inventory-stock.csv",
    requiredColumns: ["SKU", "Item_Name", "Warehouse", "Current_Stock", "Reorder_Level", "Unit_Cost"],
    metrics: ["Total Valuation", "Out of Stock Count", "Reorder Alerts", "Warehouse Fill %"],
    fictionalRows: 12,
    layoutStyle: "matrix",
    colorTheme: "amber",
    widgets: [
      { id: "i1", type: "kpi", title: "Current Stock Units", measureField: "Current_Stock", aggregation: "sum" },
      { id: "i2", type: "kpi", title: "Reorder Threshold Units", measureField: "Reorder_Level", aggregation: "sum" },
      { id: "i3", type: "kpi", title: "Average Unit Cost", measureField: "Unit_Cost", aggregation: "sum" },
      { id: "i_slicer", type: "slicer", title: "Filter by Warehouse", dimensionField: "Warehouse", gridSpan: "half" },
      { id: "i4", type: "bar", title: "Stock by Item Name", dimensionField: "Item_Name", measureField: "Current_Stock", topN: 8 },
      { id: "i5", type: "donut", title: "Warehouse Stock Distribution", dimensionField: "Warehouse", measureField: "Current_Stock" },
      { id: "i6", type: "scatter", title: "Stock vs Reorder Correlation", measureField: "Current_Stock", secondaryMeasureField: "Reorder_Level" },
    ],
  },
  {
    id: "ecommerce_conversion",
    name: "E-Commerce Funnel & Cart Conversion",
    category: "E-Commerce & Retail",
    description: "Direct-to-consumer store metrics tracking traffic sessions, add-to-cart rate, checkout abandonment, and device AOV.",
    filename: "ecommerce-conversion.csv",
    requiredColumns: ["Date", "Device_Type", "Sessions", "Cart_Adds", "Checkouts", "Revenue", "Conversion_Rate"],
    metrics: ["Total Revenue", "Sessions", "Checkouts", "Avg Conversion Rate"],
    fictionalRows: 16,
    layoutStyle: "trend_focus",
    colorTheme: "cyan",
    widgets: [
      { id: "ec1", type: "kpi", title: "Total E-Commerce Revenue", measureField: "Revenue", aggregation: "sum" },
      { id: "ec2", type: "kpi", title: "Sessions Traffic", measureField: "Sessions", aggregation: "sum" },
      { id: "ec3", type: "kpi", title: "Completed Checkouts", measureField: "Checkouts", aggregation: "sum" },
      { id: "ec_slicer", type: "slicer", title: "Filter by Device", dimensionField: "Device_Type", gridSpan: "half" },
      { id: "ec_funnel", type: "funnel", title: "Traffic Pipeline by Device", dimensionField: "Device_Type", measureField: "Sessions", gridSpan: "half" },
      { id: "ec_gauge", type: "gauge", title: "Conversion Attainment", measureField: "Conversion_Rate", gridSpan: "half" },
      { id: "ec4", type: "line", title: "Revenue Timeline", dimensionField: "Date", measureField: "Revenue", gridSpan: "full" },
      { id: "ec5", type: "bar", title: "Revenue by Device Type", dimensionField: "Device_Type", measureField: "Revenue" },
      { id: "ec6", type: "donut", title: "Traffic Share by Device", dimensionField: "Device_Type", measureField: "Sessions" },
      { id: "ec_table", type: "table", title: "Device Summary Grid", dimensionField: "Device_Type", measureField: "Revenue", gridSpan: "full" },
    ],
  },
  {
    id: "hr_headcount",
    name: "HR Headcount & Attendance",
    category: "Human Resources",
    description: "Summarize department headcount, attendance ratios, overtime expenditures, and employee turnover trends.",
    filename: "hr-attendance.csv",
    requiredColumns: ["Employee_ID", "Department", "Role", "Join_Date", "Attendance_Pct", "Overtime_Hours"],
    metrics: ["Total Headcount", "Avg Attendance", "Total Overtime", "Dept Breakdown"],
    fictionalRows: 12,
    layoutStyle: "split",
    colorTheme: "rose",
    widgets: [
      { id: "h1", type: "kpi", title: "Total Employees", measureField: "Overtime_Hours", aggregation: "count" },
      { id: "h2", type: "kpi", title: "Total Overtime Hours", measureField: "Overtime_Hours", aggregation: "sum" },
      { id: "h_slicer", type: "slicer", title: "Filter by Department", dimensionField: "Department", gridSpan: "half" },
      { id: "h3", type: "bar", title: "Headcount by Department", dimensionField: "Department", measureField: "Overtime_Hours" },
      { id: "h4", type: "donut", title: "Role Distribution", dimensionField: "Role", measureField: "Overtime_Hours" },
    ],
  },
  {
    id: "operations_sla",
    name: "Operations & SLA Performance",
    category: "Customer Support & SLA",
    description: "Evaluate ticket resolution times, SLA breach rates, operational backlog, and agent efficiency.",
    filename: "operations-sla.csv",
    requiredColumns: ["Ticket_ID", "Created_Date", "Priority", "Resolution_Hours", "SLA_Status", "Agent"],
    metrics: ["SLA Compliance %", "Avg Resolution Time", "Total Tickets", "Breach Count"],
    fictionalRows: 14,
    layoutStyle: "boardroom",
    colorTheme: "indigo",
    widgets: [
      { id: "o1", type: "kpi", title: "Total Tickets Handled", measureField: "Resolution_Hours", aggregation: "count" },
      { id: "o2", type: "kpi", title: "Total Resolution Hours", measureField: "Resolution_Hours", aggregation: "sum" },
      { id: "o_slicer", type: "slicer", title: "Filter by Priority", dimensionField: "Priority", gridSpan: "half" },
      { id: "o3", type: "line", title: "Resolution Hours by Date", dimensionField: "Created_Date", measureField: "Resolution_Hours", gridSpan: "full" },
      { id: "o4", type: "bar", title: "Tickets by Agent", dimensionField: "Agent", measureField: "Resolution_Hours" },
      { id: "o5", type: "donut", title: "SLA Status Ratio", dimensionField: "SLA_Status", measureField: "Resolution_Hours" },
    ],
  },
  {
    id: "marketing_campaign",
    name: "Marketing Campaign Performance",
    category: "Marketing & Growth",
    description: "Review campaign spend, impressions, click-through rates, lead conversions, and acquisition cost.",
    filename: "marketing-campaigns.csv",
    requiredColumns: ["Campaign_Name", "Channel", "Spend", "Impressions", "Clicks", "Conversions"],
    metrics: ["Total Spend", "Impressions", "Clicks", "Total Conversions"],
    fictionalRows: 12,
    layoutStyle: "trend_focus",
    colorTheme: "violet",
    widgets: [
      { id: "m1", type: "kpi", title: "Total Campaign Spend", measureField: "Spend", aggregation: "sum" },
      { id: "m2", type: "kpi", title: "Total Impressions", measureField: "Impressions", aggregation: "sum" },
      { id: "m3", type: "kpi", title: "Total Conversions", measureField: "Conversions", aggregation: "sum" },
      { id: "m_slicer", type: "slicer", title: "Filter by Channel", dimensionField: "Channel", gridSpan: "half" },
      { id: "m4", type: "bar", title: "Spend by Channel", dimensionField: "Channel", measureField: "Spend" },
      { id: "m5", type: "donut", title: "Conversions by Channel", dimensionField: "Channel", measureField: "Conversions" },
      { id: "m6", type: "scatter", title: "Spend vs Conversions", measureField: "Spend", secondaryMeasureField: "Conversions" },
    ],
  },
  {
    id: "project_tasks",
    name: "Project & Task Status",
    category: "Project Management",
    description: "Track task completion rates, blocked items, sprint velocity, and resource workload across projects.",
    filename: "project-tasks.csv",
    requiredColumns: ["Task_ID", "Project_Name", "Assignee", "Status", "Priority", "Estimated_Hours"],
    metrics: ["Completion Rate", "Blocked Tasks", "Total Estimated Hours", "High Priority Count"],
    fictionalRows: 12,
    layoutStyle: "compact",
    colorTheme: "blue",
    widgets: [
      { id: "p1", type: "kpi", title: "Total Tasks", measureField: "Estimated_Hours", aggregation: "count" },
      { id: "p2", type: "kpi", title: "Estimated Hours", measureField: "Estimated_Hours", aggregation: "sum" },
      { id: "p_slicer", type: "slicer", title: "Filter by Status", dimensionField: "Status", gridSpan: "half" },
      { id: "p3", type: "bar", title: "Hours by Project", dimensionField: "Project_Name", measureField: "Estimated_Hours" },
      { id: "p4", type: "donut", title: "Status Breakdown", dimensionField: "Status", measureField: "Estimated_Hours" },
    ],
  },
  {
    id: "logistics_fleet",
    name: "Logistics & Fleet Dispatch",
    category: "Supply Chain & Warehousing",
    description: "Fleet transit telematics, fuel consumption efficiency, distance kilometers, and on-time delivery dispatch.",
    filename: "logistics-fleet.csv",
    requiredColumns: ["Trip_ID", "Route_Code", "Driver", "Distance_KM", "Fuel_Litres", "Delivery_Status", "Transit_Hours"],
    metrics: ["Total Distance (KM)", "Fuel Consumed (L)", "Transit Hours", "Active Trips"],
    fictionalRows: 15,
    layoutStyle: "matrix",
    colorTheme: "emerald",
    widgets: [
      { id: "lf1", type: "kpi", title: "Total Distance (KM)", measureField: "Distance_KM", aggregation: "sum" },
      { id: "lf2", type: "kpi", title: "Fuel Consumed (Litres)", measureField: "Fuel_Litres", aggregation: "sum" },
      { id: "lf3", type: "kpi", title: "Total Transit Hours", measureField: "Transit_Hours", aggregation: "sum" },
      { id: "lf4", type: "bar", title: "Distance by Route", dimensionField: "Route_Code", measureField: "Distance_KM" },
      { id: "lf5", type: "donut", title: "Delivery Status Split", dimensionField: "Delivery_Status", measureField: "Distance_KM" },
      { id: "lf6", type: "scatter", title: "Distance vs Fuel Ratio", measureField: "Distance_KM", secondaryMeasureField: "Fuel_Litres" },
    ],
  },
  {
    id: "healthcare_capacity",
    name: "Healthcare & Clinic Bed Capacity",
    category: "Healthcare & Operations",
    description: "Hospital ward occupancy, ER triage wait times, admitted patients, and department doctor staffing.",
    filename: "healthcare-capacity.csv",
    requiredColumns: ["Date", "Department", "Patients_Admitted", "Bed_Occupancy_Pct", "Avg_Wait_Mins", "Doctor_Staff"],
    metrics: ["Patients Admitted", "Wait Minutes", "Doctor Staff", "Bed Occupancy"],
    fictionalRows: 15,
    layoutStyle: "boardroom",
    colorTheme: "cyan",
    widgets: [
      { id: "hc1", type: "kpi", title: "Total Patients Admitted", measureField: "Patients_Admitted", aggregation: "sum" },
      { id: "hc2", type: "kpi", title: "Doctor Staff Available", measureField: "Doctor_Staff", aggregation: "sum" },
      { id: "hc3", type: "kpi", title: "Average Wait Minutes", measureField: "Avg_Wait_Mins", aggregation: "sum" },
      { id: "hc4", type: "line", title: "Patient Volume Over Time", dimensionField: "Date", measureField: "Patients_Admitted", gridSpan: "full" },
      { id: "hc5", type: "bar", title: "Wait Time by Department", dimensionField: "Department", measureField: "Avg_Wait_Mins" },
      { id: "hc6", type: "donut", title: "Admissions by Ward", dimensionField: "Department", measureField: "Patients_Admitted" },
    ],
  },
  {
    id: "retail_pos",
    name: "Retail POS Store Cashflow",
    category: "E-Commerce & Retail",
    description: "Store registers gross sales, transaction volumes, customer return values, and retail store rankings.",
    filename: "retail-pos.csv",
    requiredColumns: ["Date", "Store_Location", "Register_No", "Gross_Sales", "Transaction_Count", "Return_Value"],
    metrics: ["Gross Sales", "Transactions", "Return Value", "Stores"],
    fictionalRows: 12,
    layoutStyle: "split",
    colorTheme: "amber",
    widgets: [
      { id: "rp1", type: "kpi", title: "Gross POS Sales", measureField: "Gross_Sales", aggregation: "sum" },
      { id: "rp2", type: "kpi", title: "Completed Transactions", measureField: "Transaction_Count", aggregation: "sum" },
      { id: "rp3", type: "kpi", title: "Product Return Value", measureField: "Return_Value", aggregation: "sum" },
      { id: "rp4", type: "bar", title: "Sales by Store Location", dimensionField: "Store_Location", measureField: "Gross_Sales" },
      { id: "rp5", type: "line", title: "Sales Trajectory by Date", dimensionField: "Date", measureField: "Gross_Sales" },
      { id: "rp6", type: "donut", title: "Transactions by Store", dimensionField: "Store_Location", measureField: "Transaction_Count" },
    ],
  },
  {
    id: "manufacturing_oee",
    name: "Manufacturing OEE & Downtime",
    category: "Manufacturing & Engineering",
    description: "Overall Equipment Effectiveness (OEE), production output, machine scrap units, and maintenance downtime.",
    filename: "manufacturing-oee.csv",
    requiredColumns: ["Shift_Date", "Assembly_Line", "Total_Produced", "Scrap_Units", "Downtime_Minutes", "OEE_Pct"],
    metrics: ["Total Produced", "Scrap Units", "Downtime Minutes", "OEE Ratio"],
    fictionalRows: 12,
    layoutStyle: "kpi_heavy",
    colorTheme: "slate",
    widgets: [
      { id: "mo1", type: "kpi", title: "Total Units Produced", measureField: "Total_Produced", aggregation: "sum" },
      { id: "mo2", type: "kpi", title: "Defect Scrap Units", measureField: "Scrap_Units", aggregation: "sum" },
      { id: "mo3", type: "kpi", title: "Downtime Minutes", measureField: "Downtime_Minutes", aggregation: "sum" },
      { id: "mo4", type: "bar", title: "Production by Assembly Line", dimensionField: "Assembly_Line", measureField: "Total_Produced" },
      { id: "mo5", type: "line", title: "Downtime Trend by Shift", dimensionField: "Shift_Date", measureField: "Downtime_Minutes" },
      { id: "mo6", type: "donut", title: "Scrap Distribution by Line", dimensionField: "Assembly_Line", measureField: "Scrap_Units" },
    ],
  },
  {
    id: "customer_csat",
    name: "Customer CSAT & NPS Feedback",
    category: "Customer Support & SLA",
    description: "Customer satisfaction ratings, Net Promoter Score categories, response times, and support channel analytics.",
    filename: "customer-csat.csv",
    requiredColumns: ["Feedback_Date", "Channel", "Satisfaction_Score", "NPS_Category", "First_Response_Mins", "Agent_Name"],
    metrics: ["Total Surveys", "Avg CSAT Score", "Response Minutes", "Promoters"],
    fictionalRows: 12,
    layoutStyle: "boardroom",
    colorTheme: "emerald",
    widgets: [
      { id: "cs1", type: "kpi", title: "Surveys Received", measureField: "Satisfaction_Score", aggregation: "count" },
      { id: "cs2", type: "kpi", title: "Response Minutes Total", measureField: "First_Response_Mins", aggregation: "sum" },
      { id: "cs3", type: "bar", title: "CSAT by Channel", dimensionField: "Channel", measureField: "Satisfaction_Score" },
      { id: "cs4", type: "donut", title: "NPS Category Breakdown", dimensionField: "NPS_Category", measureField: "Satisfaction_Score" },
      { id: "cs5", type: "line", title: "Response Speed by Date", dimensionField: "Feedback_Date", measureField: "First_Response_Mins" },
    ],
  },
  {
    id: "it_devops_uptime",
    name: "IT Infrastructure, Uptime & DevOps",
    category: "IT & Engineering",
    description: "Cloud service uptime reliability, API latency millisecond response, infrastructure cloud cost, and incident alerts.",
    filename: "it-devops-uptime.csv",
    requiredColumns: ["Date", "Service_Name", "Uptime_Pct", "API_Latency_MS", "Cloud_Cost_USD", "Incident_Count"],
    metrics: ["Cloud Spend USD", "API Latency MS", "Incident Count", "Uptime %"],
    fictionalRows: 12,
    layoutStyle: "matrix",
    colorTheme: "violet",
    widgets: [
      { id: "it1", type: "kpi", title: "Total Cloud Spend ($)", measureField: "Cloud_Cost_USD", aggregation: "sum" },
      { id: "it2", type: "kpi", title: "System Incidents", measureField: "Incident_Count", aggregation: "sum" },
      { id: "it3", type: "kpi", title: "API Latency (MS)", measureField: "API_Latency_MS", aggregation: "sum" },
      { id: "it4", type: "bar", title: "Cost by Cloud Service", dimensionField: "Service_Name", measureField: "Cloud_Cost_USD" },
      { id: "it5", type: "line", title: "API Latency by Date", dimensionField: "Date", measureField: "API_Latency_MS", gridSpan: "full" },
      { id: "it6", type: "donut", title: "Incidents by Service", dimensionField: "Service_Name", measureField: "Incident_Count" },
    ],
  },
  {
    id: "real_estate_portfolio",
    name: "Real Estate Commercial Leases",
    category: "Real Estate & Property",
    description: "Commercial building occupancy, square footage leasing, monthly rental income, and property OPEX maintenance.",
    filename: "real-estate-portfolio.csv",
    requiredColumns: ["Property_Name", "City", "Sq_Footage", "Occupancy_Pct", "Monthly_Rental", "Opex_Cost"],
    metrics: ["Monthly Rental", "Square Footage", "Operating OPEX", "Occupancy"],
    fictionalRows: 12,
    layoutStyle: "split",
    colorTheme: "blue",
    widgets: [
      { id: "re1", type: "kpi", title: "Total Monthly Rental ($)", measureField: "Monthly_Rental", aggregation: "sum" },
      { id: "re2", type: "kpi", title: "Leased Sq Footage", measureField: "Sq_Footage", aggregation: "sum" },
      { id: "re3", type: "kpi", title: "Property OPEX Cost", measureField: "Opex_Cost", aggregation: "sum" },
      { id: "re4", type: "bar", title: "Rental Income by City", dimensionField: "City", measureField: "Monthly_Rental" },
      { id: "re5", type: "donut", title: "Sq Footage by Property", dimensionField: "Property_Name", measureField: "Sq_Footage" },
      { id: "re6", type: "scatter", title: "Sq Ft vs Rental Yield", measureField: "Sq_Footage", secondaryMeasureField: "Monthly_Rental" },
    ],
  },
  {
    id: "hospitality_revpar",
    name: "Hospitality & Hotel RevPAR",
    category: "Real Estate & Hospitality",
    description: "Hotel bookings volume, Average Daily Rate (ADR), Revenue per Available Room (RevPAR), and room type yield.",
    filename: "hospitality-revpar.csv",
    requiredColumns: ["Date", "Room_Type", "Bookings_Count", "Occupancy_Pct", "ADR_USD", "RevPAR_USD"],
    metrics: ["Total Bookings", "ADR Rate", "RevPAR Yield", "Occupancy"],
    fictionalRows: 12,
    layoutStyle: "boardroom",
    colorTheme: "rose",
    widgets: [
      { id: "hp1", type: "kpi", title: "Total Room Bookings", measureField: "Bookings_Count", aggregation: "sum" },
      { id: "hp2", type: "kpi", title: "Average Daily Rate (ADR)", measureField: "ADR_USD", aggregation: "sum" },
      { id: "hp3", type: "kpi", title: "RevPAR Metric", measureField: "RevPAR_USD", aggregation: "sum" },
      { id: "hp4", type: "line", title: "RevPAR Timeline", dimensionField: "Date", measureField: "RevPAR_USD", gridSpan: "full" },
      { id: "hp5", type: "bar", title: "Bookings by Room Type", dimensionField: "Room_Type", measureField: "Bookings_Count" },
      { id: "hp6", type: "donut", title: "Revenue Share by Room", dimensionField: "Room_Type", measureField: "ADR_USD" },
    ],
  },
  {
    id: "education_grades",
    name: "Education & Academic Grades MIS",
    category: "Education & Public Sector",
    description: "Student course performance, attendance percentages, assignment grades, and department evaluations.",
    filename: "education-grades.csv",
    requiredColumns: ["Student_ID", "Department", "Course", "Attendance_Pct", "Assignment_Score", "Final_Grade"],
    metrics: ["Enrolled Students", "Final Grade Avg", "Assignment Scores", "Attendance"],
    fictionalRows: 15,
    layoutStyle: "trend_focus",
    colorTheme: "cyan",
    widgets: [
      { id: "ed1", type: "kpi", title: "Enrolled Students", measureField: "Final_Grade", aggregation: "count" },
      { id: "ed2", type: "kpi", title: "Average Assignment Score", measureField: "Assignment_Score", aggregation: "sum" },
      { id: "ed3", type: "kpi", title: "Final Grade Total", measureField: "Final_Grade", aggregation: "sum" },
      { id: "ed4", type: "bar", title: "Grade by Department", dimensionField: "Department", measureField: "Final_Grade" },
      { id: "ed5", type: "donut", title: "Courses Distribution", dimensionField: "Course", measureField: "Final_Grade" },
      { id: "ed6", type: "scatter", title: "Attendance vs Final Grade", measureField: "Attendance_Pct", secondaryMeasureField: "Final_Grade" },
    ],
  },
  {
    id: "procurement_spend",
    name: "Procurement & Supplier Spend",
    category: "Accounting & Finance",
    description: "Purchase order amounts, supplier category spend concentration, vendor discount rates, and payment terms.",
    filename: "procurement-spend.csv",
    requiredColumns: ["PO_Number", "Supplier_Name", "Category", "PO_Amount", "Discount_Pct", "Payment_Terms_Days"],
    metrics: ["Total PO Spend", "Captured Discounts", "Payment Terms Days", "Suppliers"],
    fictionalRows: 15,
    layoutStyle: "matrix",
    colorTheme: "amber",
    widgets: [
      { id: "pr1", type: "kpi", title: "Total PO Commitments ($)", measureField: "PO_Amount", aggregation: "sum" },
      { id: "pr2", type: "kpi", title: "Total Purchase Orders", measureField: "PO_Amount", aggregation: "count" },
      { id: "pr3", type: "kpi", title: "Average Discount %", measureField: "Discount_Pct", aggregation: "sum" },
      { id: "pr4", type: "bar", title: "Spend by Category", dimensionField: "Category", measureField: "PO_Amount" },
      { id: "pr5", type: "donut", title: "Spend by Top Supplier", dimensionField: "Supplier_Name", measureField: "PO_Amount" },
      { id: "pr6", type: "scatter", title: "PO Size vs Discount %", measureField: "PO_Amount", secondaryMeasureField: "Discount_Pct" },
    ],
  },
  {
    id: "banking_credit_risk",
    name: "Banking & Credit Risk Portfolio",
    category: "Banking & Risk",
    description: "Commercial loan disbursement, interest margins, risk ratings (AAA/BBB), and default performing status.",
    filename: "banking-credit-risk.csv",
    requiredColumns: ["Loan_ID", "Borrower_Segment", "Loan_Amount", "Interest_Rate", "Risk_Rating", "Default_Status"],
    metrics: ["Total Loan Book", "Interest Margin", "Active Accounts", "NPL Status"],
    fictionalRows: 15,
    layoutStyle: "kpi_heavy",
    colorTheme: "indigo",
    widgets: [
      { id: "bk1", type: "kpi", title: "Total Loan Book ($)", measureField: "Loan_Amount", aggregation: "sum" },
      { id: "bk2", type: "kpi", title: "Average Interest Rate", measureField: "Interest_Rate", aggregation: "sum" },
      { id: "bk3", type: "kpi", title: "Active Loans Count", measureField: "Loan_Amount", aggregation: "count" },
      { id: "bk4", type: "bar", title: "Loans by Borrower Segment", dimensionField: "Borrower_Segment", measureField: "Loan_Amount" },
      { id: "bk5", type: "donut", title: "Risk Rating Profile", dimensionField: "Risk_Rating", measureField: "Loan_Amount" },
      { id: "bk6", type: "scatter", title: "Loan Size vs Interest Rate", measureField: "Loan_Amount", secondaryMeasureField: "Interest_Rate" },
    ],
  },
  {
    id: "esg_sustainability",
    name: "ESG & Carbon Emissions Audit",
    category: "ESG & Sustainability",
    description: "Scope 1 and 2 carbon emissions (tCO2e), renewable energy transition percentage, and waste diversion rates.",
    filename: "esg-sustainability.csv",
    requiredColumns: ["Facility", "Country", "Scope1_Tons", "Scope2_Tons", "Renewable_Energy_Pct", "Waste_Diverted_Pct"],
    metrics: ["Scope 1 Emissions", "Scope 2 Emissions", "Renewable Energy %", "Waste Diverted %"],
    fictionalRows: 12,
    layoutStyle: "boardroom",
    colorTheme: "emerald",
    widgets: [
      { id: "es1", type: "kpi", title: "Scope 1 Carbon (Tons)", measureField: "Scope1_Tons", aggregation: "sum" },
      { id: "es2", type: "kpi", title: "Scope 2 Carbon (Tons)", measureField: "Scope2_Tons", aggregation: "sum" },
      { id: "es3", type: "kpi", title: "Monitored Facilities", measureField: "Scope1_Tons", aggregation: "count" },
      { id: "es4", type: "bar", title: "Scope 1 Emissions by Facility", dimensionField: "Facility", measureField: "Scope1_Tons" },
      { id: "es5", type: "donut", title: "Emissions by Country", dimensionField: "Country", measureField: "Scope1_Tons" },
      { id: "es6", type: "scatter", title: "Renewable vs Waste Diverted", measureField: "Renewable_Energy_Pct", secondaryMeasureField: "Waste_Diverted_Pct" },
    ],
  },
];
