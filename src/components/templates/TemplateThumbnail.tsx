"use client";

import React from "react";

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

interface TemplateThumbnailProps {
  layoutStyle?: TemplateLayoutStyle;
  colorTheme?: TemplateColorTheme;
  title?: string;
  className?: string;
}

const THEME_COLORS: Record<TemplateColorTheme, { primary: string; secondary: string; accent: string; bg: string }> = {
  indigo: { primary: "#6366f1", secondary: "#818cf8", accent: "#c7d2fe", bg: "#e0e7ff" },
  emerald: { primary: "#10b981", secondary: "#34d399", accent: "#a7f3d0", bg: "#d1fae5" },
  blue: { primary: "#2563eb", secondary: "#60a5fa", accent: "#bfdbfe", bg: "#dbeafe" },
  violet: { primary: "#8b5cf6", secondary: "#a78bfa", accent: "#ddd6fe", bg: "#ede9fe" },
  amber: { primary: "#f59e0b", secondary: "#fbbf24", accent: "#fde68a", bg: "#fef3c7" },
  rose: { primary: "#f43f5e", secondary: "#fb7185", accent: "#fecdd3", bg: "#ffe4e6" },
  cyan: { primary: "#06b6d4", secondary: "#22d3ee", accent: "#a5f3fc", bg: "#cffafe" },
  slate: { primary: "#475569", secondary: "#94a3b8", accent: "#cbd5e1", bg: "#f1f5f9" },
};

