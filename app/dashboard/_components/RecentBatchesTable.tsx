import Link from "next/link";
import { Eye, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRecentBatches } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

// ─── Status badge ──────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { label: string; bg: string; text: string; icon: React.FC<{ className?: string }> }> = {
    completed:   { label: "Completed",   bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle2 },
    "in-progress": { label: "In Progress", bg: "bg-blue-50",    text: "text-blue-700",   icon: Clock         },
    cancelled:   { label: "Cancelled",   bg: "bg-red-50",     text: "text-red-600",    icon: XCircle       },
  };
  const s = styles[status] ?? { label: status, bg: "bg-muted", text: "text-muted-foreground", icon: Clock };
  const Icon = s.icon;
  return (
    <Badge
      variant="outline"
      className={cn("gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border-0", s.bg, s.text)}
    >
      <Icon className="w-2.5 h-2.5" aria-hidden="true" />
      {s.label}
    </Badge>
  );
}

// ─── Grade dot ────────────────────────────────────────────────
function GradeDot({ grade }: { grade: string | null }) {
  if (!grade) return <span className="text-xs text-muted-foreground">—</span>;
  const color: Record<string, string> = {
    "A+": "#16a34a", A: "#22c55e", B: "#ca8a04", C: "#f97316", D: "#dc2626", F: "#7f1d1d",
  };
  return (
    <span
      className="inline-flex items-center justify-center w-8 h-6 rounded-md text-xs font-bold text-white"
      style={{ backgroundColor: color[grade] ?? "#64748b" }}
      aria-label={`Grade ${grade}`}
    >
      {grade}
    </span>
  );
}

// ─── Desktop table row ────────────────────────────────────────
function TableRow({ batch }: { batch: ReturnType<typeof getRecentBatches>[number] }) {
  return (
    <tr className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
      <td className="py-3 px-4 text-xs font-mono font-medium text-foreground">
        {batch.batchNumber.replace("BATCH-2024-", "#")}
      </td>
      <td className="py-3 px-4 text-xs text-foreground max-w-[160px] truncate">
        {batch.productName}
      </td>
      <td className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">
        {batch.quantity.toLocaleString("en-IN")} {batch.unit}
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <GradeDot grade={batch.grade} />
          {batch.score !== null && (
            <span className="text-xs text-muted-foreground">{batch.score}</span>
          )}
        </div>
      </td>
      <td className="py-3 px-4">
        <StatusBadge status={batch.status} />
      </td>
      <td className="py-3 px-4 text-right">
        <Link
          href={`/batches/${batch.id}`}
          className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-md border border-border bg-card hover:bg-muted transition-colors"
          style={{ color: "var(--brand-green)" }}
        >
          <Eye className="w-3 h-3" aria-hidden="true" />
          View
        </Link>
      </td>
    </tr>
  );
}

// ─── Mobile card ──────────────────────────────────────────────
function MobileCard({ batch }: { batch: ReturnType<typeof getRecentBatches>[number] }) {
  return (
    <div className="flex items-start gap-3 py-3.5 border-b border-border last:border-0">
      <GradeDot grade={batch.grade} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">{batch.productName}</p>
            <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
              {batch.batchNumber.replace("BATCH-2024-", "Batch #")}
            </p>
          </div>
          <StatusBadge status={batch.status} />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] text-muted-foreground">
            {batch.quantity.toLocaleString("en-IN")} {batch.unit}
          </span>
          <Link
            href={`/batches/${batch.id}`}
            className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded border border-border hover:bg-muted transition-colors"
            style={{ color: "var(--brand-green)" }}
          >
            <Eye className="w-2.5 h-2.5" aria-hidden="true" />
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────
export function RecentBatchesTable({ batches: propBatches }: { batches?: ReturnType<typeof getRecentBatches> }) {
  const batches = propBatches || getRecentBatches(6);

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="px-5 pt-5 pb-3 flex flex-row items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">Recent Batches</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Last {batches.length} production runs
          </p>
        </div>
        <Link
          href="/batches"
          className="text-xs font-medium hover:underline"
          style={{ color: "var(--brand-green)" }}
        >
          View all
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Batch", "Product", "Quantity", "Score", "Status", ""].map((h) => (
                  <th
                    key={h}
                    className="py-2.5 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-left"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {batches.map((b) => (
                <TableRow key={b.id} batch={b} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="sm:hidden px-4">
          {batches.map((b) => (
            <MobileCard key={b.id} batch={b} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
