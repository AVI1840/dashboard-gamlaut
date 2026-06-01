import { useMemo, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip as MapTooltip, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useSnapshotData } from "@/hooks/useSnapshotData";
import { useBranchFilter } from "@/context/BranchFilterContext";
import { benefitTypes, formatNumber } from "@/data/welfareData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Approximate coordinates for Israeli municipalities
const MUNICIPALITY_COORDS: Record<string, [number, number]> = {
  "ירושלים": [31.7683, 35.2137],
  "תל אביב -יפו": [32.0853, 34.7818],
  "חיפה": [32.7940, 34.9896],
  "ראשון לציון": [31.9730, 34.7925],
  "פתח תקווה": [32.0841, 34.8878],
  "אשדוד": [31.8040, 34.6553],
  "נתניה": [32.3215, 34.8532],
  "בני ברק": [32.0834, 34.8331],
  "באר שבע": [31.2518, 34.7913],
  "חולון": [32.0117, 34.7748],
  "בת ים": [32.0171, 34.7515],
  "רמת גן": [32.0680, 34.8241],
  "אשקלון": [31.6688, 34.5743],
  "רחובות": [31.8928, 34.8113],
  "הרצלייה": [32.1629, 34.7915],
  "חדרה": [32.4340, 34.9196],
  "כפר סבא": [32.1751, 34.9077],
  "מודיעין-מכבים-רעות": [31.8969, 35.0104],
  "לוד": [31.9514, 34.8883],
  "רעננה": [32.1836, 34.8706],
  "רמלה": [31.9275, 34.8625],
  "נצרת": [32.6996, 35.3035],
  "רהט": [31.3925, 34.7539],
  "ביתר עילית": [31.6969, 35.1186],
  "מודיעין עילית": [31.9333, 35.0444],
  "אלעד": [32.0525, 34.9511],
  "כרמיאל": [32.9136, 35.3014],
  "נוף הגליל": [32.7061, 35.3289],
  "טייבה": [32.2667, 34.9833],
  "עפולה": [32.6078, 35.2889],
  "אילת": [29.5577, 34.9519],
  "גבעתיים": [32.0717, 34.8117],
  "יבנה": [31.8786, 34.7386],
  "נתיבות": [31.4217, 34.5878],
  "עכו": [32.9278, 35.0764],
  "טבריה": [32.7922, 35.5312],
  "קריית מוצקין": [32.8372, 35.0750],
  "קריית אתא": [32.8028, 35.1064],
  "אום אל-פחם": [32.5167, 35.1500],
  "קריית גת": [31.6100, 34.7642],
  "אור יהודה": [32.0286, 34.8553],
  "צפת": [32.9646, 35.4964],
  "דימונה": [31.0697, 35.0331],
  "אופקים": [31.3167, 34.6167],
  "שדרות": [31.5250, 34.5964],
  "טמרה": [32.8536, 35.1978],
  "סח'נין": [32.8625, 35.2917],
  "באקה אל-גרביה": [32.4167, 35.0333],
  "ערד": [31.2589, 35.2128],
  "טירת כרמל": [32.7600, 34.9700],
  "גבעת שמואל": [32.0756, 34.8478],
  "מגדל העמק": [32.6750, 35.2417],
  "שפרעם": [32.8050, 35.1700],
  "קריית ים": [32.8439, 35.0667],
  "קריית אונו": [32.0633, 34.8553],
  "מעלות-תרשיחא": [33.0167, 35.2750],
  "נהרייה": [33.0050, 35.0950],
  "קריית ביאליק": [32.8333, 35.0833],
  "נשר": [32.7700, 35.0400],
  "אור עקיבא": [32.5050, 34.9200],
  "קריית מלאכי": [31.7300, 34.7400],
  "בית שמש": [31.7514, 34.9886],
  "מעלה אדומים": [31.7778, 35.3000],
  "אריאל": [32.1056, 35.1736],
  "גבעת זאב": [31.8611, 35.1750],
  "מבשרת ציון": [31.8000, 35.1500],
  "ירוחם": [30.9875, 34.9292],
  "חצור הגלילית": [32.9833, 35.5333],
  "קריית שמונה": [33.2075, 35.5714],
  "בית שאן": [32.5000, 35.5000],
  "מגאר": [32.8833, 35.4000],
  "כפר כנא": [32.7500, 35.3333],
  "קלנסווה": [32.2833, 34.9833],
  "ערערה-בנגב": [31.2833, 34.8167],
  "רכסים": [32.7500, 35.0833],
  "פרדס חנה-כרכור": [32.4700, 34.9700],
  "יקנעם עילית": [32.6583, 35.1083],
  "כפר קאסם": [32.1167, 34.9667],
  "ג'לג'וליה": [32.1500, 34.9500],
  "כפר יונה": [32.3167, 34.9333],
  "קדימה-צורן": [32.2833, 34.9167],
  "מצפה רמון": [30.6100, 34.8017],
  "קצרין": [32.9917, 35.6917],
  "ראש העין": [32.0958, 34.9564],
  "הוד השרון": [32.1500, 34.8833],
  "רמת השרון": [32.1500, 34.8333],
  "אבו גוש": [31.8000, 35.1167],
  "שלומי": [33.0750, 35.1417],
  "מגדל": [32.8167, 35.5167],
  "כפר תבור": [32.6833, 35.4167],
  "יסוד המעלה": [33.0500, 35.5667],
  "קריית ארבע": [31.5250, 35.1167],
  "אפרת": [31.6667, 35.1500],
  "בוקעאתא": [33.2333, 35.7667],
  "מג'דל שמס": [33.2667, 35.7667],
  "מטולה": [33.2778, 35.5750],
  "מסעדה": [33.2333, 35.7500],
  "לקיה": [31.3333, 34.8167],
  "חורה": [31.2917, 34.7833],
  "כסיפה": [31.2333, 34.9833],
  "תל שבע": [31.2500, 34.7667],
  "שגב-שלום": [31.2500, 34.8500],
  "ג'סר א-זרקא": [32.5333, 34.9000],
  "דאלית אל-כרמל": [32.6917, 35.0417],
  "עספיא": [32.7167, 35.0500],
  "בסמת טבעון": [32.7167, 35.1333],
  "ירכא": [32.9500, 35.1833],
  "כפר יאסיף": [32.9583, 35.1667],
  "אבו סנאן": [32.9500, 35.1667],
  "ג'ולס": [32.9333, 35.1667],
  "פקיעין (בוקייעה)": [32.9833, 35.3333],
  "ג'דיידה-מכר": [32.9333, 35.1500],
  "עיילבון": [32.8333, 35.4000],
  "דייר אל-אסד": [32.9333, 35.2667],
  "מג'ד אל-כרום": [32.9167, 35.2500],
  "נחף": [32.9500, 35.3167],
  "בענה": [32.9333, 35.2833],
  "סלמה": [32.9000, 35.2500],
  "ראמה": [32.9333, 35.3667],
  "סאג'ור": [32.9500, 35.3500],
  "בית ג'ן": [32.9500, 35.3833],
  "חורפיש": [33.0167, 35.3500],
  "כסרא-סמיע": [33.0333, 35.3333],
  "מעיליא": [33.0333, 35.2500],
  "פסוטה": [33.0500, 35.2500],
  "יאנוח-ג'ת": [33.0000, 35.3167],
  "שייח' דנון": [33.0000, 35.1167],
  "מזרעה": [33.0000, 35.1000],
  "אכסאל": [32.6833, 35.3167],
  "דבורייה": [32.6833, 35.3667],
  "זרזיר": [32.7167, 35.2500],
  "יפיע": [32.6833, 35.2833],
  "עילוט": [32.7167, 35.2833],
  "עין מאהל": [32.7333, 35.3167],
  "כפר מנדא": [32.8000, 35.2667],
  "טורעאן": [32.7833, 35.3333],
  "משהד": [32.7333, 35.3000],
  "ריינה": [32.7167, 35.3000],
  "רומת הייב": [32.7333, 35.2500],
  "עוזייר": [32.7500, 35.3500],
  "כעביה-טבאש-חג'אג'רה": [32.7167, 35.1833],
  "ביר אל-מכסור": [32.7667, 35.2167],
  "אעבלין": [32.8333, 35.1833],
  "הושעיה": [32.7333, 35.2833],
  "דייר חנא": [32.8667, 35.3667],
  "כאבול": [32.8667, 35.2167],
  "כאוכב אבו אל-היג'א": [32.8500, 35.2500],
  "שעב": [32.8500, 35.2333],
  "בועיינה-נוג'ידאת": [32.7500, 35.3500],
  "גבעת אבני": [32.7500, 35.4500],
  "יבנאל": [32.7167, 35.5000],
  "טובא-זנגרייה": [32.9500, 35.5167],
  "ע'ג'ר": [33.2500, 35.7833],
  "עין קנייא": [33.2500, 35.7667],
  "ג'ש (גוש חלב)": [33.0333, 35.4500],
  "ראש פינה": [32.9667, 35.5333],
  "נס ציונה": [31.9292, 34.7953],
  "גדרה": [31.8125, 34.7792],
  "גן יבנה": [31.7833, 34.7083],
  "באר יעקב": [31.9417, 34.8333],
  "שוהם": [31.9917, 34.9417],
  "אזור": [32.0250, 34.7917],
  "סביון": [32.0500, 34.8500],
  "גני תקווה": [32.0583, 34.8750],
  "יהוד-מונוסון": [32.0333, 34.8833],
  "כפר שמריהו": [32.1833, 34.8000],
  "כוכב יאיר": [32.2167, 34.9667],
  "צור יצחק": [32.2333, 34.9500],
  "אלפי מנשה": [32.1667, 35.0667],
  "קדומים": [32.2833, 35.1500],
  "קרני שומרון": [32.1833, 35.1000],
  "צופים": [32.1500, 35.0833],
  "עמנואל": [32.1500, 35.1500],
  "אלון מורה": [32.2167, 35.3167],
  "ברכה": [32.1833, 35.2833],
  "יצהר": [32.1500, 35.2500],
  "יקיר": [32.1167, 35.1333],
  "רבבה": [32.1333, 35.1500],
  "ברוכין": [32.1000, 35.1167],
  "ברקן": [32.1000, 35.1000],
  "עלי זהב": [32.1000, 35.0500],
  "פדואל": [32.0833, 35.0667],
  "מתן": [32.1500, 34.9833],
  "אורנית": [32.1333, 35.0333],
  "אלקנה": [32.1167, 35.0500],
  "שער שומרון": [32.2000, 35.0833],
  "כפר ברא": [32.1000, 34.9667],
  "בית אריה-עופרים": [32.0333, 35.0833],
  "גני מודיעין": [31.9500, 35.0333],
  "חשמונאים": [31.9333, 35.0167],
  "טלמון": [31.9500, 35.1000],
  "כפר האורנים": [31.9167, 35.0167],
  "לפיד": [31.8833, 35.0000],
  "מבוא חורון": [31.8667, 35.0500],
  "מתתיהו": [31.9500, 35.0833],
  "ניל\"י": [31.9333, 35.0500],
  "נעלה": [31.9500, 35.0667],
  "אחיעזר": [31.9333, 34.8833],
  "בית דגן": [31.9833, 34.8333],
  "בית חשמונאי": [31.9000, 34.9000],
  "ברקת": [31.9667, 34.9167],
  "גזר": [31.8833, 34.9333],
  "כפר חב\"ד": [31.9833, 34.8500],
  "נוף איילון": [31.8833, 34.9667],
  "נחל שורק": [31.7500, 34.8500],
  "קריית עקרון": [31.8667, 34.8167],
  "מזכרת בתיה": [31.8500, 34.8333],
  "מרכז שפירא": [31.7000, 34.7167],
  "יד בנימין": [31.7833, 34.7667],
  "באר טוביה": [31.7167, 34.7333],
  "אבן שמואל": [31.5500, 34.7333],
  "לכיש": [31.5833, 34.8333],
  "שפיר": [31.7333, 34.7500],
  "גבעת ברנר": [31.8667, 34.7833],
  "בני עי\"ש": [31.7833, 34.7500],
  "חריש": [32.4583, 35.0417],
  "אליכין": [32.4000, 34.9333],
  "בנימינה-גבעת עדה": [32.5167, 34.9500],
  "בסמ\"ה": [32.4500, 35.0667],
  "ג'ת": [32.4333, 35.0833],
  "זכרון יעקב": [32.5667, 34.9500],
  "זמר": [32.3833, 35.0167],
  "כפר קרע": [32.5000, 35.0833],
  "מייסר": [32.4667, 35.0500],
  "מעגן מיכאל": [32.5667, 34.9167],
  "מעלה עירון": [32.4833, 35.0833],
  "עראבה": [32.8500, 35.3333],
  "ערערה": [32.5000, 35.0667],
  "עתלית": [32.6833, 34.9333],
  "פוריידיס": [32.6000, 34.9500],
  "קיסריה": [32.5000, 34.8833],
  "קציר": [32.4833, 35.0833],
  "נופית": [32.7333, 35.0167],
  "קריית טבעון": [32.7333, 35.1167],
  "רמת ישי": [32.7000, 35.1667],
  "שמשית": [32.6833, 35.1833],
  "גן נר": [32.5833, 35.3667],
  "כפר כמא": [32.7167, 35.4500],
  "כפר מצר": [32.7000, 35.2000],
  "מוקייבלה": [32.5833, 35.2333],
  "נאעורה": [32.6167, 35.2500],
  "ניין": [32.6333, 35.3333],
  "סולם": [32.6167, 35.3167],
  "שבלי - אום אל-גנם": [32.7000, 35.2333],
  "אחוזת ברק": [32.5833, 35.2833],
  "בית אל": [31.9500, 35.2333],
  "גבע בנימין": [31.9167, 35.2500],
  "הר אדר": [31.8167, 35.1333],
  "כוכב השחר": [31.9833, 35.3167],
  "כוכב יעקב": [31.8500, 35.2333],
  "כפר אדומים": [31.8000, 35.3333],
  "מעלה מכמש": [31.8833, 35.2833],
  "מצפה יריחו": [31.8333, 35.4167],
  "נווה דניאל": [31.6833, 35.1333],
  "נוקדים": [31.6500, 35.1667],
  "עין נקובא": [31.7833, 35.1333],
  "עלי": [32.0667, 35.2667],
  "עפרה": [31.9667, 35.2667],
  "פסגות": [31.9333, 35.2500],
  "צור הדסה": [31.7167, 35.1167],
  "קריית יערים": [31.8000, 35.1000],
  "שילה": [32.0500, 35.2833],
  "תל ציון": [31.8667, 35.2333],
  "מעלה אפרים": [32.0833, 35.3667],
  "טירה": [32.2333, 34.9500],
  "תקוע": [31.6333, 35.2167],
  "אבן יהודה": [32.2833, 34.8833],
  "אבני חפץ": [32.3167, 35.1167],
  "בית יצחק-שער חפר": [32.3500, 34.8833],
  "בת חפר": [32.3333, 34.9000],
  "פרדסייה": [32.3000, 34.9000],
  "צור משה": [32.3000, 34.9167],
  "תל מונד": [32.2500, 34.9167],
};

