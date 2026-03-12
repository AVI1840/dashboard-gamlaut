// Welfare Benefits Gap Analysis Data
// Based on Israeli National Insurance data - December 2024
// STRICT MIRROR of Excel file: דוח_פערי_גמלאות_ברשויות_בישראל_1.2025.xlsx
// CORRECTED: Normalized by target population for each benefit type

export interface Municipality {
  id: string;
  name: string;
  code: number;
  population: number;
  cluster?: number; // Socio-Economic Cluster 1-10
  district: string;
  region: string;
}

export interface BenefitData {
  municipalityId: string;
  recipients: number;
  ratePer1000: number;
  recipientPercent: number; // % of recipients from population (new field)
  gapFromAverage: number;
  gapPercentage: number;
  ranking: number;
  averageBenefit: number;
}

export interface BenefitType {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  targetPopulation: string;
  nationalRecipients: number;
  nationalRatePer1000: number;
  nationalAverageBenefit: number;
  icon: string;
}

export interface NationalStats {
  totalPopulation: number;
  population65Plus: number;
  population18To64: number;
  population0To17: number;
  totalMunicipalities: number;
  lastUpdated: string;
}

// National Statistics - FROM EXCEL
export const nationalStats: NationalStats = {
  totalPopulation: 9746456,
  population65Plus: 1264063,
  population18To64: 5317732,
  population0To17: 3164661,
  totalMunicipalities: 280,
  lastUpdated: "דצמבר 2025",
};

// Benefit Types - EXACT from Excel overview sheet
export const benefitTypes: BenefitType[] = [
  {
    id: "disability",
    name: "נכות כללית",
    nameEn: "General Disability",
    description: "קצבה לאנשים עם מוגבלויות",
    targetPopulation: "כלל האוכלוסייה",
    nationalRecipients: 346564,
    nationalRatePer1000: 35.56,
    nationalAverageBenefit: 4460,
    icon: "♿",
  },
  {
    id: "disabled-child",
    name: "ילד נכה",
    nameEn: "Disabled Child",
    description: "גמלה למשפחות המטפלות בילד עם מוגבלות (גיל 0-17)",
    targetPopulation: "בני 0-17",
    nationalRecipients: 153472,
    nationalRatePer1000: 48.50,
    nationalAverageBenefit: 2962,
    icon: "🧒",
  },
  {
    id: "mobility",
    name: "גמלת ניידות",
    nameEn: "Mobility",
    description: "גמלה למוגבלים בניידות",
    targetPopulation: "כלל האוכלוסייה",
    nationalRecipients: 52431,
    nationalRatePer1000: 5.38,
    nationalAverageBenefit: 2335,
    icon: "🚗",
  },
  {
    id: "nursing",
    name: "גמלת סיעוד",
    nameEn: "Nursing Care",
    description: "גמלה לזקנים הזקוקים לסיוע (בני 65+)",
    targetPopulation: "בני 65+",
    nationalRecipients: 374472,
    nationalRatePer1000: 296.24,
    nationalAverageBenefit: 4594,
    icon: "🏥",
  },
  {
    id: "unemployment",
    name: "דמי אבטלה",
    nameEn: "Unemployment",
    description: "קצבה לעובדים שאיבדו את עבודתם (גיל 18-64)",
    targetPopulation: "בני 18-64",
    nationalRecipients: 81287,
    nationalRatePer1000: 15.29,
    nationalAverageBenefit: 5296,
    icon: "📊",
  },
  {
    id: "income-support",
    name: "הבטחת הכנסה",
    nameEn: "Income Support",
    description: "רשת בטחון למשפחות ללא הכנסה מספקת (גיל 18-64)",
    targetPopulation: "בני 18-64",
    nationalRecipients: 55533,
    nationalRatePer1000: 10.44,
    nationalAverageBenefit: 2352,
    icon: "💰",
  },
  {
    id: "alimony",
    name: "גמלת מזונות",
    nameEn: "Alimony",
    description: "גמלה להורים עצמאיים שאינם מקבלים מזונות",
    targetPopulation: "כלל האוכלוסייה",
    nationalRecipients: 10915,
    nationalRatePer1000: 1.12,
    nationalAverageBenefit: 2190,
    icon: "👪",
  },
  {
    id: "old-age",
    name: "קצבת זקנה ושאירים",
    nameEn: "Old Age & Survivors",
    description: "קצבה לאזרחים ותיקים (65+) ושאיריהם",
    targetPopulation: "בני 65+",
    nationalRecipients: 1203511,
    nationalRatePer1000: 952.10,
    nationalAverageBenefit: 2631,
    icon: "👴",
  },
  {
    id: "child-support",
    name: "קצבת ילדים",
    nameEn: "Child Allowance",
    description: "קצבה אוניברסלית למשפחות עם ילדים",
    targetPopulation: "כלל האוכלוסייה",
    nationalRecipients: 1282426,
    nationalRatePer1000: 131.58,
    nationalAverageBenefit: 457,
    icon: "👶",
  },
];

// Districts
export const districts = [
  "מרכז",
  "תל אביב",
  "צפון",
  "דרום",
  "ירושלים",
  "חיפה",
  "יו\"ש",
];

// Municipalities - EXACT from Excel with all key cities
export const municipalities: Municipality[] = [
  // Major cities
  { id: "jerusalem", name: "ירושלים", code: 3000, population: 1014874, cluster: 4, district: "ירושלים", region: "ירושלים" },
  { id: "tel-aviv", name: "תל אביב -יפו", code: 5000, population: 461649, cluster: 8, district: "תל אביב", region: "מרכז" },
  { id: "haifa", name: "חיפה", code: 4000, population: 279968, cluster: 7, district: "חיפה", region: "צפון" },
  { id: "rishon", name: "ראשון לציון", code: 8300, population: 254174, cluster: 7, district: "מרכז", region: "מרכז" },
  { id: "petah-tikva", name: "פתח תקווה", code: 7900, population: 255952, cluster: 7, district: "מרכז", region: "מרכז" },
  { id: "ashdod", name: "אשדוד", code: 70, population: 227285, cluster: 5, district: "דרום", region: "דרום" },
  { id: "netanya", name: "נתניה", code: 7400, population: 226189, cluster: 6, district: "מרכז", region: "מרכז" },
  { id: "bnei-brak", name: "בני ברק", code: 6100, population: 223585, cluster: 3, district: "תל אביב", region: "מרכז" },
  { id: "beer-sheva", name: "באר שבע", code: 9000, population: 214661, cluster: 5, district: "דרום", region: "דרום" },
  { id: "holon", name: "חולון", code: 6600, population: 187734, cluster: 7, district: "תל אביב", region: "מרכז" },
  { id: "beit-shemesh", name: "בית שמש", code: 2610, population: 175767, cluster: 3, district: "ירושלים", region: "ירושלים" },
  { id: "ramat-gan", name: "רמת גן", code: 8600, population: 162214, cluster: 8, district: "תל אביב", region: "מרכז" },
  { id: "ashkelon", name: "אשקלון", code: 7100, population: 160929, cluster: 5, district: "דרום", region: "דרום" },
  { id: "rehovot", name: "רחובות", code: 8400, population: 149399, cluster: 7, district: "מרכז", region: "מרכז" },
  { id: "bat-yam", name: "בת ים", code: 6200, population: 124600, cluster: 5, district: "תל אביב", region: "מרכז" },
  { id: "herzliya", name: "הרצלייה", code: 6400, population: 104165, cluster: 9, district: "תל אביב", region: "מרכז" },
  { id: "hadera", name: "חדרה", code: 6500, population: 103959, cluster: 6, district: "חיפה", region: "צפון" },
  { id: "modiin", name: "מודיעין-מכבים-רעות", code: 1200, population: 100113, cluster: 9, district: "מרכז", region: "מרכז" },
  { id: "kfar-saba", name: "כפר סבא", code: 6900, population: 99158, cluster: 8, district: "מרכז", region: "מרכז" },
  { id: "lod", name: "לוד", code: 7000, population: 89230, cluster: 4, district: "מרכז", region: "מרכז" },
  { id: "modiin-illit", name: "מודיעין עילית", code: 3797, population: 86326, cluster: 2, district: "יו\"ש", region: "ירושלים" },
  { id: "raanana", name: "רעננה", code: 8700, population: 82844, cluster: 9, district: "מרכז", region: "מרכז" },
  { id: "ramle", name: "רמלה", code: 8500, population: 82371, cluster: 4, district: "מרכז", region: "מרכז" },
  { id: "nazareth", name: "נצרת", code: 7300, population: 78999, cluster: 3, district: "צפון", region: "צפון" },
  { id: "rahat", name: "רהט", code: 1161, population: 79100, cluster: 1, district: "דרום", region: "דרום" },
  { id: "rosh-haayin", name: "ראש העין", code: 2640, population: 74367, cluster: 7, district: "מרכז", region: "מרכז" },
  { id: "beitar-illit", name: "ביתר עילית", code: 3780, population: 71073, cluster: 1, district: "יו\"ש", region: "ירושלים" },
  { id: "kiryat-gat", name: "קריית גת", code: 2630, population: 70214, cluster: 4, district: "דרום", region: "דרום" },
  { id: "nahariya", name: "נהרייה", code: 9100, population: 67695, cluster: 6, district: "צפון", region: "צפון" },
  { id: "afula", name: "עפולה", code: 7700, population: 65478, cluster: 5, district: "צפון", region: "צפון" },
  { id: "hod-hasharon", name: "הוד השרון", code: 9700, population: 63403, cluster: 9, district: "מרכז", region: "מרכז" },
  { id: "kiryat-ata", name: "קריית אתא", code: 6800, population: 61710, cluster: 5, district: "חיפה", region: "צפון" },
  { id: "umm-al-fahm", name: "אום אל-פחם", code: 2710, population: 60641, cluster: 2, district: "צפון", region: "צפון" },
  { id: "eilat", name: "אילת", code: 2600, population: 57781, cluster: 6, district: "דרום", region: "דרום" },
  { id: "givatayim", name: "גבעתיים", code: 6300, population: 57327, cluster: 9, district: "תל אביב", region: "מרכז" },
  { id: "yavne", name: "יבנה", code: 2660, population: 56921, cluster: 7, district: "מרכז", region: "מרכז" },
  { id: "netivot", name: "נתיבות", code: 246, population: 54781, cluster: 3, district: "דרום", region: "דרום" },
  { id: "acre", name: "עכו", code: 7600, population: 53986, cluster: 4, district: "צפון", region: "צפון" },
  { id: "tiberias", name: "טבריה", code: 6700, population: 52388, cluster: 3, district: "צפון", region: "צפון" },
  { id: "kiryat-motzkin", name: "קריית מוצקין", code: 8200, population: 50191, cluster: 7, district: "חיפה", region: "צפון" },
  { id: "elad", name: "אלעד", code: 1309, population: 49582, cluster: 2, district: "מרכז", region: "מרכז" },
  { id: "karmiel", name: "כרמיאל", code: 1139, population: 47769, cluster: 6, district: "צפון", region: "צפון" },
  { id: "nof-hagalil", name: "נוף הגליל", code: 1061, population: 47542, cluster: 5, district: "צפון", region: "צפון" },
  { id: "tayibe", name: "טייבה", code: 2730, population: 47069, cluster: 2, district: "מרכז", region: "מרכז" },
  { id: "ramat-hasharon", name: "רמת השרון", code: 2650, population: 45758, cluster: 9, district: "תל אביב", region: "מרכז" },
  { id: "kiryat-bialik", name: "קריית ביאליק", code: 9500, population: 45354, cluster: 7, district: "חיפה", region: "צפון" },
  { id: "pardes-hanna", name: "פרדס חנה-כרכור", code: 7800, population: 45270, cluster: 6, district: "חיפה", region: "צפון" },
  { id: "nes-ziona", name: "נס ציונה", code: 7200, population: 45315, cluster: 8, district: "מרכז", region: "מרכז" },
  { id: "shfaram", name: "שפרעם", code: 8800, population: 43185, cluster: 3, district: "צפון", region: "צפון" },
  { id: "kiryat-yam", name: "קריית ים", code: 9600, population: 41520, cluster: 4, district: "חיפה", region: "צפון" },
  { id: "kiryat-ono", name: "קריית אונו", code: 2620, population: 42385, cluster: 8, district: "תל אביב", region: "מרכז" },
  { id: "dimona", name: "דימונה", code: 2200, population: 41136, cluster: 4, district: "דרום", region: "דרום" },
  { id: "ofakim", name: "אופקים", code: 31, population: 40184, cluster: 3, district: "דרום", region: "דרום" },
  { id: "or-yehuda", name: "אור יהודה", code: 2400, population: 39382, cluster: 6, district: "תל אביב", region: "מרכז" },
  { id: "safed", name: "צפת", code: 8000, population: 39301, cluster: 3, district: "צפון", region: "צפון" },
  { id: "harish", name: "חריש", code: 1247, population: 37909, cluster: 6, district: "חיפה", region: "צפון" },
  { id: "maale-adumim", name: "מעלה אדומים", code: 3616, population: 37165, cluster: 7, district: "יו\"ש", region: "ירושלים" },
  { id: "tamra", name: "טמרה", code: 8900, population: 36657, cluster: 2, district: "צפון", region: "צפון" },
  { id: "sderot", name: "שדרות", code: 1031, population: 35796, cluster: 4, district: "דרום", region: "דרום" },
  { id: "sachnin", name: "סח'נין", code: 7500, population: 35524, cluster: 2, district: "צפון", region: "צפון" },
  { id: "baqa-jatt", name: "באקה אל-גרביה", code: 6000, population: 35170, cluster: 3, district: "צפון", region: "צפון" },
  { id: "beer-yaakov", name: "באר יעקב", code: 2530, population: 33689, cluster: 7, district: "מרכז", region: "מרכז" },
  { id: "arad", name: "ערד", code: 2560, population: 31958, cluster: 5, district: "דרום", region: "דרום" },
  { id: "yehud", name: "יהוד", code: 9400, population: 31324, cluster: 7, district: "תל אביב", region: "מרכז" },
  { id: "tirat-carmel", name: "טירת כרמל", code: 2100, population: 30938, cluster: 4, district: "חיפה", region: "צפון" },
  { id: "givat-shmuel", name: "גבעת שמואל", code: 681, population: 29004, cluster: 8, district: "מרכז", region: "מרכז" },
  { id: "migdal-haemek", name: "מגדל העמק", code: 874, population: 28708, cluster: 4, district: "צפון", region: "צפון" },
  { id: "kfar-yona", name: "כפר יונה", code: 168, population: 28151, cluster: 6, district: "מרכז", region: "מרכז" },
  { id: "arraba", name: "עראבה", code: 531, population: 28010, cluster: 2, district: "צפון", region: "צפון" },
  { id: "kiryat-malachi", name: "קריית מלאכי", code: 1034, population: 27668, cluster: 3, district: "דרום", region: "דרום" },
  { id: "tira", name: "טירה", code: 2720, population: 26833, cluster: 3, district: "מרכז", region: "מרכז" },
  { id: "kfar-kasem", name: "כפר קאסם", code: 634, population: 26353, cluster: 3, district: "מרכז", region: "מרכז" },
  { id: "mevasseret-zion", name: "מבשרת ציון", code: 1015, population: 26097, cluster: 8, district: "ירושלים", region: "ירושלים" },
  { id: "gan-yavne", name: "גן יבנה", code: 166, population: 24777, cluster: 6, district: "דרום", region: "דרום" },
  { id: "maghar", name: "מגאר", code: 481, population: 24667, cluster: 3, district: "צפון", region: "צפון" },
  { id: "kfar-kana", name: "כפר כנא", code: 509, population: 24636, cluster: 2, district: "צפון", region: "צפון" },
  { id: "kalansua", name: "קלנסווה", code: 638, population: 24627, cluster: 3, district: "מרכז", region: "מרכז" },
  { id: "kiryat-shmona", name: "קריית שמונה", code: 2800, population: 24400, cluster: 4, district: "צפון", region: "צפון" },
  { id: "tel-sheva", name: "תל שבע", code: 1054, population: 24242, cluster: 1, district: "דרום", region: "דרום" },
  { id: "gani-tikva", name: "גני תקווה", code: 229, population: 24163, cluster: 8, district: "מרכז", region: "מרכז" },
  { id: "or-akiva", name: "אור עקיבא", code: 1020, population: 24165, cluster: 4, district: "חיפה", region: "צפון" },
  { id: "zichron-yaakov", name: "זכרון יעקב", code: 9300, population: 23877, cluster: 8, district: "חיפה", region: "צפון" },
  { id: "givat-zeev", name: "גבעת זאב", code: 3730, population: 23424, cluster: 5, district: "יו\"ש", region: "ירושלים" },
  { id: "maalot-tarshiha", name: "מעלות-תרשיחא", code: 1063, population: 23448, cluster: 5, district: "צפון", region: "צפון" },
  { id: "hura", name: "חורה", code: 1303, population: 23033, cluster: 1, district: "דרום", region: "דרום" },
  { id: "kfar-manda", name: "כפר מנדא", code: 510, population: 22269, cluster: 2, district: "צפון", region: "צפון" },
  { id: "kadima-zoran", name: "קדימה-צורן", code: 195, population: 22017, cluster: 7, district: "מרכז", region: "מרכז" },
  { id: "nesher", name: "נשר", code: 2500, population: 21881, cluster: 6, district: "חיפה", region: "צפון" },
  { id: "magdiel-kerem", name: "מג'ד אל-כרום", code: 516, population: 21794, cluster: 2, district: "צפון", region: "צפון" },
  { id: "kusaife", name: "כסיפה", code: 1059, population: 21654, cluster: 1, district: "דרום", region: "דרום" },
  { id: "arara-negev", name: "ערערה-בנגב", code: 1192, population: 21590, cluster: 1, district: "דרום", region: "דרום" },
  { id: "beit-shean", name: "בית שאן", code: 9200, population: 21317, cluster: 4, district: "צפון", region: "צפון" },
  { id: "jdeide-maker", name: "ג'דיידה-מכר", code: 1292, population: 21134, cluster: 4, district: "צפון", region: "צפון" },
  { id: "arara", name: "ערערה", code: 637, population: 21203, cluster: 3, district: "צפון", region: "צפון" },
  { id: "kfar-kara", name: "כפר קרע", code: 654, population: 20799, cluster: 4, district: "צפון", region: "צפון" },
  { id: "daliyat-al-carmel", name: "דאלית אל-כרמל", code: 494, population: 20395, cluster: 4, district: "חיפה", region: "צפון" },
  { id: "yaffa-nazareth", name: "יפיע", code: 499, population: 19976, cluster: 3, district: "צפון", region: "צפון" },
  { id: "ariel", name: "אריאל", code: 3570, population: 19128, cluster: 6, district: "יו\"ש", region: "מרכז" },
  { id: "lakiya", name: "לקיה", code: 1060, population: 18401, cluster: 1, district: "דרום", region: "דרום" },
  { id: "kiryat-tivon", name: "קריית טבעון", code: 2300, population: 17981, cluster: 8, district: "חיפה", region: "צפון" },
  { id: "yrka", name: "ירכא", code: 502, population: 17188, cluster: 4, district: "צפון", region: "צפון" },
  { id: "reine", name: "ריינה", code: 542, population: 17247, cluster: 3, district: "צפון", region: "צפון" },
  { id: "mzra", name: "מזרעה", code: 517, population: 4149, cluster: 4, district: "צפון", region: "צפון" },
  { id: "maale-iron", name: "מעלה עירון", code: 1327, population: 16152, cluster: 2, district: "צפון", region: "צפון" },
  { id: "jisr-az-zarqa", name: "ג'סר א-זרקא", code: 541, population: 15778, cluster: 1, district: "חיפה", region: "צפון" },
  { id: "akbara", name: "פוריידיס", code: 537, population: 13838, cluster: 2, district: "חיפה", region: "צפון" },
  { id: "touraan", name: "טורעאן", code: 498, population: 15136, cluster: 3, district: "צפון", region: "צפון" },
  { id: "binyamina", name: "בנימינה-גבעת עדה", code: 9800, population: 15029, cluster: 7, district: "חיפה", region: "צפון" },
  { id: "reksim", name: "רכסים", code: 922, population: 14689, cluster: 2, district: "חיפה", region: "צפון" },
  { id: "abu-sinan", name: "אבו סנאן", code: 473, population: 14502, cluster: 5, district: "צפון", region: "צפון" },
  { id: "ein-mahil", name: "עין מאהל", code: 532, population: 14404, cluster: 3, district: "צפון", region: "צפון" },
  { id: "nahf", name: "נחף", code: 522, population: 14252, cluster: 2, district: "צפון", region: "צפון" },
  { id: "kabul", name: "כאבול", code: 504, population: 13190, cluster: 3, district: "צפון", region: "צפון" },
  { id: "segev-shalom", name: "שגב-שלום", code: 1286, population: 13396, cluster: 1, district: "דרום", region: "דרום" },
  { id: "aablin", name: "אעבלין", code: 529, population: 13228, cluster: 3, district: "צפון", region: "צפון" },
  { id: "azor", name: "אזור", code: 565, population: 12496, cluster: 7, district: "תל אביב", region: "מרכז" },
  { id: "yeruham", name: "ירוחם", code: 831, population: 12061, district: "דרום", region: "דרום" },
  { id: "hatzor-hagalilit", name: "חצור הגלילית", code: 2034, population: 11134, cluster: 4, district: "צפון", region: "צפון" },
  { id: "bsmt-tabun", name: "בסמת טבעון", code: 944, population: 8245, cluster: 3, district: "צפון", region: "צפון" },
  { id: "deir-hanna", name: "דייר חנא", code: 492, population: 11279, cluster: 2, district: "צפון", region: "צפון" },
  { id: "bir-makhsur", name: "ביר אל-מכסור", code: 998, population: 11104, cluster: 2, district: "צפון", region: "צפון" },
  { id: "daburia", name: "דבורייה", code: 489, population: 11265, cluster: 3, district: "צפון", region: "צפון" },
  { id: "bueine-nujeidat", name: "בועיינה-נוג'ידאת", code: 482, population: 10969, cluster: 2, district: "צפון", region: "צפון" },
  { id: "kiryat-ekron", name: "קריית עקרון", code: 469, population: 10888, cluster: 5, district: "מרכז", region: "מרכז" },
  { id: "jaljulya", name: "ג'לג'וליה", code: 627, population: 10877, cluster: 3, district: "מרכז", region: "מרכז" },
  { id: "kfar-yasif", name: "כפר יאסיף", code: 507, population: 10620, cluster: 4, district: "צפון", region: "צפון" },
  { id: "isfiya", name: "עספיא", code: 534, population: 11058, cluster: 4, district: "חיפה", region: "צפון" },
  { id: "zarzir", name: "זרזיר", code: 975, population: 9299, cluster: 2, district: "צפון", region: "צפון" },
  { id: "ilut", name: "עילוט", code: 511, population: 9163, cluster: 3, district: "צפון", region: "צפון" },
  { id: "meshhed", name: "משהד", code: 520, population: 8900, cluster: 3, district: "צפון", region: "צפון" },
  { id: "rama", name: "ראמה", code: 543, population: 8469, cluster: 3, district: "צפון", region: "צפון" },
  { id: "katsrin", name: "קצרין", code: 4100, population: 8380, cluster: 6, district: "צפון", region: "צפון" },
  { id: "shlomi", name: "שלומי", code: 812, population: 8093, cluster: 4, district: "צפון", region: "צפון" },
  { id: "shab", name: "שעב", code: 538, population: 7869, cluster: 3, district: "צפון", region: "צפון" },
  { id: "bir-hadaj", name: "ביר הדאג'", code: 1348, population: 3666, cluster: 1, district: "דרום", region: "דרום" },
  { id: "umm-batin", name: "אום בטין", code: 1358, population: 4371, cluster: 1, district: "דרום", region: "דרום" },
  { id: "sawa", name: "סעוה", code: 1360, population: 2332, cluster: 1, district: "דרום", region: "דרום" },
  { id: "kasir-a-sir", name: "קצר א-סר", code: 1347, population: 2704, cluster: 1, district: "דרום", region: "דרום" },
  { id: "abu-talul", name: "אבו תלול", code: 1375, population: 2867, cluster: 1, district: "דרום", region: "דרום" },
  { id: "salama", name: "סלמה", code: 1245, population: 3681, cluster: 2, district: "צפון", region: "צפון" },
  { id: "bnei-ayish", name: "בני עי\"ש", code: 1066, population: 6515, cluster: 5, district: "מרכז", region: "מרכז" },
  { id: "tubazangaria", name: "טובא-זנגרייה", code: 962, population: 6905, cluster: 3, district: "צפון", region: "צפון" },
  { id: "horfish", name: "חורפיש", code: 496, population: 6794, cluster: 4, district: "צפון", region: "צפון" },
  { id: "julis", name: "ג'ולס", code: 485, population: 6871, cluster: 5, district: "צפון", region: "צפון" },
  { id: "yanoch-jat", name: "יאנוח-ג'ת", code: 1295, population: 6969, cluster: 3, district: "צפון", region: "צפון" },
  { id: "shibly-umm-ghanam", name: "שבלי - אום אל-גנם", code: 913, population: 6830, cluster: 3, district: "צפון", region: "צפון" },
  { id: "bana", name: "בענה", code: 483, population: 6611, cluster: 3, district: "צפון", region: "צפון" },
  { id: "pekiin", name: "פקיעין (בוקייעה)", code: 536, population: 6114, cluster: 4, district: "צפון", region: "צפון" },
  { id: "kobia-tabash", name: "כעביה-טבאש-חג'אג'רה", code: 978, population: 6291, cluster: 2, district: "צפון", region: "צפון" },
  { id: "ailabon", name: "עיילבון", code: 530, population: 5706, cluster: 3, district: "צפון", region: "צפון" },
  { id: "magdel", name: "מגדל", code: 65, population: 2076, cluster: 4, district: "צפון", region: "צפון" },
  { id: "yavneel", name: "יבנאל", code: 46, population: 4502, cluster: 4, district: "צפון", region: "צפון" },
];

