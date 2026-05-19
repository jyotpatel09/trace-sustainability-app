"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle, Loader2, AlertCircle } from "lucide-react";
import { ResourceLog } from "@/types";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EntryList } from "./EntryList";
import { useState } from "react";

// ─── Zod Schema ────────────────────────────────────────────────────────
const electricitySchema = z.object({
  quantity: z.number({ message: "Please enter a valid amount" }).min(1, "Must be greater than 0"),
  solarContribution: z.number().min(0).max(100).optional(),
  recordedAt: z.string().min(1, "Date is required"),
  notes: z.string().max(200).optional(),
});

type ElectricityFormValues = z.infer<typeof electricitySchema>;

interface ElectricityTabProps {
  batchId: string;
  entries: ResourceLog[];
  onAdd: (log: ResourceLog) => void;
  onDelete: (id: string) => void;
}

export function ElectricityTab({ batchId, entries, onAdd, onDelete }: ElectricityTabProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ElectricityFormValues>({
    resolver: zodResolver(electricitySchema),
    defaultValues: {
      recordedAt: new Date().toISOString().split("T")[0],
      notes: "",
      solarContribution: 0,
    },
  });

  const onSubmit = async (data: ElectricityFormValues) => {
    setIsSubmitting(true);
    await new Promise((res) => setTimeout(res, 600));

    const newLog: ResourceLog = {
      id: `e-${Date.now()}`,
      batchId,
      resourceType: "electricity",
      name: `Electricity Usage`,
      quantity: data.quantity,
      unit: "kWh",
      recordedAt: data.recordedAt,
      solarContribution: data.solarContribution,
      notes: data.notes || undefined,
    };

    onAdd(newLog);
    reset({
      recordedAt: new Date().toISOString().split("T")[0],
      notes: "",
      solarContribution: 0,
    });
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 p-5 bg-card border border-border shadow-sm rounded-xl">
        {/* Quantity */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="elec-quantity" className="text-sm font-semibold">
            Amount (kWh) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="elec-quantity"
            type="number"
            inputMode="numeric"
            placeholder="e.g. 1500"
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

        {/* Solar Contribution */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="elec-solar" className="text-sm font-semibold">
            Solar Contribution (%)
          </Label>
          <Input
            id="elec-solar"
            type="number"
            inputMode="numeric"
            placeholder="e.g. 20"
            className="h-12 text-base touch-target"
            {...register("solarContribution", { valueAsNumber: true })}
            aria-invalid={!!errors.solarContribution}
          />
          {errors.solarContribution && (
            <p className="text-xs text-destructive flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3 h-3" />
              {errors.solarContribution.message}
            </p>
          )}
        </div>

        {/* Date */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="elec-date" className="text-sm font-semibold">
            Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="elec-date"
            type="date"
            className="h-12 text-base touch-target"
            {...register("recordedAt")}
            aria-invalid={!!errors.recordedAt}
          />
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="elec-notes" className="text-sm font-semibold">
            Notes (Optional)
          </Label>
          <Input
            id="elec-notes"
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
              Add Electricity Log
            </>
          )}
        </Button>
      </form>

      <EntryList entries={entries} onDelete={onDelete} type="electricity" />
    </div>
  );
}
