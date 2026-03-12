/**
 * Hook that provides snapshot data from CSV (340 entities).
 * Replaces direct imports from welfareData.ts for entity/benefit data.
 * welfareData.ts is still used for benefitTypes metadata (icons, descriptions).
 */

import { useState, useEffect, useMemo } from "react";
import {
  CsvMunicipality,
  CsvBenefitData,
  loadSnapshotFromCsv,
  loadSnapshotForBranch,
} from "@/data/csvSnapshotBridge";
import { useBranchFilter } from "@/context/BranchFilterContext";
import { benefitTypes, BenefitType } from "@/data/welfareData";

interface SnapshotData {
  municipalities: CsvMunicipality[];
  benefitData: Record<string, Record<string, CsvBenefitData>>;
  loading: boolean;
}

export function useSnapshotData(): SnapshotData {
  const { selectedBranch } = useBranchFilter();
  const [data, setData] = useState<{
    municipalities: CsvMunicipality[];
    benefitData: Record<string, Record<string, CsvBenefitData>>;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const loader = selectedBranch
      ? loadSnapshotForBranch(selectedBranch)
      : loadSnapshotFromCsv();

    loader.then((result) => {
      setData(result);
      setLoading(false);
    });
  }, [selectedBranch]);

  return {
    municipalities: data?.municipalities ?? [],
    benefitData: data?.benefitData ?? {},
    loading,
  };
}

/** Get top municipalities by gap for a benefit type */
export function getTopByGap(
  benefitData: Record<string, Record<string, CsvBenefitData>>,
  municipalities: CsvMunicipality[],
  benefitId: string,
  count = 10
): Array<{ municipality: CsvMunicipality; data: CsvBenefitData }> {
  const data = benefitData[benefitId];
  if (!data) return [];

  const muniMap = new Map(municipalities.map((m) => [m.id, m]));

  return Object.entries(data)
    .map(([id, d]) => {
      const municipality = muniMap.get(id);
      if (!municipality) return null;
      return { municipality, data: d };
    })
    .filter(Boolean)
    .filter((item) => item!.data.ratePer1000 > 0)
    .sort((a, b) => b!.data.gapPercentage - a!.data.gapPercentage)
    .slice(0, count) as Array<{ municipality: CsvMunicipality; data: CsvBenefitData }>;
}

/** Get all municipalities with data for a benefit type */
export function getAllWithData(
  benefitData: Record<string, Record<string, CsvBenefitData>>,
  municipalities: CsvMunicipality[],
  benefitId: string
): Array<{ municipality: CsvMunicipality; data: CsvBenefitData }> {
  const data = benefitData[benefitId];
  if (!data) return [];

  const muniMap = new Map(municipalities.map((m) => [m.id, m]));

  return Object.entries(data)
    .map(([id, d]) => {
      const municipality = muniMap.get(id);
      if (!municipality) return null;
      return { municipality, data: d };
    })
    .filter(Boolean)
    .filter((item) => item!.data.ratePer1000 > 0) as Array<{
    municipality: CsvMunicipality;
    data: CsvBenefitData;
  }>;
}

/** Get municipality profile across all benefit types */
export function getMuniProfile(
  benefitDataMap: Record<string, Record<string, CsvBenefitData>>,
  municipalityId: string
): Array<{ benefit: BenefitType; data: CsvBenefitData }> {
  return benefitTypes
    .map((benefit) => {
      const data = benefitDataMap[benefit.id]?.[municipalityId];
      if (!data) return null;
      return { benefit, data };
    })
    .filter(Boolean) as Array<{ benefit: BenefitType; data: CsvBenefitData }>;
}