// ============================================================
// BENEFIT DATA - EXACT FROM EXCEL SHEETS
// ============================================================

// Nursing Care (סיעוד) - normalized to 65+ population - FROM PAGE 4
const nursingData: Record<string, BenefitData> = {
  "sachnin": { municipalityId: "sachnin", recipients: 2107, ratePer1000: 734.91, recipientPercent: 73.49, gapFromAverage: 438.67, gapPercentage: 148.1, ranking: 1, averageBenefit: 4316 },
  "maale-iron": { municipalityId: "maale-iron", recipients: 1014, ratePer1000: 715.81, recipientPercent: 71.58, gapFromAverage: 419.57, gapPercentage: 141.6, ranking: 2, averageBenefit: 3844 },
  "umm-al-fahm": { municipalityId: "umm-al-fahm", recipients: 2653, ratePer1000: 711.50, recipientPercent: 71.15, gapFromAverage: 415.26, gapPercentage: 140.2, ranking: 3, averageBenefit: 4151 },
  "kfar-manda": { municipalityId: "kfar-manda", recipients: 1117, ratePer1000: 703.14, recipientPercent: 70.31, gapFromAverage: 406.90, gapPercentage: 137.4, ranking: 5, averageBenefit: 4126 },
  "salama": { municipalityId: "salama", recipients: 114, ratePer1000: 699.39, recipientPercent: 69.94, gapFromAverage: 403.15, gapPercentage: 136.1, ranking: 6, averageBenefit: 4611 },
  "magdiel-kerem": { municipalityId: "magdiel-kerem", recipients: 1120, ratePer1000: 677.47, recipientPercent: 67.75, gapFromAverage: 381.23, gapPercentage: 128.7, ranking: 7, averageBenefit: 4283 },
  "arraba": { municipalityId: "arraba", recipients: 1390, ratePer1000: 669.39, recipientPercent: 66.94, gapFromAverage: 373.15, gapPercentage: 126.0, ranking: 8, averageBenefit: 4333 },
  "deir-hanna": { municipalityId: "deir-hanna", recipients: 553, ratePer1000: 665.88, recipientPercent: 66.59, gapFromAverage: 369.64, gapPercentage: 124.8, ranking: 9, averageBenefit: 4378 },
  "nahf": { municipalityId: "nahf", recipients: 713, ratePer1000: 663.87, recipientPercent: 66.39, gapFromAverage: 367.63, gapPercentage: 124.1, ranking: 10, averageBenefit: 4186 },
  "kfar-kana": { municipalityId: "kfar-kana", recipients: 895, ratePer1000: 574.09, recipientPercent: 57.41, gapFromAverage: 277.85, gapPercentage: 93.8, ranking: 41, averageBenefit: 3944 },
  "tamra": { municipalityId: "tamra", recipients: 1351, ratePer1000: 562.21, recipientPercent: 56.22, gapFromAverage: 265.97, gapPercentage: 89.8, ranking: 46, averageBenefit: 4176 },
  "shfaram": { municipalityId: "shfaram", recipients: 1905, ratePer1000: 527.85, recipientPercent: 52.79, gapFromAverage: 231.61, gapPercentage: 78.2, ranking: 58, averageBenefit: 4057 },
  "nazareth": { municipalityId: "nazareth", recipients: 4079, ratePer1000: 519.49, recipientPercent: 51.95, gapFromAverage: 223.25, gapPercentage: 75.4, ranking: 61, averageBenefit: 4153 },
  "jisr-az-zarqa": { municipalityId: "jisr-az-zarqa", recipients: 298, ratePer1000: 490.13, recipientPercent: 49.01, gapFromAverage: 193.89, gapPercentage: 65.4, ranking: 69, averageBenefit: 4149 },
  "sderot": { municipalityId: "sderot", recipients: 1656, ratePer1000: 489.94, recipientPercent: 48.99, gapFromAverage: 193.70, gapPercentage: 65.4, ranking: 70, averageBenefit: 4629 },
  "lod": { municipalityId: "lod", recipients: 4622, ratePer1000: 437.94, recipientPercent: 43.79, gapFromAverage: 141.70, gapPercentage: 47.8, ranking: 79, averageBenefit: 4627 },
  "ramle": { municipalityId: "ramle", recipients: 4761, ratePer1000: 435.87, recipientPercent: 43.59, gapFromAverage: 139.63, gapPercentage: 47.1, ranking: 80, averageBenefit: 4682 },
  "ashkelon": { municipalityId: "ashkelon", recipients: 11635, ratePer1000: 433.22, recipientPercent: 43.32, gapFromAverage: 136.98, gapPercentage: 46.2, ranking: 83, averageBenefit: 4675 },
  "nof-hagalil": { municipalityId: "nof-hagalil", recipients: 3491, ratePer1000: 406.45, recipientPercent: 40.65, gapFromAverage: 110.21, gapPercentage: 37.2, ranking: 88, averageBenefit: 4505 },
  "kiryat-yam": { municipalityId: "kiryat-yam", recipients: 4151, ratePer1000: 401.37, recipientPercent: 40.14, gapFromAverage: 105.13, gapPercentage: 35.5, ranking: 91, averageBenefit: 4973 },
  "kiryat-gat": { municipalityId: "kiryat-gat", recipients: 3544, ratePer1000: 397.18, recipientPercent: 39.72, gapFromAverage: 100.94, gapPercentage: 34.1, ranking: 97, averageBenefit: 4713 },
  "dimona": { municipalityId: "dimona", recipients: 2227, ratePer1000: 402.93, recipientPercent: 40.29, gapFromAverage: 106.69, gapPercentage: 36.0, ranking: 90, averageBenefit: 4722 },
  "holon": { municipalityId: "holon", recipients: 14048, ratePer1000: 364.77, recipientPercent: 36.48, gapFromAverage: 68.53, gapPercentage: 23.1, ranking: 106, averageBenefit: 4980 },
  "beer-sheva": { municipalityId: "beer-sheva", recipients: 13430, ratePer1000: 364.23, recipientPercent: 36.42, gapFromAverage: 67.99, gapPercentage: 23.0, ranking: 107, averageBenefit: 4759 },
  "bat-yam": { municipalityId: "bat-yam", recipients: 11246, ratePer1000: 357.92, recipientPercent: 35.79, gapFromAverage: 61.68, gapPercentage: 20.8, ranking: 108, averageBenefit: 4949 },
  "ashdod": { municipalityId: "ashdod", recipients: 13491, ratePer1000: 356.73, recipientPercent: 35.67, gapFromAverage: 60.49, gapPercentage: 20.4, ranking: 109, averageBenefit: 4505 },
  "tirat-carmel": { municipalityId: "tirat-carmel", recipients: 1360, ratePer1000: 284.88, recipientPercent: 28.49, gapFromAverage: -11.36, gapPercentage: -3.8, ranking: 143, averageBenefit: 4340 },
  "rishon": { municipalityId: "rishon", recipients: 14182, ratePer1000: 283.41, recipientPercent: 28.34, gapFromAverage: -12.83, gapPercentage: -4.3, ranking: 144, averageBenefit: 4745 },
  "acre": { municipalityId: "acre", recipients: 2372, ratePer1000: 282.72, recipientPercent: 28.27, gapFromAverage: -13.52, gapPercentage: -4.6, ranking: 145, averageBenefit: 4320 },
  "netanya": { municipalityId: "netanya", recipients: 12592, ratePer1000: 281.69, recipientPercent: 28.17, gapFromAverage: -14.55, gapPercentage: -4.9, ranking: 146, averageBenefit: 4521 },
  "petah-tikva": { municipalityId: "petah-tikva", recipients: 11822, ratePer1000: 267.65, recipientPercent: 26.77, gapFromAverage: -28.59, gapPercentage: -9.7, ranking: 150, averageBenefit: 4781 },
  "rehovot": { municipalityId: "rehovot", recipients: 6518, ratePer1000: 267.48, recipientPercent: 26.75, gapFromAverage: -28.76, gapPercentage: -9.7, ranking: 151, averageBenefit: 4579 },
  "jerusalem": { municipalityId: "jerusalem", recipients: 29912, ratePer1000: 301.19, recipientPercent: 30.12, gapFromAverage: 4.95, gapPercentage: 1.7, ranking: 136, averageBenefit: 4379 },
  "haifa": { municipalityId: "haifa", recipients: 15136, ratePer1000: 248.71, recipientPercent: 24.87, gapFromAverage: -47.53, gapPercentage: -16.0, ranking: 167, averageBenefit: 4427 },
  "tel-aviv": { municipalityId: "tel-aviv", recipients: 17463, ratePer1000: 228.21, recipientPercent: 22.82, gapFromAverage: -68.03, gapPercentage: -23.0, ranking: 180, averageBenefit: 4828 },
  "ramat-gan": { municipalityId: "ramat-gan", recipients: 7472, ratePer1000: 252.25, recipientPercent: 25.23, gapFromAverage: -43.99, gapPercentage: -14.8, ranking: 164, averageBenefit: 4731 },
  "givatayim": { municipalityId: "givatayim", recipients: 2304, ratePer1000: 232.54, recipientPercent: 23.25, gapFromAverage: -63.70, gapPercentage: -21.5, ranking: 177, averageBenefit: 4737 },
  "herzliya": { municipalityId: "herzliya", recipients: 3565, ratePer1000: 166.32, recipientPercent: 16.63, gapFromAverage: -129.92, gapPercentage: -43.9, ranking: 219, averageBenefit: 4587 },
  "kfar-saba": { municipalityId: "kfar-saba", recipients: 4190, ratePer1000: 196.73, recipientPercent: 19.67, gapFromAverage: -99.51, gapPercentage: -33.6, ranking: 201, averageBenefit: 4507 },
  "raanana": { municipalityId: "raanana", recipients: 2195, ratePer1000: 134.40, recipientPercent: 13.44, gapFromAverage: -161.84, gapPercentage: -54.6, ranking: 241, averageBenefit: 4439 },
  "modiin": { municipalityId: "modiin", recipients: 1997, ratePer1000: 182.83, recipientPercent: 18.28, gapFromAverage: -113.41, gapPercentage: -38.3, ranking: 212, averageBenefit: 4413 },
  "tiberias": { municipalityId: "tiberias", recipients: 2476, ratePer1000: 334.87, recipientPercent: 33.49, gapFromAverage: 38.63, gapPercentage: 13.0, ranking: 119, averageBenefit: 4528 },
  "afula": { municipalityId: "afula", recipients: 3155, ratePer1000: 307.83, recipientPercent: 30.78, gapFromAverage: 11.59, gapPercentage: 3.9, ranking: 133, averageBenefit: 4680 },
  "kiryat-shmona": { municipalityId: "kiryat-shmona", recipients: 1136, ratePer1000: 299.66, recipientPercent: 29.97, gapFromAverage: 3.42, gapPercentage: 1.2, ranking: 139, averageBenefit: 4546 },
  "safed": { municipalityId: "safed", recipients: 1235, ratePer1000: 301.15, recipientPercent: 30.12, gapFromAverage: 4.91, gapPercentage: 1.7, ranking: 137, averageBenefit: 4322 },
};

