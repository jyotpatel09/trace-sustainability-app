import Link from "next/link";
import { PlusCircle, FileText, FlaskConical, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const ACTIONS = [
  {
    id: "qa-create-batch",
    label: "Create New Batch",
    description: "Start logging a new production run",
    href: "/batches/new",
    icon: PlusCircle,
    primary: true,
  },
  {
    id: "qa-view-reports",
    label: "View Reports",
    description: "Browse all sustainability report cards",
    href: "/reports",
    icon: FileText,
    primary: false,
  },
  {
    id: "qa-demo-factory",
    label: "Open Demo Factory",
    description: "Explore pre-loaded sample data",
    href: "/demo",
    icon: FlaskConical,
    primary: false,
  },
] as const;

export function QuickActions() {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
        Quick Actions
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {ACTIONS.map(({ id, label, description, href, icon: Icon, primary }) => (
          <Link
            key={id}
            id={id}
            href={href}
            className={cn(
              "flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-150 group",
              primary
                ? "text-white border-transparent shadow-sm hover:opacity-90"
                : "bg-card border-border text-foreground hover:bg-muted"
            )}
            style={primary ? { backgroundColor: "var(--brand-green)" } : {}}
          >
            <span
              className={cn(
                "flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg",
                primary ? "bg-white/15" : "bg-muted"
              )}
              aria-hidden="true"
            >
              <Icon
                className={cn("w-4 h-4", primary ? "text-white" : "text-muted-foreground")}
              />
            </span>
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm font-semibold", primary ? "text-white" : "text-foreground")}>
                {label}
              </p>
              <p className={cn("text-[10px] mt-0.5 truncate", primary ? "text-white/70" : "text-muted-foreground")}>
                {description}
              </p>
            </div>
            <ChevronRight
              className={cn("w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 transition-transform", primary ? "text-white/70" : "text-muted-foreground")}
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
