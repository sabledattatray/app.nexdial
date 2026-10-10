"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";

export interface UseEChartsOptions {
  options: echarts.EChartsOption;
  theme?: "light" | "dark";
  onEvents?: Record<string, (params: unknown) => void>;
}

export function useECharts({ options }: UseEChartsOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Detect if dark mode is active
    const isDark = document.documentElement.classList.contains("dark");
    const chartTheme = isDark ? "dark" : undefined;

    // Initialize ECharts instance
    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(containerRef.current, chartTheme, {
        renderer: "canvas",
      });
    }

    // Set chart configuration
    chartInstanceRef.current.setOption(options, true);

    // Responsive Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      chartInstanceRef.current?.resize();
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [options]);

  // Clean up instance on unmount
  useEffect(() => {
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  const getInstance = () => chartInstanceRef.current;

  return { containerRef, getInstance };
}
