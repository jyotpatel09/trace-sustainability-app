import { TopNav } from "./TopNav";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
  /**
   * When true, removes the default page padding so full-bleed
   * layouts (e.g. dashboard) can manage their own spacing.
   */
  fullWidth?: boolean;
}

/**
 * AppShell wraps every page with:
 *  - Sticky TopNav
 *  - Scrollable main content area
 *  - Consistent container & spacing
 */
export function AppShell({ children, className, fullWidth = false }: AppShellProps) {
  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <TopNav />

      <main
        id="main-content"
        className={cn(
          "flex-1 w-full",
          !fullWidth && "page-container section-spacing",
          className
        )}
        // Accessibility: skip-to-main link target
        tabIndex={-1}
      >
        {children}
      </main>

      {/* Footer rule — minimal, non-intrusive */}
      <footer className="border-t border-border py-4">
        <div className="page-container">
          <p className="text-xs text-muted-foreground text-center">
            Trace &mdash; Built for Indian SME Manufacturers &middot;{" "}
            <span className="font-medium" style={{ color: "var(--brand-green)" }}>
              Sustainability First
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}
