import { create } from "zustand";

import initialAllSessions from "@/data/allSessions.json";
import type { ApiAllSessions, Session } from "@/types.js";
import { formatSessions } from "@/utils/sessions.js";

const doFetch = async (url: string) => {
  try {
    const result = await fetch(url);
    return await result.json();
  } catch {
    return null;
  }
};

type ConfState = {
  schedule: {
    dayOne: Session[];
    dayTwo: Session[];
  };
  allSessions: ApiAllSessions;
  isRefreshing?: boolean;
  lastRefreshed: string | null;
  refreshData: (options?: { ttlMs?: number }) => Promise<void>;
  shouldUseLocalTz: boolean;
  toggleLocalTz: () => void;
};

const getInitialSchedule = () => {
  const [dayOne, dayTwo] = formatSessions(initialAllSessions);
  return {
    schedule: {
      dayOne: dayOne as Session[],
      dayTwo: dayTwo as Session[],
    },
    allSessions: initialAllSessions as ApiAllSessions,
  };
};

export const useReactConfStore = create<ConfState>((set, get) => ({
  ...getInitialSchedule(),
  isRefreshing: false,
  lastRefreshed: null,
  shouldUseLocalTz: false,
  refreshData: async (options) => {
    const ttlMs = options?.ttlMs;
    const { isRefreshing, lastRefreshed } = get();

    // Bail out if already refreshing
    if (isRefreshing) {
      return;
    }

    // Bail out if last refresh was within TTL
    if (lastRefreshed) {
      const diff = new Date().getTime() - new Date(lastRefreshed).getTime();
      if (ttlMs && diff < ttlMs) {
        return;
      }
    }

    try {
      set({ isRefreshing: true });

      const allSessions = await doFetch(
        "https://sessionize.com/api/v2/ctta9bhe/view/All",
      );

      if (allSessions) {
        const [dayOne, dayTwo] = formatSessions(allSessions as ApiAllSessions);
        set({
          schedule: {
            dayOne: dayOne as Session[],
            dayTwo: dayTwo as Session[],
          },
          allSessions: allSessions as ApiAllSessions,
          lastRefreshed: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.warn(e);
    } finally {
      set({ isRefreshing: false });
    }
  },
  toggleLocalTz: () => {
    set((state) => ({ shouldUseLocalTz: !state.shouldUseLocalTz }));
  },
}));