// Disability (נכות כללית) - FROM PAGE 3
const disabilityData: Record<string, BenefitData> = {
  "tiberias": { municipalityId: "tiberias", recipients: 4154, ratePer1000: 79.29, recipientPercent: 7.93, gapFromAverage: 43.73, gapPercentage: 123.0, ranking: 1, averageBenefit: 4613 },
  "magdel": { municipalityId: "magdel", recipients: 156, ratePer1000: 75.14, recipientPercent: 7.51, gapFromAverage: 39.58, gapPercentage: 111.3, ranking: 2, averageBenefit: 4192 },
  "kiryat-shmona": { municipalityId: "kiryat-shmona", recipients: 1651, ratePer1000: 67.66, recipientPercent: 6.77, gapFromAverage: 32.10, gapPercentage: 90.3, ranking: 3, averageBenefit: 4345 },
  "maghar": { municipalityId: "maghar", recipients: 1627, ratePer1000: 65.96, recipientPercent: 6.60, gapFromAverage: 30.40, gapPercentage: 85.5, ranking: 4, averageBenefit: 4513 },
  "yavneel": { municipalityId: "yavneel", recipients: 290, ratePer1000: 64.42, recipientPercent: 6.44, gapFromAverage: 28.86, gapPercentage: 81.2, ranking: 5, averageBenefit: 4988 },
  "safed": { municipalityId: "safed", recipients: 2470, ratePer1000: 62.85, recipientPercent: 6.29, gapFromAverage: 27.29, gapPercentage: 76.7, ranking: 6, averageBenefit: 4998 },
  "hatzor-hagalilit": { municipalityId: "hatzor-hagalilit", recipients: 669, ratePer1000: 60.09, recipientPercent: 6.01, gapFromAverage: 24.53, gapPercentage: 69.0, ranking: 7, averageBenefit: 4662 },
  "afula": { municipalityId: "afula", recipients: 3922, ratePer1000: 59.90, recipientPercent: 5.99, gapFromAverage: 24.34, gapPercentage: 68.5, ranking: 8, averageBenefit: 4524 },
  "jisr-az-zarqa": { municipalityId: "jisr-az-zarqa", recipients: 942, ratePer1000: 59.70, recipientPercent: 5.97, gapFromAverage: 24.14, gapPercentage: 67.9, ranking: 9, averageBenefit: 4526 },
  "yrka": { municipalityId: "yrka", recipients: 1018, ratePer1000: 59.23, recipientPercent: 5.92, gapFromAverage: 23.67, gapPercentage: 66.6, ranking: 10, averageBenefit: 4470 },
  "beer-sheva": { municipalityId: "beer-sheva", recipients: 12636, ratePer1000: 58.86, recipientPercent: 5.89, gapFromAverage: 23.30, gapPercentage: 65.5, ranking: 11, averageBenefit: 4470 },
  "migdal-haemek": { municipalityId: "migdal-haemek", recipients: 1661, ratePer1000: 57.86, recipientPercent: 5.79, gapFromAverage: 22.30, gapPercentage: 62.7, ranking: 13, averageBenefit: 4517 },
  "beit-shean": { municipalityId: "beit-shean", recipients: 1229, ratePer1000: 57.65, recipientPercent: 5.77, gapFromAverage: 22.09, gapPercentage: 62.1, ranking: 14, averageBenefit: 4555 },
  "kiryat-yam": { municipalityId: "kiryat-yam", recipients: 2325, ratePer1000: 56.00, recipientPercent: 5.60, gapFromAverage: 20.44, gapPercentage: 57.5, ranking: 16, averageBenefit: 4387 },
  "deir-hanna": { municipalityId: "deir-hanna", recipients: 631, ratePer1000: 55.94, recipientPercent: 5.59, gapFromAverage: 20.38, gapPercentage: 57.3, ranking: 17, averageBenefit: 4446 },
  "dimona": { municipalityId: "dimona", recipients: 2291, ratePer1000: 55.69, recipientPercent: 5.57, gapFromAverage: 20.13, gapPercentage: 56.6, ranking: 18, averageBenefit: 4461 },
  "shfaram": { municipalityId: "shfaram", recipients: 2318, ratePer1000: 53.68, recipientPercent: 5.37, gapFromAverage: 18.12, gapPercentage: 51.0, ranking: 23, averageBenefit: 4428 },
  "arad": { municipalityId: "arad", recipients: 1705, ratePer1000: 53.35, recipientPercent: 5.34, gapFromAverage: 17.79, gapPercentage: 50.0, ranking: 26, averageBenefit: 4947 },
  "tirat-carmel": { municipalityId: "tirat-carmel", recipients: 1594, ratePer1000: 51.52, recipientPercent: 5.15, gapFromAverage: 15.96, gapPercentage: 44.9, ranking: 33, averageBenefit: 4463 },
  "kiryat-ata": { municipalityId: "kiryat-ata", recipients: 3145, ratePer1000: 50.96, recipientPercent: 5.10, gapFromAverage: 15.40, gapPercentage: 43.3, ranking: 34, averageBenefit: 4398 },
  "nof-hagalil": { municipalityId: "nof-hagalil", recipients: 2391, ratePer1000: 50.29, recipientPercent: 5.03, gapFromAverage: 14.73, gapPercentage: 41.4, ranking: 39, averageBenefit: 4356 },
  "tamra": { municipalityId: "tamra", recipients: 1841, ratePer1000: 50.22, recipientPercent: 5.02, gapFromAverage: 14.66, gapPercentage: 41.2, ranking: 41, averageBenefit: 4541 },
  "eilat": { municipalityId: "eilat", recipients: 2897, ratePer1000: 50.14, recipientPercent: 5.01, gapFromAverage: 14.58, gapPercentage: 41.0, ranking: 42, averageBenefit: 4342 },
  "nazareth": { municipalityId: "nazareth", recipients: 3919, ratePer1000: 49.61, recipientPercent: 4.96, gapFromAverage: 14.05, gapPercentage: 39.5, ranking: 45, averageBenefit: 4464 },
  "acre": { municipalityId: "acre", recipients: 2645, ratePer1000: 48.99, recipientPercent: 4.90, gapFromAverage: 13.43, gapPercentage: 37.8, ranking: 47, averageBenefit: 4389 },
  "haifa": { municipalityId: "haifa", recipients: 13492, ratePer1000: 48.19, recipientPercent: 4.82, gapFromAverage: 12.63, gapPercentage: 35.5, ranking: 51, averageBenefit: 4346 },
  "arraba": { municipalityId: "arraba", recipients: 1345, ratePer1000: 48.02, recipientPercent: 4.80, gapFromAverage: 12.46, gapPercentage: 35.0, ranking: 53, averageBenefit: 4558 },
  "kiryat-malachi": { municipalityId: "kiryat-malachi", recipients: 1327, ratePer1000: 47.96, recipientPercent: 4.80, gapFromAverage: 12.40, gapPercentage: 34.9, ranking: 54, averageBenefit: 4552 },
  "sachnin": { municipalityId: "sachnin", recipients: 1678, ratePer1000: 47.24, recipientPercent: 4.72, gapFromAverage: 11.68, gapPercentage: 32.8, ranking: 58, averageBenefit: 4498 },
  "tira": { municipalityId: "tira", recipients: 1263, ratePer1000: 47.07, recipientPercent: 4.71, gapFromAverage: 11.51, gapPercentage: 32.4, ranking: 59, averageBenefit: 4322 },
  "kiryat-bialik": { municipalityId: "kiryat-bialik", recipients: 2134, ratePer1000: 47.05, recipientPercent: 4.70, gapFromAverage: 11.49, gapPercentage: 32.3, ranking: 60, averageBenefit: 4321 },
  "ofakim": { municipalityId: "ofakim", recipients: 1874, ratePer1000: 46.64, recipientPercent: 4.66, gapFromAverage: 11.08, gapPercentage: 31.2, ranking: 62, averageBenefit: 4658 },
  "or-yehuda": { municipalityId: "or-yehuda", recipients: 1796, ratePer1000: 45.60, recipientPercent: 4.56, gapFromAverage: 10.04, gapPercentage: 28.3, ranking: 66, averageBenefit: 4412 },
  "bat-yam": { municipalityId: "bat-yam", recipients: 5670, ratePer1000: 45.51, recipientPercent: 4.55, gapFromAverage: 9.95, gapPercentage: 28.0, ranking: 67, averageBenefit: 4290 },
  "ashkelon": { municipalityId: "ashkelon", recipients: 7269, ratePer1000: 45.17, recipientPercent: 4.52, gapFromAverage: 9.61, gapPercentage: 27.0, ranking: 70, averageBenefit: 4361 },
  "kiryat-gat": { municipalityId: "kiryat-gat", recipients: 3166, ratePer1000: 45.09, recipientPercent: 4.51, gapFromAverage: 9.53, gapPercentage: 26.8, ranking: 71, averageBenefit: 4659 },
  "ramle": { municipalityId: "ramle", recipients: 3708, ratePer1000: 45.02, recipientPercent: 4.50, gapFromAverage: 9.46, gapPercentage: 26.6, ranking: 72, averageBenefit: 4387 },
  "sderot": { municipalityId: "sderot", recipients: 1521, ratePer1000: 42.49, recipientPercent: 4.25, gapFromAverage: 6.93, gapPercentage: 19.5, ranking: 87, averageBenefit: 4374 },
  "umm-al-fahm": { municipalityId: "umm-al-fahm", recipients: 2511, ratePer1000: 41.41, recipientPercent: 4.14, gapFromAverage: 5.85, gapPercentage: 16.5, ranking: 95, averageBenefit: 4712 },
  "holon": { municipalityId: "holon", recipients: 7517, ratePer1000: 40.04, recipientPercent: 4.00, gapFromAverage: 4.48, gapPercentage: 12.6, ranking: 100, averageBenefit: 4317 },
  "netanya": { municipalityId: "netanya", recipients: 8785, ratePer1000: 38.84, recipientPercent: 3.88, gapFromAverage: 3.28, gapPercentage: 9.2, ranking: 110, averageBenefit: 4413 },
  "lod": { municipalityId: "lod", recipients: 3416, ratePer1000: 38.28, recipientPercent: 3.83, gapFromAverage: 2.72, gapPercentage: 7.7, ranking: 114, averageBenefit: 4538 },
  "ashdod": { municipalityId: "ashdod", recipients: 8276, ratePer1000: 36.41, recipientPercent: 3.64, gapFromAverage: 0.85, gapPercentage: 2.4, ranking: 125, averageBenefit: 4532 },
  "kfar-saba": { municipalityId: "kfar-saba", recipients: 3471, ratePer1000: 35.00, recipientPercent: 3.50, gapFromAverage: -0.56, gapPercentage: -1.6, ranking: 131, averageBenefit: 4210 },
  "petah-tikva": { municipalityId: "petah-tikva", recipients: 8759, ratePer1000: 34.22, recipientPercent: 3.42, gapFromAverage: -1.34, gapPercentage: -3.8, ranking: 136, averageBenefit: 4311 },
  "rehovot": { municipalityId: "rehovot", recipients: 5018, ratePer1000: 33.59, recipientPercent: 3.36, gapFromAverage: -1.97, gapPercentage: -5.5, ranking: 138, averageBenefit: 4430 },
  "tel-aviv": { municipalityId: "tel-aviv", recipients: 15156, ratePer1000: 32.83, recipientPercent: 3.28, gapFromAverage: -2.73, gapPercentage: -7.7, ranking: 139, averageBenefit: 4249 },
  "harish": { municipalityId: "harish", recipients: 1241, ratePer1000: 32.74, recipientPercent: 3.27, gapFromAverage: -2.82, gapPercentage: -7.9, ranking: 140, averageBenefit: 4964 },
  "rishon": { municipalityId: "rishon", recipients: 8263, ratePer1000: 32.51, recipientPercent: 3.25, gapFromAverage: -3.05, gapPercentage: -8.6, ranking: 142, averageBenefit: 4254 },
  "ramat-gan": { municipalityId: "ramat-gan", recipients: 5092, ratePer1000: 31.39, recipientPercent: 3.14, gapFromAverage: -4.17, gapPercentage: -11.7, ranking: 148, averageBenefit: 4247 },
  "jerusalem": { municipalityId: "jerusalem", recipients: 28261, ratePer1000: 27.85, recipientPercent: 2.78, gapFromAverage: -7.71, gapPercentage: -21.7, ranking: 170, averageBenefit: 4548 },
  "herzliya": { municipalityId: "herzliya", recipients: 2887, ratePer1000: 27.72, recipientPercent: 2.77, gapFromAverage: -7.84, gapPercentage: -22.1, ranking: 171, averageBenefit: 4243 },
  "hod-hasharon": { municipalityId: "hod-hasharon", recipients: 1694, ratePer1000: 26.72, recipientPercent: 2.67, gapFromAverage: -8.84, gapPercentage: -24.9, ranking: 176, averageBenefit: 4229 },
  "beit-shemesh": { municipalityId: "beit-shemesh", recipients: 4512, ratePer1000: 25.67, recipientPercent: 2.57, gapFromAverage: -9.89, gapPercentage: -27.8, ranking: 180, averageBenefit: 5149 },
  "raanana": { municipalityId: "raanana", recipients: 2084, ratePer1000: 25.16, recipientPercent: 2.52, gapFromAverage: -10.40, gapPercentage: -29.3, ranking: 184, averageBenefit: 4230 },
  "beitar-illit": { municipalityId: "beitar-illit", recipients: 1741, ratePer1000: 24.50, recipientPercent: 2.45, gapFromAverage: -11.06, gapPercentage: -31.1, ranking: 188, averageBenefit: 5135 },
  "givatayim": { municipalityId: "givatayim", recipients: 1367, ratePer1000: 23.85, recipientPercent: 2.39, gapFromAverage: -11.71, gapPercentage: -32.9, ranking: 195, averageBenefit: 4220 },
  "elad": { municipalityId: "elad", recipients: 1166, ratePer1000: 23.52, recipientPercent: 2.35, gapFromAverage: -12.04, gapPercentage: -33.9, ranking: 199, averageBenefit: 4958 },
  "kiryat-ono": { municipalityId: "kiryat-ono", recipients: 973, ratePer1000: 22.96, recipientPercent: 2.30, gapFromAverage: -12.60, gapPercentage: -35.4, ranking: 204, averageBenefit: 4268 },
  "ramat-hasharon": { municipalityId: "ramat-hasharon", recipients: 1070, ratePer1000: 23.38, recipientPercent: 2.34, gapFromAverage: -12.18, gapPercentage: -34.3, ranking: 201, averageBenefit: 4235 },
  "bnei-brak": { municipalityId: "bnei-brak", recipients: 6639, ratePer1000: 29.69, recipientPercent: 2.97, gapFromAverage: -5.87, gapPercentage: -16.5, ranking: 164, averageBenefit: 4828 },
  "modiin-illit": { municipalityId: "modiin-illit", recipients: 0, ratePer1000: 0, recipientPercent: 0, gapFromAverage: 0, gapPercentage: 0, ranking: 275, averageBenefit: 0 },
  "modiin": { municipalityId: "modiin", recipients: 0, ratePer1000: 0, recipientPercent: 0, gapFromAverage: 0, gapPercentage: 0, ranking: 275, averageBenefit: 0 },
  "karmiel": { municipalityId: "karmiel", recipients: 2046, ratePer1000: 42.83, recipientPercent: 4.28, gapFromAverage: 7.27, gapPercentage: 20.5, ranking: 85, averageBenefit: 4359 },
  "nahariya": { municipalityId: "nahariya", recipients: 2668, ratePer1000: 39.41, recipientPercent: 3.94, gapFromAverage: 3.85, gapPercentage: 10.8, ranking: 107, averageBenefit: 4299 },
};

