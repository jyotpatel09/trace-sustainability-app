"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getTrendData, TrendPoint } from "@/lib/mock-data";

// ─── Custom Tooltip ──────────────────────────────────────────
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-md text-xs">
      <p className="font-semibold text-foreground">Batch {label}</p>
      <p style={{ color: "var(--brand-green)" }} className="font-bold mt-0.5">
        Score: {payload[0].value}
      </p>
    </div>
  );
}

// ─── Grade band background ───────────────────────────────────
const GRADE_BANDS = [
  { y: 90, label: "A+", color: "#16a34a22" },
  { y: 80, label: "A",  color: "#22c55e18" },
  { y: 70, label: "B",  color: "#eab30818" },
  { y: 60, label: "C",  color: "#f9731618" },
];

export function TrendChart({ data: propData }: { data?: TrendPoint[] }) {
  const data = propData || getTrendData();

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="px-5 pt-5 pb-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Sustainability Score Trend
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Score per completed batch (0–100)
            </p>
          </div>
          {/* Grade legend */}
          <div className="hidden sm:flex items-center gap-3">
            {[
              { label: "A+/A", color: "#16a34a" },
              { label: "B/C",  color: "#ca8a04" },
              { label: "D/F",  color: "#dc2626" },
            ].map(({ label, color }) => (
              <span key={label} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
                {label}
              </span>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 pb-3">
        <div className="h-[220px] sm:h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 4, right: 16, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#64748b" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[30, 100]}
                tick={{ fontSize: 10, fill: "#64748b" }}
                tickLine={false}
                axisLine={false}
                ticks={[40, 60, 80, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              {/* Grade reference lines */}
              {GRADE_BANDS.map(({ y, color }) => (
                <line
                  key={y}
                  x1="0"
                  x2="100%"
                  y1={y}
                  y2={y}
                  stroke={color}
                  strokeDasharray="4 3"
                />
              ))}
              <Line
                type="monotone"
                dataKey="score"
                stroke="var(--brand-green)"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "var(--brand-green)", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "var(--brand-green)", strokeWidth: 2, stroke: "#fff" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
