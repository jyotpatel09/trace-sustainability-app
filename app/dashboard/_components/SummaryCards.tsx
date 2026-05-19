import { Layers, Gauge, Droplets, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getDashboardStats, DashboardStats } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

const CARDS = [
  {
    key: "totalBatches",
    label: "Total Batches",
    icon: Layers,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    suffix: "",
    format: (v: number) => String(v),
  },
  {
    key: "avgScore",
    label: "Avg. Sustainability Score",
    icon: Gauge,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-700",
    suffix: "/100",
    format: (v: number) => String(v),
  },
  {
    key: "totalWaterLiters",
    label: "Total Water Logged",
    icon: Droplets,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    suffix: " L",
    format: (v: number) => formatNumber(v, 0),
  },
  {
    key: "totalEnergyKWh",
    label: "Total Electricity Logged",
    icon: Zap,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    suffix: " kWh",
    format: (v: number) => formatNumber(v, 0),
  },
] as const;

export function SummaryCards({ stats: propStats }: { stats?: DashboardStats }) {
  const stats = propStats || getDashboardStats();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {CARDS.map(({ key, label, icon: Icon, iconBg, iconColor, suffix, format }) => {
        const value = stats[key as keyof typeof stats];
        return (
          <Card key={key} className="border border-border shadow-sm">
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-lg",
                    iconBg
                  )}
                  aria-hidden="true"
                >
                  <Icon className={cn("w-4 h-4", iconColor)} />
                </span>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-foreground leading-none">
                  {format(value)}
                  {suffix && (
                    <span className="text-sm font-medium text-muted-foreground ml-0.5">
                      {suffix}
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-snug">
                  {label}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
