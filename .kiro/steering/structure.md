# Project Structure

```
src/
├── App.tsx                    # Root: providers + router setup
├── main.tsx                   # Entry point
├── index.css                  # Global styles, CSS variables, custom classes
│
├── pages/                     # Route-level components
│   ├── OverviewPage.tsx        # "/" — KPIs, benefit cards, top municipalities table
│   ├── BenefitAnalysisPage.tsx # "/benefit/:benefitId" — per-benefit drill-down
│   ├── ComparePage.tsx         # "/compare" — side-by-side municipality comparison
│   └── NotFound.tsx
│
├── components/
│   ├── dashboard/             # Domain-specific dashboard components
│   │   ├── DashboardLayout.tsx # Shell: sidebar, topbar, footer, mobile nav
│   │   ├── BranchFilter.tsx    # Branch selector (uses BranchFilterContext)
│   │   ├── ViewModeToggle.tsx  # Snapshot ↔ Trend toggle (uses ViewModeContext)
│   │   ├── KPICard.tsx
│   │   ├── MunicipalityTable.tsx
│   │   ├── BenefitTypeCard.tsx
│   │   ├── TrendPanel.tsx      # Trend view container (uses flatData)
│   │   ├── TrendTable.tsx
│   │   ├── TrendSparkline.tsx
│   │   ├── InsightsPanel.tsx
│   │   ├── ExtremeShiftsWidget.tsx
│   │   ├── GapBadge.tsx
│   │   └── charts/
│   │       ├── GapBarChart.tsx
│   │       ├── PopulationScatterChart.tsx
│   │       ├── RadarComparisonChart.tsx
│   │       └── RateHistogram.tsx
│   ├── FeedbackModal.tsx       # Pilot feedback collection
│   ├── NavLink.tsx
│   └── ui/                    # shadcn/ui primitives — do not modify directly
│
├── context/
│   ├── ViewModeContext.tsx     # ViewMode: "snapshot_2025" | "trend_23_25"
│   └── BranchFilterContext.tsx # selectedBranch: string (empty = all branches)
│
├── data/
│   ├── flatData.ts             # CSV parser + FlatDataRow type + helpers (trend view)
│   ├── csvSnapshotBridge.ts    # Converts CSV rows → snapshot structures (CsvMunicipality, CsvBenefitData)
│   ├── welfareData.ts          # Static metadata: benefitTypes[], nationalStats, legacy municipality list
│   └── regionalCouncilSettlements.json
│
├── hooks/
│   ├── useSnapshotData.ts      # Primary data hook — loads CSV, applies branch filter
│   └── use-mobile.tsx
│
└── lib/
    └── utils.ts                # cn() helper (clsx + tailwind-merge)

public/
└── btl_flat_data.csv           # Master dataset — 340 entities × 11 benefit types
```

## Architecture Patterns

### Data Flow
1. `public/btl_flat_data.csv` is fetched at runtime by `loadFlatData()` (singleton, cached)
2. `csvSnapshotBridge.ts` transforms rows into `CsvMunicipality[]` and `Record<benefitId, Record<muniId, CsvBenefitData>>`
3. `useSnapshotData()` hook consumes the bridge, re-runs when `selectedBranch` changes
4. Pages receive `{ municipalities, benefitData, loading }` from the hook

### View Mode Pattern
Pages check `viewMode` from `useViewMode()` and render either snapshot or trend content:
```tsx
if (viewMode === "trend_23_25") return <TrendPanel />;
// else render snapshot content
```

### Benefit ID Mapping
Route IDs (e.g. `"disability"`) map to CSV `Benefit_Type` Hebrew strings (e.g. `"נכות"`) via `benefitIdToCsvType` in `BenefitAnalysisPage.tsx` and `csvTypeToRouteId` in `csvSnapshotBridge.ts`.

### Key Conventions
- All UI text is Hebrew (RTL). Use `text-right` or `dir="rtl"` where needed.
- `dashboard-card` CSS class for card containers (not shadcn `<Card>`)
- `gradient-header` CSS class for the sidebar gradient background
- Pre-computed CSV fields are authoritative — never recalculate rates or gaps in the frontend
- `welfareData.ts` is used only for `benefitTypes` metadata (icons, names, descriptions, national stats). Entity data comes from CSV.
- Regional councils display with `(מ.א.)` suffix in UI
