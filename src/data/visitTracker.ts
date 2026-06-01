/**
 * Visit Tracker - Counts page visits per month by region/branch.
 * Stores data in localStorage and sends to Google Sheet.
 */

const STORAGE_KEY = "btl-dashboard-visits";
const SHEET_URL = "https://script.google.com/macros/s/AKfycbwD8CMFoP5XoOwRLwK_OxMMOFKF8fS2CRpbJkNdOHjbnJIepkOLzlGrg3GQNGRqbwB6bA/exec";

interface VisitEntry {
  month: string; // "2026-06"
  branch: string; // selected branch or "all"
  page: string; // route path
  count: number;
  lastSent: string | null;
}

function getMonthKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function loadVisits(): VisitEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveVisits(entries: VisitEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function trackVisit(branch: string, page: string): void {
  const month = getMonthKey();
  const branchKey = branch || "all";
  const entries = loadVisits();

  const existing = entries.find(
    (e) => e.month === month && e.branch === branchKey && e.page === page
  );

  if (existing) {
    existing.count++;
  } else {
    entries.push({ month, branch: branchKey, page, count: 1, lastSent: null });
  }

  saveVisits(entries);

  // Send to sheet (fire and forget)
  sendVisitToSheet(month, branchKey, page).catch(() => {});
}

async function sendVisitToSheet(month: string, branch: string, page: string): Promise<void> {
  try {
    await fetch(SHEET_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        app: "דשבורד פערי גמלאות",
        category: "visit",
        name: branch,
        text: `${page} | ${month}`,
        severity: "visit",
      }),
    });
  } catch {
    // Silently fail
  }
}

/** Get visit summary for display */
export function getVisitSummary(): {
  currentMonth: { total: number; byBranch: Record<string, number> };
  allTime: { total: number; byBranch: Record<string, number> };
} {
  const entries = loadVisits();
  const month = getMonthKey();

  const currentMonth = { total: 0, byBranch: {} as Record<string, number> };
  const allTime = { total: 0, byBranch: {} as Record<string, number> };

  for (const e of entries) {
    allTime.total += e.count;
    allTime.byBranch[e.branch] = (allTime.byBranch[e.branch] || 0) + e.count;

    if (e.month === month) {
      currentMonth.total += e.count;
      currentMonth.byBranch[e.branch] = (currentMonth.byBranch[e.branch] || 0) + e.count;
    }
  }

  return { currentMonth, allTime };
}
