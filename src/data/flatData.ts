/**
 * BTL Flat Data v5 - Analytical dataset for executive use.
 * 340 entities (286 local authorities + 54 regional councils).
 * All computed fields are pre-validated and treated as the single source of truth.
 * DO NOT recompute or transform any statistics.
 */

export interface FlatDataRow {
  Branch: string;
  Municipality: string;
  Entity_Type: string; // "רשות מקומית" | "מועצה אזורית"
  Cluster: number | null;
  Pop_2025: number | null;
  Rate_2023: number | null;
  Rate_2024: number | null;
  Rate_2025: number | null;
  Change_23_24_Pct: number | null;
  Change_24_25_Pct: number | null;
  Cumulative_Change_Pct: number | null;
  Trend: string;
  Z_Score_Cluster: number | null;
  Small_Pop_Flag: boolean;
  Benefit_Type: string;
  Benefit: string;
  Cluster_Average_Rate_2025: number | null;
  Gap_from_Cluster_Pct: number | null;
  Operational_Status: string;
}

function cleanStr(s: string): string {
  return s.trim().replace(/^"|"$/g, "").replace(/""/g, '"');
}

// Parse CSV text into FlatDataRow[]
function parseCSV(csvText: string): FlatDataRow[] {
  const lines = csvText.split("\n");
  const rows: FlatDataRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = splitCSVLine(line);
    if (cols.length < 19) continue;

    const parseNum = (s: string): number | null => {
      const v = s.trim();
      if (!v || v === "" || v === "N/A") return null;
      const n = parseFloat(v);
      return isNaN(n) ? null : n;
    };

    const parseBool = (s: string): boolean => {
      const v = s.trim().toLowerCase();
      return v === "true" || v === "1";
    };

    rows.push({
      Branch: cleanStr(cols[0]),
      Municipality: cleanStr(cols[1]),
      Entity_Type: cleanStr(cols[2]),
      Cluster: parseNum(cols[3]),
      Pop_2025: parseNum(cols[4]),
      Rate_2023: parseNum(cols[5]),
      Rate_2024: parseNum(cols[6]),
      Rate_2025: parseNum(cols[7]),
      Change_23_24_Pct: parseNum(cols[8]),
      Change_24_25_Pct: parseNum(cols[9]),
      Cumulative_Change_Pct: parseNum(cols[10]),
      Trend: cleanStr(cols[11]) || "N/A",
      Z_Score_Cluster: parseNum(cols[12]),
      Small_Pop_Flag: parseBool(cols[13]),
      Benefit_Type: cleanStr(cols[14]),
      Benefit: cleanStr(cols[15]),
      Cluster_Average_Rate_2025: parseNum(cols[16]),
      Gap_from_Cluster_Pct: parseNum(cols[17]),
      Operational_Status: cleanStr(cols[18]) || "⚪ תואם אשכול",
    });
  }

  return rows;
}

function splitCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

// ─── Singleton cache ────────────────────────────────────────────────────────

let _cachedRows: FlatDataRow[] | null = null;
let _fetchPromise: Promise<FlatDataRow[]> | null = null;

export async function loadFlatData(): Promise<FlatDataRow[]> {
  if (_cachedRows) return _cachedRows;
  if (_fetchPromise) return _fetchPromise;

  _fetchPromise = fetch(`${import.meta.env.BASE_URL}btl_flat_data.csv`)
    .then((r) => r.text())
    .then((text) => {
      _cachedRows = parseCSV(text);
      return _cachedRows;
    });

  return _fetchPromise;
}

// ─── Derived helpers ────────────────────────────────────────────────────────

/** Returns unique benefit types found in the dataset */
export function getBenefitTypes(rows: FlatDataRow[]): string[] {
  return Array.from(new Set(rows.map((r) => r.Benefit_Type))).sort();
}

/** Returns unique branch names found in the dataset */
export function getBranches(rows: FlatDataRow[]): string[] {
  return Array.from(new Set(rows.map((r) => r.Branch).filter(Boolean))).sort(
    (a, b) => a.localeCompare(b, "he")
  );
}

/** Filter rows by benefit type */
export function getRowsByBenefit(
  rows: FlatDataRow[],
  benefitType: string
): FlatDataRow[] {
  return rows.filter((r) => r.Benefit_Type === benefitType);
}

/** Filter rows by branch */
export function getRowsByBranch(
  rows: FlatDataRow[],
  branch: string
): FlatDataRow[] {
  if (!branch) return rows;
  return rows.filter((r) => r.Branch === branch);
}

/**
 * Top N increases/decreases by Cumulative_Change_Pct.
 * No recalculation – uses field directly.
 */
export function getExtremeShifts(
  rows: FlatDataRow[],
  benefitType: string,
  n = 3
): { increases: FlatDataRow[]; decreases: FlatDataRow[] } {
  const filtered = getRowsByBenefit(rows, benefitType).filter(
    (r) => r.Cumulative_Change_Pct !== null
  );
  const sorted = [...filtered].sort(
    (a, b) => (b.Cumulative_Change_Pct ?? 0) - (a.Cumulative_Change_Pct ?? 0)
  );
  return {
    increases: sorted.slice(0, n),
    decreases: sorted.slice(-n).reverse(),
  };
}

/** Precompute cluster average Rate_2025 from dataset */
export function computeClusterAverages(
  rows: FlatDataRow[],
  benefitType: string
): Map<number, number> {
  const map = new Map<number, { sum: number; count: number }>();
  for (const r of rows) {
    if (r.Benefit_Type !== benefitType || r.Cluster === null || r.Rate_2025 === null) continue;
    const entry = map.get(r.Cluster) ?? { sum: 0, count: 0 };
    entry.sum += r.Rate_2025;
    entry.count++;
    map.set(r.Cluster, entry);
  }
  const result = new Map<number, number>();
  for (const [cluster, { sum, count }] of map) {
    result.set(cluster, sum / count);
  }
  return result;
}
