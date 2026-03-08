# CLAUDE.md — דשבורד פערי גמלאות ברשויות

## מה הפרויקט עושה
דשבורד אנליטי RTL (עברית) לניתוח פערי גמלאות רווחה ב-280 רשויות מקומיות.
3 מסכים: סקירה כללית, ניתוח לפי סוג גמלה, השוואת רשויות. נתונים אמיתיים מדצמבר 2024.

## סטאק
React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Recharts

## קבצים חשובים
- `src/components/dashboard/DashboardLayout.tsx` — layout ראשי עם sidebar
- `src/data/welfareData.ts` — נתוני גמלאות מובנים (אל תשנה ללא מקור)
- `src/data/flatData.ts` — נתוני CSV שטוחים (btl_flat_data.csv)
- `src/pages/` — OverviewPage, BenefitAnalysisPage, ComparePage
- `src/components/FeedbackModal.tsx` — מערכת משוב פיילוט עם localStorage

## כללי עבודה ל-AI

### מה מותר
- שיפורי UI ועיצוב
- הוספת גרפים וויזואליזציות
- שיפור ביצועים
- תיקון באגים

### מה אסור
- **אל תשנה** נתונים ב-welfareData.ts או flatData.ts — הם מדויקים מאקסל
- **אל תשנה** את הקרדיט: "אביעד יצחקי, מינהל גמלאות"
- **אל תוסיף** Lovable או כל branding חיצוני
- **אל תשדרג** ספריות ללא בדיקה

## Build
```
npm install
npm run build
```
אם npx לא עובד: `node_modules\.bin\tsc.cmd -b` ואז `node_modules\.bin\vite.cmd build`

## Deploy
GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`)
URL: https://aviad1840.github.io/dashboard-gamlaut/
