import Link from "next/link";

const footerLinks = [
  { href: "/", label: "البحث" },
  { href: "/browse", label: "التصفح" },
  { href: "/about", label: "عن الموقع" },
  { href: "/links", label: "روابط مهمة" },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <span className="material-icons-round text-white text-base">
                  qr_code_2
                </span>
              </div>
              <span className="font-bold text-primary-700 dark:text-primary-400">
                أكواد GS1 مصر
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              محرك بحث ذكي لأكواد المنظومة الضريبية المصرية. بيساعدك تلاقي كود
              أي منتج أو خدمة بسهولة عشان الفاتورة الإلكترونية.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
              روابط سريعة
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* External Links */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
              روابط مهمة
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://invoicing.eta.gov.eg/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
                >
                  بوابة الفاتورة الإلكترونية
                  <span className="material-icons-round text-[12px]">
                    open_in_new
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.gs1eg.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
                >
                  GS1 مصر
                  <span className="material-icons-round text-[12px]">
                    open_in_new
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.eta.gov.eg/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
                >
                  مصلحة الضرائب المصرية
                  <span className="material-icons-round text-[12px]">
                    open_in_new
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} أكواد GS1 مصر — جميع الحقوق محفوظة
          </p>
          
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
            صنع بـ <span className="text-red-500 text-sm">❤️</span> بواسطة <span className="font-semibold text-primary-600 dark:text-primary-400">Moemen Hamdy</span>
          </p>

          <p className="text-xs text-slate-400 dark:text-slate-500">
            البيانات مأخوذة من التصنيف العالمي للمنتجات GPC
          </p>
        </div>
      </div>
    </footer>
  );
}
