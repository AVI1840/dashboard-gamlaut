import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "react-router-dom";

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
}

const STORAGE_KEY = "btl-feedback-dashboard-welfare";

// PASTE YOUR GOOGLE APPS SCRIPT URL HERE (see docs/SETUP_FEEDBACK_SHEET.md)
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxT0P5RtHmEhT-wzxN4H_CzxqpFsnqjPUs9uiV9V7caxr4rE7qGouDfK6yI5tLjNY1PTw/exec";

type Category = "באג" | "שיפור" | "נתונים" | "עיצוב";
type Severity = "קריטי" | "שיפור" | "קטן";

interface FeedbackEntry {
  id: number;
  category: Category | "";
  severity: Severity | "";
  text: string;
  timestamp: string;
  synced?: boolean;
}

const catLabels: Record<Category, string> = {
  "באג": "\uD83D\uDC1B באג",
  "שיפור": "\uD83D\uDCA1 שיפור",
  "נתונים": "\uD83D\uDCCA נתונים",
  "עיצוב": "\uD83C\uDFA8 עיצוב",
};

async function sendToSheet(entry: FeedbackEntry, page: string): Promise<boolean> {
  if (!GOOGLE_SHEET_URL) return false;
  try {
    await fetch(GOOGLE_SHEET_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        app: "דשבורד גמלאות ברשויות",
        category: entry.category ? catLabels[entry.category] : "כללי",
        severity: entry.severity || "—",
        text: entry.text,
        page: page,
      }),
    });
    return true;
  } catch {
    return false;
  }
}

export function FeedbackModal({ open, onClose }: FeedbackModalProps) {
  const location = useLocation();
  const [category, setCategory] = useState<Category | "">("");
  const [severity, setSeverity] = useState<Severity | "">("");
  const [text, setText] = useState("");
  const [items, setItems] = useState<FeedbackEntry[]>([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setItems(JSON.parse(saved));
  }, [open]);

  const save = (updated: FeedbackEntry[]) => {
    setItems(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;
    const entry: FeedbackEntry = {
      id: Date.now(),
      category,
      severity,
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };
    setSending(true);
    const ok = await sendToSheet(entry, location.pathname);
    entry.synced = ok;
    save([entry, ...items]);
    setSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 2500);
    setCategory("");
    setSeverity("");
    setText("");
  };

  const handleExport = () => {
    if (!items.length) return;
    const lines = items.map((fb) => {
      const ts = new Date(fb.timestamp).toLocaleString("he-IL");
      const cat = fb.category ? catLabels[fb.category] : "—";
      return "[" + ts + "] [" + cat + "] [" + (fb.severity || "—") + "] " + fb.text;
    });
    navigator.clipboard.writeText(lines.join("\n\n"));
  };

  const handleDownload = () => {
    if (!items.length) return;
    const jsonContent = JSON.stringify(items, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "feedback_pilot_" + new Date().toISOString().slice(0, 10) + ".json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => { save([]); };

  const sevColor = (s: Severity | "") =>
    s === "קריטי" ? "border-red-500 bg-red-50 text-red-700" :
    s === "שיפור" ? "border-orange-400 bg-orange-50 text-orange-700" :
    s === "קטן" ? "border-green-500 bg-green-50 text-green-700" : "";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right text-lg">{"\uD83D\uDCAC"} משוב פיילוט</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-1">
          <div>
            <p className="text-sm font-medium mb-2 text-right">קטגוריה</p>
            <div className="flex gap-2 flex-wrap justify-end">
              {(["באג", "שיפור", "נתונים", "עיצוב"] as Category[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(category === c ? "" : c)}
                  className={"px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors " + (
                    category === c
                      ? "border-[#1B3A5C] bg-[#1B3A5C] text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:border-[#1B3A5C]"
                  )}
                >
                  {catLabels[c]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2 text-right">חומרה</p>
            <div className="flex gap-2 flex-wrap justify-end">
              {(["קריטי", "שיפור", "קטן"] as Severity[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSeverity(severity === s ? "" : s)}
                  className={"px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors " + (
                    severity === s
                      ? sevColor(s) + " border-2"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2 text-right">תיאור</p>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="תאר את המשוב..."
              className="min-h-[80px] text-right"
              dir="rtl"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!text.trim() || sending}
            className="w-full text-white"
            style={{ backgroundColor: "#1B3A5C" }}
          >
            {sending ? "שולח..." : sent ? "\u2713 נשלח בהצלחה" : "שלח משוב"}
          </Button>

          {!GOOGLE_SHEET_URL && (
            <p className="text-xs text-center text-amber-600">
              {"\u26A0"} המשוב נשמר מקומית בלבד. לריכוז אוטומטי ב-Google Sheet ראה הוראות ב-docs/SETUP_FEEDBACK_SHEET.md
            </p>
          )}

          {items.length > 0 && (
            <div className="border-t pt-3 space-y-2">
              <div className="flex items-center justify-between">
                <button onClick={handleClear} className="text-xs text-red-500 hover:underline">
                  מחק הכל
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{items.length} משובים</span>
                  <button
                    onClick={handleExport}
                    className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-50"
                  >
                    {"\uD83D\uDCCB"} העתק ללוח
                  </button>
                  <button
                    onClick={handleDownload}
                    className="text-xs px-2 py-1 rounded border border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-medium"
                  >
                    {"\uD83D\uDCBE"} שמור קובץ
                  </button>
                </div>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {items.map((fb) => (
                  <div key={fb.id} className="bg-gray-50 rounded-lg p-3 text-right border border-gray-200">
                    <div className="flex items-center gap-2 mb-1 flex-wrap justify-end">
                      {fb.category && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#1B3A5C]/10 text-[#1B3A5C] font-medium">
                          {catLabels[fb.category]}
                        </span>
                      )}
                      {fb.severity && (
                        <span className={"text-xs px-2 py-0.5 rounded-full border font-medium " + sevColor(fb.severity as Severity)}>
                          {fb.severity}
                        </span>
                      )}
                      {fb.synced && (
                        <span className="text-xs text-green-600">{"\u2713"} סונכרן</span>
                      )}
                      <span className="text-xs text-gray-400">
                        {new Date(fb.timestamp).toLocaleString("he-IL")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800">{fb.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}