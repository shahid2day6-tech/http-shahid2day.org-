/** Pinned homepage rails — TMDB ids with posters/backdrops. */

export type WeeklyHotAnime = { id: number; type: "tv" | "movie" };

/** الأكثر مشاهدة انمي هذا الأسبوع — order matches the requested lists. */
export const WEEKLY_HOT_ANIME: WeeklyHotAnime[] = [
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

export const FEATURED_ANIME_IDS: number[] = WEEKLY_HOT_ANIME.filter((item) => item.type === "tv").map(
  (item) => item.id
);

export const FEATURED_ANIME_KEYWORDS: string[] = [
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
