/** Pinned homepage rails — TMDB ids with posters/backdrops. */

export type WeeklyHotAnime = { id: number; type: "tv" | "movie" };

const TRENDING_SEARCH_ANIME: WeeklyHotAnime[] = [
  { id: 37854, type: "tv" }, // One Piece
  { id: 85937, type: "tv" }, // Demon Slayer
  { id: 95479, type: "tv" }, // Jujutsu Kaisen
  { id: 1429, type: "tv" }, // Attack on Titan
  { id: 127532, type: "tv" }, // Solo Leveling
  { id: 240411, type: "tv" }, // Dan Da Dan
  { id: 209867, type: "tv" }, // Frieren: Beyond Journey's End
  { id: 114410, type: "tv" }, // Chainsaw Man
  { id: 120089, type: "tv" }, // Spy x Family
  { id: 65930, type: "tv" }, // My Hero Academia
  { id: 65494, type: "tv" }, // Re:Zero
  { id: 203737, type: "tv" }, // Mashle
  { id: 221211, type: "tv" }, // Kaiju No. 8
  { id: 220542, type: "tv" }, // The Apothecary Diaries
  { id: 207332, type: "tv" }, // Sakamoto Days
  { id: 256721, type: "tv" }, // Gachiakuta
  { id: 223500, type: "tv" }, // Wind Breaker
  { id: 203075, type: "tv" }, // Oshi no Ko
  { id: 63926, type: "tv" }, // One Punch Man
  { id: 46298, type: "tv" }, // Hunter x Hunter
  { id: 13916, type: "tv" }, // Death Note
  { id: 46260, type: "tv" }, // Naruto
  { id: 30984, type: "tv" }, // Bleach
  { id: 88803, type: "tv" }, // Vinland Saga
  { id: 135051, type: "tv" }, // Blue Lock
  { id: 86031, type: "tv" }, // Dr. Stone
  { id: 31911, type: "tv" }, // Fullmetal Alchemist: Brotherhood
  { id: 42509, type: "tv" }, // Haikyuu!!
  { id: 68436, type: "tv" }, // Black Clover
  { id: 90090, type: "tv" }, // Fire Force
];

const LEGACY_WEEKLY_HOT_ANIME: WeeklyHotAnime[] = [
  { id: 285166, type: "tv" }, // Jack-of-All-Trades, Party of None (Yuusha Party wo Oidasareta Kiyoubinbou)
  { id: 324502, type: "tv" }, // Overgeared (premieres October 2026)
  // List 1
  { id: 82823, type: "tv" }, // Boarding School Juliet
  { id: 61223, type: "tv" }, // Akame ga Kill!
  { id: 223515, type: "tv" }, // The Girl Downstairs
  { id: 271576, type: "tv" }, // Summer Pockets
  { id: 312849, type: "tv" }, // Rich Girl Caretaker
  { id: 123876, type: "tv" }, // Komi Can't Communicate
  { id: 196040, type: "tv" }, // Engage Kiss
  { id: 285818, type: "tv" }, // Mistress Kanan Is Devilishly Easy
  { id: 63145, type: "tv" }, // Charlotte
  { id: 286388, type: "tv" }, // Inexpressive Kashiwada and Expressive Oota
  { id: 65948, type: "tv" }, // And You Thought There Is Never a Girl Online?
  { id: 56998, type: "tv" }, // High School of the Dead
  { id: 325040, type: "tv" }, // Above Myriads
  // List 2
  { id: 75431, type: "tv" }, // Komori-san Can't Decline!
  { id: 62110, type: "tv" }, // Assassination Classroom
  { id: 124572, type: "tv" }, // Healer Girl
  { id: 276253, type: "tv" }, // The Brilliant Healer's New Life in the Shadows
  { id: 62742, type: "tv" }, // Sankarea
  { id: 127714, type: "tv" }, // Uncle from Another World
  { id: 117061, type: "tv" }, // The Detective Is Already Dead
  { id: 63330, type: "tv" }, // My Wife is the Student Council President
  { id: 115694, type: "tv" }, // Shikimori's Not Just a Cutie
  { id: 37437, type: "tv" }, // Heaven's Lost Property
  { id: 139287, type: "tv" }, // More than a Married Couple, but Not Lovers
  { id: 45998, type: "tv" }, // Kiss x Sis
  // List 3
  { id: 276349, type: "tv" }, // Yano-kun's Ordinary Days
  { id: 280038, type: "tv" }, // Apocalypse Bringer Mynoghra
  { id: 144288, type: "movie" }, // Berserk: The Eclipse / Shoku (Golden Age Arc III)
  { id: 62640, type: "tv" }, // Nisekoi: False Love
  { id: 253811, type: "tv" }, // Tougen Anki
  { id: 27167, type: "tv" }, // Lovely Complex
  { id: 156563, type: "tv" }, // The Reincarnation of the Strongest Exorcist in Another World
  { id: 96316, type: "tv" }, // Rent-a-Girlfriend
  { id: 66109, type: "tv" }, // Hundred
  { id: 916192, type: "movie" }, // The Tunnel to Summer, the Exit of Goodbyes
  { id: 131365, type: "tv" }, // The Wrong Way to Use Healing Magic
  { id: 208493, type: "tv" }, // I Got a Cheat Skill in Another World...
  { id: 72517, type: "tv" }, // Classroom of the Elite
  { id: 114868, type: "tv" }, // Record of Ragnarok
];