// Israel center
const ISRAEL_CENTER: [number, number] = [31.5, 35.0];
const ISRAEL_ZOOM = 8;

// Continuous color scale for heatmap effect
function getHeatColor(gap: number): string {
  // Normalize gap to 0-1 range (clamped between -50 and +80)
  const normalized = Math.max(0, Math.min(1, (gap + 50) / 130));
  
  // Blue → Green → Yellow → Orange → Red
  if (normalized < 0.25) {
    // Blue to Cyan
    const t = normalized / 0.25;
    return `rgb(${Math.round(30 + t * 0)}, ${Math.round(100 + t * 155)}, ${Math.round(200 - t * 0)})`;
  } else if (normalized < 0.45) {
    // Cyan to Green
    const t = (normalized - 0.25) / 0.2;
    return `rgb(${Math.round(30 + t * 0)}, ${Math.round(200 + t * 55)}, ${Math.round(200 - t * 130)})`;
  } else if (normalized < 0.55) {
    // Green to Yellow
    const t = (normalized - 0.45) / 0.1;
    return `rgb(${Math.round(30 + t * 220)}, ${Math.round(200 + t * 55)}, ${Math.round(70 - t * 40)})`;
  } else if (normalized < 0.7) {
    // Yellow to Orange
    const t = (normalized - 0.55) / 0.15;
    return `rgb(${Math.round(250 - t * 10)}, ${Math.round(220 - t * 100)}, ${Math.round(30)})`;
  } else {
    // Orange to Red
    const t = (normalized - 0.7) / 0.3;
    return `rgb(${Math.round(240 - t * 40)}, ${Math.round(120 - t * 100)}, ${Math.round(30 + t * 10)})`;
  }
}