// Income Support (הבטחת הכנסה) - normalized to 18-64 population - FROM PAGE 5
const incomeSupportData: Record<string, BenefitData> = {
  "sawa": { municipalityId: "sawa", recipients: 69, ratePer1000: 72.86, recipientPercent: 7.29, gapFromAverage: 62.42, gapPercentage: 597.7, ranking: 1, averageBenefit: 2485 },
  "kusaife": { municipalityId: "kusaife", recipients: 707, ratePer1000: 67.82, recipientPercent: 6.78, gapFromAverage: 57.38, gapPercentage: 549.4, ranking: 2, averageBenefit: 2564 },
  "abu-talul": { municipalityId: "abu-talul", recipients: 79, ratePer1000: 67.23, recipientPercent: 6.72, gapFromAverage: 56.79, gapPercentage: 543.8, ranking: 3, averageBenefit: 2626 },
  "bir-hadaj": { municipalityId: "bir-hadaj", recipients: 108, ratePer1000: 63.16, recipientPercent: 6.32, gapFromAverage: 52.72, gapPercentage: 504.8, ranking: 4, averageBenefit: 2867 },
  "arara-negev": { municipalityId: "arara-negev", recipients: 641, ratePer1000: 60.74, recipientPercent: 6.07, gapFromAverage: 50.30, gapPercentage: 481.6, ranking: 5, averageBenefit: 2440 },
  "kasir-a-sir": { municipalityId: "kasir-a-sir", recipients: 68, ratePer1000: 60.55, recipientPercent: 6.06, gapFromAverage: 50.11, gapPercentage: 479.8, ranking: 6, averageBenefit: 2578 },
  "tel-sheva": { municipalityId: "tel-sheva", recipients: 679, ratePer1000: 57.22, recipientPercent: 5.72, gapFromAverage: 46.78, gapPercentage: 447.9, ranking: 7, averageBenefit: 2568 },
  "umm-batin": { municipalityId: "umm-batin", recipients: 103, ratePer1000: 56.28, recipientPercent: 5.63, gapFromAverage: 45.84, gapPercentage: 439.0, ranking: 8, averageBenefit: 2669 },
  "lakiya": { municipalityId: "lakiya", recipients: 395, ratePer1000: 44.26, recipientPercent: 4.43, gapFromAverage: 33.82, gapPercentage: 323.8, ranking: 9, averageBenefit: 2523 },
  "segev-shalom": { municipalityId: "segev-shalom", recipients: 280, ratePer1000: 42.85, recipientPercent: 4.29, gapFromAverage: 32.41, gapPercentage: 310.4, ranking: 10, averageBenefit: 2510 },
  "rahat": { municipalityId: "rahat", recipients: 1585, ratePer1000: 39.79, recipientPercent: 3.98, gapFromAverage: 29.35, gapPercentage: 281.1, ranking: 11, averageBenefit: 2527 },
  "hura": { municipalityId: "hura", recipients: 452, ratePer1000: 38.43, recipientPercent: 3.84, gapFromAverage: 27.99, gapPercentage: 268.1, ranking: 12, averageBenefit: 2619 },
  "jisr-az-zarqa": { municipalityId: "jisr-az-zarqa", recipients: 353, ratePer1000: 38.01, recipientPercent: 3.80, gapFromAverage: 27.57, gapPercentage: 264.1, ranking: 13, averageBenefit: 2412 },
  "tiberias": { municipalityId: "tiberias", recipients: 797, ratePer1000: 28.43, recipientPercent: 2.84, gapFromAverage: 17.99, gapPercentage: 172.4, ranking: 16, averageBenefit: 2387 },
  "lod": { municipalityId: "lod", recipients: 1124, ratePer1000: 24.31, recipientPercent: 2.43, gapFromAverage: 13.87, gapPercentage: 132.8, ranking: 18, averageBenefit: 2408 },
  "ramle": { municipalityId: "ramle", recipients: 1023, ratePer1000: 22.28, recipientPercent: 2.23, gapFromAverage: 11.84, gapPercentage: 113.4, ranking: 20, averageBenefit: 2356 },
  "dimona": { municipalityId: "dimona", recipients: 398, ratePer1000: 16.53, recipientPercent: 1.65, gapFromAverage: 6.09, gapPercentage: 58.3, ranking: 31, averageBenefit: 2325 },
  "ofakim": { municipalityId: "ofakim", recipients: 322, ratePer1000: 15.15, recipientPercent: 1.52, gapFromAverage: 4.71, gapPercentage: 45.1, ranking: 35, averageBenefit: 2349 },
  "acre": { municipalityId: "acre", recipients: 427, ratePer1000: 13.54, recipientPercent: 1.35, gapFromAverage: 3.10, gapPercentage: 29.7, ranking: 42, averageBenefit: 2338 },
  "kiryat-malachi": { municipalityId: "kiryat-malachi", recipients: 348, ratePer1000: 23.85, recipientPercent: 2.39, gapFromAverage: 13.41, gapPercentage: 128.5, ranking: 19, averageBenefit: 2451 },
  "beer-sheva": { municipalityId: "beer-sheva", recipients: 1569, ratePer1000: 12.77, recipientPercent: 1.28, gapFromAverage: 2.33, gapPercentage: 22.3, ranking: 46, averageBenefit: 2330 },
  "ashkelon": { municipalityId: "ashkelon", recipients: 920, ratePer1000: 10.39, recipientPercent: 1.04, gapFromAverage: -0.05, gapPercentage: -0.5, ranking: 74, averageBenefit: 2319 },
  "bat-yam": { municipalityId: "bat-yam", recipients: 671, ratePer1000: 9.79, recipientPercent: 0.98, gapFromAverage: -0.65, gapPercentage: -6.2, ranking: 84, averageBenefit: 2308 },
  "ashdod": { municipalityId: "ashdod", recipients: 998, ratePer1000: 8.24, recipientPercent: 0.82, gapFromAverage: -2.20, gapPercentage: -21.1, ranking: 107, averageBenefit: 2340 },
  "haifa": { municipalityId: "haifa", recipients: 1031, ratePer1000: 6.64, recipientPercent: 0.66, gapFromAverage: -3.80, gapPercentage: -36.4, ranking: 135, averageBenefit: 2313 },
  "tel-aviv": { municipalityId: "tel-aviv", recipients: 1509, ratePer1000: 5.26, recipientPercent: 0.53, gapFromAverage: -5.18, gapPercentage: -49.6, ranking: 167, averageBenefit: 2338 },
  "jerusalem": { municipalityId: "jerusalem", recipients: 3970, ratePer1000: 7.09, recipientPercent: 0.71, gapFromAverage: -3.35, gapPercentage: -32.1, ranking: 124, averageBenefit: 2337 },
  "netanya": { municipalityId: "netanya", recipients: 876, ratePer1000: 7.27, recipientPercent: 0.73, gapFromAverage: -3.17, gapPercentage: -30.4, ranking: 120, averageBenefit: 2339 },
  "petah-tikva": { municipalityId: "petah-tikva", recipients: 686, ratePer1000: 4.95, recipientPercent: 0.50, gapFromAverage: -5.49, gapPercentage: -52.6, ranking: 175, averageBenefit: 2314 },
  "holon": { municipalityId: "holon", recipients: 540, ratePer1000: 5.27, recipientPercent: 0.53, gapFromAverage: -5.17, gapPercentage: -49.5, ranking: 166, averageBenefit: 2299 },
  "rishon": { municipalityId: "rishon", recipients: 620, ratePer1000: 4.29, recipientPercent: 0.43, gapFromAverage: -6.15, gapPercentage: -58.9, ranking: 189, averageBenefit: 2297 },
  "bnei-brak": { municipalityId: "bnei-brak", recipients: 568, ratePer1000: 5.79, recipientPercent: 0.58, gapFromAverage: -4.65, gapPercentage: -44.5, ranking: 155, averageBenefit: 2437 },
  "beit-shemesh": { municipalityId: "beit-shemesh", recipients: 631, ratePer1000: 8.20, recipientPercent: 0.82, gapFromAverage: -2.24, gapPercentage: -21.5, ranking: 108, averageBenefit: 2461 },
  "beitar-illit": { municipalityId: "beitar-illit", recipients: 366, ratePer1000: 10.16, recipientPercent: 1.02, gapFromAverage: -0.28, gapPercentage: -2.7, ranking: 76, averageBenefit: 2491 },
  "elad": { municipalityId: "elad", recipients: 262, ratePer1000: 11.09, recipientPercent: 1.11, gapFromAverage: 0.65, gapPercentage: 6.2, ranking: 65, averageBenefit: 2478 },
  "modiin-illit": { municipalityId: "modiin-illit", recipients: 568, ratePer1000: 13.27, recipientPercent: 1.33, gapFromAverage: 2.83, gapPercentage: 27.1, ranking: 44, averageBenefit: 2516 },
  "sderot": { municipalityId: "sderot", recipients: 216, ratePer1000: 10.45, recipientPercent: 1.05, gapFromAverage: 0.01, gapPercentage: 0.1, ranking: 75, averageBenefit: 2317 },
  "safed": { municipalityId: "safed", recipients: 257, ratePer1000: 13.22, recipientPercent: 1.32, gapFromAverage: 2.78, gapPercentage: 26.6, ranking: 45, averageBenefit: 2410 },
  "nazareth": { municipalityId: "nazareth", recipients: 559, ratePer1000: 11.25, recipientPercent: 1.13, gapFromAverage: 0.81, gapPercentage: 7.8, ranking: 63, averageBenefit: 2378 },
  "netivot": { municipalityId: "netivot", recipients: 360, ratePer1000: 12.66, recipientPercent: 1.27, gapFromAverage: 2.22, gapPercentage: 21.3, ranking: 49, averageBenefit: 2415 },
  "kiryat-gat": { municipalityId: "kiryat-gat", recipients: 391, ratePer1000: 10.74, recipientPercent: 1.07, gapFromAverage: 0.30, gapPercentage: 2.9, ranking: 71, averageBenefit: 2351 },
};

// Unemployment (דמי אבטלה) - normalized to 18-64 population - FROM PAGE 6
const unemploymentData: Record<string, BenefitData> = {
  "salama": { municipalityId: "salama", recipients: 73, ratePer1000: 33.78, recipientPercent: 3.38, gapFromAverage: 18.49, gapPercentage: 121.0, ranking: 1, averageBenefit: 4611 },
  "kiryat-shmona": { municipalityId: "kiryat-shmona", recipients: 458, ratePer1000: 30.69, recipientPercent: 3.07, gapFromAverage: 15.40, gapPercentage: 100.8, ranking: 2, averageBenefit: 4422 },
  "deir-hanna": { municipalityId: "deir-hanna", recipients: 194, ratePer1000: 26.80, recipientPercent: 2.68, gapFromAverage: 11.51, gapPercentage: 75.3, ranking: 3, averageBenefit: 4288 },
  "hatzor-hagalilit": { municipalityId: "hatzor-hagalilit", recipients: 154, ratePer1000: 25.56, recipientPercent: 2.56, gapFromAverage: 10.27, gapPercentage: 67.2, ranking: 4, averageBenefit: 4587 },
  "tubazangaria": { municipalityId: "tubazangaria", recipients: 106, ratePer1000: 25.09, recipientPercent: 2.51, gapFromAverage: 9.80, gapPercentage: 64.2, ranking: 5, averageBenefit: 4752 },
  "harish": { municipalityId: "harish", recipients: 430, ratePer1000: 23.60, recipientPercent: 2.36, gapFromAverage: 8.31, gapPercentage: 54.4, ranking: 9, averageBenefit: 5158 },
  "katsrin": { municipalityId: "katsrin", recipients: 111, ratePer1000: 24.03, recipientPercent: 2.40, gapFromAverage: 8.74, gapPercentage: 57.2, ranking: 7, averageBenefit: 4789 },
  "tiberias": { municipalityId: "tiberias", recipients: 634, ratePer1000: 22.62, recipientPercent: 2.26, gapFromAverage: 7.33, gapPercentage: 48.0, ranking: 13, averageBenefit: 4543 },
  "or-akiva": { municipalityId: "or-akiva", recipients: 301, ratePer1000: 22.49, recipientPercent: 2.25, gapFromAverage: 7.20, gapPercentage: 47.1, ranking: 15, averageBenefit: 5354 },
  "beit-shean": { municipalityId: "beit-shean", recipients: 278, ratePer1000: 22.40, recipientPercent: 2.24, gapFromAverage: 7.11, gapPercentage: 46.5, ranking: 16, averageBenefit: 4703 },
  "kiryat-gat": { municipalityId: "kiryat-gat", recipients: 806, ratePer1000: 22.14, recipientPercent: 2.21, gapFromAverage: 6.85, gapPercentage: 44.9, ranking: 17, averageBenefit: 4829 },
  "nof-hagalil": { municipalityId: "nof-hagalil", recipients: 571, ratePer1000: 21.78, recipientPercent: 2.18, gapFromAverage: 6.49, gapPercentage: 42.5, ranking: 19, averageBenefit: 4570 },
  "shlomi": { municipalityId: "shlomi", recipients: 106, ratePer1000: 21.52, recipientPercent: 2.15, gapFromAverage: 6.23, gapPercentage: 40.8, ranking: 21, averageBenefit: 4644 },
  "maghar": { municipalityId: "maghar", recipients: 336, ratePer1000: 21.25, recipientPercent: 2.13, gapFromAverage: 5.96, gapPercentage: 39.0, ranking: 23, averageBenefit: 3950 },
  "kiryat-yam": { municipalityId: "kiryat-yam", recipients: 483, ratePer1000: 21.23, recipientPercent: 2.12, gapFromAverage: 5.94, gapPercentage: 38.9, ranking: 24, averageBenefit: 4610 },
  "sderot": { municipalityId: "sderot", recipients: 436, ratePer1000: 21.09, recipientPercent: 2.11, gapFromAverage: 5.80, gapPercentage: 38.0, ranking: 26, averageBenefit: 4957 },
  "jdeide-maker": { municipalityId: "jdeide-maker", recipients: 288, ratePer1000: 20.94, recipientPercent: 2.09, gapFromAverage: 5.65, gapPercentage: 37.0, ranking: 27, averageBenefit: 4034 },
  "tirat-carmel": { municipalityId: "tirat-carmel", recipients: 357, ratePer1000: 20.68, recipientPercent: 2.07, gapFromAverage: 5.39, gapPercentage: 35.3, ranking: 30, averageBenefit: 5341 },
  "migdal-haemek": { municipalityId: "migdal-haemek", recipients: 326, ratePer1000: 20.65, recipientPercent: 2.07, gapFromAverage: 5.36, gapPercentage: 35.1, ranking: 31, averageBenefit: 4825 },
  "acre": { municipalityId: "acre", recipients: 646, ratePer1000: 20.48, recipientPercent: 2.05, gapFromAverage: 5.19, gapPercentage: 34.0, ranking: 32, averageBenefit: 4543 },
  "kiryat-bialik": { municipalityId: "kiryat-bialik", recipients: 498, ratePer1000: 20.43, recipientPercent: 2.04, gapFromAverage: 5.14, gapPercentage: 33.6, ranking: 33, averageBenefit: 5073 },
  "afula": { municipalityId: "afula", recipients: 705, ratePer1000: 20.16, recipientPercent: 2.02, gapFromAverage: 4.87, gapPercentage: 31.9, ranking: 35, averageBenefit: 4634 },
  "hadera": { municipalityId: "hadera", recipients: 1123, ratePer1000: 19.57, recipientPercent: 1.96, gapFromAverage: 4.28, gapPercentage: 28.0, ranking: 38, averageBenefit: 5359 },
  "arad": { municipalityId: "arad", recipients: 321, ratePer1000: 19.55, recipientPercent: 1.96, gapFromAverage: 4.26, gapPercentage: 27.9, ranking: 39, averageBenefit: 4648 },
  "pardes-hanna": { municipalityId: "pardes-hanna", recipients: 477, ratePer1000: 19.14, recipientPercent: 1.91, gapFromAverage: 3.85, gapPercentage: 25.2, ranking: 43, averageBenefit: 5910 },
  "karmiel": { municipalityId: "karmiel", recipients: 503, ratePer1000: 19.14, recipientPercent: 1.91, gapFromAverage: 3.85, gapPercentage: 25.2, ranking: 44, averageBenefit: 4714 },
  "dimona": { municipalityId: "dimona", recipients: 453, ratePer1000: 18.81, recipientPercent: 1.88, gapFromAverage: 3.52, gapPercentage: 23.1, ranking: 45, averageBenefit: 4111 },
  "eilat": { municipalityId: "eilat", recipients: 680, ratePer1000: 18.58, recipientPercent: 1.86, gapFromAverage: 3.29, gapPercentage: 21.6, ranking: 47, averageBenefit: 5071 },
  "sachnin": { municipalityId: "sachnin", recipients: 414, ratePer1000: 18.58, recipientPercent: 1.86, gapFromAverage: 3.29, gapPercentage: 21.5, ranking: 48, averageBenefit: 4046 },
  "netanya": { municipalityId: "netanya", recipients: 2237, ratePer1000: 18.57, recipientPercent: 1.86, gapFromAverage: 3.28, gapPercentage: 21.5, ranking: 49, averageBenefit: 5362 },
  "kiryat-malachi": { municipalityId: "kiryat-malachi", recipients: 271, ratePer1000: 18.56, recipientPercent: 1.86, gapFromAverage: 3.27, gapPercentage: 21.4, ranking: 50, averageBenefit: 4425 },
  "ashkelon": { municipalityId: "ashkelon", recipients: 1610, ratePer1000: 18.19, recipientPercent: 1.82, gapFromAverage: 2.90, gapPercentage: 19.0, ranking: 51, averageBenefit: 4898 },
  "nesher": { municipalityId: "nesher", recipients: 232, ratePer1000: 18.17, recipientPercent: 1.82, gapFromAverage: 2.88, gapPercentage: 18.8, ranking: 53, averageBenefit: 5198 },
  "ashdod": { municipalityId: "ashdod", recipients: 2199, ratePer1000: 18.15, recipientPercent: 1.82, gapFromAverage: 2.86, gapPercentage: 18.7, ranking: 54, averageBenefit: 4891 },
  "maalot-tarshiha": { municipalityId: "maalot-tarshiha", recipients: 244, ratePer1000: 18.14, recipientPercent: 1.81, gapFromAverage: 2.85, gapPercentage: 18.7, ranking: 55, averageBenefit: 4717 },
  "tel-aviv": { municipalityId: "tel-aviv", recipients: 5151, ratePer1000: 17.95, recipientPercent: 1.80, gapFromAverage: 2.66, gapPercentage: 17.5, ranking: 58, averageBenefit: 6524 },
  "yeruham": { municipalityId: "yeruham", recipients: 119, ratePer1000: 17.82, recipientPercent: 1.78, gapFromAverage: 2.53, gapPercentage: 16.6, ranking: 59, averageBenefit: 4993 },
  "kiryat-ata": { municipalityId: "kiryat-ata", recipients: 605, ratePer1000: 17.82, recipientPercent: 1.78, gapFromAverage: 2.53, gapPercentage: 16.6, ranking: 60, averageBenefit: 4810 },
  "nahariya": { municipalityId: "nahariya", recipients: 689, ratePer1000: 17.80, recipientPercent: 1.78, gapFromAverage: 2.51, gapPercentage: 16.4, ranking: 61, averageBenefit: 4745 },
  "kiryat-motzkin": { municipalityId: "kiryat-motzkin", recipients: 478, ratePer1000: 17.72, recipientPercent: 1.77, gapFromAverage: 2.43, gapPercentage: 15.9, ranking: 62, averageBenefit: 5274 },
  "rosh-haayin": { municipalityId: "rosh-haayin", recipients: 729, ratePer1000: 17.72, recipientPercent: 1.77, gapFromAverage: 2.43, gapPercentage: 15.9, ranking: 63, averageBenefit: 5818 },
  "ramat-gan": { municipalityId: "ramat-gan", recipients: 1695, ratePer1000: 17.53, recipientPercent: 1.75, gapFromAverage: 2.24, gapPercentage: 14.7, ranking: 70, averageBenefit: 6453 },
  "holon": { municipalityId: "holon", recipients: 1797, ratePer1000: 17.52, recipientPercent: 1.75, gapFromAverage: 2.23, gapPercentage: 14.6, ranking: 71, averageBenefit: 5383 },
  "givatayim": { municipalityId: "givatayim", recipients: 593, ratePer1000: 17.51, recipientPercent: 1.75, gapFromAverage: 2.22, gapPercentage: 14.6, ranking: 72, averageBenefit: 6686 },
  "hod-hasharon": { municipalityId: "hod-hasharon", recipients: 607, ratePer1000: 17.33, recipientPercent: 1.73, gapFromAverage: 2.04, gapPercentage: 13.4, ranking: 76, averageBenefit: 6996 },
  "haifa": { municipalityId: "haifa", recipients: 2671, ratePer1000: 17.19, recipientPercent: 1.72, gapFromAverage: 1.90, gapPercentage: 12.5, ranking: 82, averageBenefit: 5179 },
  "yavne": { municipalityId: "yavne", recipients: 509, ratePer1000: 17.15, recipientPercent: 1.72, gapFromAverage: 1.86, gapPercentage: 12.2, ranking: 85, averageBenefit: 5962 },
  "bat-yam": { municipalityId: "bat-yam", recipients: 1174, ratePer1000: 17.12, recipientPercent: 1.71, gapFromAverage: 1.83, gapPercentage: 12.0, ranking: 86, averageBenefit: 5190 },
  "herzliya": { municipalityId: "herzliya", recipients: 935, ratePer1000: 16.59, recipientPercent: 1.66, gapFromAverage: 1.30, gapPercentage: 8.5, ranking: 98, averageBenefit: 6796 },
  "rehovot": { municipalityId: "rehovot", recipients: 1238, ratePer1000: 15.74, recipientPercent: 1.57, gapFromAverage: 0.45, gapPercentage: 2.9, ranking: 117, averageBenefit: 5802 },
  "raanana": { municipalityId: "raanana", recipients: 687, ratePer1000: 15.56, recipientPercent: 1.56, gapFromAverage: 0.27, gapPercentage: 1.8, ranking: 123, averageBenefit: 6777 },
  "kfar-saba": { municipalityId: "kfar-saba", recipients: 832, ratePer1000: 15.90, recipientPercent: 1.59, gapFromAverage: 0.61, gapPercentage: 4.0, ranking: 113, averageBenefit: 6487 },
  "kiryat-ono": { municipalityId: "kiryat-ono", recipients: 350, ratePer1000: 15.28, recipientPercent: 1.53, gapFromAverage: -0.01, gapPercentage: -0.0, ranking: 133, averageBenefit: 6849 },
  "ramle": { municipalityId: "ramle", recipients: 693, ratePer1000: 15.09, recipientPercent: 1.51, gapFromAverage: -0.20, gapPercentage: -1.3, ranking: 137, averageBenefit: 4874 },
  "lod": { municipalityId: "lod", recipients: 684, ratePer1000: 14.79, recipientPercent: 1.48, gapFromAverage: -0.50, gapPercentage: -3.3, ranking: 145, averageBenefit: 4831 },
  "petah-tikva": { municipalityId: "petah-tikva", recipients: 2050, ratePer1000: 14.80, recipientPercent: 1.48, gapFromAverage: -0.49, gapPercentage: -3.2, ranking: 144, averageBenefit: 5693 },
  "modiin": { municipalityId: "modiin", recipients: 860, ratePer1000: 14.81, recipientPercent: 1.48, gapFromAverage: -0.48, gapPercentage: -3.1, ranking: 143, averageBenefit: 6634 },
  "rishon": { municipalityId: "rishon", recipients: 2346, ratePer1000: 16.23, recipientPercent: 1.62, gapFromAverage: 0.94, gapPercentage: 6.2, ranking: 105, averageBenefit: 5718 },
  "netivot": { municipalityId: "netivot", recipients: 451, ratePer1000: 15.86, recipientPercent: 1.59, gapFromAverage: 0.57, gapPercentage: 3.7, ranking: 115, averageBenefit: 4618 },
  "ofakim": { municipalityId: "ofakim", recipients: 360, ratePer1000: 16.94, recipientPercent: 1.69, gapFromAverage: 1.65, gapPercentage: 10.8, ranking: 93, averageBenefit: 4570 },
  "beer-sheva": { municipalityId: "beer-sheva", recipients: 2028, ratePer1000: 16.51, recipientPercent: 1.65, gapFromAverage: 1.22, gapPercentage: 8.0, ranking: 101, averageBenefit: 4719 },
  "jerusalem": { municipalityId: "jerusalem", recipients: 7520, ratePer1000: 13.43, recipientPercent: 1.34, gapFromAverage: -1.86, gapPercentage: -12.2, ranking: 157, averageBenefit: 4753 },
  "beit-shemesh": { municipalityId: "beit-shemesh", recipients: 888, ratePer1000: 11.54, recipientPercent: 1.15, gapFromAverage: -3.75, gapPercentage: -24.5, ranking: 219, averageBenefit: 4849 },
  "beitar-illit": { municipalityId: "beitar-illit", recipients: 230, ratePer1000: 6.39, recipientPercent: 0.64, gapFromAverage: -8.90, gapPercentage: -58.2, ranking: 274, averageBenefit: 4379 },
  "bnei-brak": { municipalityId: "bnei-brak", recipients: 709, ratePer1000: 7.22, recipientPercent: 0.72, gapFromAverage: -8.07, gapPercentage: -52.8, ranking: 262, averageBenefit: 4676 },
  "elad": { municipalityId: "elad", recipients: 261, ratePer1000: 11.06, recipientPercent: 1.11, gapFromAverage: -4.23, gapPercentage: -27.7, ranking: 228, averageBenefit: 4526 },
  "modiin-illit": { municipalityId: "modiin-illit", recipients: 253, ratePer1000: 5.91, recipientPercent: 0.59, gapFromAverage: -9.38, gapPercentage: -61.3, ranking: 276, averageBenefit: 4417 },
  "safed": { municipalityId: "safed", recipients: 298, ratePer1000: 15.33, recipientPercent: 1.53, gapFromAverage: 0.04, gapPercentage: 0.3, ranking: 129, averageBenefit: 3965 },
  "nazareth": { municipalityId: "nazareth", recipients: 699, ratePer1000: 14.06, recipientPercent: 1.41, gapFromAverage: -1.23, gapPercentage: -8.0, ranking: 160, averageBenefit: 4602 },
};

