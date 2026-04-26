import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "عن الموقع",
  description:
    "تعرف على محرك بحث أكواد GS1 مصر — كيف يعمل البحث الذكي، ما هي أكواد GPC والتصنيف العالمي للمنتجات، وإزاي تستخدم الموقع للفاتورة الإلكترونية.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "عن أكواد GS1 مصر | كيف يعمل البحث الذكي",
    description:
      "تعرف على محرك البحث الذكي لأكواد الفاتورة الإلكترونية المصرية — كيف يعمل وكيف تستخدمه.",
    url: "https://gs1-lookup.moemenhamdy.com/about",
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-8">
        عن الموقع
      </h1>

      {/* What is this */}
      <section className="mb-10">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
              <span className="material-icons-round text-primary-600 dark:text-primary-400">
                info
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              إيه هو الموقع ده؟
            </h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm mb-4">
            الموقع ده محرك بحث ذكي بيساعدك تلاقي أكواد المنتجات والخدمات اللي
            محتاجها عشان الفاتورة الإلكترونية في المنظومة الضريبية المصرية.
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            البيانات مأخوذة من التصنيف العالمي للمنتجات (GPC) اللي بتوفره منظمة
            GS1، وده التصنيف المعتمد من مصلحة الضرائب المصرية في منظومة الفواتير
            الإلكترونية.
          </p>
        </div>
      </section>

      {/* GS1 GPC Explanation */}
      <section className="mb-10">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
              <span className="material-icons-round text-amber-600 dark:text-amber-400">
                qr_code_2
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              يعني إيه GS1 و GPC؟
            </h2>
          </div>
          <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              <strong className="text-slate-800 dark:text-slate-100">GS1</strong>{" "}
              هي منظمة عالمية غير هادفة للربح بتوفر معايير عالمية لتحديد المنتجات
              والخدمات. الباركود اللي بتشوفه على أي منتج ده من معايير GS1.
            </p>
            <p>
              <strong className="text-slate-800 dark:text-slate-100">GPC</strong>{" "}
              (Global Product Classification) هو نظام التصنيف العالمي للمنتجات.
              كل منتج أو خدمة ليهم كود رقمي فريد بيتم استخدامه في الفاتورة
              الإلكترونية.
            </p>
          </div>
        </div>
      </section>

      {/* How to use */}
      <section className="mb-10">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
              <span className="material-icons-round text-emerald-600 dark:text-emerald-400">
                help
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              إزاي تستخدم الموقع؟
            </h2>
          </div>
          <div className="space-y-4">
            {[
              {
                step: "1",
                title: "ابحث عن المنتج",
                desc: "اكتب اسم المنتج أو الخدمة في خانة البحث. البحث الذكي هيفهم اللي بتدور عليه حتى لو الكلمات مش بالظبط.",
                icon: "search",
              },
              {
                step: "2",
                title: "اختار النتيجة المناسبة",
                desc: "هتظهرلك نتائج مرتبة حسب التشابه. النتيجة الأقرب ليك هتكون فوق ومميزة.",
                icon: "touch_app",
              },
              {
                step: "3",
                title: "انسخ الكود",
                desc: "اضغط على كود GS1 لنسخه تلقائياً واستخدمه في الفاتورة الإلكترونية.",
                icon: "content_copy",
              },
              {
                step: "4",
                title: "أو تصفح الأكواد",
                desc: "ممكن تستعرض كل الأكواد مصنفة من صفحة التصفح، وتحملها كملف Excel.",
                icon: "category",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0 mono-numbers text-sm font-bold text-primary-700 dark:text-primary-300">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-5">
          أسئلة شائعة
        </h2>
        <div className="space-y-4">
          {[
            {
              q: "البيانات دي رسمية؟",
              a: "البيانات مأخوذة من التصنيف العالمي للمنتجات GPC المنشور من منظمة GS1. يُنصح بمراجعة البيانات مع مصلحة الضرائب المصرية للتأكد من التحديثات.",
            },
            {
              q: "البحث بيشتغل إزاي؟",
              a: "البحث بيستخدم تقنية البحث الدلالي (Semantic Search) اللي بتفهم المعنى مش بس الكلمات. يعني لو كتبت 'موبايل' هيلاقيلك 'الهواتف المحمولة / الهواتف الذكية'.",
            },
            {
              q: "ممكن أحمل كل الأكواد؟",
              a: "أيوا! من صفحة التصفح ممكن تحمل كل الأكواد كملف Excel منظم ومصنف.",
            },
            {
              q: "الموقع مجاني؟",
              a: "أيوا، الموقع مجاني تماماً ومتاح للجميع.",
            },
          ].map((faq, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700"
            >
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                <span className="material-icons-round text-primary-500 text-[18px]">
                  help_outline
                </span>
                {faq.q}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed pr-7">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Credits */}
      <section className="mt-10 mb-6">
        <div className="bg-gradient-to-br from-primary-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 border border-primary-100 dark:border-slate-700 flex flex-col items-center justify-center text-center">
          <p className="text-base font-medium text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 flex-wrap">
            صنع بـ <span className="text-red-500 text-lg">❤️</span> بواسطة <span className="font-bold text-primary-600 dark:text-primary-400">Moemen Hamdy</span>
          </p>
        </div>
      </section>
    </div>
  );
}