function getRadius(population: number): number {
  if (population > 200000) return 16;
  if (population > 100000) return 13;
  if (population > 50000) return 10;
  if (population > 20000) return 8;
  if (population > 10000) return 6;
  return 5;
}

interface MapDataItem {
  id: string;
  name: string;
  coords: [number, number];
  population: number;
  gap: number;
  rate: number;
  recipients: number;
  branch: string;
}

interface GapMapProps {
  className?: string;
}

export function GapMap({ className }: GapMapProps) {
  const { municipalities, benefitData, loading } = useSnapshotData();
  const { selectedBranch } = useBranchFilter();
  const [selectedBenefit, setSelectedBenefit] = useState("__all__");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const mapData = useMemo((): MapDataItem[] => {
    if (selectedBenefit === "__all__") {
      // Average gap across all benefit types
      return municipalities
        .map((m) => {
          const coords = MUNICIPALITY_COORDS[m.name];
          if (!coords) return null;

          let totalGap = 0;
          let totalRate = 0;
          let totalRecipients = 0;
          let count = 0;

          for (const routeId of Object.keys(benefitData)) {
            const entry = benefitData[routeId]?.[m.id];
            if (entry && entry.ratePer1000 > 0) {
              totalGap += entry.gapPercentage;
              totalRate += entry.recipientPercent;
              totalRecipients += entry.recipients ?? 0;
              count++;
            }
          }

          if (count === 0) return null;

          return {
            id: m.id,
            name: m.name,
            coords,
            population: m.population,
            gap: totalGap / count,
            rate: totalRate / count,
            recipients: totalRecipients,
            branch: m.branch,
          };
        })
        .filter(Boolean) as MapDataItem[];
    }

    // Single benefit type
    const data = benefitData[selectedBenefit];
    if (!data) return [];

    return municipalities
      .map((m) => {
        const coords = MUNICIPALITY_COORDS[m.name];
        if (!coords) return null;
        const entry = data[m.id];
        if (!entry || entry.ratePer1000 === 0) return null;

        return {
          id: m.id,
          name: m.name,
          coords,
          population: m.population,
          gap: entry.gapPercentage,
          rate: entry.recipientPercent,
          recipients: entry.recipients ?? 0,
          branch: m.branch,
        };
      })
      .filter(Boolean) as MapDataItem[];
  }, [municipalities, benefitData, selectedBenefit]);

  const benefitLabel = selectedBenefit === "__all__"
    ? "כל הגמלאות (ממוצע)"
    : benefitTypes.find((b) => b.id === selectedBenefit)?.name || "";

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center h-[500px] bg-muted/30 rounded-lg", className)}>
        <span className="animate-pulse text-muted-foreground">טוען מפה...</span>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">סוג גמלה:</label>
          <Select value={selectedBenefit} onValueChange={setSelectedBenefit}>
            <SelectTrigger className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">🔥 כל הגמלאות (ממוצע)</SelectItem>
              {benefitTypes.map((bt) => (
                <SelectItem key={bt.id} value={bt.id}>
                  {bt.icon} {bt.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Color scale legend */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">מתחת לממוצע</span>
          <div className="flex h-4 rounded-full overflow-hidden border" style={{ width: "120px" }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="flex-1"
                style={{ backgroundColor: getHeatColor(-50 + (i * 130) / 20) }}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">מעל הממוצע</span>
        </div>
      </div>

      {/* Map */}
      <div className="rounded-xl overflow-hidden border shadow-sm" style={{ height: "520px" }}>
        <MapContainer
          center={ISRAEL_CENTER}
          zoom={ISRAEL_ZOOM}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          {mapData.map((item) => {
            const isHovered = hoveredId === item.id;
            return (
              <CircleMarker
                key={item.id}
                center={item.coords}
                radius={isHovered ? getRadius(item.population) + 3 : getRadius(item.population)}
                pathOptions={{
                  color: isHovered ? "#1B3A5C" : "rgba(255,255,255,0.8)",
                  fillColor: getHeatColor(item.gap),
                  fillOpacity: isHovered ? 0.95 : 0.8,
                  weight: isHovered ? 2.5 : 1,
                }}
                eventHandlers={{
                  mouseover: () => setHoveredId(item.id),
                  mouseout: () => setHoveredId(null),
                }}
              >
                <MapTooltip
                  direction="top"
                  offset={[0, -8]}
                  opacity={0.95}
                  className="custom-tooltip"
                >
                  <div className="text-right min-w-[160px] p-0.5" dir="rtl">
                    <p className="font-bold text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.branch} • {formatNumber(item.population)} תושבים</p>
                    <p className={cn("text-sm font-bold mt-0.5", item.gap > 0 ? "text-red-600" : "text-blue-600")}>
                      פער: {item.gap > 0 ? "+" : ""}{item.gap.toFixed(1)}%
                    </p>
                  </div>
                </MapTooltip>
                <Popup maxWidth={320} className="municipality-popup">
                  <div className="text-right min-w-[280px]" dir="rtl">
                    <div className="border-b pb-2 mb-2">
                      <p className="font-bold text-base">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.branch} • אשכול {municipalities.find(m => m.id === item.id)?.cluster ?? "—"} • {formatNumber(item.population)} תושבים</p>
                    </div>
                    <p className="text-xs font-semibold text-gray-700 mb-1.5">פירוט גמלאות — פער מממוצע האשכול:</p>
                    <div className="space-y-1">
                      {benefitTypes.map((bt) => {
                        const entry = benefitData[bt.id]?.[item.id];
                        if (!entry || entry.ratePer1000 === 0) return null;
                        return (
                          <div key={bt.id} className="flex items-center justify-between text-xs py-0.5 border-b border-gray-100 last:border-0">
                            <span className="text-gray-600">{bt.icon} {bt.name}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-gray-800 font-medium">{entry.recipientPercent.toFixed(1)}%</span>
                              <span className={cn(
                                "font-bold min-w-[50px] text-left",
                                entry.gapPercentage > 15 ? "text-red-600" :
                                entry.gapPercentage > 0 ? "text-orange-500" :
                                "text-blue-600"
                              )}>
                                {entry.gapPercentage > 0 ? "+" : ""}{entry.gapPercentage.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>
          {mapData.length} רשויות על המפה
          {selectedBranch && ` • סניף: ${selectedBranch}`}
        </span>
        <span>
          גודל = אוכלוסייה • צבע = פער מממוצע האשכול • {benefitLabel}
        </span>
      </div>
    </div>
  );
}
