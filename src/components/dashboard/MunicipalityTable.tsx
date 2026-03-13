import { useState, Fragment } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { formatNumber } from "@/data/welfareData";
import { Search, ArrowUpDown, ChevronUp, ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import regionalCouncils from "@/data/regionalCouncilSettlements.json";

/** Generic row shape accepted by the table */
export interface TableMunicipality {
  id: string;
  name: string;
  population: number;
  district: string;
  entityType?: string; // "רשות מקומית" | "מועצה אזורית"
}

export interface TableBenefitData {
  recipientPercent: number;
  recipients?: number;
  ratePer1000: number;
  gapPercentage: number;
  ranking?: number;
}

interface MunicipalityTableProps {
  data: Array<{ municipality: TableMunicipality; data: TableBenefitData }>;
  showSearch?: boolean;
  maxRows?: number;
  onRowClick?: (municipalityId: string) => void;
  compact?: boolean;
}

type SortField = "name" | "population" | "recipients" | "recipientPercent" | "ratePer1000" | "gapPercentage" | "ranking";
type SortDirection = "asc" | "desc";

export function MunicipalityTable({
  data,
  showSearch = true,
  maxRows,
  onRowClick,
  compact = false,
}: MunicipalityTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("recipientPercent");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [showDetails, setShowDetails] = useState(false);
  const [expandedCouncils, setExpandedCouncils] = useState<Set<string>>(new Set());

  const toggleCouncil = (name: string) => {
    setExpandedCouncils((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection(field === "ranking" || field === "name" ? "asc" : "desc");
    }
  };

  const filteredData = data.filter((item) =>
    item.municipality.name.includes(searchTerm) ||
    item.municipality.district.includes(searchTerm)
  );

  const sortedData = [...filteredData].sort((a, b) => {
    let aVal: number | string;
    let bVal: number | string;

    switch (sortField) {
      case "name":
        aVal = a.municipality.name;
        bVal = b.municipality.name;
        break;
      case "population":
        aVal = a.municipality.population;
        bVal = b.municipality.population;
        break;
      case "recipients":
        aVal = a.data.recipients ?? 0;
        bVal = b.data.recipients ?? 0;
        break;
      case "recipientPercent":
        aVal = a.data.recipientPercent;
        bVal = b.data.recipientPercent;
        break;
      case "ratePer1000":
        aVal = a.data.ratePer1000;
        bVal = b.data.ratePer1000;
        break;
      case "gapPercentage":
        aVal = a.data.gapPercentage;
        bVal = b.data.gapPercentage;
        break;
      case "ranking":
        aVal = a.data.ranking ?? 0;
        bVal = b.data.ranking ?? 0;
        break;
      default:
        return 0;
    }

    if (typeof aVal === "string") {
      return sortDirection === "asc"
        ? aVal.localeCompare(bVal as string, "he")
        : (bVal as string).localeCompare(aVal, "he");
    }

    return sortDirection === "asc" ? aVal - (bVal as number) : (bVal as number) - aVal;
  });

  const displayData = maxRows ? sortedData.slice(0, maxRows) : sortedData;

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 text-muted-foreground/50" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="h-3 w-3 text-primary" />
    ) : (
      <ChevronDown className="h-3 w-3 text-primary" />
    );
  };

  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  return (
    <div className="space-y-3">
      {showSearch && (
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="חיפוש רשות מקומית..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          <Collapsible open={showDetails} onOpenChange={setShowDetails}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <ChevronRight className={cn("h-4 w-4 transition-transform", showDetails && "rotate-90")} />
                פרטים
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>
      )}

      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="text-right">
                <Button variant="ghost" size="sm" className="h-8 p-0 hover:bg-transparent text-xs" onClick={() => handleSort("name")}>
                  שם יישוב
                  <SortIcon field="name" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" size="sm" className="h-8 p-0 hover:bg-transparent text-xs font-bold text-primary" onClick={() => handleSort("recipientPercent")}>
                  אחוז מקבלים
                  <SortIcon field="recipientPercent" />
                </Button>
              </TableHead>
              {showDetails && (
                <>
                  <TableHead className="text-right hidden md:table-cell">
                    <Button variant="ghost" size="sm" className="h-8 p-0 hover:bg-transparent text-xs" onClick={() => handleSort("population")}>
                      אוכלוסייה
                      <SortIcon field="population" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right hidden lg:table-cell">
                    <Button variant="ghost" size="sm" className="h-8 p-0 hover:bg-transparent text-xs" onClick={() => handleSort("gapPercentage")}>
                      פער מהממוצע
                      <SortIcon field="gapPercentage" />
                    </Button>
                  </TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.map((item, index) => {
              const isRC = item.municipality.entityType === "מועצה אזורית";
              const children = isRC
                ? (regionalCouncils as Record<string, string[]>)[item.municipality.name] || []
                : [];
              const isExpanded = expandedCouncils.has(item.municipality.name);
              return (
                <Fragment key={item.municipality.id}>
                <TableRow
                  className={cn(
                    "transition-colors",
                    onRowClick && "cursor-pointer hover:bg-accent",
                    index % 2 === 0 ? "bg-background" : "bg-muted/30"
                  )}
                  onClick={() => onRowClick?.(item.municipality.id)}
                >
                  <TableCell className="py-2">
                    {isRC ? (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 font-medium hover:text-primary transition-colors"
                        onClick={(e) => { e.stopPropagation(); toggleCouncil(item.municipality.name); }}
                      >
                        <ChevronLeft className={cn("h-3.5 w-3.5 transition-transform", isExpanded && "-rotate-90")} />
                        {item.municipality.name}
                      </button>
                    ) : (
                      <span className="font-medium">{item.municipality.name}</span>
                    )}
                    {isRC && (
                      <span className="mr-1.5 inline-flex items-center rounded-full bg-violet-100 dark:bg-violet-900/40 px-1.5 py-0.5 text-[10px] font-medium text-violet-700 dark:text-violet-300">
                        מ.א.
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-2">
                    <span className={cn(
                      "font-bold text-base",
                      item.data.recipientPercent > 0 ? "text-destructive" : "text-muted-foreground"
                    )}>
                      {formatPercent(item.data.recipientPercent)}
                    </span>
                  </TableCell>
                  {showDetails && (
                    <>
                      <TableCell className="py-2 hidden md:table-cell text-muted-foreground">
                        {formatNumber(item.municipality.population)}
                      </TableCell>
                      <TableCell className="py-2 hidden lg:table-cell">
                        <span className={cn(
                          "text-sm font-medium",
                          item.data.gapPercentage > 0 ? "text-destructive" : "text-primary"
                        )}>
                          {item.data.gapPercentage > 0 ? "+" : ""}{item.data.gapPercentage.toFixed(1)}%
                        </span>
                      </TableCell>
                    </>
                  )}
                </TableRow>
                {isRC && isExpanded && children.length > 0 && (
                  <>
                    <TableRow className="bg-violet-50/50 dark:bg-violet-950/20">
                      <TableCell colSpan={showDetails ? 4 : 2} className="py-2 pr-8 text-xs text-violet-600 dark:text-violet-400 font-medium">
                        📍 {children.length} יישובים במועצה • הנתונים מוצגים ברמת המועצה האזורית
                      </TableCell>
                    </TableRow>
                    {children.map((child, ci) => (
                      <TableRow key={`${item.municipality.id}-child-${ci}`} className="bg-violet-50/30 dark:bg-violet-950/10">
                        <TableCell className="py-1 pr-10">
                          <span className="text-xs text-muted-foreground">↳ {child}</span>
                        </TableCell>
                        <TableCell colSpan={showDetails ? 3 : 1} className="py-1 text-xs text-muted-foreground" />
                      </TableRow>
                    ))}
                  </>
                )}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {maxRows && sortedData.length > maxRows && (
        <p className="text-center text-sm text-muted-foreground">
          מציג {maxRows} מתוך {sortedData.length} רשויות
        </p>
      )}
    </div>
  );
}
