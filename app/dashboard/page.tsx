"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, LayoutDashboard } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SummaryCards }       from "./_components/SummaryCards";
import { TrendChart }         from "./_components/TrendChart";
import { TopAndLowestBatches } from "./_components/TopBatches";
import { RecentBatchesTable } from "./_components/RecentBatchesTable";
import { QuickActions }       from "./_components/QuickActions";
import { cn } from "@/lib/utils";
import { Batch } from "@/types";
import {
  getStoredBatches,
  getDashboardStats,
  getTrendData,
  getTopBatches,
  getLowestBatches,
  getRecentBatches
} from "@/lib/store";

export default function DashboardPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setBatches(getStoredBatches());
    setMounted(true);
  }, []);

  // Compute dynamic data
  const stats = getDashboardStats(batches);
  const trendData = getTrendData(batches);
  const topBatches = getTopBatches(batches, 4);
  const lowestBatches = getLowestBatches(batches, 4);
  const recentBatches = getRecentBatches(batches, 6);

  return (
    <div className="flex flex-col gap-8">

      {/* ── Page Header ─────────────────────────────────────────── */}
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl"
            style={{ backgroundColor: "var(--brand-green-pale)" }}
            aria-hidden="true"
          >
            <LayoutDashboard
              className="w-5 h-5"
              style={{ color: "var(--brand-green)" }}
            />
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Dashboard
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Arjun Textiles &mdash; Demo Factory &middot; {mounted ? batches.length : "..."} batches tracked
            </p>
          </div>
        </div>

        <Link
          id="dashboard-create-batch"
          href="/batches/new"
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-lg px-4 h-9 text-sm font-semibold text-white transition-all duration-150 active:translate-y-px select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:opacity-90 shrink-0"
          )}
          style={{ backgroundColor: "var(--brand-green)" }}
        >
          <PlusCircle className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline">Create New Batch</span>
          <span className="sm:hidden">New Batch</span>
        </Link>
      </header>

      {/* ── Summary Cards ──────────────────────────────────────── */}
      <section aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="sr-only">Summary metrics</h2>
        <SummaryCards stats={stats} />
      </section>

      {/* ── Trend Chart ────────────────────────────────────────── */}
      <section aria-labelledby="trend-heading">
        <h2 id="trend-heading" className="sr-only">Sustainability trend</h2>
        <TrendChart data={trendData} />
      </section>

      {/* ── Top & Lowest Batches ───────────────────────────────── */}
      <section aria-labelledby="ranking-heading">
        <div className="flex items-center justify-between mb-3">
          <h2
            id="ranking-heading"
            className="text-xs font-semibold text-muted-foreground uppercase tracking-widest"
          >
            Batch Rankings
          </h2>
        </div>
        <TopAndLowestBatches top={topBatches} low={lowestBatches} />
      </section>

      <Separator />

      {/* ── Recent Batches Table ───────────────────────────────── */}
      <section aria-labelledby="recent-heading">
        <h2 id="recent-heading" className="sr-only">Recent batches</h2>
        <RecentBatchesTable batches={recentBatches} />
      </section>

      <Separator />

      {/* ── Quick Actions ──────────────────────────────────────── */}
      <section aria-labelledby="actions-heading">
        <h2 id="actions-heading" className="sr-only">Quick actions</h2>
        <QuickActions />
      </section>

    </div>
  );
}