export function TemplateThumbnail({
  layoutStyle = "boardroom",
  colorTheme = "indigo",
  title,
  className = "",
}: TemplateThumbnailProps) {
  const colors = THEME_COLORS[colorTheme] || THEME_COLORS.indigo;

  return (
    <div
      className={`relative w-full aspect-16/10 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 shadow-2xs select-none transition-transform duration-200 group-hover:scale-[1.02] ${className}`}
      aria-label={title ? `${title} layout preview` : "Dashboard layout preview"}
    >
      <svg
        viewBox="0 0 320 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Subtle grid background */}
        <rect width="320" height="200" fill="currentColor" className="text-slate-50/50 dark:text-slate-950/40" />

        {/* Top Header Mockup */}
        <rect x="12" y="10" width="10" height="10" rx="3" fill={colors.primary} />
        <rect x="28" y="12" width="70" height="6" rx="2" fill="currentColor" className="text-slate-400 dark:text-slate-600" />
        <rect x="230" y="12" width="40" height="6" rx="2" fill="currentColor" className="text-slate-300 dark:text-slate-700" />
        <rect x="276" y="10" width="32" height="10" rx="4" fill={colors.bg} />
        <line x1="12" y1="26" x2="308" y2="26" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="1" />

        {/* Top KPI Cards (Common across all MIS templates) */}
        <g id="kpi-cards">
          {/* KPI 1 */}
          <rect x="12" y="32" width="68" height="34" rx="5" fill="currentColor" className="text-white dark:text-slate-800/90" stroke="currentColor" strokeWidth="0.75" />
          <rect x="18" y="38" width="30" height="3" rx="1.5" fill="currentColor" className="text-slate-400 dark:text-slate-500" />
          <rect x="18" y="45" width="42" height="8" rx="2" fill={colors.primary} />
          <rect x="18" y="57" width="22" height="3" rx="1.5" fill={colors.secondary} opacity="0.8" />

          {/* KPI 2 */}
          <rect x="86" y="32" width="68" height="34" rx="5" fill="currentColor" className="text-white dark:text-slate-800/90" stroke="currentColor" strokeWidth="0.75" />
          <rect x="92" y="38" width="32" height="3" rx="1.5" fill="currentColor" className="text-slate-400 dark:text-slate-500" />
          <rect x="92" y="45" width="38" height="8" rx="2" fill="currentColor" className="text-slate-800 dark:text-slate-200" />
          <rect x="92" y="57" width="24" height="3" rx="1.5" fill={colors.primary} />

          {/* KPI 3 */}
          <rect x="160" y="32" width="68" height="34" rx="5" fill="currentColor" className="text-white dark:text-slate-800/90" stroke="currentColor" strokeWidth="0.75" />
          <rect x="166" y="38" width="28" height="3" rx="1.5" fill="currentColor" className="text-slate-400 dark:text-slate-500" />
          <rect x="166" y="45" width="36" height="8" rx="2" fill={colors.primary} />
          <rect x="166" y="57" width="20" height="3" rx="1.5" fill="#10b981" />

          {/* KPI 4 */}
          <rect x="234" y="32" width="74" height="34" rx="5" fill="currentColor" className="text-white dark:text-slate-800/90" stroke="currentColor" strokeWidth="0.75" />
          <rect x="240" y="38" width="30" height="3" rx="1.5" fill="currentColor" className="text-slate-400 dark:text-slate-500" />
          <rect x="240" y="45" width="44" height="8" rx="2" fill="currentColor" className="text-slate-800 dark:text-slate-200" />
          <rect x="240" y="57" width="26" height="3" rx="1.5" fill={colors.secondary} />
        </g>

        {/* Dynamic Visual Content depending on Layout Style */}
        {layoutStyle === "boardroom" && (
          <g id="boardroom-layout">
            {/* Wide ECharts Wave Trend Line */}
            <rect x="12" y="72" width="296" height="60" rx="6" fill="currentColor" className="text-white dark:text-slate-800/90" stroke="currentColor" strokeWidth="0.75" />
            <rect x="20" y="78" width="64" height="4" rx="2" fill="currentColor" className="text-slate-400 dark:text-slate-500" />
            <path
              d="M 22 118 Q 70 85, 120 102 T 200 90 T 290 82"
              fill="none"
              stroke={colors.primary}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 22 118 Q 70 85, 120 102 T 200 90 T 290 82 L 290 125 L 22 125 Z"
              fill={colors.primary}
              opacity="0.12"
            />

            {/* Bottom Dual Visuals */}
            {/* Mini Bar Chart */}
            <rect x="12" y="138" width="144" height="52" rx="6" fill="currentColor" className="text-white dark:text-slate-800/90" stroke="currentColor" strokeWidth="0.75" />
            <rect x="20" y="144" width="48" height="4" rx="2" fill="currentColor" className="text-slate-400" />
            <rect x="24" y="162" width="14" height="22" rx="2" fill={colors.primary} />
            <rect x="44" y="154" width="14" height="30" rx="2" fill={colors.secondary} />
            <rect x="64" y="166" width="14" height="18" rx="2" fill={colors.primary} />
            <rect x="84" y="150" width="14" height="34" rx="2" fill={colors.primary} />
            <rect x="104" y="158" width="14" height="26" rx="2" fill={colors.secondary} />
            <rect x="124" y="168" width="14" height="16" rx="2" fill={colors.accent} />

            {/* Mini Donut Chart */}
            <rect x="164" y="138" width="144" height="52" rx="6" fill="currentColor" className="text-white dark:text-slate-800/90" stroke="currentColor" strokeWidth="0.75" />
            <rect x="172" y="144" width="48" height="4" rx="2" fill="currentColor" className="text-slate-400" />
            <circle cx="236" cy="166" r="18" fill="none" stroke={colors.primary} strokeWidth="7" strokeDasharray="60 30" />
            <circle cx="236" cy="166" r="18" fill="none" stroke={colors.secondary} strokeWidth="7" strokeDasharray="25 65" strokeDashoffset="-60" />
            <circle cx="236" cy="166" r="18" fill="none" stroke="#f59e0b" strokeWidth="7" strokeDasharray="15 75" strokeDashoffset="-85" />
            <circle cx="236" cy="166" r="7" fill="currentColor" className="text-white dark:text-slate-800" />
          </g>
        )}

        {layoutStyle === "trend_focus" && (
          <g id="trend-focus-layout">
            <rect x="12" y="72" width="194" height="118" rx="6" fill="currentColor" className="text-white dark:text-slate-800/90" stroke="currentColor" strokeWidth="0.75" />
            <rect x="22" y="80" width="60" height="4" rx="2" fill="currentColor" className="text-slate-400" />
            {/* Dynamic area curves */}
            <path
              d="M 24 165 C 60 120, 100 150, 140 100 S 180 90, 196 85"
              fill="none"
              stroke={colors.primary}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 24 165 C 60 120, 100 150, 140 100 S 180 90, 196 85 L 196 178 L 24 178 Z"
              fill={colors.primary}
              opacity="0.15"
            />
            {/* Secondary trend curve */}
            <path
              d="M 24 172 C 60 155, 110 160, 140 135 S 180 125, 196 115"
              fill="none"
              stroke={colors.secondary}
              strokeWidth="1.5"
              strokeDasharray="3 2"
            />

            {/* Side Column Stack */}
            <rect x="214" y="72" width="94" height="56" rx="6" fill="currentColor" className="text-white dark:text-slate-800/90" stroke="currentColor" strokeWidth="0.75" />
            <rect x="222" y="78" width="38" height="4" rx="2" fill="currentColor" className="text-slate-400" />
            <rect x="224" y="94" width="12" height="26" rx="2" fill={colors.primary} />
            <rect x="242" y="88" width="12" height="32" rx="2" fill={colors.secondary} />
            <rect x="260" y="100" width="12" height="20" rx="2" fill={colors.primary} />
            <rect x="278" y="92" width="12" height="28" rx="2" fill={colors.accent} />

            <rect x="214" y="134" width="94" height="56" rx="6" fill="currentColor" className="text-white dark:text-slate-800/90" stroke="currentColor" strokeWidth="0.75" />
            <rect x="222" y="140" width="36" height="4" rx="2" fill="currentColor" className="text-slate-400" />
            <circle cx="261" cy="162" r="16" fill="none" stroke={colors.primary} strokeWidth="6" strokeDasharray="50 30" />
            <circle cx="261" cy="162" r="16" fill="none" stroke={colors.secondary} strokeWidth="6" strokeDasharray="30 50" strokeDashoffset="-50" />
          </g>
        )}

        {layoutStyle === "split" && (
          <g id="split-layout">
            {/* 50/50 Balanced Canvas */}
            <rect x="12" y="72" width="144" height="118" rx="6" fill="currentColor" className="text-white dark:text-slate-800/90" stroke="currentColor" strokeWidth="0.75" />
            <rect x="22" y="80" width="56" height="4" rx="2" fill="currentColor" className="text-slate-400" />
            <rect x="26" y="130" width="16" height="48" rx="2" fill={colors.primary} />
            <rect x="48" y="105" width="16" height="73" rx="2" fill={colors.secondary} />
            <rect x="70" y="120" width="16" height="58" rx="2" fill={colors.primary} />
            <rect x="92" y="95" width="16" height="83" rx="2" fill={colors.primary} />
            <rect x="114" y="140" width="16" height="38" rx="2" fill={colors.accent} />

            <rect x="164" y="72" width="144" height="118" rx="6" fill="currentColor" className="text-white dark:text-slate-800/90" stroke="currentColor" strokeWidth="0.75" />
            <rect x="174" y="80" width="56" height="4" rx="2" fill="currentColor" className="text-slate-400" />
            <circle cx="236" cy="135" r="28" fill="none" stroke={colors.primary} strokeWidth="10" strokeDasharray="75 40" />
            <circle cx="236" cy="135" r="28" fill="none" stroke={colors.secondary} strokeWidth="10" strokeDasharray="35 80" strokeDashoffset="-75" />
            <circle cx="236" cy="135" r="28" fill="none" stroke="#10b981" strokeWidth="10" strokeDasharray="25 90" strokeDashoffset="-110" />
            <circle cx="236" cy="135" r="12" fill="currentColor" className="text-white dark:text-slate-800" />
          </g>
        )}

        {layoutStyle === "matrix" && (
          <g id="matrix-layout">
            {/* 2x2 Quadrant Grid */}
            <rect x="12" y="72" width="144" height="56" rx="5" fill="currentColor" className="text-white dark:text-slate-800/90" stroke="currentColor" strokeWidth="0.75" />
            <path d="M 22 112 Q 55 90, 85 98 T 145 84" fill="none" stroke={colors.primary} strokeWidth="2" />
            
            <rect x="164" y="72" width="144" height="56" rx="5" fill="currentColor" className="text-white dark:text-slate-800/90" stroke="currentColor" strokeWidth="0.75" />
            <rect x="174" y="92" width="12" height="28" rx="2" fill={colors.primary} />
            <rect x="192" y="84" width="12" height="36" rx="2" fill={colors.secondary} />
            <rect x="210" y="98" width="12" height="22" rx="2" fill={colors.primary} />
            <rect x="228" y="78" width="12" height="42" rx="2" fill={colors.primary} />

            <rect x="12" y="134" width="144" height="56" rx="5" fill="currentColor" className="text-white dark:text-slate-800/90" stroke="currentColor" strokeWidth="0.75" />
            <circle cx="84" cy="162" r="16" fill="none" stroke={colors.primary} strokeWidth="6" strokeDasharray="60 30" />
            <circle cx="84" cy="162" r="16" fill="none" stroke={colors.secondary} strokeWidth="6" strokeDasharray="25 65" strokeDashoffset="-60" />

            <rect x="164" y="134" width="144" height="56" rx="5" fill="currentColor" className="text-white dark:text-slate-800/90" stroke="currentColor" strokeWidth="0.75" />
            {/* Scatter dots */}
            <circle cx="185" cy="170" r="3" fill={colors.primary} />
            <circle cx="205" cy="155" r="3" fill={colors.secondary} />
            <circle cx="225" cy="165" r="3" fill={colors.primary} />
            <circle cx="245" cy="148" r="3" fill={colors.primary} />
            <circle cx="265" cy="160" r="3" fill={colors.secondary} />
            <circle cx="285" cy="142" r="3" fill={colors.primary} />
          </g>
        )}

        {(layoutStyle === "kpi_heavy" || layoutStyle === "compact") && (
          <g id="kpi-heavy-layout">
            <rect x="12" y="72" width="296" height="52" rx="6" fill="currentColor" className="text-white dark:text-slate-800/90" stroke="currentColor" strokeWidth="0.75" />
            <path
              d="M 20 110 Q 70 85, 120 100 T 200 88 T 296 80"
              fill="none"
              stroke={colors.primary}
              strokeWidth="2.5"
            />
            <rect x="12" y="130" width="94" height="60" rx="6" fill="currentColor" className="text-white dark:text-slate-800/90" stroke="currentColor" strokeWidth="0.75" />
            <rect x="20" y="152" width="12" height="30" rx="2" fill={colors.primary} />
            <rect x="38" y="145" width="12" height="37" rx="2" fill={colors.secondary} />
            <rect x="56" y="160" width="12" height="22" rx="2" fill={colors.accent} />

            <rect x="113" y="130" width="94" height="60" rx="6" fill="currentColor" className="text-white dark:text-slate-800/90" stroke="currentColor" strokeWidth="0.75" />
            <circle cx="160" cy="160" r="16" fill="none" stroke={colors.primary} strokeWidth="6" strokeDasharray="50 30" />
            <circle cx="160" cy="160" r="16" fill="none" stroke={colors.secondary} strokeWidth="6" strokeDasharray="30 50" strokeDashoffset="-50" />

            <rect x="214" y="130" width="94" height="60" rx="6" fill="currentColor" className="text-white dark:text-slate-800/90" stroke="currentColor" strokeWidth="0.75" />
            <rect x="222" y="142" width="78" height="4" rx="2" fill="currentColor" className="text-slate-300 dark:text-slate-700" />
            <rect x="222" y="152" width="65" height="4" rx="2" fill="currentColor" className="text-slate-300 dark:text-slate-700" />
            <rect x="222" y="162" width="72" height="4" rx="2" fill="currentColor" className="text-slate-300 dark:text-slate-700" />
            <rect x="222" y="172" width="58" height="4" rx="2" fill="currentColor" className="text-slate-300 dark:text-slate-700" />
          </g>
        )}
      </svg>

      {/* Floating Theme / Layout Badge */}
      <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 backdrop-blur-xs">
        {layoutStyle.replace("_", " ")}
      </div>
    </div>
  );
}
