import { Suspense } from "react";
import { Dashboard } from "./content";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="animate-pulse">Loading ...</div>}>
      <Dashboard />
    </Suspense>
  );
}
