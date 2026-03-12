import { useEffect, useState, useMemo } from "react";
import {
  loadFlatData,
  FlatDataRow,
  getBenefitTypes,
  getRowsByBenefit,
  getRowsByBranch,
  getExtremeShifts,
} from "@/data/flatData";
import { TrendTable } from "@/components/dashboard/TrendTable";
import { ExtremeShiftsWidget } from "@/components/dashboard/ExtremeShiftsWidget";
import { InsightsPanel } from "@/components/dashboard/InsightsPanel";
import { useBranchFilter } from "@/context/BranchFilterContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TrendPanelProps {
  initialBenefitType?: string;
}

export function TrendPanel({ initialBenefitType }: TrendPanelProps = {}) {
  const [allRows, setAllRows] = useState<FlatDataRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBenefit, setSelectedBenefit] = useState<string>("");
  const { selectedBranch } = useBranchFilter();

  useEffect(() => {
    loadFlatData()
      .then((data) => {
        setAllRows(data);
        const types = getBenefitTypes(data);
        if (initialBenefitType && types.includes(initialBenefitType)) {
          setSelectedBenefit(initialBenefitType);
        } else if (types.length > 0) {
          setSelectedBenefit(types[0]);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("שגיאה בטעינת הנתונים");
        setLoading(false);
      });
  }, [initialBenefitType]);

  // Apply branch filter first
  const rows = useMemo(
    () => getRowsByBranch(allRows, selectedBranch),
    [allRows, selectedBranch]
  );

  const benefitTypes = useMemo(() => getBenefitTypes(rows), [rows]);
  const filteredRows = useMemo(
    () => (selectedBenefit ? getRowsByBenefit(rows, selectedBenefit) : rows),
    [rows, selectedBenefit]
  );

  const { increases, decreases } = useMemo(
    () =>
      selectedBenefit
        ? getExtremeShifts(rows, selectedBenefit, 3)
        : { increases: [], decreases: [] },
    [rows, selectedBenefit]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <span className="animate-pulse">טוען נתוני מגמות...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16 text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Benefit type selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <label className="text-sm font-medium whitespace-nowrap">סוג גמלה:</label>
        <Select value={selectedBenefit} onValueChange={setSelectedBenefit}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="בחר גמלה..." />
          </SelectTrigger>
          <SelectContent>
            {benefitTypes.map((bt) => (
              <SelectItem key={bt} value={bt}>
                {bt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {filteredRows.length} רשויות
          {selectedBranch && ` | סניף: ${selectedBranch}`}
        </span>
      </div>

      {/* Extreme Shifts Widget */}
      <div>
        <h2 className="text-base font-semibold mb-3">שינויים חריגים</h2>
        <ExtremeShiftsWidget increases={increases} decreases={decreases} />
      </div>

      {/* Insights Panel */}
      <InsightsPanel rows={filteredRows} />

      {/* Trend Table */}
      <div>
        <h2 className="text-base font-semibold mb-3">טבלת מגמות דצמבר 2023–2025</h2>
        <TrendTable rows={filteredRows} />
      </div>
    </div>
  );
}
