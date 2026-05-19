import type { Metadata } from "next";
import Link from "next/link";
import {
  Leaf,
  ArrowRight,
  FlaskConical,
  PlusCircle,
  Layers,
  Gauge,
  FileText,
  ClipboardList,
  Zap,
  Droplets,
  Flame,
  Trash2,
  CheckCircle2,
  ChevronRight,
  Factory,
  BarChart3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Home | Track Factory Resource Usage Batch-by-Batch",
  description:
    "Trace helps Indian SME manufacturers log water, electricity, fuel, and waste per production batch — and generate sustainability report cards instantly.",
};

// ─── Shared styles ───────────────────────────────────────────
const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-lg px-6 font-semibold text-white transition-all duration-150 active:translate-y-px select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:opacity-90";

const btnOutline =
  "inline-flex items-center justify-center gap-2 rounded-lg px-6 font-semibold border border-border bg-card text-foreground transition-all duration-150 active:translate-y-px select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-muted";

// ─── Data ───────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Layers,
    title: "Batch Tracking",
    desc: "Organise every production run into a numbered batch. Know exactly what was produced, when, and how much.",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    icon: ClipboardList,
    title: "Resource Logging",
    desc: "Record electricity, water, fuel, and material consumption per batch in seconds — right from the factory floor.",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    icon: Gauge,
    title: "Sustainability Score",
    desc: "Each batch receives an A–F grade based on resource intensity versus your industry benchmark.",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    icon: FileText,
    title: "Printable Reports",
    desc: "Generate clean, shareable PDF report cards — ready for audits, buyers, or internal review.",
    color: "text-slate-700",
    bg: "bg-slate-100",
    border: "border-slate-200",
  },
] as const;

const STEPS = [
  {
    n: "01",
    icon: PlusCircle,
    title: "Create a Batch",
    desc: "Enter your product name, quantity, and start date. Takes under 30 seconds.",
  },
  {
    n: "02",
    icon: ClipboardList,
    title: "Log Resources",
    desc: "Record water, electricity, fuel, and waste as you produce. Use simple number inputs.",
  },
  {
    n: "03",
    icon: FileText,
    title: "Get Report Card",
    desc: "Instantly receive a graded sustainability report card with improvement tips.",
  },
] as const;

const RESOURCES = [
  { icon: Zap,      label: "Electricity", unit: "kWh",    color: "text-amber-600",  bg: "bg-amber-50"  },
  { icon: Droplets, label: "Water",       unit: "Litres", color: "text-blue-600",   bg: "bg-blue-50"   },
  { icon: Flame,    label: "Fuel / Gas",  unit: "Litres", color: "text-orange-600", bg: "bg-orange-50" },
  { icon: Trash2,   label: "Waste",       unit: "Kg",     color: "text-slate-600",  bg: "bg-slate-100" },
] as const;

const DEMO_STATS = [
  { label: "Batches logged",    value: "12"   },
  { label: "Avg. score",        value: "B+"   },
  { label: "Water saved",       value: "14%"  },
  { label: "Energy intensity",  value: "↓ 8%" },
] as const;

