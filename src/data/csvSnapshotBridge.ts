/**
 * CSV → Snapshot Bridge
 * Converts flat CSV data (340 entities) into the same structures
 * that the snapshot view (welfareData.ts) expects.
 * This makes the CSV the single source of truth for BOTH views.
 */

import { FlatDataRow, loadFlatData, getRowsByBranch } from "./flatData";

// Re-export types that match welfareData interfaces
export interface CsvMunicipality {
  id: string;
  name: string;
  code: number;
  population: number;
  cluster: number | null;
  district: string;
  region: string;
  entityType: string; // "רשות מקומית" | "מועצה אזורית"
  branch: string;
}

export interface CsvBenefitData {
  municipalityId: string;
  ratePer1000: number;
  recipientPercent: number;
  gapFromAverage: number;
  gapPercentage: number;
  ranking: number;
  rate2024: number | null;
  rate2023: number | null;
  cumulativeChange: number | null;
  trend: string;
  operationalStatus: string;
}

// ─── CSV Benefit_Type → route ID mapping ────────────────────
const csvTypeToRouteId: Record<string, string> = {
  "זקנה": "old-age",
  "נכות": "disability",
  "סיעוד": "nursing",
  "הבטחת_הכנסה": "income-support",
  "אבטלה": "unemployment",
  "ילדים": "child-support",
  "ילד_נכה": "disabled-child",
  "ניידות": "mobility",
  "מזונות": "alimony",
  "נכות_מעבודה": "work-disability",
  "דמי_פגיעה": "work-injury",
};

/** Create a stable ID from municipality name */
function makeId(name: string): string {
  return name.trim().replace(/\s+/g, "-");
}

// ─── Singleton cache ────────────────────────────────────────
let _cache: {
  municipalities: CsvMunicipality[];
  benefitData: Record<string, Record<string, CsvBenefitData>>;
} | null = null;
let _promise: Promise<typeof _cache> | null = null;

export async function loadSnapshotFromCsv(): Promise<NonNullable<typeof _cache>> {
  if (_cache) return _cache;
  if (_promise) return _promise as Promise<NonNullable<typeof _cache>>;

  _promise = loadFlatData().then((rows) => {
    _cache = buildSnapshot(rows);
    return _cache;
  });

  return _promise as Promise<NonNullable<typeof _cache>>;
}

function buildSnapshot(rows: FlatDataRow[]): NonNullable<typeof _cache> {
  // Build unique municipalities from CSV
  const muniMap = new Map<string, CsvMunicipality>();
  const benefitData: Record<string, Record<string, CsvBenefitData>> = {};

  // Initialize benefit data maps
  for (const routeId of Object.values(csvTypeToRouteId)) {
    benefitData[routeId] = {};
  }

  for (const row of rows) {
    const id = makeId(row.Municipality);

    // Build municipality entry (first occurrence wins)
    if (!muniMap.has(id)) {
      muniMap.set(id, {
        id,
        name: row.Municipality,
        code: 0,
        population: row.Pop_2025 ?? 0,
        cluster: row.Cluster,
        district: row.Branch || "",
        region: row.Branch || "",
        entityType: row.Entity_Type,
        branch: row.Branch,
      });
    }

    // Map CSV benefit type to route ID
    const routeId = csvTypeToRouteId[row.Benefit_Type];
    if (!routeId) continue;

    // Use Rate_2025 as primary, fall back to Rate_2024 for regional councils
    const rate = row.Rate_2025 ?? row.Rate_2024 ?? 0;
    const ratePer1000 = rate; // CSV rates are already per-1000

    benefitData[routeId][id] = {
      municipalityId: id,
      ratePer1000,
      recipientPercent: rate / 10, // convert per-1000 to percent
      gapFromAverage: row.Gap_from_Cluster_Pct ?? 0,
      gapPercentage: row.Gap_from_Cluster_Pct ?? 0,
      ranking: 0, // will be computed below
      rate2024: row.Rate_2024,
      rate2023: row.Rate_2023,
      cumulativeChange: row.Cumulative_Change_Pct,
      trend: row.Trend,
      operationalStatus: row.Operational_Status,
    };
  }

  // Compute rankings per benefit type (by recipientPercent descending)
  for (const routeId of Object.keys(benefitData)) {
    const entries = Object.values(benefitData[routeId]);
    entries.sort((a, b) => b.recipientPercent - a.recipientPercent);
    entries.forEach((e, i) => { e.ranking = i + 1; });
  }

  const municipalities = Array.from(muniMap.values()).sort((a, b) =>
    b.population - a.population
  );

  return { municipalities, benefitData };
}

/**
 * Get snapshot data filtered by branch.
 * Returns fresh computation (not cached) when branch filter is active.
 */
export async function loadSnapshotForBranch(branch: string): Promise<NonNullable<typeof _cache>> {
  const allRows = await loadFlatData();
  const filtered = branch ? getRowsByBranch(allRows, branch) : allRows;
  return buildSnapshot(filtered);
}
