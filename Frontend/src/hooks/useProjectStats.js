import { useState, useEffect, useCallback, useRef } from "react";
import {
  fetchAllProjectStats,
  incrementProjectViews,
  incrementProjectClaps,
  subscribeToProjectStats,
  getUserClapsForProject,
  setUserClapsForProject,
  MAX_CLAPS_PER_USER_PER_PROJECT,
} from "../lib/projectStatsService";

export function useProjectStats() {
  const [stats, setStats] = useState({});
  const [userClaps, setUserClaps] = useState({});
  const [loading, setLoading] = useState(true);

  // Debounce queue for claps: { [projectId]: pendingCount }
  const clapQueueRef = useRef({});
  const debounceTimersRef = useRef({});

  // Initial stats fetch & realtime subscription
  useEffect(() => {
    let isMounted = true;
    const timers = debounceTimersRef.current;

    fetchAllProjectStats().then((data) => {
      if (isMounted) {
        setStats(data || {});
        setLoading(false);
      }
    });

    const unsubscribe = subscribeToProjectStats((update) => {
      if (!isMounted || !update?.projectId) return;
      setStats((prev) => ({
        ...prev,
        [update.projectId]: {
          views: update.views ?? prev[update.projectId]?.views ?? 0,
          claps: update.claps ?? prev[update.projectId]?.claps ?? 0,
        },
      }));
    });

    return () => {
      isMounted = false;
      unsubscribe();
      // Flush any remaining timers safely using the copied ref variable
      Object.values(timers).forEach(clearTimeout);
    };
  }, []);

  // Get current stats for a project
  const getProjectStat = useCallback(
    (projectId) => {
      return stats[projectId] || { views: 0, claps: 0 };
    },
    [stats]
  );

  // Get user's personal clap count for a project
  const getUserClapCount = useCallback((projectId) => {
    if (!projectId) return 0;
    return getUserClapsForProject(projectId);
  }, []);

  // Record a verified unique view per session
  const recordView = useCallback((projectId) => {
    if (!projectId || typeof window === "undefined") return;

    const sessionKey = `portfolio_viewed_${projectId}`;
    if (sessionStorage.getItem(sessionKey)) {
      // Already viewed in this session
      return;
    }

    sessionStorage.setItem(sessionKey, "1");

    // Optimistic UI update
    setStats((prev) => {
      const curr = prev[projectId] || { views: 0, claps: 0 };
      return {
        ...prev,
        [projectId]: {
          ...curr,
          views: (curr.views || 0) + 1,
        },
      };
    });

    // Send to backend
    incrementProjectViews(projectId);
  }, []);

  // Medium-style Clap action with rapid-tap optimistic update & debounced network batching
  const clap = useCallback((projectId, count = 1) => {
    if (!projectId) return { success: false, currentTotal: 0, userTotal: 0 };

    const currentCount = getUserClapsForProject(projectId);
    if (currentCount >= MAX_CLAPS_PER_USER_PER_PROJECT) {
      return {
        success: false,
        maxReached: true,
        userTotal: currentCount,
        currentTotal: stats[projectId]?.claps || 0,
      };
    }

    const incrementAmount = Math.min(count, MAX_CLAPS_PER_USER_PER_PROJECT - currentCount);
    const newUserTotal = currentCount + incrementAmount;

    // Save user total locally
    setUserClapsForProject(projectId, newUserTotal);
    setUserClaps((prev) => ({ ...prev, [projectId]: newUserTotal }));

    // Optimistically bump total claps in state
    setStats((prev) => {
      const curr = prev[projectId] || { views: 0, claps: 0 };
      return {
        ...prev,
        [projectId]: {
          ...curr,
          claps: (curr.claps || 0) + incrementAmount,
        },
      };
    });

    // Queue for debounced network dispatch
    clapQueueRef.current[projectId] = (clapQueueRef.current[projectId] || 0) + incrementAmount;

    if (debounceTimersRef.current[projectId]) {
      clearTimeout(debounceTimersRef.current[projectId]);
    }

    debounceTimersRef.current[projectId] = setTimeout(() => {
      const batchedClaps = clapQueueRef.current[projectId];
      delete clapQueueRef.current[projectId];
      delete debounceTimersRef.current[projectId];

      if (batchedClaps && batchedClaps > 0) {
        incrementProjectClaps(projectId, batchedClaps);
      }
    }, 600);

    return {
      success: true,
      maxReached: newUserTotal >= MAX_CLAPS_PER_USER_PER_PROJECT,
      userTotal: newUserTotal,
      incrementAmount,
    };
  }, [stats]);

  return {
    stats,
    userClaps,
    loading,
    getProjectStat,
    getUserClapCount,
    recordView,
    clap,
    maxClaps: MAX_CLAPS_PER_USER_PER_PROJECT,
  };
}