function uniquePins(items: WeeklyHotAnime[]): WeeklyHotAnime[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.type}-${item.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** الأكثر مشاهدة / الأشهر / الأكثر بحثاً — trending first, then the existing weekly rail. */
export const WEEKLY_HOT_ANIME: WeeklyHotAnime[] = uniquePins([
  ...TRENDING_SEARCH_ANIME,
  ...LEGACY_WEEKLY_HOT_ANIME,
]);

export const FEATURED_ANIME_IDS: number[] = WEEKLY_HOT_ANIME.filter((item) => item.type === "tv").map(
  (item) => item.id
);

export const FEATURED_ANIME_KEYWORDS: string[] = [
  "انمي مترجم اون لاين",
  "أشهر الانميات",
  "انميات جديدة 2026",
  "الاكثر بحثا انمي",
  "One Piece",
  "ون بيس",
  "مشاهدة One Piece مترجم",
  "انمي ون بيس مترجم اون لاين",
  "Demon Slayer",
  "قاتل الشياطين",
  "مشاهدة Demon Slayer مترجم",
  "انمي قاتل الشياطين مترجم",
  "Jujutsu Kaisen",
  "جوجوتسو كايسن",
  "مشاهدة Jujutsu Kaisen مترجم",
  "انمي جوجوتسو مترجم",
  "Attack on Titan",
  "هجوم العمالقة",
  "مشاهدة Attack on Titan مترجم",
  "انمي هجوم العمالقة مترجم",
  "Solo Leveling",
  "سولوليفينغ",
  "مشاهدة Solo Leveling مترجم",
  "انمي سولو ليفلنغ مترجم",
  "Dandadan",
  "Dan Da Dan",
  "داندا دان",
  "مشاهدة Dandadan مترجم",
  "انمي داندا دان مترجم",
  "Frieren",
  "فريرن",
  "مشاهدة Frieren مترجم",
  "انمي فريرن مترجم",
  "Chainsaw Man",
  "رجل المنشار",
  "مشاهدة Chainsaw Man مترجم",
  "Spy x Family",
  "سباي فاميلي",
  "مشاهدة Spy x Family مترجم",
  "My Hero Academia",
  "أكاديمية البطولة",
  "مشاهدة My Hero Academia مترجم",
  "Re:Zero",
  "ري زيرو",
  "مشاهدة Re:Zero مترجم",
  "Mashle",
  "ماشل",
  "مشاهدة Mashle مترجم",
  "Kaiju No. 8",
  "كيجو رقم 8",
  "مشاهدة Kaiju No. 8 مترجم",
  "The Apothecary Diaries",
  "مذكرات الصيدلانية",
  "مشاهدة The Apothecary Diaries مترجم",
  "Sakamoto Days",
  "أيام ساكاموتو",
  "مشاهدة Sakamoto Days مترجم",
  "Gachiakuta",
  "غاتشياكوتا",
  "مشاهدة Gachiakuta مترجم",
  "Wind Breaker",
  "ويند بريكر",
  "مشاهدة Wind Breaker مترجم",
  "Oshi no Ko",
  "أوشي نو كو",
  "مشاهدة Oshi no Ko مترجم",
  "One Punch Man",
  "رجل اللكمة الواحدة",
  "مشاهدة One Punch Man مترجم",
  "Hunter x Hunter",
  "القناص",
  "مشاهدة Hunter x Hunter مترجم",
  "Death Note",
  "مذكرة الموت",
  "مشاهدة Death Note مترجم",
  "Naruto",
  "ناروتو",
  "مشاهدة Naruto مترجم",
  "Bleach",
  "بليتش",
  "مشاهدة Bleach مترجم",
  "Vinland Saga",
  "ملحمة فينلاند",
  "مشاهدة Vinland Saga مترجم",
  "Blue Lock",
  "بلو لوك",
  "مشاهدة Blue Lock مترجم",
  "Dr. Stone",
  "دكتور ستون",
  "مشاهدة Dr. Stone مترجم",
  "Fullmetal Alchemist Brotherhood",
  "الخيميائي الفولاذي",
  "مشاهدة Fullmetal Alchemist مترجم",
  "Haikyuu",
  "هايكيو",
  "مشاهدة Haikyuu مترجم",
  "Black Clover",
  "بلاك كلوفر",
  "مشاهدة Black Clover مترجم",
  "Fire Force",
  "فاير فورس",
  "مشاهدة Fire Force مترجم",
  "Yuusha Party wo Oidasareta Kiyoubinbou",
  "Jack-of-All-Trades, Party of None",
  "勇者パーティを追い出された器用貧乏",
  "Overgeared",
  "Overgeared anime",
  "Boarding School Juliet",
  "مشاهدة Boarding School Juliet",
  "انمي Boarding School Juliet مترجم",
  "جولييت مدرسة داخلية",
  "أكاديمية جولييت انمي",
  "Akame ga Kill",
  "Akame ga Kill!",
  "مشاهدة Akame ga Kill",
  "انمي Akame ga Kill مترجم",
  "أكامي غا كيل",
  "The Girl Downstairs",
  "The girl downstairs its very good give it a try",
  "مشاهدة The Girl Downstairs",
  "انمي The Girl Downstairs مترجم",
  "الفتاة في الطابق السفلي",
  "Summer Pockets",
  "مشاهدة Summer Pockets",
  "انمي Summer Pockets مترجم",
  "Rich Girl",
  "Rich Girl Caretaker",
  "مشاهدة Rich Girl",
  "انمي Rich Girl مترجم",
  "Komi Can't Communicate",
  "Komi Cant Communicate",
  "مشاهدة Komi Can't Communicate",
  "انمي كومي مترجم",
  "كومي لا تستطيع التواصل",
  "Engage Kiss",
  "مشاهدة Engage Kiss",
  "انمي Engage Kiss مترجم",
  "Mistress Kanan is Devilishly Easy",
  "Mistress Kanan Is Devilishly Easy",
  "مشاهدة Mistress Kanan",
  "انمي كنان مترجم",
  "Charlotte",
  "انمي Charlotte مترجم",
  "مشاهدة انمي شارلوت",
  "شارلوت انمي",
  "Inexpressive Kashiwada and Expressive Oota",
  "مشاهدة Kashiwada",
  "انمي Kashiwada مترجم",
  "And You Thought There Is Never a Girl Online",
  "And You Thought There Is Never a Girl Online?",
  "Netoge no Yome",
  "مشاهدة نتوجي",
  "انمي نتوجي مترجم",
  "High School of the Dead",
  "Highschool of the Dead",
  "مشاهدة High School of the Dead",
  "انمي ثانوية الموتى",
  "ثانوية الموتى انمي",
  "Above Myriads",
  "مشاهدة Above Myriads",
  "انمي Above Myriads مترجم",
  "万人之上",
  "Komori-san Can't Decline",
  "Komori-san Can't Decline!",
  "مشاهدة Komori-san Can't Decline",
  "انمي كوموري مترجم",
  "كوموري سان لا تستطيع الرفض",
  "Assassination Classroom",
  "مشاهدة Assassination Classroom",
  "انمي Assassination Classroom مترجم",
  "فصل الاغتيال",
  "انمي فصل الاغتيال مترجم",
  "Healer Girl",
  "مشاهدة Healer Girl",
  "انمي Healer Girl مترجم",
  "فتاة الشفاء",
  "The Brilliant Healer's New Life in the Shadows",
  "مشاهدة The Brilliant Healer's New Life in the Shadows",
  "انمي The Brilliant Healer's New Life in the Shadows مترجم",
  "المعالج العبقري حياة جديدة في الظلال",
  "Sankarea",
  "Sankarea: Undying Love",
  "مشاهدة Sankarea",
  "انمي Sankarea مترجم",
  "سانكاريا",
  "Uncle from Another World",
  "مشاهدة Uncle from Another World",
  "انمي Uncle from Another World مترجم",
  "العم من عالم آخر",
  "The Detective Is Already Dead",
  "مشاهدة The Detective Is Already Dead",
  "انمي The Detective Is Already Dead مترجم",
  "المحقق ميت بالفعل",
  "My Wife is the Student Council President",
  "مشاهدة My Wife is the Student Council President",
  "انمي My Wife is the Student Council President مترجم",
  "زوجتي رئيسة مجلس الطلاب",
  "Shikimori's Not Just a Cutie",
  "مشاهدة Shikimori's Not Just a Cutie",
  "انمي Shikimori's Not Just a Cutie مترجم",
  "شيكيموري ليست لطيفة فقط",
  "Heaven's Lost Property",
  "Sora no Otoshimono",
  "مشاهدة Heaven's Lost Property",
  "انمي Heaven's Lost Property مترجم",
  "ممتلكات السماء المفقودة",
  "More than a Married Couple, but Not Lovers",
  "More than a Married Couple, but Not Lovers.",
  "مشاهدة More than a Married Couple, but Not Lovers",
  "انمي More than a Married Couple, but Not Lovers مترجم",
  "أكثر من زوجين لكن لسنا عشاق",
  "Kiss x Sis",
  "KissXSis",
  "مشاهدة Kiss x Sis",
  "انمي Kiss x Sis مترجم",
  "Yano-kun's Ordinary Days",
  "مشاهدة Yano-kun's Ordinary Days",
  "انمي Yano-kun's Ordinary Days مترجم",
  "أيام يانو العادية",
  "Apocalypse Bringer Mynoghra",
  "مشاهدة Apocalypse Bringer Mynoghra",
  "انمي Apocalypse Bringer Mynoghra مترجم",
  "مينوغرا جالب القيامة",
  "The Eclipse",
  "Shoku",
  "Berserk The Eclipse",
  "Berserk: The Golden Age Arc III - The Advent",
  "مشاهدة The Eclipse Berserk",
  "انمي بيرسيرك الكسوف مترجم",
  "الكسوف بيرسيرك",
  "Nisekoi",
  "Nisekoi: False Love",
  "مشاهدة Nisekoi",
  "انمي Nisekoi مترجم",
  "نيسيكوي حب مزيف",
  "Tougen Anki",
  "مشاهدة Tougen Anki",
  "انمي Tougen Anki مترجم",
  "توغن أنكي",
  "Lovely Complex",
  "Lovely★Complex",
  "مشاهدة Lovely Complex",
  "انمي Lovely Complex مترجم",
  "لافلي كومبلكس",
  "The Reincarnation Of The Strongest Exorcist In Another World",
  "The Reincarnation of the Strongest Exorcist in Another World",
  "مشاهدة The Reincarnation Of The Strongest Exorcist In Another World",
  "انمي أقوى طارد أرواح في عالم آخر مترجم",
  "تناسخ أقوى طارد أرواح",
  "Rent-a-Girlfriend",
  "Kanojo Okarishimasu",
  "مشاهدة Rent-a-Girlfriend",
  "انمي Rent-a-Girlfriend مترجم",
  "صديقة للإيجار",
  "Hundred",
  "انمي Hundred",
  "مشاهدة انمي Hundred",
  "انمي Hundred مترجم",
  "هاندرِد انمي",
  "Tunnel to Summer",
  "The Tunnel to Summer, the Exit of Goodbyes",
  "مشاهدة Tunnel to Summer",
  "انمي Tunnel to Summer مترجم",
  "نفق الصيف مخرج الوداع",
  "The Wrong Way to Use Healing Magic",
  "مشاهدة The Wrong Way to Use Healing Magic",
  "انمي The Wrong Way to Use Healing Magic مترجم",
  "الطريقة الخاطئة لاستخدام سحر الشفاء",
  "I Got a Cheat Skill in Another World",
  "I Got a Cheat Skill in Another World and Became Unrivaled in the Real World, Too",
  "مشاهدة I Got a Cheat Skill in Another World",
  "انمي I Got a Cheat Skill in Another World مترجم",
  "مهارة غش في عالم آخر",
  "Classroom of the Elite",
  "Youkoso Jitsuryoku Shijou Shugi no Kyoushitsu e",
  "مشاهدة Classroom of the Elite",
  "انمي Classroom of the Elite مترجم",
  "فصل النخبة",
  "Record Of Ragnarok",
  "Record of Ragnarok",
  "Shuumatsu no Valkyrie",
  "مشاهدة Record Of Ragnarok",
  "انمي Record Of Ragnarok مترجم",
  "سجل راجناروك",
  "الأكثر مشاهدة انمي هذا الأسبوع",
];
