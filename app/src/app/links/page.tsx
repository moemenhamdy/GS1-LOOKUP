import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import {
  Receipt,
  Landmark,
  QrCode,
  Globe,
  Globe2,
  Code,
  ExternalLink,
} from "lucide-react";

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
    url: "https://gs1-lookup.moemenhamdy.me/links",
  },
};

const links = [
  {
    title: "بوابة الفاتورة الإلكترونية",
    description:
      "البوابة الرسمية لمنظومة الفواتير الإلكترونية — مصلحة الضرائب المصرية. من هنا تقدر تسجل وتصدر فواتيرك الإلكترونية.",
    url: "https://invoicing.eta.gov.eg/",
    icon: Receipt,
    color: "primary",
  },
  {
    title: "مصلحة الضرائب المصرية",
    description:
      "الموقع الرسمي لمصلحة الضرائب المصرية. فيه كل المعلومات والتحديثات الخاصة بالضرائب.",
    url: "https://www.eta.gov.eg/",
    icon: Landmark,
    color: "amber",
  },
  {
    title: "GS1 مصر",
    description:
      "الموقع الرسمي لمنظمة GS1 في مصر. بتوفر أكواد الباركود والتصنيفات العالمية للمنتجات.",
    url: "https://www.gs1eg.org/",
    icon: QrCode,
    color: "emerald",
  },
  {
    title: "GS1 العالمية",
    description:
      "الموقع الرسمي لمنظمة GS1 العالمية — مصدر التصنيف العالمي للمنتجات GPC.",
    url: "https://www.gs1.org/",
    icon: Globe,
    color: "blue",
  },
  {
    title: "بوابة الضرائب المصرية",
    description:
      "بوابة مصلحة الضرائب المصرية للخدمات الإلكترونية — تقديم الإقرارات والاستعلامات.",
    url: "https://eservice.incometax.gov.eg/",
    icon: Globe2,
    color: "violet",
  },
  {
    title: "دليل أكواد EGS",
    description:
      "كود EGS هو الكود الداخلي للمنشأة. يستخدم مع كود GS1 في الفاتورة الإلكترونية.",
    url: "https://sdk.invoicing.eta.gov.eg/codes/",
    icon: Code,
    color: "rose",
  },
];

const colorMap: Record<string, { iconBg: string; iconColor: string }> = {
  primary: {
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  amber: {
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  emerald: {
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  blue: {
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  violet: {
    iconBg: "bg-violet-100 dark:bg-violet-900/40",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  rose: {
    iconBg: "bg-rose-100 dark:bg-rose-900/40",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
};

export default function LinksPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          روابط مهمة
        </h1>
        <p className="text-sm text-muted-foreground">
          روابط مفيدة هتحتاجها في شغلك مع الفاتورة الإلكترونية والمنظومة
          الضريبية
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {links.map((link) => {
          const colors = colorMap[link.color];
          const Icon = link.icon;
          return (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-border/80">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
                    >
                      <Icon className={`w-5 h-5 ${colors.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-foreground">
                          {link.title}
                        </h3>
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {link.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>
          );
        })}
      </div>
    </div>
  );
}