// Disabled Child (ילד נכה) - normalized to 0-17 population - FROM PAGE 8
const disabledChildData: Record<string, BenefitData> = {
  "sderot": { municipalityId: "sderot", recipients: 1258, ratePer1000: 107.09, recipientPercent: 10.71, gapFromAverage: 58.59, gapPercentage: 120.8, ranking: 1, averageBenefit: 2452 },
  "kiryat-shmona": { municipalityId: "kiryat-shmona", recipients: 503, ratePer1000: 88.45, recipientPercent: 8.85, gapFromAverage: 39.95, gapPercentage: 82.4, ranking: 2, averageBenefit: 2435 },
  "tiberias": { municipalityId: "tiberias", recipients: 1398, ratePer1000: 82.39, recipientPercent: 8.24, gapFromAverage: 33.89, gapPercentage: 69.9, ranking: 3, averageBenefit: 2374 },
  "bat-yam": { municipalityId: "bat-yam", recipients: 1952, ratePer1000: 79.29, recipientPercent: 7.93, gapFromAverage: 30.79, gapPercentage: 63.5, ranking: 4, averageBenefit: 2845 },
  "tirat-carmel": { municipalityId: "tirat-carmel", recipients: 697, ratePer1000: 78.28, recipientPercent: 7.83, gapFromAverage: 29.78, gapPercentage: 61.4, ranking: 5, averageBenefit: 3082 },
  "holon": { municipalityId: "holon", recipients: 3539, ratePer1000: 75.89, recipientPercent: 7.59, gapFromAverage: 27.39, gapPercentage: 56.5, ranking: 6, averageBenefit: 3525 },
  "ramle": { municipalityId: "ramle", recipients: 1872, ratePer1000: 73.32, recipientPercent: 7.33, gapFromAverage: 24.82, gapPercentage: 51.2, ranking: 7, averageBenefit: 2932 },
  "kiryat-gat": { municipalityId: "kiryat-gat", recipients: 1810, ratePer1000: 72.71, recipientPercent: 7.27, gapFromAverage: 24.21, gapPercentage: 49.9, ranking: 8, averageBenefit: 2819 },
  "nesher": { municipalityId: "nesher", recipients: 329, ratePer1000: 72.51, recipientPercent: 7.25, gapFromAverage: 24.01, gapPercentage: 49.5, ranking: 9, averageBenefit: 3087 },
  "afula": { municipalityId: "afula", recipients: 1456, ratePer1000: 71.86, recipientPercent: 7.19, gapFromAverage: 23.36, gapPercentage: 48.2, ranking: 10, averageBenefit: 2437 },
  "azor": { municipalityId: "azor", recipients: 257, ratePer1000: 71.41, recipientPercent: 7.14, gapFromAverage: 22.91, gapPercentage: 47.2, ranking: 11, averageBenefit: 3300 },
  "hatzor-hagalilit": { municipalityId: "hatzor-hagalilit", recipients: 262, ratePer1000: 71.35, recipientPercent: 7.14, gapFromAverage: 22.85, gapPercentage: 47.1, ranking: 12, averageBenefit: 2315 },
  "beer-sheva": { municipalityId: "beer-sheva", recipients: 3890, ratePer1000: 70.82, recipientPercent: 7.08, gapFromAverage: 22.32, gapPercentage: 46.0, ranking: 13, averageBenefit: 3319 },
  "or-yehuda": { municipalityId: "or-yehuda", recipients: 799, ratePer1000: 70.17, recipientPercent: 7.02, gapFromAverage: 21.67, gapPercentage: 44.7, ranking: 14, averageBenefit: 3363 },
  "nof-hagalil": { municipalityId: "nof-hagalil", recipients: 885, ratePer1000: 69.47, recipientPercent: 6.95, gapFromAverage: 20.97, gapPercentage: 43.3, ranking: 15, averageBenefit: 3352 },
  "katsrin": { municipalityId: "katsrin", recipients: 160, ratePer1000: 68.88, recipientPercent: 6.89, gapFromAverage: 20.38, gapPercentage: 42.0, ranking: 16, averageBenefit: 2608 },
  "eilat": { municipalityId: "eilat", recipients: 931, ratePer1000: 68.25, recipientPercent: 6.83, gapFromAverage: 19.75, gapPercentage: 40.7, ranking: 17, averageBenefit: 3034 },
  "ashkelon": { municipalityId: "ashkelon", recipients: 3104, ratePer1000: 68.15, recipientPercent: 6.82, gapFromAverage: 19.65, gapPercentage: 40.5, ranking: 18, averageBenefit: 2700 },
  "shlomi": { municipalityId: "shlomi", recipients: 153, ratePer1000: 68.03, recipientPercent: 6.80, gapFromAverage: 19.53, gapPercentage: 40.3, ranking: 19, averageBenefit: 3545 },
  "ofakim": { municipalityId: "ofakim", recipients: 1040, ratePer1000: 67.79, recipientPercent: 6.78, gapFromAverage: 19.29, gapPercentage: 39.8, ranking: 20, averageBenefit: 2951 },
  "nahariya": { municipalityId: "nahariya", recipients: 1058, ratePer1000: 65.79, recipientPercent: 6.58, gapFromAverage: 17.29, gapPercentage: 35.7, ranking: 23, averageBenefit: 3458 },
  "kiryat-yam": { municipalityId: "kiryat-yam", recipients: 554, ratePer1000: 65.73, recipientPercent: 6.57, gapFromAverage: 17.23, gapPercentage: 35.5, ranking: 24, averageBenefit: 2640 },
  "arad": { municipalityId: "arad", recipients: 725, ratePer1000: 65.67, recipientPercent: 6.57, gapFromAverage: 17.17, gapPercentage: 35.4, ranking: 25, averageBenefit: 3511 },
  "rishon": { municipalityId: "rishon", recipients: 3829, ratePer1000: 64.23, recipientPercent: 6.42, gapFromAverage: 15.73, gapPercentage: 32.4, ranking: 28, averageBenefit: 3442 },
  "kiryat-motzkin": { municipalityId: "kiryat-motzkin", recipients: 774, ratePer1000: 64.18, recipientPercent: 6.42, gapFromAverage: 15.68, gapPercentage: 32.3, ranking: 29, averageBenefit: 2661 },
  "dimona": { municipalityId: "dimona", recipients: 739, ratePer1000: 64.10, recipientPercent: 6.41, gapFromAverage: 15.60, gapPercentage: 32.2, ranking: 30, averageBenefit: 3188 },
  "ashdod": { municipalityId: "ashdod", recipients: 4366, ratePer1000: 63.92, recipientPercent: 6.39, gapFromAverage: 15.42, gapPercentage: 31.8, ranking: 31, averageBenefit: 3377 },
  "bnei-ayish": { municipalityId: "bnei-ayish", recipients: 96, ratePer1000: 63.45, recipientPercent: 6.35, gapFromAverage: 14.95, gapPercentage: 30.8, ranking: 32, averageBenefit: 2542 },
  "kiryat-ekron": { municipalityId: "kiryat-ekron", recipients: 183, ratePer1000: 62.99, recipientPercent: 6.30, gapFromAverage: 14.49, gapPercentage: 29.9, ranking: 33, averageBenefit: 2592 },
  "beit-shemesh": { municipalityId: "beit-shemesh", recipients: 5722, ratePer1000: 62.30, recipientPercent: 6.23, gapFromAverage: 13.80, gapPercentage: 28.5, ranking: 34, averageBenefit: 3136 },
  "kiryat-bialik": { municipalityId: "kiryat-bialik", recipients: 711, ratePer1000: 62.10, recipientPercent: 6.21, gapFromAverage: 13.60, gapPercentage: 28.0, ranking: 35, averageBenefit: 2696 },
  "kiryat-malachi": { municipalityId: "kiryat-malachi", recipients: 613, ratePer1000: 61.65, recipientPercent: 6.17, gapFromAverage: 13.15, gapPercentage: 27.1, ranking: 36, averageBenefit: 2742 },
  "kfar-saba": { municipalityId: "kfar-saba", recipients: 1571, ratePer1000: 61.53, recipientPercent: 6.15, gapFromAverage: 13.03, gapPercentage: 26.9, ranking: 37, averageBenefit: 2662 },
  "harish": { municipalityId: "harish", recipients: 1089, ratePer1000: 61.32, recipientPercent: 6.13, gapFromAverage: 12.82, gapPercentage: 26.4, ranking: 38, averageBenefit: 2682 },
  "haifa": { municipalityId: "haifa", recipients: 3899, ratePer1000: 61.15, recipientPercent: 6.12, gapFromAverage: 12.65, gapPercentage: 26.1, ranking: 39, averageBenefit: 3267 },
  "migdal-haemek": { municipalityId: "migdal-haemek", recipients: 486, ratePer1000: 59.82, recipientPercent: 5.98, gapFromAverage: 11.32, gapPercentage: 23.3, ranking: 40, averageBenefit: 2568 },
  "rehovot": { municipalityId: "rehovot", recipients: 2767, ratePer1000: 59.67, recipientPercent: 5.97, gapFromAverage: 11.17, gapPercentage: 23.0, ranking: 42, averageBenefit: 2756 },
  "kiryat-ata": { municipalityId: "kiryat-ata", recipients: 983, ratePer1000: 59.64, recipientPercent: 5.96, gapFromAverage: 11.14, gapPercentage: 23.0, ranking: 43, averageBenefit: 2665 },
  "beit-shean": { municipalityId: "beit-shean", recipients: 370, ratePer1000: 59.51, recipientPercent: 5.95, gapFromAverage: 11.01, gapPercentage: 22.7, ranking: 44, averageBenefit: 2463 },
  "safed": { municipalityId: "safed", recipients: 932, ratePer1000: 59.15, recipientPercent: 5.92, gapFromAverage: 10.65, gapPercentage: 22.0, ranking: 45, averageBenefit: 2601 },
  "lod": { municipalityId: "lod", recipients: 1917, ratePer1000: 59.11, recipientPercent: 5.91, gapFromAverage: 10.61, gapPercentage: 21.9, ranking: 46, averageBenefit: 2919 },
  "jisr-az-zarqa": { municipalityId: "jisr-az-zarqa", recipients: 343, ratePer1000: 58.30, recipientPercent: 5.83, gapFromAverage: 9.80, gapPercentage: 20.2, ranking: 47, averageBenefit: 2802 },
  "petah-tikva": { municipalityId: "petah-tikva", recipients: 4190, ratePer1000: 57.15, recipientPercent: 5.72, gapFromAverage: 8.65, gapPercentage: 17.8, ranking: 48, averageBenefit: 3326 },
  "hod-hasharon": { municipalityId: "hod-hasharon", recipients: 1037, ratePer1000: 56.75, recipientPercent: 5.68, gapFromAverage: 8.25, gapPercentage: 17.0, ranking: 49, averageBenefit: 2629 },
  "ramat-gan": { municipalityId: "ramat-gan", recipients: 2003, ratePer1000: 55.81, recipientPercent: 5.58, gapFromAverage: 7.31, gapPercentage: 15.1, ranking: 50, averageBenefit: 3387 },
  "hadera": { municipalityId: "hadera", recipients: 1588, ratePer1000: 55.62, recipientPercent: 5.56, gapFromAverage: 7.12, gapPercentage: 14.7, ranking: 51, averageBenefit: 2672 },
  "rosh-haayin": { municipalityId: "rosh-haayin", recipients: 1431, ratePer1000: 55.39, recipientPercent: 5.54, gapFromAverage: 6.89, gapPercentage: 14.2, ranking: 52, averageBenefit: 2792 },
  "kfar-manda": { municipalityId: "kfar-manda", recipients: 432, ratePer1000: 54.91, recipientPercent: 5.49, gapFromAverage: 6.41, gapPercentage: 13.2, ranking: 53, averageBenefit: 2923 },
  "modiin": { municipalityId: "modiin", recipients: 1631, ratePer1000: 52.40, recipientPercent: 5.24, gapFromAverage: 3.90, gapPercentage: 8.0, ranking: 68, averageBenefit: 2783 },
  "netanya": { municipalityId: "netanya", recipients: 3219, ratePer1000: 52.77, recipientPercent: 5.28, gapFromAverage: 4.27, gapPercentage: 8.8, ranking: 65, averageBenefit: 3241 },
  "netivot": { municipalityId: "netivot", recipients: 1201, ratePer1000: 52.29, recipientPercent: 5.23, gapFromAverage: 3.79, gapPercentage: 7.8, ranking: 69, averageBenefit: 3008 },
  "acre": { municipalityId: "acre", recipients: 755, ratePer1000: 53.74, recipientPercent: 5.37, gapFromAverage: 5.24, gapPercentage: 10.8, ranking: 61, averageBenefit: 3296 },
  "karmiel": { municipalityId: "karmiel", recipients: 598, ratePer1000: 53.40, recipientPercent: 5.34, gapFromAverage: 4.90, gapPercentage: 10.1, ranking: 62, averageBenefit: 2560 },
  "raanana": { municipalityId: "raanana", recipients: 1138, ratePer1000: 50.89, recipientPercent: 5.09, gapFromAverage: 2.39, gapPercentage: 4.9, ranking: 73, averageBenefit: 2780 },
  "herzliya": { municipalityId: "herzliya", recipients: 1310, ratePer1000: 49.70, recipientPercent: 4.97, gapFromAverage: 1.20, gapPercentage: 2.5, ranking: 78, averageBenefit: 2676 },
  "kiryat-ono": { municipalityId: "kiryat-ono", recipients: 589, ratePer1000: 46.60, recipientPercent: 4.66, gapFromAverage: -1.90, gapPercentage: -3.9, ranking: 92, averageBenefit: 3434 },
  "modiin-illit": { municipalityId: "modiin-illit", recipients: 2488, ratePer1000: 46.52, recipientPercent: 4.65, gapFromAverage: -1.98, gapPercentage: -4.1, ranking: 94, averageBenefit: 3003 },
  "givatayim": { municipalityId: "givatayim", recipients: 630, ratePer1000: 46.46, recipientPercent: 4.65, gapFromAverage: -2.04, gapPercentage: -4.2, ranking: 95, averageBenefit: 3328 },
  "tel-aviv": { municipalityId: "tel-aviv", recipients: 4472, ratePer1000: 45.52, recipientPercent: 4.55, gapFromAverage: -2.98, gapPercentage: -6.1, ranking: 100, averageBenefit: 3142 },
  "beitar-illit": { municipalityId: "beitar-illit", recipients: 1769, ratePer1000: 44.43, recipientPercent: 4.44, gapFromAverage: -4.07, gapPercentage: -8.4, ranking: 107, averageBenefit: 2708 },
  "bnei-brak": { municipalityId: "bnei-brak", recipients: 4839, ratePer1000: 44.02, recipientPercent: 4.40, gapFromAverage: -4.48, gapPercentage: -9.2, ranking: 113, averageBenefit: 2776 },
  "elad": { municipalityId: "elad", recipients: 1037, ratePer1000: 41.71, recipientPercent: 4.17, gapFromAverage: -6.79, gapPercentage: -14.0, ranking: 125, averageBenefit: 2897 },
  "jerusalem": { municipalityId: "jerusalem", recipients: 18285, ratePer1000: 45.04, recipientPercent: 4.50, gapFromAverage: -3.46, gapPercentage: -7.1, ranking: 102, averageBenefit: 2957 },
  "ramat-hasharon": { municipalityId: "ramat-hasharon", recipients: 484, ratePer1000: 38.44, recipientPercent: 3.84, gapFromAverage: -10.06, gapPercentage: -20.7, ranking: 147, averageBenefit: 2547 },
  "nazareth": { municipalityId: "nazareth", recipients: 869, ratePer1000: 40.52, recipientPercent: 4.05, gapFromAverage: -7.98, gapPercentage: -16.5, ranking: 131, averageBenefit: 2984 },
  "shfaram": { municipalityId: "shfaram", recipients: 463, ratePer1000: 39.08, recipientPercent: 3.91, gapFromAverage: -9.42, gapPercentage: -19.4, ranking: 142, averageBenefit: 3149 },
};

