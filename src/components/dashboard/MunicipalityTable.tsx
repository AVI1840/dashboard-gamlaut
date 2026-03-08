import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Municipality, BenefitData, formatNumber } from "@/data/welfareData";
import { Search, ArrowUpDown, ChevronUp, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface MunicipalityTableProps {
  data: Array<{ municipality: Municipality; data: BenefitData }>;
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
        aVal = a.data.recipients;
        bVal = b.data.recipients;
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
        aVal = a.data.ranking;
        bVal = b.data.ranking;
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

  // Format percentage - just the number with % (like Excel column F)
  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

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
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 p-0 hover:bg-transparent text-xs"
                  onClick={() => handleSort("name")}
                >
                  שם יישוב
                  <SortIcon field="name" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 p-0 hover:bg-transparent text-xs font-bold text-primary"
                  onClick={() => handleSort("recipientPercent")}
                >
                  אחוז מקבלים
                  <SortIcon field="recipientPercent" />
                </Button>
              </TableHead>
              {showDetails && (
                <>
                  <TableHead className="text-right hidden sm:table-cell">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 p-0 hover:bg-transparent text-xs"
                      onClick={() => handleSort("recipients")}
                    >
                      מקבלים
                      <SortIcon field="recipients" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right hidden md:table-cell">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 p-0 hover:bg-transparent text-xs"
                      onClick={() => handleSort("population")}
                    >
                      אוכלוסייה
                      <SortIcon field="population" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right hidden lg:table-cell">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 p-0 hover:bg-transparent text-xs"
                      onClick={() => handleSort("gapPercentage")}
                    >
                      פער מהממוצע
                      <SortIcon field="gapPercentage" />
                    </Button>
                  </TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.map((item, index) => (
              <TableRow
                key={item.municipality.id}
                className={cn(
                  "transition-colors",
                  onRowClick && "cursor-pointer hover:bg-accent",
                  index % 2 === 0 ? "bg-background" : "bg-muted/30"
                )}
                onClick={() => onRowClick?.(item.municipality.id)}
              >
                <TableCell className="py-2">
                  <span className="font-medium">{item.municipality.name}</span>
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
                    <TableCell className="py-2 hidden sm:table-cell text-muted-foreground">
                      {formatNumber(item.data.recipients)}
                    </TableCell>
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
            ))}
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
