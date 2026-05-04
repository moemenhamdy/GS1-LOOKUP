import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { QrCode, ExternalLink, Heart } from "lucide-react";

const footerLinks = [
  { href: "/", label: "البحث" },
  { href: "/browse", label: "التصفح" },
  { href: "/about", label: "عن الموقع" },
  { href: "/links", label: "روابط مهمة" },
];

export function Footer() {
  return (
    <footer className="mt-auto">
      {/* Gradient divider */}
      <div className="gradient-divider" />

      <div className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
                  <QrCode className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-primary">
                  أكواد GS1 مصر
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                محرك بحث ذكي لأكواد المنظومة الضريبية المصرية. بيساعدك تلاقي كود
                أي منتج أو خدمة بسهولة عشان الفاتورة الإلكترونية.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">
                روابط سريعة
              </h3>
              <ul className="space-y-2">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* External Links */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">
                روابط مهمة
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://invoicing.eta.gov.eg/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  >
                    بوابة الفاتورة الإلكترونية
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.gs1eg.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  >
                    GS1 مصر
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.eta.gov.eg/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  >
                    مصلحة الضرائب المصرية
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} أكواد GS1 مصر — جميع الحقوق محفوظة
            </p>
            
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              صنع بـ <Heart className="w-3 h-3 text-red-500 fill-red-500" /> بواسطة{" "}
              <a
                href="https://moemenhamdy.me"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                Moemen Hamdy
              </a>
            </p>

            <p className="text-xs text-muted-foreground">
              البيانات مأخوذة من التصنيف العالمي للمنتجات GPC
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
