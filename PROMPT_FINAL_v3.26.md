"city"  `type: ce:erfa ל-Municipality int שדה `type` - הוסףs[]` (כרגע רק 152)
  icipalitieישויות ל-`munף את כל 340 ה  - הוסlfareData.ts`:
 דכן גם את `weStatus

4. ע Operational_עמודה 18:ter_Pct
   - from_Clusה 17: Gap_   - עמודerage_Rate_2025
דה 16: Cluster_Av Benefit
   - עמו   - עמודה 15: Benefit_Type
  - עמודה 14: 13: Small_Pop_Flag
 Cluster
   - עמודהודה 12: Z_Score_nd
   - עמודה 11: Trehange_Pct
   - עמe_C_24_25_Pct, Cumulativ_Pct, Changehange_23_24דות 8-10: Cte_2025
   - עמו, Rate_2024, RaRate_2023ודות 5-7: ודה 4: Pop_2025
   - עמster
   - עמ
   - עמודה 3: Clu
   - עמודה 2: Entity_Typeunicipalityמודה 1: Mה 0: Branch
   - ע - עמוד העמודות החדשות:
  ה! השתנa.ts` - סדר העמודות`flatDat ב-rseCSV()``
3. עדכן את `paing;
}
``_Status: strOperationaler_Pct: number | null;
  
  Gap_from_Clustrage_Rate_2025: number | null;Ave
  Cluster_ring;Benefit: stefit_Type: string;
  Flag: boolean;
  Ben_Pop_number | null;
  Small_Cluster: nd: string;
  Z_Scorenull;
  Treumber | ct: ntive_Change_P
  Cumula| null;ct: number e_24_25_P Changber | null;
 r | null;
  Change_23_24_Pct: numate_2025: numbe
  Rr | null;  Rate_2024: numbe null;
ate_2023: number |null;
  R2025: number | 
  Cluster: number | null;
  Pop_ "מועצה אזורית"חדש: "רשות מקומית" |_Type: string;      //  Entityality: string;
   Municiping;           // חדש
{
  Branch: strFlatDataRow rface rt intet
expo```typescripc/data/flatData.ts`:
-`srerface בtDataRow` int
2. עדכן את `Flat_data.csv`ic/btl_flacsv` → `publ_FINAL.ase_v5board_datab_ושדרוג/dashעתק `תיקון מה לעשות:
1. הדר שונה |

###מבנה, סו מבנה | אותו ר העמודות | אות16 |
| שאודה 5 | עמודה it | עמ Benef עמודה 4 | עמודה 15 |
| | |
| Benefit_Type / "מועצה אזורית"✅ "רשות מקומית"קיים | ity_Type | ❌ לא רכים) |
| Ent (24 ע✅ סניף ביטוח לאומיקיים | | ❌ לא -|------|
| Branch ------|-----| ישן | חדש |
|ישן:
| שדה שינויים מול ה-CSV הtus
```

### r_Pct,
Operational_Stafrom_Cluste25,Gap_e_Rate_20luster_Averagit_Type,Benefit,Cg,Beneflaop_Fe_Cluster,
Small_PPct,Trend,Z_Scor_Change__25_Pct,Cumulativeange_23_24_Pct,Change_24
Ch,Rate_2025,3,Rate_2024_202p_2025,Rateype,Cluster,Poicipality,Entity_T
```
Branch,Munחדש (20 עמודות):### מבנה ה-CSV הdatabase_v5_FINAL.csv`).

`dashboard_/btl_flat_data.csv`) בחדש (V הישן (`public

### מה:
להחליף את ה-CS ראשון!)ראשי (קריטי - לעשותונים השימה 1: החלפת מקור הנת

---

## מ ביצוע

## 5 משימות
---יה |
וכלוסיt | קצבת ילדים | כלל האuppor5+ |
| child-sage | זקנה ושאירים | 6וכלוסייה |
| old-y | מזונות | כלל הא |
| alimonנסה | 18-64support | הבטחת הכ4 |
| income-אבטלה | 18-6ment | 
| unemploy| סיעוד | 65+ |ursing ל האוכלוסייה |
| nty | ניידות | כלili | 0-17 |
| mob| ילד נכהchild bled-disaוסייה |
| ת | כלל האוכללינכות כלdisability | -------|
| --------ית יעד |
|----|-----|-סיID | שם | אוכלוות:
| ת קיימ
### 9 גמלאו5` (מגמות)
 / `trend_23_2 מחדל)25` (ברירת תצוגה: `snapshot_20ת)
- מצבarePage (השוואת רשויומלה)
- `/compare` → Compניתוח מעמיק לכל גalysisPage (enefitAnnefitId` → Bbenefit/:beאות)
- `/ + כרטיסי גמלPIs (סקירה + KerviewPage## דפים קיימים:
- `/` → Ovורית ויישוביה

#צה אז - נתוני למ"ס מלאים על כל מועcouncils_full.json`)
- `cbs_regional_bycode2021 → יישובים (מלמ"ס  54 מועצות אזוריות- מיפויcils_mapping.json` ת
- `regional_counניפי ביטוח לאומי → רשויוn` - מיפוי 24 סranches_dashboard.jsoה מתוקנת**
- `bגמלאות, **זקנ אזוריות), 9 (286 רשויות + 54 מועצות40 ישויות** - **3,058 שורות, 3ase_v5_FINAL.csv` ard_datab):
- `dashboושדרוג/`ים (בתיקיית `תיקון_### מקורות נתונים חדש+ פונקציות עזר

s` - parser ל-CSV a/flatData.tגמלאות
- `src/dat,239 שורות, 9  רשויות, 22023-2025, ~285` - CSV מגמות l_flat_data.csvblic/bt
- `pupshot 2025גי גמלאות, snaלבד**, 9 סוס סטטי, **152 רשויות ב.ts` - דאטהבייreData
- `src/data/welfaות נתונים קיימים:בורד

### מקורי של הדשמצב נוכח

---

## הוסף ותקן.**דפים קיימים. רק *כלל ברזל: אל תשבור מבר 2023-2025.

* ביטוח לאומי, דצמבוססישראל.
נתונים ת המקומיות בילאות רווחה ברשויוניתוח פערי גמL עברית) לind+shadcn/ui (RTVite+Tailwact+TypeScript+שבורד Re26

## רקע
דשדרוג דשבורד פערי גמלאות v3.ע סופי - תיקון ו ביצו# פרומפט