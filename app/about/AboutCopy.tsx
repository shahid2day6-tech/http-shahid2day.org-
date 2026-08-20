"use client";

import { useLang } from "../context/LanguageContext";

export default function AboutCopy() {
  const { lang } = useLang();
  const isAr = lang === "ar";

  return (
    <div className="mx-auto max-w-3xl px-4 pt-6 sm:px-6">
      <h1 className="mb-4 text-3xl font-bold text-white">
        {isAr ? "من نحن - shahid2day" : "About shahid2day"}
      </h1>
      <p className="mb-2 text-xs text-[#a3a3a3]">
        {isAr ? "آخر تحديث" : "Last updated"}: 2026-02-24
      </p>
      <p className="mb-8 text-sm leading-relaxed text-[#d6cfc2]">
        {isAr
          ? "أفلام ومسلسلات مترجمة اون لاين. shahid2day (شاهد تو داي) منصة لعرض واستكشاف المحتوى الترفيهي، تساعد المستخدمين في الوصول إلى الأفلام والمسلسلات والأنمي ضمن تجربة متعددة اللغات."
          : "SHAHID2DAY is an entertainment discovery platform that helps users find movies, TV series, and anime in one place, with a multilingual experience."}
      </p>

      <div className="space-y-6 text-sm leading-relaxed text-[#d6cfc2]">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-white">
            {isAr ? "أفلام ومسلسلات مترجمة اون لاين" : "Movies and series subtitled online"}
          </h2>
          <p>
            {isAr
              ? "أفلام ومسلسلات مترجمة اون لاين. شاهد أحدث الأفلام والمسلسلات المترجمة مجاناً بجودة HD على شاهد تو داي."
              : "Watch the latest subtitled movies and series in HD on SHAHID2DAY."}
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-white">{isAr ? "من نحن" : "Who we are"}</h2>
          <p>
            {isAr
              ? "يتم تشغيل shahid2day كمشروع رقمي يركز على اكتشاف المحتوى وتوفير تجربة تصفح سهلة بلغات متعددة."
              : "shahid2day is operated as a digital media project focused on content discovery, multilingual access, and user-friendly browsing."}
          </p>
          <p className="mt-2">
            {isAr
              ? "نعمل باستمرار على تحسين تجربة المستخدم ودعم اللغات واستقرار المنصة."
              : "We continuously improve user experience, language support, and platform reliability."}
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-white">{isAr ? "ما الذي نقدمه" : "What we provide"}</h2>
          <p>
            {isAr
              ? "نوفر صفحات تصفح وعرض بيانات المحتوى والتوصيات وواجهات تشغيل."
              : "We provide browsing pages, metadata presentation, recommendations, and playback interfaces."}
          </p>
          <p className="mt-2">
            {isAr
              ? "قد تختلف إتاحة المحتوى وجودة التشغيل حسب مزود الخدمة والمنطقة والظروف التقنية."
              : "Content availability and playback quality may vary depending on providers, regions, and technical conditions."}
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-white">{isAr ? "مسؤولية المستخدم" : "User responsibility"}</h2>
          <p>
            {isAr
              ? "المستخدم مسؤول عن الالتزام بالقوانين والأنظمة المحلية عند استخدام المحتوى."
              : "Users are responsible for complying with their local laws and regulations when accessing content."}
          </p>
          <p className="mt-2">
            {isAr
              ? "باستخدامك shahid2day فإنك توافق على الاستخدام القانوني والشخصي فقط."
              : "By using shahid2day, you agree to use the platform for lawful and personal purposes only."}
          </p>
        </section>
      </div>
    </div>
  );
}
