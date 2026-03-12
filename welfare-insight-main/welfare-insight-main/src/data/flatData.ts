/**
 * BTL Flat Data v3 - Analytical dataset for executive use.
 * All computed fields are pre-validated and treated as the single source of truth.
 * DO NOT recompute or transform any statistics.
 */

export interface FlatDataRow {
  Municipality: string;
  Cluster: number | null;
  Pop_2025: number | null;
  Benefit_Type: string;
  Benefit: string;
  Rate_2023: number | null;
  Rate_2024: number | null;
  Rate_2025: number | null;
  Change_23_24_Pct: number | null;
  Change_24_25_Pct: number | null;
  Cumulative_Change_Pct: number | null;
  Trend: string;
  Z_Score_Cluster: number | null;
  Small_Pop_Flag: boolean;
  Cluster_Average_Rate_2025: number | null;
  Gap_from_Cluster_Pct: number | null;
  Operational_Status: string;
}

// Parse CSV text into FlatDataRow[]
function parseCSV(csvText: string): FlatDataRow[] {
  const lines = csvText.split("\n");
  const rows: FlatDataRow[] = [];
  const startIndex = 1; // skip header

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = splitCSVLine(line);
    if (cols.length < 17) continue;

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
      Municipality: cols[0].trim().replace(/^"|"$/g, "").replace(/""/g, '"'),
      Cluster: parseNum(cols[1]),
      Pop_2025: parseNum(cols[2]),
      Benefit_Type: cols[3].trim().replace(/^"|"$/g, ""),
      Benefit: cols[4].trim().replace(/^"|"$/g, ""),
      Rate_2023: parseNum(cols[5]),
      Rate_2024: parseNum(cols[6]),
      Rate_2025: parseNum(cols[7]),
      Change_23_24_Pct: parseNum(cols[8]),
      Change_24_25_Pct: parseNum(cols[9]),
      Cumulative_Change_Pct: parseNum(cols[10]),
      Trend: cols[11].trim().replace(/^"|"$/g, "") || "N/A",
      Z_Score_Cluster: parseNum(cols[12]),
      Small_Pop_Flag: parseBool(cols[13]),
      Cluster_Average_Rate_2025: parseNum(cols[14]),
      Gap_from_Cluster_Pct: parseNum(cols[15]),
      Operational_Status: cols[16]?.trim().replace(/^"|"$/g, "") || "⚪ תואם אשכול",
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

  _fetchPromise = fetch("/btl_flat_data.csv")
    .then((r) => r.text())
    .then((text) => {
      _cachedRows = parseCSV(text);
      return _cachedRows;
    });

  return _fetchPromise;
}

// ─── Derived helpers (no recalculation) ─────────────────────────────────────

/** Returns unique benefit types found in the dataset */
export function getBenefitTypes(rows: FlatDataRow[]): string[] {
  return Array.from(new Set(rows.map((r) => r.Benefit_Type))).sort();
}

/** Filter rows by benefit type */
export function getRowsByBenefit(
  rows: FlatDataRow[],
  benefitType: string
): FlatDataRow[] {
  return rows.filter((r) => r.Benefit_Type === benefitType);
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

/** Precompute cluster average Rate_2025 from dataset (used only for tooltip display) */
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
