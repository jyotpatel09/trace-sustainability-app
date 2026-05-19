"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Droplets, Zap, Flame, Trash, LucideIcon, FileText, Check } from "lucide-react";

import { getBatch, updateBatch } from "@/lib/store";
import { ResourceLog, Batch } from "@/types";
import { cn, formatNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { WaterTab } from "./_components/WaterTab";
import { ElectricityTab } from "./_components/ElectricityTab";
import { FuelTab } from "./_components/FuelTab";
import { WasteTab } from "./_components/WasteTab";

type TabType = "water" | "electricity" | "fuel" | "waste";

const TABS: { id: TabType; label: string; icon: LucideIcon }[] = [
  { id: "water", label: "Water", icon: Droplets },
  { id: "electricity", label: "Electricity", icon: Zap },
  { id: "fuel", label: "Fuel", icon: Flame },
  { id: "waste", label: "Waste", icon: Trash },
];

export default function BatchDetailPage() {
  const params = useParams();
  const batchId = params.id as string;

  // Local state for the batch and logs
  const [batch, setBatch] = useState<Batch | null>(null);
  const [logs, setLogs] = useState<ResourceLog[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("water");

  // Load mock data on mount
  useEffect(() => {
    const found = getBatch(batchId);
    if (found) {
      setBatch(found);
      setLogs(found.resources || []);
    }
  }, [batchId]);

  const handleAddLog = (newLog: ResourceLog) => {
    setLogs((prev) => {
      const updated = [newLog, ...prev];
      if (batch) {
        updateBatch({ ...batch, resources: updated });
      }
      return updated;
    });
  };

  const handleDeleteLog = (id: string) => {
    setLogs((prev) => {
      const updated = prev.filter((log) => log.id !== id);
      if (batch) {
        updateBatch({ ...batch, resources: updated });
      }
      return updated;
    });
  };

  const handleCompleteBatch = () => {
    if (batch) {
      const updatedBatch: Batch = {
        ...batch,
        status: "completed",
        completedAt: new Date().toISOString(),
      };
      setBatch(updatedBatch);
      updateBatch(updatedBatch);
    }
  };

  const handleReopenBatch = () => {
    if (batch) {
      const updatedBatch: Batch = {
        ...batch,
        status: "in-progress",
        completedAt: undefined,
      };
      setBatch(updatedBatch);
      updateBatch(updatedBatch);
    }
  };

  if (!batch) {
    return <div className="p-8 text-center text-muted-foreground">Loading batch...</div>;
  }

  // Filter logs for the active tab
  const activeLogs = logs.filter((l) => l.resourceType === activeTab);

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full pb-10">
      
      {/* ── Header ────────────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-start gap-4">
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-card hover:bg-muted transition-colors shrink-0 mt-1"
            aria-label="Go back to dashboard"
          >
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
                {batch.productName}
              </h1>
              <Badge variant="outline" className={cn(
                "border-0 px-2.5 py-0.5 rounded-full font-medium text-xs",
                batch.status === "completed" ? "bg-emerald-50 text-emerald-700" :
                batch.status === "in-progress" ? "bg-blue-50 text-blue-700" :
                "bg-red-50 text-red-600"
              )}>
                {batch.status === "in-progress" ? "In Progress" : batch.status === "completed" ? "Completed" : "Cancelled"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              {batch.batchNumber} &middot; {formatNumber(batch.quantity, 0)} {batch.unit}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          {batch.status === "in-progress" ? (
            <Button
              size="sm"
              onClick={handleCompleteBatch}
              className="h-9 px-3 text-xs font-semibold text-white transition-all cursor-pointer"
              style={{ backgroundColor: "var(--brand-green)" }}
            >
              <Check className="w-3.5 h-3.5 mr-1.5" />
              Complete Batch
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={handleReopenBatch}
              className="h-9 px-3 text-xs font-semibold cursor-pointer"
            >
              Reopen Batch
            </Button>
          )}

          <Link
            href={`/batches/${batch.id}/report`}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card text-foreground transition-all duration-150 active:translate-y-px select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-muted px-3 h-9 text-xs font-semibold"
          >
            <FileText className="w-3.5 h-3.5 text-muted-foreground" />
            Report Card
          </Link>
        </div>
      </header>

      {/* ── Mobile-friendly Tab Navigation ───────────────────── */}
      <nav 
        className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide"
        aria-label="Resource tabs"
      >
        <div className="flex gap-2 min-w-max">
          {TABS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "flex items-center gap-2 px-4 h-10 rounded-full text-sm font-semibold transition-all select-none touch-target focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "text-white shadow-sm"
                    : "bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                style={isActive ? { backgroundColor: "var(--brand-green)" } : {}}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className={cn("w-4 h-4", isActive ? "opacity-100" : "opacity-70")} />
                {label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── Tab Content Area ─────────────────────────────────── */}
      <main className="min-h-[400px]">
        {activeTab === "water" && (
          <WaterTab batchId={batchId} entries={activeLogs} onAdd={handleAddLog} onDelete={handleDeleteLog} />
        )}
        {activeTab === "electricity" && (
          <ElectricityTab batchId={batchId} entries={activeLogs} onAdd={handleAddLog} onDelete={handleDeleteLog} />
        )}
        {activeTab === "fuel" && (
          <FuelTab batchId={batchId} entries={activeLogs} onAdd={handleAddLog} onDelete={handleDeleteLog} />
        )}
        {activeTab === "waste" && (
          <WasteTab batchId={batchId} entries={activeLogs} onAdd={handleAddLog} onDelete={handleDeleteLog} />
        )}
      </main>

    </div>
  );
}
