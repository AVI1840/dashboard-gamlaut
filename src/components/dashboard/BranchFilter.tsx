import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBranchFilter } from "@/context/BranchFilterContext";
import { loadFlatData, getBranches } from "@/data/flatData";

export function BranchFilter() {
  const { selectedBranch, setSelectedBranch } = useBranchFilter();
  const [branches, setBranches] = useState<string[]>([]);

  useEffect(() => {
    loadFlatData().then((rows) => setBranches(getBranches(rows)));
  }, []);

  if (branches.length === 0) return null;

  return (
    <div className="flex items-center gap-2 bg-primary/5 rounded-lg px-3 py-1.5 border border-primary/20">
      <label className="text-sm font-semibold whitespace-nowrap hidden sm:inline text-primary">
        סניף:
      </label>
      <Select
        value={selectedBranch || "__all__"}
        onValueChange={(v) => setSelectedBranch(v === "__all__" ? "" : v)}
      >
        <SelectTrigger className="w-40 h-9 text-sm border-primary/30 font-medium">
          <SelectValue placeholder="כל הסניפים" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">כל הסניפים</SelectItem>
          {branches.map((b) => (
            <SelectItem key={b} value={b}>
              {b}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
