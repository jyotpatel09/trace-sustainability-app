"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, PlusCircle, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { saveBatch } from "@/lib/store";
import { Batch } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ─── Zod Schema ────────────────────────────────────────────────────────
const batchSchema = z.object({
  batchId: z.string().min(1, "Batch ID is required").max(50),
  productType: z.enum([
    "garment",
    "leather_goods",
    "food_processing",
    "ceramic",
    "paper",
    "other",
  ], { message: "Please select a product type" }),
  units: z.number({ message: "Please enter a valid number" }).min(1, "Must be at least 1 unit"),
  startDate: z.string().min(1, "Start date is required"),
  rawMaterial: z.string().min(1, "Primary raw material is required").max(100),
});

type BatchFormValues = z.infer<typeof batchSchema>;

// ─── Constants ────────────────────────────────────────────────────────
const PRODUCT_TYPES = [
  { value: "garment", label: "Garment & Textiles" },
  { value: "leather_goods", label: "Leather Goods" },
  { value: "food_processing", label: "Food Processing" },
  { value: "ceramic", label: "Ceramics & Glass" },
  { value: "paper", label: "Paper & Packaging" },
  { value: "other", label: "Other" },
];

export default function CreateBatchPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BatchFormValues>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      batchId: "",
      startDate: new Date().toISOString().split("T")[0],
      rawMaterial: "",
    },
  });

  const onSubmit = async (data: BatchFormValues) => {
    setIsSubmitting(true);
    
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 600));

    const typeLabels: Record<string, string> = {
      garment: "Garments",
      leather_goods: "Leather Goods",
      food_processing: "Processed Food",
      ceramic: "Ceramics & Glassware",
      paper: "Paper Packaging",
      other: "Products",
    };
    const productName = `${data.rawMaterial} ${typeLabels[data.productType] || "Products"}`;

    const newBatchId = data.batchId.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const newBatch: Batch = {
      id: newBatchId,
      factoryId: "f001",
      batchNumber: data.batchId,
      productName: productName,
      productType: data.productType,
      rawMaterial: data.rawMaterial,
      quantity: data.units,
      unit: data.productType === "ceramic" ? "sqm" : data.productType === "paper" ? "kg" : "units",
      status: "in-progress",
      startedAt: new Date(data.startDate).toISOString(),
      resources: [],
    };

    saveBatch(newBatch);
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Redirect to dashboard after showing success
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 animate-in fade-in zoom-in duration-300">
        <div 
          className="flex items-center justify-center w-16 h-16 rounded-full"
          style={{ backgroundColor: "var(--brand-green-pale)" }}
        >
          <CheckCircle2 className="w-8 h-8" style={{ color: "var(--brand-green)" }} />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Batch Created</h2>
          <p className="text-muted-foreground mt-1">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto w-full pb-20 sm:pb-0">
      
      {/* ── Header ────────────────────────────────────────────── */}
      <header className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-card hover:bg-muted transition-colors"
          aria-label="Go back to dashboard"
        >
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Create New Batch
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Log a new production run
          </p>
        </div>
      </header>

      {/* ── Form Card ──────────────────────────────────────────── */}
      <Card className="border border-border shadow-sm">
        <CardContent className="p-5 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            
            {/* Batch ID */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="batchId" className="text-sm font-semibold">
                Batch ID <span className="text-destructive">*</span>
              </Label>
              <Input
                id="batchId"
                placeholder="e.g. BATCH-2024-013"
                className="h-12 text-base touch-target"
                {...register("batchId")}
                aria-invalid={!!errors.batchId}
              />
              {errors.batchId && (
                <p className="text-xs text-destructive flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3" />
                  {errors.batchId.message}
                </p>
              )}
            </div>

            {/* Product Type (Select) */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="productType" className="text-sm font-semibold">
                Product Type <span className="text-destructive">*</span>
              </Label>
              <Controller
                control={control}
                name="productType"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger 
                      id="productType" 
                      className="h-12 text-base w-full touch-target"
                      aria-invalid={!!errors.productType}
                    >
                      <SelectValue placeholder="Select a product type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value} className="h-11">
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.productType && (
                <p className="text-xs text-destructive flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3" />
                  {errors.productType.message}
                </p>
              )}
            </div>

            {/* Units & Date Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Number of Units */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="units" className="text-sm font-semibold">
                  Number of Units <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="units"
                  type="number"
                  inputMode="numeric"
                  placeholder="e.g. 1000"
                  className="h-12 text-base touch-target"
                  {...register("units", { valueAsNumber: true })}
                  aria-invalid={!!errors.units}
                />
                {errors.units && (
                  <p className="text-xs text-destructive flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3 h-3" />
                    {errors.units.message}
                  </p>
                )}
              </div>

              {/* Start Date */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="startDate" className="text-sm font-semibold">
                  Start Date <span className="text-destructive">*</span>
                </Label>
                {/* Native date input is best for low-end Android accessibility & speed */}
                <Input
                  id="startDate"
                  type="date"
                  className="h-12 text-base touch-target w-full"
                  {...register("startDate")}
                  aria-invalid={!!errors.startDate}
                />
                {errors.startDate && (
                  <p className="text-xs text-destructive flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3 h-3" />
                    {errors.startDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Primary Raw Material */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="rawMaterial" className="text-sm font-semibold">
                Primary Raw Material <span className="text-destructive">*</span>
              </Label>
              <Input
                id="rawMaterial"
                placeholder="e.g. Organic Cotton Yarn"
                className="h-12 text-base touch-target"
                {...register("rawMaterial")}
                aria-invalid={!!errors.rawMaterial}
              />
              {errors.rawMaterial && (
                <p className="text-xs text-destructive flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3" />
                  {errors.rawMaterial.message}
                </p>
              )}
            </div>

            {/* Submit Actions */}
            <div className={cn(
              "mt-4 pt-4 sm:pt-0 sm:border-0 sm:bg-transparent",
              "fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border z-10 sm:relative sm:p-0"
            )}>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full h-12 text-base font-semibold text-white shadow-sm transition-all touch-target",
                  isSubmitting ? "opacity-80" : "hover:opacity-90 active:scale-[0.98]"
                )}
                style={{ backgroundColor: "var(--brand-green)" }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Batch...
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Create Batch
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
