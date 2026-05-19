"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle, Loader2, AlertCircle } from "lucide-react";
import { ResourceLog, WasteType, WasteDisposal } from "@/types";

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
const wasteSchema = z.object({
  quantity: z.number({ message: "Please enter a valid amount" }).min(1, "Must be greater than 0"),
  wasteType: z.enum(["fabric offcuts", "chemical", "food", "mixed"] as const, {
    message: "Please select a waste type",
  }),
  disposalMethod: z.enum(["landfill", "recycler", "composted", "unknown"] as const, {
    message: "Please select a disposal method",
  }),
  recordedAt: z.string().min(1, "Date is required"),
  notes: z.string().max(200).optional(),
});

type WasteFormValues = z.infer<typeof wasteSchema>;

interface WasteTabProps {
  batchId: string;
  entries: ResourceLog[];
  onAdd: (log: ResourceLog) => void;
  onDelete: (id: string) => void;
}

export function WasteTab({ batchId, entries, onAdd, onDelete }: WasteTabProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<WasteFormValues>({
    resolver: zodResolver(wasteSchema),
    defaultValues: {
      recordedAt: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  const onSubmit = async (data: WasteFormValues) => {
    setIsSubmitting(true);
    await new Promise((res) => setTimeout(res, 600));

    const newLog: ResourceLog = {
      id: `wst-${Date.now()}`,
      batchId,
      resourceType: "waste",
      name: `Waste - ${data.wasteType}`,
      quantity: data.quantity,
      unit: "kg",
      recordedAt: data.recordedAt,
      wasteType: data.wasteType,
      disposalMethod: data.disposalMethod,
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
          <Label htmlFor="waste-quantity" className="text-sm font-semibold">
            Amount (Kg) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="waste-quantity"
            type="number"
            inputMode="numeric"
            placeholder="e.g. 50"
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

        {/* Waste Type & Disposal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Waste Type Dropdown */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="waste-type" className="text-sm font-semibold">
              Waste Type <span className="text-destructive">*</span>
            </Label>
            <Controller
              control={control}
              name="wasteType"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="waste-type" className="h-12 text-base touch-target" aria-invalid={!!errors.wasteType}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fabric offcuts" className="h-11">Fabric Offcuts</SelectItem>
                    <SelectItem value="chemical" className="h-11">Chemical</SelectItem>
                    <SelectItem value="food" className="h-11">Food Processing</SelectItem>
                    <SelectItem value="mixed" className="h-11">Mixed / General</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.wasteType && (
              <p className="text-xs text-destructive flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3" />
                {errors.wasteType.message}
              </p>
            )}
          </div>

          {/* Disposal Method Dropdown */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="waste-disposal" className="text-sm font-semibold">
              Disposal Method <span className="text-destructive">*</span>
            </Label>
            <Controller
              control={control}
              name="disposalMethod"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="waste-disposal" className="h-12 text-base touch-target" aria-invalid={!!errors.disposalMethod}>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="landfill" className="h-11">Landfill</SelectItem>
                    <SelectItem value="recycler" className="h-11">Recycler / Sold</SelectItem>
                    <SelectItem value="composted" className="h-11">Composted</SelectItem>
                    <SelectItem value="unknown" className="h-11">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.disposalMethod && (
              <p className="text-xs text-destructive flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3" />
                {errors.disposalMethod.message}
              </p>
            )}
          </div>
        </div>

        {/* Date */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="waste-date" className="text-sm font-semibold">
            Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="waste-date"
            type="date"
            className="h-12 text-base touch-target"
            {...register("recordedAt")}
            aria-invalid={!!errors.recordedAt}
          />
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="waste-notes" className="text-sm font-semibold">
            Notes (Optional)
          </Label>
          <Input
            id="waste-notes"
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
              Add Waste Log
            </>
          )}
        </Button>
      </form>

      <EntryList entries={entries} onDelete={onDelete} type="waste" />
    </div>
  );
}
