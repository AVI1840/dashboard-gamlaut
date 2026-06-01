import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
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
// Source: CBS (Central Bureau of Statistics) settlement coordinates
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
};

// Israel center
const ISRAEL_CENTER: [number, number] = [31.5, 34.9];
const ISRAEL_ZOOM = 8;

function getGapColor(gap: number): string {
  if (gap > 30) return "#dc2626"; // red-600
  if (gap > 15) return "#ea580c"; // orange-600
  if (gap > 0) return "#f59e0b"; // amber-500
  if (gap > -15) return "#22c55e"; // green-500
  return "#3b82f6"; // blue-500
}

function getRadius(population: number): number {
  if (population > 200000) return 14;
  if (population > 100000) return 11;
  if (population > 50000) return 9;
  if (population > 20000) return 7;
  if (population > 10000) return 5;
  return 4;
}

interface GapMapProps {
  className?: string;
}

export function GapMap({ className }: GapMapProps) {
  const { municipalities, benefitData, loading } = useSnapshotData();
  const { selectedBranch } = useBranchFilter();
  const [selectedBenefit, setSelectedBenefit] = useState("disability");

  const mapData = useMemo(() => {
    const data = benefitData[selectedBenefit];
    if (!data) return [];

    return municipalities
      .map((m) => {
        const coords = MUNICIPALITY_COORDS[m.name];
        if (!coords) return null;
        const benefitEntry = data[m.id];
        if (!benefitEntry) return null;

        return {
          id: m.id,
          name: m.name,
          coords,
          population: m.population,
          gap: benefitEntry.gapPercentage,
          rate: benefitEntry.recipientPercent,
          recipients: benefitEntry.recipients ?? 0,
          branch: m.branch,
        };
      })
      .filter(Boolean) as Array<{
        id: string;
        name: string;
        coords: [number, number];
        population: number;
        gap: number;
        rate: number;
        recipients: number;
        branch: string;
      }>;
  }, [municipalities, benefitData, selectedBenefit]);

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center h-[400px] bg-muted/30 rounded-lg", className)}>
        <span className="animate-pulse text-muted-foreground">טוען מפה...</span>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Select value={selectedBenefit} onValueChange={setSelectedBenefit}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {benefitTypes.map((bt) => (
              <SelectItem key={bt.id} value={bt.id}>
                {bt.icon} {bt.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-600 inline-block" /> &gt;30%</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-600 inline-block" /> 15-30%</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> 0-15%</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> מתחת לממוצע</span>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden border" style={{ height: "450px" }}>
        <MapContainer
          center={ISRAEL_CENTER}
          zoom={ISRAEL_ZOOM}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {mapData.map((item) => (
            <CircleMarker
              key={item.id}
              center={item.coords}
              radius={getRadius(item.population)}
              pathOptions={{
                color: getGapColor(item.gap),
                fillColor: getGapColor(item.gap),
                fillOpacity: 0.7,
                weight: 1,
              }}
            >
              <Popup>
                <div className="text-right min-w-[160px]" dir="rtl">
                  <p className="font-bold text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.branch}</p>
                  <div className="mt-1 space-y-0.5 text-xs">
                    <p>אוכלוסייה: {formatNumber(item.population)}</p>
                    <p>מקבלים: {formatNumber(item.recipients)}</p>
                    <p>שיעור: {item.rate.toFixed(1)}%</p>
                    <p className={cn("font-bold", item.gap > 0 ? "text-red-600" : "text-blue-600")}>
                      פער: {item.gap > 0 ? "+" : ""}{item.gap.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        {mapData.length} רשויות על המפה • גודל העיגול = אוכלוסייה • צבע = פער מאשכול
        {selectedBranch && ` • סניף: ${selectedBranch}`}
      </p>
    </div>
  );
}
