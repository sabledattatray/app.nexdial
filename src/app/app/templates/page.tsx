import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  TrendingUp,
  Receipt,
  Boxes,
  Users,
  Timer,
  Megaphone,
  CheckSquare,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

export default function TemplatesPage() {
  const templates = [
    {
      id: "sales",
      title: "Sales MIS Dashboard",
      category: "Sales & Revenue",
      desc: "Track sales performance by region, rep leaderboard, deal volume, average transaction size, and month-over-month growth.",
      icon: TrendingUp,
      requiredColumns: ["Date", "Sales_Rep", "Region", "Category", "Revenue", "Units_Sold"],
      metrics: ["Total Revenue", "Avg Deal Size", "Total Units", "MoM Growth"],
      fictionalRows: 1420,
    },
    {
      id: "finance",
      title: "Finance & Expense Summary",
      category: "Accounting & Finance",
      desc: "Analyze departmental expenditure, budget vs actual variance, vendor concentration, and monthly burn rate.",
      icon: Receipt,
      requiredColumns: ["Date", "Department", "Vendor", "Category", "Actual_Spend", "Budget_Allocated"],
      metrics: ["Total Spend", "Budget Variance", "Vendor Concentration", "Over-Budget Count"],
      fictionalRows: 980,
    },
    {
      id: "inventory",
      title: "Inventory & Stock Status",
      category: "Supply Chain & Warehousing",
      desc: "Monitor warehouse stock levels, SKUs nearing depletion, safety stock thresholds, and stock valuation.",
      icon: Boxes,
      requiredColumns: ["SKU", "Item_Name", "Warehouse", "Current_Stock", "Reorder_Level", "Unit_Cost"],
      metrics: ["Total Valuation", "Out of Stock Count", "Reorder Alerts", "Warehouse Fill %"],
      fictionalRows: 850,
    },
    {
      id: "hr",
      title: "HR Headcount & Attendance",
      category: "Human Resources",
      desc: "Summarize department headcount, attendance ratios, overtime expenditures, and employee turnover trends.",
      icon: Users,
      requiredColumns: ["Employee_ID", "Department", "Role", "Join_Date", "Attendance_Pct", "Overtime_Hours"],
      metrics: ["Total Headcount", "Avg Attendance", "Total Overtime", "Dept Breakdown"],
      fictionalRows: 420,
    },
    {
      id: "operations",
      title: "Operations & SLA Performance",
      category: "Operations & Support",
      desc: "Evaluate ticket resolution times, SLA breach rates, operational backlog, and agent efficiency.",
      icon: Timer,
      requiredColumns: ["Ticket_ID", "Created_Date", "Priority", "Resolution_Hours", "SLA_Status", "Agent"],
      metrics: ["SLA Compliance %", "Avg Resolution Time", "Total Tickets", "Breach Count"],
      fictionalRows: 2150,
    },
    {
      id: "marketing",
      title: "Marketing Campaign Performance",
      category: "Marketing & Growth",
      desc: "Review campaign spend, impressions, click-through rates, lead conversions, and acquisition cost.",
      icon: Megaphone,
      requiredColumns: ["Campaign_Name", "Channel", "Spend", "Impressions", "Clicks", "Conversions"],
      metrics: ["Total Spend", "Cost Per Acquisition (CPA)", "Overall CTR", "Total Conversions"],
      fictionalRows: 640,
    },
    {
      id: "project",
      title: "Project & Task Status",
      category: "Project Management",
      desc: "Track task completion rates, blocked items, sprint velocity, and resource workload across projects.",
      icon: CheckSquare,
      requiredColumns: ["Task_ID", "Project_Name", "Assignee", "Status", "Priority", "Estimated_Hours"],
      metrics: ["Completion Rate", "Blocked Tasks", "Total Estimated Hours", "High Priority Count"],
      fictionalRows: 510,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Link
          href="/app"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Workspace</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              MIS Report Templates
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Pre-configured business reporting layouts. Load with synthetic sample data or map your own spreadsheet columns.
            </p>
          </div>
          <Badge variant="secondary" className="self-start sm:self-auto gap-1">
            <span>7 Production Templates</span>
          </Badge>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tpl) => {
          const Icon = tpl.icon;
          return (
            <Card key={tpl.id} id={tpl.id} className="flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <Badge variant="outline" className="text-[11px]">
                    {tpl.category}
                  </Badge>
                </div>
                <div>
                  <CardTitle className="text-lg">{tpl.title}</CardTitle>
                  <CardDescription className="mt-2 text-xs leading-relaxed">
                    {tpl.desc}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Expected Columns
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {tpl.requiredColumns.map((col) => (
                      <span
                        key={col}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300"
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Calculated KPIs
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {tpl.metrics.map((m) => (
                      <span
                        key={m}
                        className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-[11px] font-medium text-indigo-700 dark:text-indigo-300"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between pt-4">
                <span className="text-xs text-slate-400 font-medium">
                  {tpl.fictionalRows.toLocaleString()} synthetic rows
                </span>
                <Link href={`/app/new?template=${tpl.id}`}>
                  <Button size="sm" variant="primary" className="gap-1.5 text-xs">
                    <span>Use Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Notice on Fictional Datasets */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <p>
          <strong>Notice:</strong> All sample data shipped with OpenMIS templates is strictly fictional and generated for demonstration purposes. No real personal or corporate financial data is included.
        </p>
      </div>
    </div>
  );
}
