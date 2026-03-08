import { useViewMode } from "@/context/ViewModeContext";
import { cn } from "@/lib/utils";

export function ViewModeToggle() {
  const { viewMode, setViewMode } = useViewMode();

  return (
    <div
      role="group"
      aria-label="בחירת מצב תצוגה"
      className="inline-flex items-center rounded-lg border border-border bg-muted p-1 gap-1"
    >
      <button
        type="button"
        onClick={() => setViewMode("snapshot_2025")}
        className={cn(
          "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
          viewMode === "snapshot_2025"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        תמונת מצב 2025
      </button>
      <button
        type="button"
        onClick={() => setViewMode("trend_23_25")}
        className={cn(
          "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
          viewMode === "trend_23_25"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        מגמות 23-25
      </button>
    </div>
  );
}
