import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTopBatches, getLowestBatches, type RankedBatch } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

// ─── Grade colour mapping ─────────────────────────────────────
function gradeStyles(grade: string): { bg: string; text: string; border: string } {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    "A+": { bg: "bg-emerald-50",  text: "text-emerald-700",  border: "border-emerald-200" },
    "A":  { bg: "bg-emerald-50",  text: "text-emerald-700",  border: "border-emerald-200" },
    "B":  { bg: "bg-yellow-50",   text: "text-yellow-700",   border: "border-yellow-200"  },
    "C":  { bg: "bg-orange-50",   text: "text-orange-700",   border: "border-orange-200"  },
    "D":  { bg: "bg-red-50",      text: "text-red-600",      border: "border-red-200"     },
    "F":  { bg: "bg-red-100",     text: "text-red-700",      border: "border-red-300"     },
  };
  return map[grade] ?? { bg: "bg-muted", text: "text-muted-foreground", border: "border-border" };
}

// ─── Score bar ────────────────────────────────────────────────
function ScoreBar({ score }: { score: number }) {
  const pct = Math.min(100, Math.max(0, score));
  const color =
    pct >= 80 ? "var(--brand-green)" :
    pct >= 60 ? "#ca8a04" :
    "#dc2626";
  return (
    <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mt-1">
      <div
        className="h-full rounded-full transition-none"
        style={{ width: `${pct}%`, backgroundColor: color }}
        aria-hidden="true"
      />
    </div>
  );
}

// ─── Single batch row ─────────────────────────────────────────
function BatchRow({ batch }: { batch: RankedBatch }) {
  const g = gradeStyles(batch.grade);
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      {/* Grade pill */}
      <Badge
        variant="outline"
        className={cn("w-9 h-7 flex items-center justify-center text-xs font-bold shrink-0 rounded-md", g.bg, g.text, g.border)}
      >
        {batch.grade}
      </Badge>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-foreground truncate">{batch.productName}</p>
        <p className="text-[10px] text-muted-foreground">{batch.batchNumber} &middot; {batch.date}</p>
        <ScoreBar score={batch.score} />
      </div>

      {/* Score number */}
      <span className="text-sm font-bold text-foreground shrink-0">{batch.score}</span>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────
export function TopAndLowestBatches({ top: propTop, low: propLow }: { top?: RankedBatch[]; low?: RankedBatch[] }) {
  const top = propTop || getTopBatches(4);
  const low = propLow || getLowestBatches(4);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Top batches */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="px-5 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <span
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50"
              aria-hidden="true"
            >
              <TrendingUp className="w-4 h-4 text-emerald-700" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Highest Scoring</p>
              <p className="text-[10px] text-muted-foreground">Best performing batches</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-5 pt-0 pb-4">
          {top.map((b) => <BatchRow key={b.batchId} batch={b} />)}
        </CardContent>
      </Card>

      {/* Lowest batches */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="px-5 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <span
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50"
              aria-hidden="true"
            >
              <TrendingDown className="w-4 h-4 text-red-600" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Needs Improvement</p>
              <p className="text-[10px] text-muted-foreground">Lowest scoring batches</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-5 pt-0 pb-4">
          {low.map((b) => <BatchRow key={b.batchId} batch={b} />)}
        </CardContent>
      </Card>
    </div>
  );
}
