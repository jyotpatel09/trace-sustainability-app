"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle, Loader2, AlertCircle } from "lucide-react";
import { ResourceLog, WaterSource } from "@/types";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EntryList } from "./EntryList";
import { useState } from "react";

// ─── Zod Schema ────────────────────────────────────────────────────────
const waterSchema = z.object({
  quantity: z.number({ message: "Please enter a valid amount" }).min(1, "Must be greater than 0"),
  waterSource: z.enum(["municipal", "borewell", "tanker"] as const, {
    message: "Please select a water source",
  }),
  tankerCost: z.number().optional(),
  recordedAt: z.string().min(1, "Date is required"),
  notes: z.string().max(200).optional(),
}).refine(
  (data) => {
    if (data.waterSource === "tanker" && (!data.tankerCost || data.tankerCost <= 0)) {
      return false;
    }
    return true;
  },
  {
    message: "Tanker cost is required when Tanker is selected",
    path: ["tankerCost"],
  }
);

type WaterFormValues = z.infer<typeof waterSchema>;

interface WaterTabProps {
  batchId: string;
  entries: ResourceLog[];
  onAdd: (log: ResourceLog) => void;
  onDelete: (id: string) => void;
}

export function WaterTab({ batchId, entries, onAdd, onDelete }: WaterTabProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<WaterFormValues>({
    resolver: zodResolver(waterSchema),
    defaultValues: {
      recordedAt: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  const selectedSource = watch("waterSource");

  const onSubmit = async (data: WaterFormValues) => {
    setIsSubmitting(true);
    // Simulate API delay
    await new Promise((res) => setTimeout(res, 600));

    const newLog: ResourceLog = {
      id: `w-${Date.now()}`,
      batchId,
      resourceType: "water",
      name: `Water Logging - ${data.waterSource}`,
      quantity: data.quantity,
      unit: "liters",
      recordedAt: data.recordedAt,
      waterSource: data.waterSource,
      tankerCost: data.waterSource === "tanker" ? data.tankerCost : undefined,
      notes: data.notes || undefined,
    };

    onAdd(newLog);
    reset({
      recordedAt: new Date().toISOString().split("T")[0],
      notes: "",
    });
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 p-5 bg-card border border-border shadow-sm rounded-xl">
        {/* Quantity */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="water-quantity" className="text-sm font-semibold">
            Amount (Litres) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="water-quantity"
            type="number"
            inputMode="numeric"
            placeholder="e.g. 500"
            className="h-12 text-base touch-target"
            {...register("quantity", { valueAsNumber: true })}
            aria-invalid={!!errors.quantity}
          />
          {errors.quantity && (
            <p className="text-xs text-destructive flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3 h-3" />
              {errors.quantity.message}
            </p>
          )}
        </div>

        {/* Source Dropdown */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="water-source" className="text-sm font-semibold">
            Water Source <span className="text-destructive">*</span>
          </Label>
          <Controller
            control={control}
            name="waterSource"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="water-source" className="h-12 text-base touch-target" aria-invalid={!!errors.waterSource}>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="municipal" className="h-11">Municipal</SelectItem>
                  <SelectItem value="borewell" className="h-11">Borewell</SelectItem>
                  <SelectItem value="tanker" className="h-11">Tanker</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.waterSource && (
            <p className="text-xs text-destructive flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3 h-3" />
              {errors.waterSource.message}
            </p>
          )}
        </div>

        {/* Conditional Tanker Cost */}
        {selectedSource === "tanker" && (
          <div className="flex flex-col gap-2 animate-in slide-in-from-top-2 fade-in duration-200">
            <Label htmlFor="water-cost" className="text-sm font-semibold">
              Tanker Cost (₹ per litre) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="water-cost"
              type="number"
              step="0.01"
              inputMode="decimal"
              placeholder="e.g. 0.50"
              className="h-12 text-base touch-target"
              {...register("tankerCost", { valueAsNumber: true })}
              aria-invalid={!!errors.tankerCost}
            />
            {errors.tankerCost && (
              <p className="text-xs text-destructive flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3" />
                {errors.tankerCost.message}
              </p>
            )}
          </div>
        )}

        {/* Date */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="water-date" className="text-sm font-semibold">
            Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="water-date"
            type="date"
            className="h-12 text-base touch-target"
            {...register("recordedAt")}
            aria-invalid={!!errors.recordedAt}
          />
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="water-notes" className="text-sm font-semibold">
            Notes (Optional)
          </Label>
          <Input
            id="water-notes"
            placeholder="Any specific details..."
            className="h-12 text-base touch-target"
            {...register("notes")}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 text-base font-semibold text-white shadow-sm transition-all mt-2 touch-target"
          style={{ backgroundColor: "var(--brand-green)" }}
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <PlusCircle className="w-5 h-5 mr-2" />
              Add Water Log
            </>
          )}
        </Button>
      </form>

      <EntryList entries={entries} onDelete={onDelete} type="water" />
    </div>
  );
}
