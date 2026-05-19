"use client";

import { Trash2, Droplets, Zap, Flame, Trash } from "lucide-react";
import { ResourceLog } from "@/types";
import { formatNumber } from "@/lib/utils";

interface EntryListProps {
  entries: ResourceLog[];
  onDelete: (id: string) => void;
  type: "water" | "electricity" | "fuel" | "waste";
}

const icons = {
  water: Droplets,
  electricity: Zap,
  fuel: Flame,
  waste: Trash,
};

const colors = {
  water: "text-blue-600 bg-blue-50 border-blue-100",
  electricity: "text-amber-600 bg-amber-50 border-amber-100",
  fuel: "text-orange-600 bg-orange-50 border-orange-100",
  waste: "text-slate-600 bg-slate-100 border-slate-200",
};

export function EntryList({ entries, onDelete, type }: EntryListProps) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center border-2 border-dashed border-border rounded-xl bg-card/50">
        <p className="text-sm font-semibold text-foreground">No entries yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          Log your first {type} entry above.
        </p>
      </div>
    );
  }

  const Icon = icons[type];
  const colorClass = colors[type];

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-2">
        Recent Logs
      </h3>
      <div className="flex flex-col gap-3">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-start gap-3 p-3.5 rounded-xl border border-border bg-card shadow-sm"
          >
            {/* Icon */}
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-lg shrink-0 border ${colorClass}`}
            >
              <Icon className="w-5 h-5" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-foreground truncate">
                    {formatNumber(entry.quantity, 0)} {entry.unit}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
                    {new Date(entry.recordedAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <button
                  onClick={() => onDelete(entry.id)}
                  className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors shrink-0"
                  aria-label="Delete entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Details based on type */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {entry.waterSource && (
                  <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
                    Source: {entry.waterSource}
                  </span>
                )}
                {entry.tankerCost && (
                  <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
                    Cost: ₹{entry.tankerCost}/L
                  </span>
                )}
                {entry.solarContribution !== undefined && (
                  <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
                    Solar: {entry.solarContribution}%
                  </span>
                )}
                {entry.fuelType && (
                  <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
                    Fuel: {entry.fuelType}
                  </span>
                )}
                {entry.wasteType && (
                  <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
                    Type: {entry.wasteType}
                  </span>
                )}
                {entry.disposalMethod && (
                  <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
                    Method: {entry.disposalMethod}
                  </span>
                )}
              </div>

              {entry.notes && (
                <p className="text-[11px] text-muted-foreground mt-2 italic bg-muted/50 p-2 rounded-md">
                  &quot;{entry.notes}&quot;
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
