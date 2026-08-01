export const chartTooltipStyle = {
  contentStyle: {
    background: "rgba(15, 15, 28, 0.95)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    fontSize: 12,
    color: "#fff",
    padding: "8px 12px",
  },
  labelStyle: { color: "rgba(255,255,255,0.6)", marginBottom: 4 },
  cursor: { stroke: "rgba(139,92,246,0.25)", strokeWidth: 1 },
};

export const axisStyle = {
  stroke: "rgba(165,160,194,0.6)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
};

export const chartColors = {
  violet: "#8b5cf6",
  violetSoft: "#a78bfa",
  indigo: "#6366f1",
  sky: "#38bdf8",
  cyan: "#22d3ee",
  emerald: "#34d399",
  amber: "#fbbf24",
  rose: "#fb7185",
};

export const pieColors = [chartColors.violet, chartColors.sky, chartColors.indigo, chartColors.cyan, chartColors.emerald];
