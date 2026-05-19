"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Factory, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopNavProps {
  className?: string;
}

const NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
] as const;

export function TopNav({ className }: TopNavProps) {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full",
        "border-b border-border bg-card/95 backdrop-blur-sm",
        "shadow-[0_1px_3px_rgba(0,0,0,0.06)]",
        className
      )}
    >
      <div className="page-container">
        <div className="flex h-14 items-center justify-between gap-4">

          {/* ── Brand ── */}
          <Link
            href="/"
            className="flex items-center gap-2 focus-ring rounded-md px-1 shrink-0"
            aria-label="Trace – Go to homepage"
          >
            <span
              className="flex items-center justify-center w-8 h-8 rounded-md"
              style={{ backgroundColor: "var(--brand-green)" }}
              aria-hidden="true"
            >
              <Leaf className="w-4 h-4 text-white" strokeWidth={2.5} />
            </span>
            <span className="flex flex-col leading-none">
              <span
                className="text-base tracking-tight font-bold"
                style={{ color: "var(--brand-green)" }}
              >
                Trace
              </span>
              <span className="text-[10px] text-muted-foreground font-medium hidden sm:block">
                Sustainability Tracker
              </span>
            </span>
          </Link>

          {/* ── Nav links (tablet+) ── */}
          <nav
            aria-label="Main navigation"
            className="hidden sm:flex items-center gap-1 flex-1"
          >
            {NAV_LINKS.map(({ label, href, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                    active
                      ? "text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  style={active ? { backgroundColor: "var(--brand-green)" } : {}}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* ── Right: factory badge ── */}
          <div className="flex items-center gap-2 shrink-0">
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border"
              style={{
                backgroundColor: "var(--brand-green-pale)",
                color: "var(--brand-green)",
                borderColor: "var(--brand-green-light)",
              }}
            >
              <Factory className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Demo Factory</span>
              <span className="sm:hidden">Demo</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
