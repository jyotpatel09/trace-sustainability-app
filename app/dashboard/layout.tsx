import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "View sustainability trends, batch scores, and resource usage for your factory — all in one place.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
