# הגדרת איסוף משובים ל-Google Sheet

## שלב 1: צור Google Sheet חדש
1. היכנס ל-https://sheets.google.com
2. צור גיליון חדש
3. בשורה 1 כתוב: תאריך | קטגוריה | חומרה | תיאור | דף
4. תן שם: "משובי דשבורד גמלאות"

## שלב 2: צור Apps Script
1. בגיליון לחץ: תוספים → Apps Script
2. מחק הכל והדבק את הקוד מהקובץ: `google_apps_script.js`
3. לחץ: פרוס → פריסה חדשה
4. סוג: אפליקציית אינטרנט
5. ביצוע בתור: אני | גישה: כל אחד
6. לחץ פרוס ואשר הרשאות
7. העתק את ה-URL

## שלב 3: הדבק ב-FeedbackModal
פתח `src/components/FeedbackModal.tsx`
החלף את השורה:
```
const GOOGLE_SHEET_URL = "";
```
ל:
```
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/YOUR_URL/exec";
```

## שלב 4: דחוף ל-GitHub
```
git add -A && git commit -m "Connect feedback to Google Sheet" && git push
```
