"use client";

import { useSyncExternalStore } from "react";
import { sessionStore } from "../../lib/store";

export function useSession() {
  return useSyncExternalStore(
    sessionStore.subscribe,
    sessionStore.getSnapshot,
    sessionStore.getStaticSnapshot,
  );
}
