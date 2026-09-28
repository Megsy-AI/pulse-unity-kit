import { Suspense, lazy } from "react";

/** Client-only mount for the Nomi React app (its own router included). */
const NomiApp = lazy(() => import("@/App"));

export function SpaMount() {
  return (
    <Suspense fallback={null}>
      <NomiApp />
    </Suspense>
  );
}
