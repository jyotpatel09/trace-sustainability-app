"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Leaf, Printer, ArrowLeft, Download } from "lucide-react";
import { useReactToPrint } from "react-to-print";

import { getStoredBatches } from "@/lib/store";
import { Batch } from "@/types";
import { calculateBatchScore, ScoreResult } from "@/lib/scoring";
import { getPreviousBatch, calculateComparison, generateObservations, ComparisonMetrics } from "@/lib/report-utils";
import { cn, formatNumber } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function BatchReportPage() {
  const params = useParams();
  const router = useRouter();
  const batchId = params.id as string;

  const [batch, setBatch] = useState<Batch | null>(null);
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [comparison, setComparison] = useState<ComparisonMetrics | null>(null);
  const [observations, setObservations] = useState<string[]>([]);
  
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const allBatches = getStoredBatches();
    const currentBatch = allBatches.find((b) => b.id === batchId);
    if (!currentBatch) return;

    setBatch(currentBatch);
    const result = calculateBatchScore(currentBatch);
    setScoreResult(result);

    const previous = getPreviousBatch(currentBatch, allBatches);

    const prevResult = previous ? calculateBatchScore(previous) : null;
    const compMetrics = calculateComparison(result, prevResult, previous || undefined);
    setComparison(compMetrics);

    const obs = generateObservations(result, compMetrics);
    setObservations(obs);

  }, [batchId]);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: batch ? `trace-report-${batch.batchNumber.toLowerCase()}` : "trace-report",
  });

  if (!batch || !scoreResult || !comparison) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Generating Report...</div>;
  }

  const { deductions } = scoreResult;

  return (
    <div className="flex flex-col max-w-4xl mx-auto w-full pb-16 px-4 sm:px-6">
      
      {/* ── Action Buttons (No Print) ────────────────────────── */}
      <div className="no-print flex items-center justify-between mb-8 mt-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => router.push(`/dashboard`)}
          className="text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print Report
          </Button>
          <Button size="sm" onClick={handlePrint} style={{ backgroundColor: "var(--brand-green)" }}>
            <Download className="w-4 h-4 mr-2" />
            Save PDF
          </Button>
        </div>
      </div>

      {/* ── REPORT DOCUMENT ────────────────────────────────────── */}
      <div ref={contentRef} className="bg-white text-black p-0 sm:p-8 rounded-xl sm:border sm:border-border sm:shadow-sm print:border-0 print:shadow-none print:p-0">
        
        {/* 1. REPORT HEADER */}
        <header className="flex flex-col sm:flex-row justify-between items-start border-b border-border pb-6 mb-8 print-avoid-break">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-700 text-white print-force-bg">
                <Leaf className="w-5 h-5 !block" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Trace</h1>
            </div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-1">
              Sustainability Report Card
            </h2>
            <p className="text-2xl font-bold text-slate-900">{batch.productName}</p>
          </div>

          <div className="mt-6 sm:mt-0 text-left sm:text-right text-sm">
            <p className="text-slate-500 mb-1">Batch ID</p>
            <p className="font-mono font-bold text-slate-900 mb-3">{batch.batchNumber}</p>
            
            <p className="text-slate-500 mb-1">Production Date</p>
            <p className="font-medium text-slate-900">
              {new Date(batch.startedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              {batch.completedAt && ` - ${new Date(batch.completedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`}
            </p>
          </div>
        </header>

        {/* 2. SUSTAINABILITY SCORE SECTION */}
        <section className="mb-8 print-avoid-break">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Overall Sustainability Score</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Big Score Card */}
            <Card className="md:col-span-1 bg-slate-50 border-slate-200 print-force-bg shadow-none flex flex-col items-center justify-center p-6 text-center">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Final Score</p>
              <div className="flex items-baseline gap-1">
                <span className={cn(
                  "text-6xl font-black",
                  scoreResult.score >= 80 ? "text-emerald-700" : scoreResult.score >= 50 ? "text-amber-600" : "text-red-600"
                )}>
                  {scoreResult.score}
                </span>
                <span className="text-xl font-bold text-slate-400">/100</span>
              </div>
            </Card>

            {/* Deduction Breakdown */}
            <Card className="md:col-span-2 border-slate-200 shadow-none">
              <CardHeader className="py-4 bg-slate-50 border-b border-slate-200 print-force-bg">
                <CardTitle className="text-sm">Deduction Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-sm text-left">
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 px-4 text-slate-600">Water Consumption Limit</td>
                      <td className="py-3 px-4 font-bold text-right text-red-600">-{deductions.water} pts</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-slate-600">Electricity Consumption Limit</td>
                      <td className="py-3 px-4 font-bold text-right text-red-600">-{deductions.electricity} pts</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-slate-600">Fuel Usage Penalty</td>
                      <td className="py-3 px-4 font-bold text-right text-red-600">-{deductions.fuel} pts</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-slate-600">Waste Disposal Penalty</td>
                      <td className="py-3 px-4 font-bold text-right text-red-600">-{deductions.waste} pts</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-slate-600">Tanker Water Usage Penalty</td>
                      <td className="py-3 px-4 font-bold text-right text-red-600">-{deductions.tanker} pts</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 3. RESOURCE SUMMARY SECTION */}
        <section className="mb-8 print-avoid-break">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Resource Summary</h3>
          <Card className="border-slate-200 shadow-none overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              
              <div className="p-5 flex flex-col justify-center">
                <p className="text-xs font-semibold text-slate-500 uppercase">Production Output</p>
                <p className="text-lg font-bold text-slate-900 mt-1">{formatNumber(batch.quantity, 0)} {batch.unit}</p>
              </div>

              <div className="p-5 flex flex-col justify-center">
                <p className="text-xs font-semibold text-slate-500 uppercase">Total Water</p>
                <p className="text-lg font-bold text-slate-900 mt-1">{formatNumber(scoreResult.totalWater, 0)} L</p>
                <p className="text-xs text-slate-500 mt-1">{scoreResult.waterPerUnit.toFixed(1)} L / {batch.unit}</p>
              </div>

              <div className="p-5 flex flex-col justify-center">
                <p className="text-xs font-semibold text-slate-500 uppercase">Total Electricity</p>
                <p className="text-lg font-bold text-slate-900 mt-1">{formatNumber(scoreResult.totalElectricity, 0)} kWh</p>
                <p className="text-xs text-slate-500 mt-1">{scoreResult.electricityPerUnit.toFixed(1)} kWh / {batch.unit}</p>
              </div>

              <div className="p-5 flex flex-col justify-center">
                <p className="text-xs font-semibold text-slate-500 uppercase">Total Penalties</p>
                <p className="text-lg font-bold text-red-600 mt-1">-{100 - scoreResult.score} pts</p>
              </div>

            </div>
          </Card>
        </section>

        {/* 4. COMPARISON SECTION */}
        <section className="mb-8 print-avoid-break">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Historical Comparison</h3>
          {comparison.hasPreviousBatch ? (
            <Card className="border-slate-200 shadow-none bg-slate-50 print-force-bg p-5">
              <p className="text-sm text-slate-600 mb-4">
                Comparing against previous batch: <span className="font-mono font-bold text-slate-900">{comparison.prevBatchNumber}</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase font-semibold">Score Shift</p>
                  <p className={cn("text-lg font-bold mt-1", comparison.scoreDiff > 0 ? "text-emerald-600" : comparison.scoreDiff < 0 ? "text-red-600" : "text-slate-600")}>
                    {comparison.scoreDiff > 0 ? "+" : ""}{comparison.scoreDiff} pts
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase font-semibold">Water Efficiency</p>
                  <p className={cn("text-lg font-bold mt-1", comparison.waterPerUnitDiff < 0 ? "text-emerald-600" : comparison.waterPerUnitDiff > 0 ? "text-red-600" : "text-slate-600")}>
                    {comparison.waterPerUnitDiff > 0 ? "+" : ""}{comparison.waterPerUnitDiff.toFixed(1)}% per unit
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase font-semibold">Power Efficiency</p>
                  <p className={cn("text-lg font-bold mt-1", comparison.elecPerUnitDiff < 0 ? "text-emerald-600" : comparison.elecPerUnitDiff > 0 ? "text-red-600" : "text-slate-600")}>
                    {comparison.elecPerUnitDiff > 0 ? "+" : ""}{comparison.elecPerUnitDiff.toFixed(1)}% per unit
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <div className="p-6 border border-dashed border-slate-200 rounded-xl text-center">
              <p className="text-sm text-slate-500 italic">No previous completed batch available for comparison.</p>
            </div>
          )}
        </section>

        {/* 5. OBSERVATION SECTION */}
        <section className="print-avoid-break">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Operational Observations</h3>
          <ul className="space-y-3">
            {observations.map((obs, idx) => (
              <li key={idx} className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-100 rounded-lg print-force-bg">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold shrink-0 print-force-bg">
                  {idx + 1}
                </span>
                <p className="text-sm text-slate-700 leading-relaxed pt-0.5">{obs}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <Separator className="my-8" />
        <footer className="text-center text-xs text-slate-400">
          <p>Generated by Trace Sustainability Tracker</p>
          <p className="mt-1">Date Printed: {new Date().toLocaleDateString("en-IN")}</p>
        </footer>

      </div>
    </div>
  );
}
