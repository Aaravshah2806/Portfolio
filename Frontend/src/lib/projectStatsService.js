import { supabase, isSupabaseConfigured } from "./supabaseClient";

// Realistic default baseline stats for Aarav's portfolio projects
const DEFAULT_BASELINE_STATS = {
  dreamcatcher: { views: 260, claps: 145 },
  "gameboy-webos": { views: 340, claps: 210 },
  greenova: { views: 328, claps: 195 },
  healflow: { views: 312, claps: 186 },
  vibedocs: { views: 220, claps: 142 },
  "f1-race-replay": { views: 380, claps: 240 },
  zealflow: { views: 275, claps: 160 },
};

const LOCAL_STORAGE_STATS_KEY = "portfolio_project_stats_v1";
const LOCAL_STORAGE_USER_CLAPS_PREFIX = "portfolio_user_claps_";
const MAX_CLAPS_PER_USER_PER_PROJECT = 50;

// Cross-tab broadcast channel for instant multi-tab sync in local/demo mode
let localBroadcast = null;
if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  try {
    localBroadcast = new BroadcastChannel("portfolio_stats_sync");
  } catch {
    // Ignore fallback
  }
}

function getLocalStats() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_STATS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_STATS_KEY, JSON.stringify(DEFAULT_BASELINE_STATS));
      return { ...DEFAULT_BASELINE_STATS };
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_BASELINE_STATS, ...parsed };
  } catch {
    return { ...DEFAULT_BASELINE_STATS };
  }
}

function saveLocalStats(stats) {
  try {
    localStorage.setItem(LOCAL_STORAGE_STATS_KEY, JSON.stringify(stats));
    if (localBroadcast) {
      localBroadcast.postMessage({ type: "STATS_UPDATE", payload: stats });
    }
  } catch {
    // Ignore storage quota error
  }
}

export function getUserClapsForProject(projectId) {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_USER_CLAPS_PREFIX}${projectId}`);
    return raw ? parseInt(raw, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

export function setUserClapsForProject(projectId, count) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${LOCAL_STORAGE_USER_CLAPS_PREFIX}${projectId}`, String(count));
  } catch {
    // Ignore
  }
}

export async function fetchAllProjectStats() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("project_stats")
        .select("project_id, views, claps");

      if (!error && data && data.length > 0) {
        const statsMap = { ...DEFAULT_BASELINE_STATS };
        data.forEach((row) => {
          statsMap[row.project_id] = {
            views: Number(row.views) || 0,
            claps: Number(row.claps) || 0,
          };
        });
        saveLocalStats(statsMap);
        return statsMap;
      }
    } catch (err) {
      console.warn("Supabase fetch failed, using local/cached stats:", err);
    }
  }

  return getLocalStats();
}

export async function incrementProjectViews(projectId) {
  if (!projectId) return;

  // Local optimistic update
  const localStats = getLocalStats();
  const current = localStats[projectId] || { views: 0, claps: 0 };
  const updatedStats = {
    ...localStats,
    [projectId]: {
      ...current,
      views: (current.views || 0) + 1,
    },
  };
  saveLocalStats(updatedStats);

  // Supabase RPC call if configured
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.rpc("increment_project_views", { p_project_id: projectId });
    } catch (err) {
      console.warn("Failed to increment views via Supabase RPC:", err);
    }
  }

  return updatedStats[projectId];
}

export async function incrementProjectClaps(projectId, count = 1) {
  if (!projectId || count <= 0) return;

  // Local optimistic update
  const localStats = getLocalStats();
  const current = localStats[projectId] || { views: 0, claps: 0 };
  const updatedStats = {
    ...localStats,
    [projectId]: {
      ...current,
      claps: (current.claps || 0) + count,
    },
  };
  saveLocalStats(updatedStats);

  // Supabase RPC call if configured
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.rpc("increment_project_claps", {
        p_project_id: projectId,
        p_count: count,
      });
    } catch (err) {
      console.warn("Failed to increment claps via Supabase RPC:", err);
    }
  }

  return updatedStats[projectId];
}

export function subscribeToProjectStats(onUpdate) {
  const cleanups = [];

  // 1. Supabase Realtime Channel
  if (isSupabaseConfigured && supabase) {
    try {
      const channel = supabase
        .channel("public:project_stats")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "project_stats" },
          (payload) => {
            if (payload.new && payload.new.project_id) {
              onUpdate({
                projectId: payload.new.project_id,
                views: Number(payload.new.views) || 0,
                claps: Number(payload.new.claps) || 0,
              });
            }
          }
        )
        .subscribe();

      cleanups.push(() => {
        supabase.removeChannel(channel);
      });
    } catch (err) {
      console.warn("Error setting up Supabase realtime channel:", err);
    }
  }

  // 2. Cross-tab Broadcast Channel listener
  if (localBroadcast) {
    const handleBroadcast = (event) => {
      if (event.data?.type === "STATS_UPDATE" && event.data.payload) {
        Object.entries(event.data.payload).forEach(([projectId, stat]) => {
          onUpdate({
            projectId,
            views: stat.views,
            claps: stat.claps,
          });
        });
      }
    };
    localBroadcast.addEventListener("message", handleBroadcast);
    cleanups.push(() => {
      localBroadcast.removeEventListener("message", handleBroadcast);
    });
  }

  return () => {
    cleanups.forEach((fn) => fn());
  };
}

export { MAX_CLAPS_PER_USER_PER_PROJECT };
