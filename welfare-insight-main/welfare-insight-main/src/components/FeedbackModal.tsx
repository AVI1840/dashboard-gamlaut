import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const STORAGE_KEY = "btl-feedback-welfare-insight";
const PROJECT_NAME = "דשבורד פערי גמלאות ברשויות";

type Category = "bug" | "improvement" | "data" | "design";
type Severity = "critical" | "improvement" | "minor";

interface FeedbackEntry {
  id: string;
  category: Category;
  severity: Severity;
  comment: string;
  timestamp: number;
}

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "bug", label: "באג" },
  { value: "improvement", label: "שיפור" },
  { value: "data", label: "נתונים" },
  { value: "design", label: "עיצוב" },
];

const SEVERITIES: { value: Severity; label: string; cls: string }[] = [
  { value: "critical", label: "קריטי", cls: "bg-red-500 text-white border-transparent" },
  { value: "improvement", label: "שיפור", cls: "bg-orange-400 text-white border-transparent" },
  { value: "minor", label: "קטן", cls: "bg-green-500 text-white border-transparent" },
];

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
}

export function FeedbackModal({ open, onClose }: FeedbackModalProps) {
  const [view, setView] = useState<"form" | "list">("form");
  const [category, setCategory] = useState<Category | null>(null);
  const [severity, setSeverity] = useState<Severity | null>(null);
  const [comment, setComment] = useState("");
  const [entries, setEntries] = useState<FeedbackEntry[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        setEntries(raw ? JSON.parse(raw) : []);
      } catch {
        setEntries([]);
      }
    }
  }, [open]);

  const handleSubmit = () => {
    if (!category || !severity) return;
    const entry: FeedbackEntry = {
      id: Date.now().toString(),
      category,
      severity,
      comment,
      timestamp: Date.now(),
    };
    const updated = [entry, ...entries];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setEntries(updated);
    setCategory(null);
    setSeverity(null);
    setComment("");
    setView("list");
  };

  const handleDeleteAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    setEntries([]);
  };

  const handleCopyAll = () => {
    const sep = "=".repeat(50);
    const header = `משובי פיילוט — ${PROJECT_NAME}\n${sep}\n`;
    const body = entries
      .map((e) => {
        const cat = CATEGORIES.find((c) => c.value === e.category)?.label ?? e.category;
        const sev = SEVERITIES.find((s) => s.value === e.severity)?.label ?? e.severity;
        const date = new Date(e.timestamp).toLocaleString("he-IL");
        return `[${date}] [${cat}] [${sev}]${e.comment ? " " + e.comment : ""}`;
      })
      .join("\n\n");
    navigator.clipboard.writeText(header + "\n" + body).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleClose = () => {
    setView("form");
    setCategory(null);
    setSeverity(null);
    setComment("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg" dir="rtl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-right text-lg">💬 משוב פיילוט</DialogTitle>
            <div className="flex gap-1.5">
              {(["form", "list"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${
                    view === v ? "text-white" : "text-muted-foreground hover:bg-muted"
                  }`}
                  style={view === v ? { backgroundColor: "#1B3A5C" } : {}}
                >
                  {v === "form" ? "טופס" : `היסטוריה (${entries.length})`}
                </button>
              ))}
            </div>
          </div>
        </DialogHeader>

        {view === "form" ? (
          <div className="space-y-4 py-1">
            <div>
              <p className="text-sm font-medium mb-2 text-right">
                קטגוריה <span className="text-destructive">*</span>
              </p>
              <div className="flex gap-2 flex-wrap justify-end">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setCategory(c.value)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                      category === c.value
                        ? "text-white border-transparent"
                        : "border-border hover:border-primary hover:text-primary"
                    }`}
                    style={category === c.value ? { backgroundColor: "#1B3A5C" } : {}}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2 text-right">
                חומרה <span className="text-destructive">*</span>
              </p>
              <div className="flex gap-2 flex-wrap justify-end">
                {SEVERITIES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setSeverity(s.value)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                      severity === s.value
                        ? s.cls + " scale-105 shadow-md"
                        : "border-border hover:border-gray-400"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2 text-right">תיאור (אופציונלי)</p>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="תאר את הבעיה / השיפור..."
                className="min-h-[80px] text-right"
                dir="rtl"
              />
            </div>

            <div className="flex gap-2 justify-start pt-1">
              <Button
                onClick={handleSubmit}
                disabled={!category || !severity}
                style={{ backgroundColor: "#1B3A5C" }}
                className="text-white hover:opacity-90"
              >
                שמור משוב
              </Button>
              <Button variant="outline" onClick={handleClose}>
                ביטול
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 py-1">
            {entries.length === 0 ? (
              <p className="text-center text-muted-foreground py-8 text-sm">אין משובים עדיין</p>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDeleteAll}
                    className="text-destructive hover:text-destructive text-xs"
                  >
                    🗑 מחק הכל
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCopyAll} className="text-xs">
                    {copied ? "✓ הועתק" : "📋 ייצא ללוח"}
                  </Button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {entries.map((e) => {
                    const cat = CATEGORIES.find((c) => c.value === e.category)?.label;
                    const sev = SEVERITIES.find((s) => s.value === e.severity);
                    const date = new Date(e.timestamp).toLocaleString("he-IL", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    return (
                      <div key={e.id} className="border border-border rounded-lg p-3 text-sm space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{date}</span>
                          <div className="flex gap-1.5">
                            <span className="px-2 py-0.5 bg-muted rounded-full text-xs">{cat}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${sev?.cls}`}>{sev?.label}</span>
                          </div>
                        </div>
                        {e.comment && (
                          <p className="text-right text-muted-foreground leading-relaxed">{e.comment}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            <Button
              className="w-full text-white"
              style={{ backgroundColor: "#1B3A5C" }}
              onClick={() => setView("form")}
            >
              + הוסף משוב חדש
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