// Mobility (ניידות) - FROM PAGE 9
const mobilityData: Record<string, BenefitData> = {
  "ailabon": { municipalityId: "ailabon", recipients: 61, ratePer1000: 10.69, recipientPercent: 1.07, gapFromAverage: 5.31, gapPercentage: 98.7, ranking: 1, averageBenefit: 2333 },
  "yanoch-jat": { municipalityId: "yanoch-jat", recipients: 74, ratePer1000: 10.62, recipientPercent: 1.06, gapFromAverage: 5.24, gapPercentage: 97.4, ranking: 2, averageBenefit: 2216 },
  "zarzir": { municipalityId: "zarzir", recipients: 91, ratePer1000: 9.79, recipientPercent: 0.98, gapFromAverage: 4.41, gapPercentage: 81.9, ranking: 4, averageBenefit: 2289 },
  "yrka": { municipalityId: "yrka", recipients: 166, ratePer1000: 9.66, recipientPercent: 0.97, gapFromAverage: 4.28, gapPercentage: 79.5, ranking: 5, averageBenefit: 2271 },
  "salama": { municipalityId: "salama", recipients: 33, ratePer1000: 8.96, recipientPercent: 0.90, gapFromAverage: 3.58, gapPercentage: 66.7, ranking: 6, averageBenefit: 2401 },
  "kobia-tabash": { municipalityId: "kobia-tabash", recipients: 56, ratePer1000: 8.90, recipientPercent: 0.89, gapFromAverage: 3.52, gapPercentage: 65.5, ranking: 7, averageBenefit: 2351 },
  "abu-sinan": { municipalityId: "abu-sinan", recipients: 126, ratePer1000: 8.69, recipientPercent: 0.87, gapFromAverage: 3.31, gapPercentage: 61.5, ranking: 8, averageBenefit: 2328 },
  "kfar-yasif": { municipalityId: "kfar-yasif", recipients: 92, ratePer1000: 8.66, recipientPercent: 0.87, gapFromAverage: 3.28, gapPercentage: 61.0, ranking: 9, averageBenefit: 2199 },
  "beer-sheva": { municipalityId: "beer-sheva", recipients: 1829, ratePer1000: 8.52, recipientPercent: 0.85, gapFromAverage: 3.14, gapPercentage: 58.4, ranking: 10, averageBenefit: 2397 },
  "tiberias": { municipalityId: "tiberias", recipients: 346, ratePer1000: 6.60, recipientPercent: 0.66, gapFromAverage: 1.22, gapPercentage: 22.8, ranking: 67, averageBenefit: 2006 },
  "dimona": { municipalityId: "dimona", recipients: 271, ratePer1000: 6.59, recipientPercent: 0.66, gapFromAverage: 1.21, gapPercentage: 22.5, ranking: 69, averageBenefit: 2375 },
  "holon": { municipalityId: "holon", recipients: 1225, ratePer1000: 6.53, recipientPercent: 0.65, gapFromAverage: 1.15, gapPercentage: 21.3, ranking: 71, averageBenefit: 2243 },
  "ashkelon": { municipalityId: "ashkelon", recipients: 1036, ratePer1000: 6.44, recipientPercent: 0.64, gapFromAverage: 1.06, gapPercentage: 19.7, ranking: 76, averageBenefit: 2285 },
  "acre": { municipalityId: "acre", recipients: 320, ratePer1000: 5.93, recipientPercent: 0.59, gapFromAverage: 0.55, gapPercentage: 10.2, ranking: 106, averageBenefit: 2306 },
  "nazareth": { municipalityId: "nazareth", recipients: 523, ratePer1000: 6.62, recipientPercent: 0.66, gapFromAverage: 1.24, gapPercentage: 23.1, ranking: 66, averageBenefit: 2505 },
  "haifa": { municipalityId: "haifa", recipients: 1708, ratePer1000: 6.10, recipientPercent: 0.61, gapFromAverage: 0.72, gapPercentage: 13.4, ranking: 94, averageBenefit: 2125 },
  "rishon": { municipalityId: "rishon", recipients: 1581, ratePer1000: 6.22, recipientPercent: 0.62, gapFromAverage: 0.84, gapPercentage: 15.6, ranking: 86, averageBenefit: 2191 },
  "petah-tikva": { municipalityId: "petah-tikva", recipients: 1469, ratePer1000: 5.74, recipientPercent: 0.57, gapFromAverage: 0.36, gapPercentage: 6.7, ranking: 118, averageBenefit: 2266 },
  "bat-yam": { municipalityId: "bat-yam", recipients: 715, ratePer1000: 5.74, recipientPercent: 0.57, gapFromAverage: 0.36, gapPercentage: 6.7, ranking: 119, averageBenefit: 2262 },
  "ashdod": { municipalityId: "ashdod", recipients: 1172, ratePer1000: 5.16, recipientPercent: 0.52, gapFromAverage: -0.22, gapPercentage: -4.1, ranking: 160, averageBenefit: 2394 },
  "tel-aviv": { municipalityId: "tel-aviv", recipients: 1893, ratePer1000: 4.10, recipientPercent: 0.41, gapFromAverage: -1.28, gapPercentage: -23.8, ranking: 213, averageBenefit: 2300 },
  "jerusalem": { municipalityId: "jerusalem", recipients: 4768, ratePer1000: 4.70, recipientPercent: 0.47, gapFromAverage: -0.68, gapPercentage: -12.7, ranking: 188, averageBenefit: 2574 },
  "netanya": { municipalityId: "netanya", recipients: 1323, ratePer1000: 5.85, recipientPercent: 0.59, gapFromAverage: 0.47, gapPercentage: 8.7, ranking: 107, averageBenefit: 2406 },
  "ramat-gan": { municipalityId: "ramat-gan", recipients: 834, ratePer1000: 5.14, recipientPercent: 0.51, gapFromAverage: -0.24, gapPercentage: -4.5, ranking: 163, averageBenefit: 2217 },
  "lod": { municipalityId: "lod", recipients: 429, ratePer1000: 4.81, recipientPercent: 0.48, gapFromAverage: -0.57, gapPercentage: -10.6, ranking: 182, averageBenefit: 2262 },
  "ramle": { municipalityId: "ramle", recipients: 492, ratePer1000: 5.97, recipientPercent: 0.60, gapFromAverage: 0.59, gapPercentage: 11.0, ranking: 104, averageBenefit: 2224 },
  "kiryat-gat": { municipalityId: "kiryat-gat", recipients: 348, ratePer1000: 4.96, recipientPercent: 0.50, gapFromAverage: -0.42, gapPercentage: -7.9, ranking: 173, averageBenefit: 2316 },
  "ofakim": { municipalityId: "ofakim", recipients: 204, ratePer1000: 5.08, recipientPercent: 0.51, gapFromAverage: -0.30, gapPercentage: -5.6, ranking: 168, averageBenefit: 2465 },
  "modiin": { municipalityId: "modiin", recipients: 435, ratePer1000: 4.35, recipientPercent: 0.44, gapFromAverage: -1.03, gapPercentage: -19.2, ranking: 200, averageBenefit: 2277 },
  "beit-shemesh": { municipalityId: "beit-shemesh", recipients: 453, ratePer1000: 2.58, recipientPercent: 0.26, gapFromAverage: -2.80, gapPercentage: -52.1, ranking: 238, averageBenefit: 2555 },
  "bnei-brak": { municipalityId: "bnei-brak", recipients: 792, ratePer1000: 3.54, recipientPercent: 0.35, gapFromAverage: -1.84, gapPercentage: -34.2, ranking: 222, averageBenefit: 2768 },
  "beitar-illit": { municipalityId: "beitar-illit", recipients: 208, ratePer1000: 2.93, recipientPercent: 0.29, gapFromAverage: -2.45, gapPercentage: -45.6, ranking: 234, averageBenefit: 2866 },
  "elad": { municipalityId: "elad", recipients: 147, ratePer1000: 2.96, recipientPercent: 0.30, gapFromAverage: -2.42, gapPercentage: -44.9, ranking: 233, averageBenefit: 2811 },
  "modiin-illit": { municipalityId: "modiin-illit", recipients: 211, ratePer1000: 2.44, recipientPercent: 0.24, gapFromAverage: -2.94, gapPercentage: -54.6, ranking: 239, averageBenefit: 2911 },
};

// Alimony (מזונות) - FROM PAGE 7
const alimonyData: Record<string, BenefitData> = {
  "jisr-az-zarqa": { municipalityId: "jisr-az-zarqa", recipients: 87, ratePer1000: 5.51, recipientPercent: 0.55, gapFromAverage: 4.39, gapPercentage: 392.4, ranking: 1, averageBenefit: 2093 },
  "mzra": { municipalityId: "mzra", recipients: 17, ratePer1000: 4.10, recipientPercent: 0.41, gapFromAverage: 2.98, gapPercentage: 265.9, ranking: 2, averageBenefit: 2180 },
  "nof-hagalil": { municipalityId: "nof-hagalil", recipients: 183, ratePer1000: 3.85, recipientPercent: 0.39, gapFromAverage: 2.73, gapPercentage: 243.7, ranking: 3, averageBenefit: 2123 },
  "abu-talul": { municipalityId: "abu-talul", recipients: 11, ratePer1000: 3.84, recipientPercent: 0.38, gapFromAverage: 2.72, gapPercentage: 242.6, ranking: 4, averageBenefit: 1950 },
  "acre": { municipalityId: "acre", recipients: 197, ratePer1000: 3.65, recipientPercent: 0.37, gapFromAverage: 2.53, gapPercentage: 225.8, ranking: 5, averageBenefit: 2135 },
  "akbara": { municipalityId: "akbara", recipients: 44, ratePer1000: 3.18, recipientPercent: 0.32, gapFromAverage: 2.06, gapPercentage: 183.9, ranking: 6, averageBenefit: 2150 },
  "salama": { municipalityId: "salama", recipients: 11, ratePer1000: 2.99, recipientPercent: 0.30, gapFromAverage: 1.87, gapPercentage: 166.8, ranking: 8, averageBenefit: 2205 },
  "jdeide-maker": { municipalityId: "jdeide-maker", recipients: 61, ratePer1000: 2.89, recipientPercent: 0.29, gapFromAverage: 1.77, gapPercentage: 157.7, ranking: 9, averageBenefit: 2065 },
  "tel-sheva": { municipalityId: "tel-sheva", recipients: 68, ratePer1000: 2.81, recipientPercent: 0.28, gapFromAverage: 1.69, gapPercentage: 150.5, ranking: 10, averageBenefit: 2175 },
  "tiberias": { municipalityId: "tiberias", recipients: 118, ratePer1000: 2.25, recipientPercent: 0.23, gapFromAverage: 1.13, gapPercentage: 101.2, ranking: 21, averageBenefit: 2065 },
  "sderot": { municipalityId: "sderot", recipients: 76, ratePer1000: 2.12, recipientPercent: 0.21, gapFromAverage: 1.00, gapPercentage: 89.7, ranking: 27, averageBenefit: 2095 },
  "lod": { municipalityId: "lod", recipients: 153, ratePer1000: 1.71, recipientPercent: 0.17, gapFromAverage: 0.59, gapPercentage: 53.2, ranking: 44, averageBenefit: 2145 },
  "ramle": { municipalityId: "ramle", recipients: 131, ratePer1000: 1.59, recipientPercent: 0.16, gapFromAverage: 0.47, gapPercentage: 41.8, ranking: 51, averageBenefit: 2085 },
  "ashkelon": { municipalityId: "ashkelon", recipients: 247, ratePer1000: 1.53, recipientPercent: 0.15, gapFromAverage: 0.41, gapPercentage: 37.2, ranking: 55, averageBenefit: 2175 },
  "beer-sheva": { municipalityId: "beer-sheva", recipients: 301, ratePer1000: 1.40, recipientPercent: 0.14, gapFromAverage: 0.28, gapPercentage: 25.3, ranking: 65, averageBenefit: 2195 },
  "bat-yam": { municipalityId: "bat-yam", recipients: 167, ratePer1000: 1.34, recipientPercent: 0.13, gapFromAverage: 0.22, gapPercentage: 19.6, ranking: 71, averageBenefit: 2125 },
  "ashdod": { municipalityId: "ashdod", recipients: 286, ratePer1000: 1.26, recipientPercent: 0.13, gapFromAverage: 0.14, gapPercentage: 12.3, ranking: 78, averageBenefit: 2155 },
  "netanya": { municipalityId: "netanya", recipients: 263, ratePer1000: 1.16, recipientPercent: 0.12, gapFromAverage: 0.04, gapPercentage: 4.0, ranking: 91, averageBenefit: 2175 },
  "haifa": { municipalityId: "haifa", recipients: 301, ratePer1000: 1.08, recipientPercent: 0.11, gapFromAverage: -0.04, gapPercentage: -3.8, ranking: 104, averageBenefit: 2145 },
  "petah-tikva": { municipalityId: "petah-tikva", recipients: 246, ratePer1000: 0.96, recipientPercent: 0.10, gapFromAverage: -0.16, gapPercentage: -14.2, ranking: 120, averageBenefit: 2205 },
  "holon": { municipalityId: "holon", recipients: 178, ratePer1000: 0.95, recipientPercent: 0.10, gapFromAverage: -0.17, gapPercentage: -15.4, ranking: 121, averageBenefit: 2095 },
  "rishon": { municipalityId: "rishon", recipients: 236, ratePer1000: 0.93, recipientPercent: 0.09, gapFromAverage: -0.19, gapPercentage: -17.3, ranking: 124, averageBenefit: 2185 },
  "tel-aviv": { municipalityId: "tel-aviv", recipients: 350, ratePer1000: 0.76, recipientPercent: 0.08, gapFromAverage: -0.36, gapPercentage: -32.2, ranking: 146, averageBenefit: 2235 },
  "jerusalem": { municipalityId: "jerusalem", recipients: 584, ratePer1000: 0.58, recipientPercent: 0.06, gapFromAverage: -0.54, gapPercentage: -48.5, ranking: 172, averageBenefit: 2275 },
  "ramat-gan": { municipalityId: "ramat-gan", recipients: 120, ratePer1000: 0.74, recipientPercent: 0.07, gapFromAverage: -0.38, gapPercentage: -34.0, ranking: 148, averageBenefit: 2165 },
  "kiryat-gat": { municipalityId: "kiryat-gat", recipients: 67, ratePer1000: 0.95, recipientPercent: 0.10, gapFromAverage: -0.17, gapPercentage: -14.8, ranking: 122, averageBenefit: 2095 },
  "bnei-brak": { municipalityId: "bnei-brak", recipients: 47, ratePer1000: 0.21, recipientPercent: 0.02, gapFromAverage: -0.91, gapPercentage: -81.3, ranking: 195, averageBenefit: 2245 },
  "beit-shemesh": { municipalityId: "beit-shemesh", recipients: 45, ratePer1000: 0.26, recipientPercent: 0.03, gapFromAverage: -0.86, gapPercentage: -77.1, ranking: 192, averageBenefit: 2315 },
};