// ─── Page ───────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="flex flex-col gap-0">

      {/* ════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="hero-heading"
        className="py-12 sm:py-16 lg:py-20"
      >
        <div className="flex flex-col items-start gap-6 max-w-2xl">

          {/* Badge */}
          <Badge
            variant="outline"
            className="gap-1.5 px-3 py-1 text-xs font-medium rounded-full"
            style={{
              backgroundColor: "var(--brand-green-pale)",
              color: "var(--brand-green)",
              borderColor: "var(--brand-green-light)",
            }}
          >
            <Leaf className="w-3 h-3" aria-hidden="true" />
            Sustainability Tracking for Indian SMEs
          </Badge>

          {/* Headline */}
          <div className="flex flex-col gap-3">
            <h1
              id="hero-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight"
            >
              Track Factory Resource Usage{" "}
              <span className="text-gradient-green">Batch-by-Batch</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
              Log water, electricity, fuel, and waste for every production run.
              Generate sustainability report cards your buyers and auditors trust.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              id="btn-hero-demo"
              href="/demo"
              className={cn(btnPrimary, "h-12 text-sm w-full sm:w-auto shadow-sm")}
              style={{ backgroundColor: "var(--brand-green)" }}
            >
              <FlaskConical className="w-4 h-4" aria-hidden="true" />
              Try Demo Factory
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              id="btn-hero-new-batch"
              href="/batches/new"
              className={cn(btnOutline, "h-12 text-sm w-full sm:w-auto")}
            >
              <PlusCircle className="w-4 h-4" aria-hidden="true" />
              Create New Batch
            </Link>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1">
            {[
              "No sign-up required",
              "Works offline",
              "Mobile-friendly",
            ].map((t) => (
              <span
                key={t}
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <CheckCircle2
                  className="w-3.5 h-3.5 flex-shrink-0"
                  style={{ color: "var(--brand-green)" }}
                  aria-hidden="true"
                />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Resource pills — visual anchor */}
        <div className="mt-10 flex flex-wrap gap-3">
          {RESOURCES.map(({ icon: Icon, label, unit, color, bg }) => (
            <div
              key={label}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-card shadow-sm",
              )}
            >
              <span className={cn("flex items-center justify-center w-7 h-7 rounded-full", bg)}>
                <Icon className={cn("w-3.5 h-3.5", color)} aria-hidden="true" />
              </span>
              <div className="leading-none">
                <p className="text-xs font-semibold text-foreground">{label}</p>
                <p className="text-[10px] text-muted-foreground">{unit} / batch</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* ════════════════════════════════════════════════════
          FEATURES
      ════════════════════════════════════════════════════ */}
      <section
        id="features"
        aria-labelledby="features-heading"
        className="py-12 sm:py-16"
      >
        <div className="flex flex-col gap-2 mb-8">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            What Trace does
          </p>
          <h2
            id="features-heading"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
          >
            Everything your factory needs
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg">
            Built for the factory floor — not the boardroom. Simple enough for any staff member to use.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc, color, bg, border }) => (
            <Card
              key={title}
              className={cn("border shadow-sm hover:shadow-md transition-shadow duration-200", border)}
            >
              <CardContent className="flex gap-4 p-5">
                <span
                  className={cn(
                    "flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-lg",
                    bg
                  )}
                  aria-hidden="true"
                >
                  <Icon className={cn("w-5 h-5", color)} />
                </span>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-foreground">{title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* ════════════════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════════════════ */}
      <section
        id="how-it-works"
        aria-labelledby="how-heading"
        className="py-12 sm:py-16"
      >
        <div className="flex flex-col gap-2 mb-8">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Simple process
          </p>
          <h2
            id="how-heading"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
          >
            From batch to report in minutes
          </h2>
        </div>

        {/* Steps */}
        <ol className="flex flex-col gap-4">
          {STEPS.map(({ n, icon: Icon, title, desc }, idx) => (
            <li key={n} className="flex gap-4 items-start">
              {/* Step number + connector */}
              <div className="flex flex-col items-center flex-shrink-0">
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-sm"
                  style={{ backgroundColor: "var(--brand-green)" }}
                  aria-hidden="true"
                >
                  {n}
                </span>
                {idx < STEPS.length - 1 && (
                  <div className="w-0.5 h-8 mt-1 bg-border" aria-hidden="true" />
                )}
              </div>

              {/* Content */}
              <div className="pb-2 pt-1">
                <div className="flex items-center gap-2 mb-1">
                  <Icon
                    className="w-4 h-4"
                    style={{ color: "var(--brand-green)" }}
                    aria-hidden="true"
                  />
                  <p className="text-sm font-semibold text-foreground">{title}</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                  {desc}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* Inline CTA */}
        <div className="mt-8">
          <Link
            id="btn-how-start"
            href="/batches/new"
            className={cn(
              btnPrimary,
              "h-11 text-sm w-full sm:w-auto"
            )}
            style={{ backgroundColor: "var(--brand-green)" }}
          >
            Start Your First Batch
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <Separator />

      {/* ════════════════════════════════════════════════════
          DEMO FACTORY
      ════════════════════════════════════════════════════ */}
      <section
        id="demo"
        aria-labelledby="demo-heading"
        className="py-12 sm:py-16"
      >
        <div
          className="rounded-xl border p-6 sm:p-8"
          style={{
            background: "var(--brand-green-pale)",
            borderColor: "var(--brand-green-light)",
          }}
        >
          {/* Header */}
          <div className="flex items-start gap-3 mb-6">
            <span
              className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl text-white shadow-sm"
              style={{ backgroundColor: "var(--brand-green)" }}
              aria-hidden="true"
            >
              <Factory className="w-5 h-5" />
            </span>
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-0.5"
                style={{ color: "var(--brand-green)" }}
              >
                Explore sample data
              </p>
              <h2
                id="demo-heading"
                className="text-xl sm:text-2xl font-bold tracking-tight text-foreground"
              >
                Demo Factory — Arjun Textiles
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Pre-loaded with 12 completed batches. Explore real sustainability scores.
              </p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {DEMO_STATS.map(({ label, value }) => (
              <div
                key={label}
                className="bg-white rounded-lg border border-white/80 px-4 py-3 shadow-sm"
              >
                <p
                  className="text-lg font-bold"
                  style={{ color: "var(--brand-green)" }}
                >
                  {value}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              id="btn-demo-explore"
              href="/demo"
              className={cn(btnPrimary, "h-11 text-sm w-full sm:w-auto shadow-sm")}
              style={{ backgroundColor: "var(--brand-green)" }}
            >
              <BarChart3 className="w-4 h-4" aria-hidden="true" />
              Explore Demo Factory
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <p className="text-xs text-muted-foreground self-center">
              No data is saved. Safe to experiment.
            </p>
          </div>
        </div>
      </section>

      <Separator />

      {/* ════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════ */}
      <footer className="py-8" aria-label="Site footer">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span
              className="flex items-center justify-center w-7 h-7 rounded-md"
              style={{ backgroundColor: "var(--brand-green)" }}
              aria-hidden="true"
            >
              <Leaf className="w-4 h-4 text-white" strokeWidth={2.5} />
            </span>
            <div className="leading-none">
              <p
                className="text-sm font-bold"
                style={{ color: "var(--brand-green)" }}
              >
                Trace
              </p>
              <p className="text-[10px] text-muted-foreground">
                Sustainability Tracker
              </p>
            </div>
          </div>

          {/* Links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-5 gap-y-1">
              {[
                { label: "Demo",    href: "/demo"         },
                { label: "Batches", href: "/batches"      },
                { label: "Reports", href: "/reports"      },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <p className="text-[11px] text-muted-foreground">
            Built for Indian SME Manufacturers &middot; Hackathon MVP
          </p>
        </div>
      </footer>

    </div>
  );
}
