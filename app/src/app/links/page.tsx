import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "روابط مهمة",
  description:
    "روابط مفيدة للفاتورة الإلكترونية والمنظومة الضريبية المصرية — بوابة الفاتورة الإلكترونية، مصلحة الضرائب المصرية، GS1 مصر، ودليل أكواد EGS.",
  alternates: {
    canonical: "/links",
  },
  openGraph: {
    title: "روابط مهمة | أكواد GS1 مصر",
    description:
      "روابط مفيدة هتحتاجها في شغلك مع الفاتورة الإلكترونية والمنظومة الضريبية.",
    url: "https://gs1-lookup.moemenhamdy.com/links",
  },
};

const links = [
  {
    title: "بوابة الفاتورة الإلكترونية",
    description:
      "البوابة الرسمية لمنظومة الفواتير الإلكترونية — مصلحة الضرائب المصرية. من هنا تقدر تسجل وتصدر فواتيرك الإلكترونية.",
    url: "https://invoicing.eta.gov.eg/",
    icon: "receipt_long",
    color: "primary",
  },
  {
    title: "مصلحة الضرائب المصرية",
    description:
      "الموقع الرسمي لمصلحة الضرائب المصرية. فيه كل المعلومات والتحديثات الخاصة بالضرائب.",
    url: "https://www.eta.gov.eg/",
    icon: "account_balance",
    color: "amber",
  },
  {
    title: "GS1 مصر",
    description:
      "الموقع الرسمي لمنظمة GS1 في مصر. بتوفر أكواد الباركود والتصنيفات العالمية للمنتجات.",
    url: "https://www.gs1eg.org/",
    icon: "qr_code_2",
    color: "emerald",
  },
  {
    title: "GS1 العالمية",
    description:
      "الموقع الرسمي لمنظمة GS1 العالمية — مصدر التصنيف العالمي للمنتجات GPC.",
    url: "https://www.gs1.org/",
    icon: "public",
    color: "blue",
  },
  {
    title: "بوابة الضرائب المصرية",
    description:
      "بوابة مصلحة الضرائب المصرية للخدمات الإلكترونية — تقديم الإقرارات والاستعلامات.",
    url: "https://eservice.incometax.gov.eg/",
    icon: "language",
    color: "violet",
  },
  {
    title: "دليل أكواد EGS",
    description:
      "كود EGS هو الكود الداخلي للمنشأة. يستخدم مع كود GS1 في الفاتورة الإلكترونية.",
    url: "https://sdk.invoicing.eta.gov.eg/codes/",
    icon: "code",
    color: "rose",
  },
];

const colorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
  primary: {
    bg: "bg-primary-50 dark:bg-primary-900/20",
    text: "text-primary-600 dark:text-primary-400",
    iconBg: "bg-primary-100 dark:bg-primary-900/40",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
  },
  violet: {
    bg: "bg-violet-50 dark:bg-violet-900/20",
    text: "text-violet-600 dark:text-violet-400",
    iconBg: "bg-violet-100 dark:bg-violet-900/40",
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-900/20",
    text: "text-rose-600 dark:text-rose-400",
    iconBg: "bg-rose-100 dark:bg-rose-900/40",
  },
};

export default function LinksPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
          روابط مهمة
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          روابط مفيدة هتحتاجها في شغلك مع الفاتورة الإلكترونية والمنظومة
          الضريبية
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {links.map((link) => {
          const colors = colorMap[link.color];
          return (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-black/20 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
                >
                  <span
                    className={`material-icons-round ${colors.text} text-xl`}
                  >
                    {link.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {link.title}
                    </h3>
                    <span className="material-icons-round text-slate-300 dark:text-slate-600 text-[14px] group-hover:text-primary-400 transition-colors">
                      open_in_new
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {link.description}
                  </p>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