// Old Age (זקנה) - normalized to 65+ population - FROM PAGE 10
const oldAgeData: Record<string, BenefitData> = {
  "bir-hadaj": { municipalityId: "bir-hadaj", recipients: 86, ratePer1000: 1622.64, recipientPercent: 162.26, gapFromAverage: 670.54, gapPercentage: 70.4, ranking: 1, averageBenefit: 3816 },
  "umm-batin": { municipalityId: "umm-batin", recipients: 46, ratePer1000: 1314.29, recipientPercent: 131.43, gapFromAverage: 362.19, gapPercentage: 38.0, ranking: 2, averageBenefit: 3359 },
  "sawa": { municipalityId: "sawa", recipients: 27, ratePer1000: 1285.71, recipientPercent: 128.57, gapFromAverage: 333.61, gapPercentage: 35.0, ranking: 3, averageBenefit: 3296 },
  "jisr-az-zarqa": { municipalityId: "jisr-az-zarqa", recipients: 763, ratePer1000: 1254.93, recipientPercent: 125.49, gapFromAverage: 302.83, gapPercentage: 31.8, ranking: 4, averageBenefit: 2836 },
  "kasir-a-sir": { municipalityId: "kasir-a-sir", recipients: 42, ratePer1000: 1235.29, recipientPercent: 123.53, gapFromAverage: 283.19, gapPercentage: 29.7, ranking: 5, averageBenefit: 3205 },
  "arara-negev": { municipalityId: "arara-negev", recipients: 509, ratePer1000: 1214.80, recipientPercent: 121.48, gapFromAverage: 262.70, gapPercentage: 27.6, ranking: 6, averageBenefit: 3151 },
  "abu-talul": { municipalityId: "abu-talul", recipients: 47, ratePer1000: 1205.13, recipientPercent: 120.51, gapFromAverage: 253.03, gapPercentage: 26.6, ranking: 7, averageBenefit: 3279 },
  "tel-sheva": { municipalityId: "tel-sheva", recipients: 620, ratePer1000: 1172.02, recipientPercent: 117.20, gapFromAverage: 219.92, gapPercentage: 23.1, ranking: 8, averageBenefit: 3039 },
  "segev-shalom": { municipalityId: "segev-shalom", recipients: 323, ratePer1000: 1083.89, recipientPercent: 108.39, gapFromAverage: 131.79, gapPercentage: 13.8, ranking: 11, averageBenefit: 3027 },
  "kusaife": { municipalityId: "kusaife", recipients: 522, ratePer1000: 1078.51, recipientPercent: 107.85, gapFromAverage: 126.41, gapPercentage: 13.3, ranking: 12, averageBenefit: 2929 },
  "rahat": { municipalityId: "rahat", recipients: 2022, ratePer1000: 1074.96, recipientPercent: 107.50, gapFromAverage: 122.86, gapPercentage: 12.9, ranking: 13, averageBenefit: 3026 },
  "hura": { municipalityId: "hura", recipients: 532, ratePer1000: 1066.13, recipientPercent: 106.61, gapFromAverage: 114.03, gapPercentage: 12.0, ranking: 15, averageBenefit: 3124 },
  "lakiya": { municipalityId: "lakiya", recipients: 451, ratePer1000: 1039.17, recipientPercent: 103.92, gapFromAverage: 87.07, gapPercentage: 9.1, ranking: 21, averageBenefit: 3027 },
  "tayibe": { municipalityId: "tayibe", recipients: 3229, ratePer1000: 1054.88, recipientPercent: 105.49, gapFromAverage: 102.78, gapPercentage: 10.8, ranking: 18, averageBenefit: 2671 },
  "tira": { municipalityId: "tira", recipients: 1992, ratePer1000: 1033.20, recipientPercent: 103.32, gapFromAverage: 81.10, gapPercentage: 8.5, ranking: 23, averageBenefit: 2685 },
  "kalansua": { municipalityId: "kalansua", recipients: 1310, ratePer1000: 1004.60, recipientPercent: 100.46, gapFromAverage: 52.50, gapPercentage: 5.5, ranking: 35, averageBenefit: 2706 },
  "sderot": { municipalityId: "sderot", recipients: 3325, ratePer1000: 983.73, recipientPercent: 98.37, gapFromAverage: 31.63, gapPercentage: 3.3, ranking: 50, averageBenefit: 2519 },
  "umm-al-fahm": { municipalityId: "umm-al-fahm", recipients: 5753, ratePer1000: 963.10, recipientPercent: 96.31, gapFromAverage: 11.00, gapPercentage: 1.2, ranking: 72, averageBenefit: 2665 },
  "tamra": { municipalityId: "tamra", recipients: 3470, ratePer1000: 946.28, recipientPercent: 94.63, gapFromAverage: -5.82, gapPercentage: -0.6, ranking: 97, averageBenefit: 2668 },
  "nazareth": { municipalityId: "nazareth", recipients: 7573, ratePer1000: 961.16, recipientPercent: 96.12, gapFromAverage: 9.06, gapPercentage: 1.0, ranking: 76, averageBenefit: 2622 },
  "shfaram": { municipalityId: "shfaram", recipients: 4080, ratePer1000: 945.08, recipientPercent: 94.51, gapFromAverage: -7.02, gapPercentage: -0.7, ranking: 101, averageBenefit: 2638 },
  "sachnin": { municipalityId: "sachnin", recipients: 3382, ratePer1000: 958.55, recipientPercent: 95.86, gapFromAverage: 6.45, gapPercentage: 0.7, ranking: 82, averageBenefit: 2661 },
  "haifa": { municipalityId: "haifa", recipients: 53889, ratePer1000: 885.19, recipientPercent: 88.52, gapFromAverage: -66.91, gapPercentage: -7.0, ranking: 200, averageBenefit: 2559 },
  "beer-sheva": { municipalityId: "beer-sheva", recipients: 32545, ratePer1000: 881.48, recipientPercent: 88.15, gapFromAverage: -70.62, gapPercentage: -7.4, ranking: 204, averageBenefit: 2564 },
  "ashkelon": { municipalityId: "ashkelon", recipients: 23522, ratePer1000: 875.63, recipientPercent: 87.56, gapFromAverage: -76.47, gapPercentage: -8.0, ranking: 212, averageBenefit: 2510 },
  "netanya": { municipalityId: "netanya", recipients: 39325, ratePer1000: 879.16, recipientPercent: 87.92, gapFromAverage: -72.94, gapPercentage: -7.7, ranking: 207, averageBenefit: 2497 },
  "bat-yam": { municipalityId: "bat-yam", recipients: 27590, ratePer1000: 879.60, recipientPercent: 87.96, gapFromAverage: -72.50, gapPercentage: -7.6, ranking: 206, averageBenefit: 2514 },
  "ashdod": { municipalityId: "ashdod", recipients: 33136, ratePer1000: 875.96, recipientPercent: 87.60, gapFromAverage: -76.14, gapPercentage: -8.0, ranking: 211, averageBenefit: 2502 },
  "holon": { municipalityId: "holon", recipients: 33873, ratePer1000: 879.90, recipientPercent: 87.99, gapFromAverage: -72.20, gapPercentage: -7.6, ranking: 205, averageBenefit: 2542 },
  "rishon": { municipalityId: "rishon", recipients: 44375, ratePer1000: 886.38, recipientPercent: 88.64, gapFromAverage: -65.72, gapPercentage: -6.9, ranking: 198, averageBenefit: 2557 },
  "petah-tikva": { municipalityId: "petah-tikva", recipients: 38988, ratePer1000: 881.76, recipientPercent: 88.18, gapFromAverage: -70.34, gapPercentage: -7.4, ranking: 203, averageBenefit: 2511 },
  "tel-aviv": { municipalityId: "tel-aviv", recipients: 68055, ratePer1000: 889.18, recipientPercent: 88.92, gapFromAverage: -62.92, gapPercentage: -6.6, ranking: 195, averageBenefit: 2545 },
  "jerusalem": { municipalityId: "jerusalem", recipients: 93802, ratePer1000: 945.12, recipientPercent: 94.51, gapFromAverage: -6.98, gapPercentage: -0.7, ranking: 100, averageBenefit: 2595 },
  "ramat-gan": { municipalityId: "ramat-gan", recipients: 26219, ratePer1000: 885.11, recipientPercent: 88.51, gapFromAverage: -66.99, gapPercentage: -7.0, ranking: 201, averageBenefit: 2548 },
  "lod": { municipalityId: "lod", recipients: 10316, ratePer1000: 977.31, recipientPercent: 97.73, gapFromAverage: 25.21, gapPercentage: 2.6, ranking: 64, averageBenefit: 2571 },
  "ramle": { municipalityId: "ramle", recipients: 10430, ratePer1000: 955.21, recipientPercent: 95.52, gapFromAverage: 3.11, gapPercentage: 0.3, ranking: 88, averageBenefit: 2541 },
  "afula": { municipalityId: "afula", recipients: 10033, ratePer1000: 978.92, recipientPercent: 97.89, gapFromAverage: 26.82, gapPercentage: 2.8, ranking: 58, averageBenefit: 2555 },
  "dimona": { municipalityId: "dimona", recipients: 5037, ratePer1000: 912.18, recipientPercent: 91.22, gapFromAverage: -39.92, gapPercentage: -4.2, ranking: 164, averageBenefit: 2512 },
  "acre": { municipalityId: "acre", recipients: 8027, ratePer1000: 957.66, recipientPercent: 95.77, gapFromAverage: 5.56, gapPercentage: 0.6, ranking: 84, averageBenefit: 2549 },
  "tiberias": { municipalityId: "tiberias", recipients: 7242, ratePer1000: 979.79, recipientPercent: 97.98, gapFromAverage: 27.69, gapPercentage: 2.9, ranking: 56, averageBenefit: 2571 },
  "karmiel": { municipalityId: "karmiel", recipients: 9205, ratePer1000: 896.41, recipientPercent: 89.64, gapFromAverage: -55.69, gapPercentage: -5.8, ranking: 181, averageBenefit: 2526 },
  "kiryat-shmona": { municipalityId: "kiryat-shmona", recipients: 3706, ratePer1000: 977.63, recipientPercent: 97.76, gapFromAverage: 25.53, gapPercentage: 2.7, ranking: 63, averageBenefit: 2575 },
  "safed": { municipalityId: "safed", recipients: 3975, ratePer1000: 969.42, recipientPercent: 96.94, gapFromAverage: 17.32, gapPercentage: 1.8, ranking: 70, averageBenefit: 2618 },
  "nahariya": { municipalityId: "nahariya", recipients: 11698, ratePer1000: 907.54, recipientPercent: 90.75, gapFromAverage: -44.56, gapPercentage: -4.7, ranking: 173, averageBenefit: 2500 },
  "kiryat-yam": { municipalityId: "kiryat-yam", recipients: 9164, ratePer1000: 886.91, recipientPercent: 88.69, gapFromAverage: -65.19, gapPercentage: -6.8, ranking: 197, averageBenefit: 2471 },
  "kiryat-bialik": { municipalityId: "kiryat-bialik", recipients: 8397, ratePer1000: 879.22, recipientPercent: 87.92, gapFromAverage: -72.88, gapPercentage: -7.7, ranking: 208, averageBenefit: 2454 },
  "kiryat-motzkin": { municipalityId: "kiryat-motzkin", recipients: 9795, ratePer1000: 877.67, recipientPercent: 87.77, gapFromAverage: -74.43, gapPercentage: -7.8, ranking: 210, averageBenefit: 2444 },
  "kiryat-ata": { municipalityId: "kiryat-ata", recipients: 10608, ratePer1000: 872.48, recipientPercent: 87.25, gapFromAverage: -79.62, gapPercentage: -8.4, ranking: 216, averageBenefit: 2432 },
  "tirat-carmel": { municipalityId: "tirat-carmel", recipients: 4211, ratePer1000: 882.95, recipientPercent: 88.30, gapFromAverage: -69.15, gapPercentage: -7.3, ranking: 202, averageBenefit: 2457 },
  "nof-hagalil": { municipalityId: "nof-hagalil", recipients: 8193, ratePer1000: 953.98, recipientPercent: 95.40, gapFromAverage: 1.88, gapPercentage: 0.2, ranking: 93, averageBenefit: 2515 },
  "kiryat-gat": { municipalityId: "kiryat-gat", recipients: 8679, ratePer1000: 972.03, recipientPercent: 97.20, gapFromAverage: 19.93, gapPercentage: 2.1, ranking: 68, averageBenefit: 2565 },
  "kiryat-malachi": { municipalityId: "kiryat-malachi", recipients: 3017, ratePer1000: 960.24, recipientPercent: 96.02, gapFromAverage: 8.14, gapPercentage: 0.9, ranking: 78, averageBenefit: 2542 },
  "beit-shemesh": { municipalityId: "beit-shemesh", recipients: 6681, ratePer1000: 958.22, recipientPercent: 95.82, gapFromAverage: 6.12, gapPercentage: 0.6, ranking: 81, averageBenefit: 2706 },
  "modiin-illit": { municipalityId: "modiin-illit", recipients: 906, ratePer1000: 952.63, recipientPercent: 95.26, gapFromAverage: 0.53, gapPercentage: 0.1, ranking: 95, averageBenefit: 2803 },
  "bnei-brak": { municipalityId: "bnei-brak", recipients: 14891, ratePer1000: 953.64, recipientPercent: 95.36, gapFromAverage: 1.54, gapPercentage: 0.2, ranking: 94, averageBenefit: 2712 },
  "beitar-illit": { municipalityId: "beitar-illit", recipients: 1052, ratePer1000: 972.40, recipientPercent: 97.24, gapFromAverage: 20.30, gapPercentage: 2.1, ranking: 67, averageBenefit: 2751 },
  "elad": { municipalityId: "elad", recipients: 1089, ratePer1000: 979.32, recipientPercent: 97.93, gapFromAverage: 27.22, gapPercentage: 2.9, ranking: 56, averageBenefit: 2720 },
  "netivot": { municipalityId: "netivot", recipients: 3269, ratePer1000: 966.87, recipientPercent: 96.69, gapFromAverage: 14.77, gapPercentage: 1.6, ranking: 71, averageBenefit: 2590 },
  "ofakim": { municipalityId: "ofakim", recipients: 3464, ratePer1000: 963.40, recipientPercent: 96.34, gapFromAverage: 11.30, gapPercentage: 1.2, ranking: 73, averageBenefit: 2582 },
  "herzliya": { municipalityId: "herzliya", recipients: 18956, ratePer1000: 886.27, recipientPercent: 88.63, gapFromAverage: -65.83, gapPercentage: -6.9, ranking: 199, averageBenefit: 2584 },
  "raanana": { municipalityId: "raanana", recipients: 14607, ratePer1000: 894.30, recipientPercent: 89.43, gapFromAverage: -57.80, gapPercentage: -6.1, ranking: 183, averageBenefit: 2574 },
  "givatayim": { municipalityId: "givatayim", recipients: 8734, ratePer1000: 882.50, recipientPercent: 88.25, gapFromAverage: -69.60, gapPercentage: -7.3, ranking: 203, averageBenefit: 2542 },
  "kfar-saba": { municipalityId: "kfar-saba", recipients: 18824, ratePer1000: 884.89, recipientPercent: 88.49, gapFromAverage: -67.21, gapPercentage: -7.1, ranking: 202, averageBenefit: 2538 },
  "modiin": { municipalityId: "modiin", recipients: 10707, ratePer1000: 980.16, recipientPercent: 98.02, gapFromAverage: 28.06, gapPercentage: 2.9, ranking: 54, averageBenefit: 2573 },
  "hod-hasharon": { municipalityId: "hod-hasharon", recipients: 10858, ratePer1000: 893.50, recipientPercent: 89.35, gapFromAverage: -58.60, gapPercentage: -6.2, ranking: 184, averageBenefit: 2543 },
  "rosh-haayin": { municipalityId: "rosh-haayin", recipients: 7134, ratePer1000: 965.20, recipientPercent: 96.52, gapFromAverage: 13.10, gapPercentage: 1.4, ranking: 72, averageBenefit: 2556 },
  "kiryat-ono": { municipalityId: "kiryat-ono", recipients: 6062, ratePer1000: 886.69, recipientPercent: 88.67, gapFromAverage: -65.41, gapPercentage: -6.9, ranking: 198, averageBenefit: 2537 },
  "ramat-hasharon": { municipalityId: "ramat-hasharon", recipients: 8599, ratePer1000: 886.27, recipientPercent: 88.63, gapFromAverage: -65.83, gapPercentage: -6.9, ranking: 199, averageBenefit: 2575 },
};

