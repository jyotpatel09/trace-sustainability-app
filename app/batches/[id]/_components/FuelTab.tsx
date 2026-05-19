"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle, Loader2, AlertCircle } from "lucide-react";
import { ResourceLog, FuelType } from "@/types";

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
const fuelSchema = z.object({
  quantity: z.number({ message: "Please enter a valid amount" }).min(1, "Must be greater than 0"),
  fuelType: z.enum(["diesel", "LPG", "coal"] as const, {
    message: "Please select a fuel type",
  }),
  recordedAt: z.string().min(1, "Date is required"),
  notes: z.string().max(200).optional(),
});

type FuelFormValues = z.infer<typeof fuelSchema>;

interface FuelTabProps {
  batchId: string;
  entries: ResourceLog[];
  onAdd: (log: ResourceLog) => void;
  onDelete: (id: string) => void;
}

export function FuelTab({ batchId, entries, onAdd, onDelete }: FuelTabProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FuelFormValues>({
    resolver: zodResolver(fuelSchema),
    defaultValues: {
      recordedAt: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  const onSubmit = async (data: FuelFormValues) => {
    setIsSubmitting(true);
    await new Promise((res) => setTimeout(res, 600));

    // Determine unit based on fuel
    const unit = data.fuelType === "diesel" ? "liters" : "kg";

    const newLog: ResourceLog = {
      id: `f-${Date.now()}`,
      batchId,
      resourceType: "fuel",
      name: `Fuel Usage - ${data.fuelType}`,
      quantity: data.quantity,
      unit,
      recordedAt: data.recordedAt,
      fuelType: data.fuelType,
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
        
        {/* Fuel Type Dropdown */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="fuel-type" className="text-sm font-semibold">
            Fuel Type <span className="text-destructive">*</span>
          </Label>
          <Controller
            control={control}
            name="fuelType"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="fuel-type" className="h-12 text-base touch-target" aria-invalid={!!errors.fuelType}>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diesel" className="h-11">Diesel</SelectItem>
                  <SelectItem value="LPG" className="h-11">LPG</SelectItem>
                  <SelectItem value="coal" className="h-11">Coal</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.fuelType && (
            <p className="text-xs text-destructive flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3 h-3" />
              {errors.fuelType.message}
            </p>
          )}
        </div>

        {/* Quantity */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="fuel-quantity" className="text-sm font-semibold">
            Amount (Litres / Kg) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fuel-quantity"
            type="number"
            inputMode="numeric"
            placeholder="e.g. 200"
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

        {/* Date */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="fuel-date" className="text-sm font-semibold">
            Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fuel-date"
            type="date"
            className="h-12 text-base touch-target"
            {...register("recordedAt")}
            aria-invalid={!!errors.recordedAt}
          />
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="fuel-notes" className="text-sm font-semibold">
            Notes (Optional)
          </Label>
          <Input
            id="fuel-notes"
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
              Add Fuel Log
            </>
          )}
        </Button>
      </form>

      <EntryList entries={entries} onDelete={onDelete} type="fuel" />
    </div>
  );
}