// Child Support (קצבת ילדים) - FROM PAGE 11
const childSupportData: Record<string, BenefitData> = {
  "harish": { municipalityId: "harish", recipients: 6558, ratePer1000: 172.99, recipientPercent: 17.30, gapFromAverage: 41.41, gapPercentage: 31.5, ranking: 3, averageBenefit: 505 },
  "tel-sheva": { municipalityId: "tel-sheva", recipients: 3661, ratePer1000: 151.02, recipientPercent: 15.10, gapFromAverage: 19.44, gapPercentage: 14.8, ranking: 19, averageBenefit: 617 },
  "hura": { municipalityId: "hura", recipients: 3443, ratePer1000: 149.48, recipientPercent: 14.95, gapFromAverage: 17.90, gapPercentage: 13.6, ranking: 22, averageBenefit: 664 },
  "rahat": { municipalityId: "rahat", recipients: 11710, ratePer1000: 148.04, recipientPercent: 14.80, gapFromAverage: 16.46, gapPercentage: 12.5, ranking: 34, averageBenefit: 574 },
  "umm-al-fahm": { municipalityId: "umm-al-fahm", recipients: 8895, ratePer1000: 146.68, recipientPercent: 14.67, gapFromAverage: 15.10, gapPercentage: 11.5, ranking: 44, averageBenefit: 426 },
  "sachnin": { municipalityId: "sachnin", recipients: 5261, ratePer1000: 148.10, recipientPercent: 14.81, gapFromAverage: 16.52, gapPercentage: 12.6, ranking: 32, averageBenefit: 399 },
  "tamra": { municipalityId: "tamra", recipients: 5407, ratePer1000: 147.50, recipientPercent: 14.75, gapFromAverage: 15.92, gapPercentage: 12.1, ranking: 39, averageBenefit: 397 },
  "nazareth": { municipalityId: "nazareth", recipients: 10489, ratePer1000: 132.77, recipientPercent: 13.28, gapFromAverage: 1.19, gapPercentage: 0.9, ranking: 176, averageBenefit: 405 },
  "shfaram": { municipalityId: "shfaram", recipients: 5645, ratePer1000: 130.72, recipientPercent: 13.07, gapFromAverage: -0.86, gapPercentage: -0.7, ranking: 190, averageBenefit: 383 },
  "arraba": { municipalityId: "arraba", recipients: 4116, ratePer1000: 146.95, recipientPercent: 14.70, gapFromAverage: 15.37, gapPercentage: 11.7, ranking: 42, averageBenefit: 424 },
  "beer-sheva": { municipalityId: "beer-sheva", recipients: 27828, ratePer1000: 129.64, recipientPercent: 12.96, gapFromAverage: -1.94, gapPercentage: -1.5, ranking: 196, averageBenefit: 417 },
  "jerusalem": { municipalityId: "jerusalem", recipients: 132951, ratePer1000: 131.00, recipientPercent: 13.10, gapFromAverage: -0.58, gapPercentage: -0.4, ranking: 186, averageBenefit: 539 },
  "tel-aviv": { municipalityId: "tel-aviv", recipients: 52683, ratePer1000: 114.12, recipientPercent: 11.41, gapFromAverage: -17.46, gapPercentage: -13.3, ranking: 265, averageBenefit: 349 },
  "haifa": { municipalityId: "haifa", recipients: 31623, ratePer1000: 112.95, recipientPercent: 11.30, gapFromAverage: -18.63, gapPercentage: -14.2, ranking: 266, averageBenefit: 380 },
  "rishon": { municipalityId: "rishon", recipients: 30526, ratePer1000: 120.10, recipientPercent: 12.01, gapFromAverage: -11.48, gapPercentage: -8.7, ranking: 250, averageBenefit: 366 },
  "petah-tikva": { municipalityId: "petah-tikva", recipients: 32562, ratePer1000: 127.22, recipientPercent: 12.72, gapFromAverage: -4.36, gapPercentage: -3.3, ranking: 215, averageBenefit: 416 },
  "ashdod": { municipalityId: "ashdod", recipients: 27867, ratePer1000: 122.61, recipientPercent: 12.26, gapFromAverage: -8.97, gapPercentage: -6.8, ranking: 240, averageBenefit: 459 },
  "netanya": { municipalityId: "netanya", recipients: 27400, ratePer1000: 121.14, recipientPercent: 12.11, gapFromAverage: -10.44, gapPercentage: -7.9, ranking: 244, averageBenefit: 416 },
  "bnei-brak": { municipalityId: "bnei-brak", recipients: 29908, ratePer1000: 133.77, recipientPercent: 13.38, gapFromAverage: 2.19, gapPercentage: 1.7, ranking: 167, averageBenefit: 692 },
  "holon": { municipalityId: "holon", recipients: 22574, ratePer1000: 120.24, recipientPercent: 12.02, gapFromAverage: -11.34, gapPercentage: -8.6, ranking: 248, averageBenefit: 386 },
  "bat-yam": { municipalityId: "bat-yam", recipients: 13854, ratePer1000: 111.19, recipientPercent: 11.12, gapFromAverage: -20.39, gapPercentage: -15.5, ranking: 273, averageBenefit: 374 },
  "ramat-gan": { municipalityId: "ramat-gan", recipients: 19977, ratePer1000: 123.15, recipientPercent: 12.32, gapFromAverage: -8.43, gapPercentage: -6.4, ranking: 237, averageBenefit: 345 },
  "ashkelon": { municipalityId: "ashkelon", recipients: 20963, ratePer1000: 130.26, recipientPercent: 13.03, gapFromAverage: -1.32, gapPercentage: -1.0, ranking: 193, averageBenefit: 407 },
  "beit-shemesh": { municipalityId: "beit-shemesh", recipients: 24790, ratePer1000: 141.04, recipientPercent: 14.10, gapFromAverage: 9.46, gapPercentage: 7.2, ranking: 88, averageBenefit: 673 },
  "modiin-illit": { municipalityId: "modiin-illit", recipients: 10838, ratePer1000: 125.55, recipientPercent: 12.56, gapFromAverage: -6.03, gapPercentage: -4.6, ranking: 226, averageBenefit: 847 },
  "beitar-illit": { municipalityId: "beitar-illit", recipients: 9899, ratePer1000: 139.28, recipientPercent: 13.93, gapFromAverage: 7.70, gapPercentage: 5.9, ranking: 106, averageBenefit: 728 },
  "elad": { municipalityId: "elad", recipients: 6855, ratePer1000: 138.26, recipientPercent: 13.83, gapFromAverage: 6.68, gapPercentage: 5.1, ranking: 116, averageBenefit: 664 },
  "netivot": { municipalityId: "netivot", recipients: 7932, ratePer1000: 144.79, recipientPercent: 14.48, gapFromAverage: 13.21, gapPercentage: 10.0, ranking: 55, averageBenefit: 539 },
  "ofakim": { municipalityId: "ofakim", recipients: 5508, ratePer1000: 137.07, recipientPercent: 13.71, gapFromAverage: 5.49, gapPercentage: 4.2, ranking: 129, averageBenefit: 533 },
  "lod": { municipalityId: "lod", recipients: 11788, ratePer1000: 132.11, recipientPercent: 13.21, gapFromAverage: 0.53, gapPercentage: 0.4, ranking: 181, averageBenefit: 509 },
  "ramle": { municipalityId: "ramle", recipients: 11050, ratePer1000: 134.15, recipientPercent: 13.42, gapFromAverage: 2.57, gapPercentage: 2.0, ranking: 162, averageBenefit: 431 },
  "kiryat-gat": { municipalityId: "kiryat-gat", recipients: 9610, ratePer1000: 136.87, recipientPercent: 13.69, gapFromAverage: 5.29, gapPercentage: 4.0, ranking: 130, averageBenefit: 482 },
  "kiryat-malachi": { municipalityId: "kiryat-malachi", recipients: 3705, ratePer1000: 133.91, recipientPercent: 13.39, gapFromAverage: 2.33, gapPercentage: 1.8, ranking: 165, averageBenefit: 514 },
  "dimona": { municipalityId: "dimona", recipients: 5765, ratePer1000: 140.14, recipientPercent: 14.01, gapFromAverage: 8.56, gapPercentage: 6.5, ranking: 97, averageBenefit: 427 },
  "sderot": { municipalityId: "sderot", recipients: 4942, ratePer1000: 138.06, recipientPercent: 13.81, gapFromAverage: 6.48, gapPercentage: 4.9, ranking: 120, averageBenefit: 450 },
  "acre": { municipalityId: "acre", recipients: 6930, ratePer1000: 128.37, recipientPercent: 12.84, gapFromAverage: -3.21, gapPercentage: -2.4, ranking: 209, averageBenefit: 385 },
  "tiberias": { municipalityId: "tiberias", recipients: 6715, ratePer1000: 128.18, recipientPercent: 12.82, gapFromAverage: -3.40, gapPercentage: -2.6, ranking: 210, averageBenefit: 496 },
  "afula": { municipalityId: "afula", recipients: 8715, ratePer1000: 133.10, recipientPercent: 13.31, gapFromAverage: 1.52, gapPercentage: 1.2, ranking: 172, averageBenefit: 439 },
  "safed": { municipalityId: "safed", recipients: 4958, ratePer1000: 126.15, recipientPercent: 12.62, gapFromAverage: -5.43, gapPercentage: -4.1, ranking: 223, averageBenefit: 611 },
  "kiryat-shmona": { municipalityId: "kiryat-shmona", recipients: 2821, ratePer1000: 115.61, recipientPercent: 11.56, gapFromAverage: -15.97, gapPercentage: -12.1, ranking: 260, averageBenefit: 398 },
  "nahariya": { municipalityId: "nahariya", recipients: 8325, ratePer1000: 122.98, recipientPercent: 12.30, gapFromAverage: -8.60, gapPercentage: -6.5, ranking: 239, averageBenefit: 362 },
  "karmiel": { municipalityId: "karmiel", recipients: 5499, ratePer1000: 115.12, recipientPercent: 11.51, gapFromAverage: -16.46, gapPercentage: -12.5, ranking: 262, averageBenefit: 379 },
  "nof-hagalil": { municipalityId: "nof-hagalil", recipients: 5716, ratePer1000: 120.23, recipientPercent: 12.02, gapFromAverage: -11.35, gapPercentage: -8.6, ranking: 249, averageBenefit: 402 },
  "eilat": { municipalityId: "eilat", recipients: 6838, ratePer1000: 118.34, recipientPercent: 11.83, gapFromAverage: -13.24, gapPercentage: -10.1, ranking: 254, averageBenefit: 374 },
  "modiin": { municipalityId: "modiin", recipients: 14112, ratePer1000: 140.96, recipientPercent: 14.10, gapFromAverage: 9.38, gapPercentage: 7.1, ranking: 89, averageBenefit: 400 },
  "rehovot": { municipalityId: "rehovot", recipients: 19923, ratePer1000: 133.35, recipientPercent: 13.34, gapFromAverage: 1.77, gapPercentage: 1.3, ranking: 171, averageBenefit: 434 },
  "kfar-saba": { municipalityId: "kfar-saba", recipients: 12746, ratePer1000: 128.54, recipientPercent: 12.85, gapFromAverage: -3.04, gapPercentage: -2.3, ranking: 208, averageBenefit: 378 },
  "herzliya": { municipalityId: "herzliya", recipients: 13068, ratePer1000: 125.45, recipientPercent: 12.55, gapFromAverage: -6.13, gapPercentage: -4.7, ranking: 228, averageBenefit: 370 },
  "raanana": { municipalityId: "raanana", recipients: 10399, ratePer1000: 125.53, recipientPercent: 12.55, gapFromAverage: -6.05, gapPercentage: -4.6, ranking: 227, averageBenefit: 400 },
  "hod-hasharon": { municipalityId: "hod-hasharon", recipients: 8812, ratePer1000: 138.98, recipientPercent: 13.90, gapFromAverage: 7.40, gapPercentage: 5.6, ranking: 111, averageBenefit: 375 },
  "rosh-haayin": { municipalityId: "rosh-haayin", recipients: 11089, ratePer1000: 149.11, recipientPercent: 14.91, gapFromAverage: 17.53, gapPercentage: 13.3, ranking: 24, averageBenefit: 427 },
  "givatayim": { municipalityId: "givatayim", recipients: 7462, ratePer1000: 130.17, recipientPercent: 13.02, gapFromAverage: -1.41, gapPercentage: -1.1, ranking: 194, averageBenefit: 338 },
  "kiryat-ono": { municipalityId: "kiryat-ono", recipients: 6086, ratePer1000: 143.59, recipientPercent: 14.36, gapFromAverage: 12.01, gapPercentage: 9.1, ranking: 64, averageBenefit: 377 },
  "yavne": { municipalityId: "yavne", recipients: 8423, ratePer1000: 147.98, recipientPercent: 14.80, gapFromAverage: 16.40, gapPercentage: 12.5, ranking: 36, averageBenefit: 439 },
};

// ============================================================
// COMBINED BENEFIT DATA MAP
// ============================================================
export const benefitData: Record<string, Record<string, BenefitData>> = {
  "nursing": nursingData,
  "disability": disabilityData,
  "income-support": incomeSupportData,
  "unemployment": unemploymentData,
  "disabled-child": disabledChildData,
  "mobility": mobilityData,
  "alimony": alimonyData,
  "old-age": oldAgeData,
  "child-support": childSupportData,
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getGapColor(gapPercentage: number): string {
  if (gapPercentage > 50) return "hsl(var(--destructive))";
  if (gapPercentage > 20) return "hsl(var(--warning))";
  if (gapPercentage > 0) return "hsl(var(--warning) / 0.7)";
  if (gapPercentage > -20) return "hsl(var(--success) / 0.7)";
  return "hsl(var(--success))";
}

export function getGapSeverity(gapPercentage: number): "high" | "medium" | "low" {
  if (gapPercentage > 50) return "high";
  if (gapPercentage > 20) return "medium";
  return "low";
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("he-IL").format(num);
}

export function formatPercent(num: number): string {
  const sign = num > 0 ? "+" : "";
  return `${sign}${num.toFixed(1)}%`;
}

export function getBenefitTypeById(id: string): BenefitType | undefined {
  return benefitTypes.find((b) => b.id === id);
}

export function getMunicipalityById(id: string): Municipality | undefined {
  return municipalities.find((m) => m.id === id);
}

export function getTopMunicipalitiesByGap(
  benefitId: string,
  count: number = 10
): Array<{ municipality: Municipality; data: BenefitData }> {
  const data = benefitData[benefitId];
  if (!data) return [];

  return Object.entries(data)
    .map(([muniId, benefitInfo]) => {
      const municipality = getMunicipalityById(muniId);
      if (!municipality) return null;
      return { municipality, data: benefitInfo };
    })
    .filter(Boolean)
    .filter((item) => item!.data.ratePer1000 > 0) // Filter out zero rates
    .sort((a, b) => b!.data.gapPercentage - a!.data.gapPercentage)
    .slice(0, count) as Array<{ municipality: Municipality; data: BenefitData }>;
}

export function getAllMunicipalitiesWithData(
  benefitId: string
): Array<{ municipality: Municipality; data: BenefitData }> {
  const data = benefitData[benefitId];
  if (!data) return [];

  return Object.entries(data)
    .map(([muniId, benefitInfo]) => {
      const municipality = getMunicipalityById(muniId);
      if (!municipality) return null;
      return { municipality, data: benefitInfo };
    })
    .filter(Boolean)
    .filter((item) => item!.data.ratePer1000 > 0) as Array<{ municipality: Municipality; data: BenefitData }>;
}

// Get municipality profile across all benefit types (for Compare page)
export function getMunicipalityProfile(
  municipalityId: string
): Array<{ benefit: BenefitType; data: BenefitData }> {
  return benefitTypes
    .map((benefit) => {
      const data = benefitData[benefit.id]?.[municipalityId];
      if (!data) return null;
      return { benefit, data };
    })
    .filter(Boolean) as Array<{ benefit: BenefitType; data: BenefitData }>;
}
