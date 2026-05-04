import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Info,
  QrCode,
  HelpCircle,
  Search,
  MousePointerClick,
  Copy,
  LayoutGrid,
  Heart,
} from "lucide-react";

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
    url: "https://gs1-lookup.moemenhamdy.me/about",
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
        عن الموقع
      </h1>

      {/* What is this */}
      <section className="mb-10">
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Info className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-bold text-foreground">
                إيه هو الموقع ده؟
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed text-sm mb-4">
              الموقع ده محرك بحث ذكي بيساعدك تلاقي أكواد المنتجات والخدمات اللي
              محتاجها عشان الفاتورة الإلكترونية في المنظومة الضريبية المصرية.
            </p>
            <p className="text-muted-foreground leading-relaxed text-sm">
              البيانات مأخوذة من التصنيف العالمي للمنتجات (GPC) اللي بتوفره منظمة
              GS1، وده التصنيف المعتمد من مصلحة الضرائب المصرية في منظومة الفواتير
              الإلكترونية.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* GS1 GPC Explanation */}
      <section className="mb-10">
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                <QrCode className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-lg font-bold text-foreground">
                يعني إيه GS1 و GPC؟
              </h2>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">GS1</strong>{" "}
                هي منظمة عالمية غير هادفة للربح بتوفر معايير عالمية لتحديد المنتجات
                والخدمات. الباركود اللي بتشوفه على أي منتج ده من معايير GS1.
              </p>
              <p>
                <strong className="text-foreground">GPC</strong>{" "}
                (Global Product Classification) هو نظام التصنيف العالمي للمنتجات.
                كل منتج أو خدمة ليهم كود رقمي فريد بيتم استخدامه في الفاتورة
                الإلكترونية.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* How to use */}
      <section className="mb-10">
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-lg font-bold text-foreground">
                إزاي تستخدم الموقع؟
              </h2>
            </div>
            <div className="space-y-4">
              {[
                {
                  step: "1",
                  title: "ابحث عن المنتج",
                  desc: "اكتب اسم المنتج أو الخدمة في خانة البحث. البحث الذكي هيفهم اللي بتدور عليه حتى لو الكلمات مش بالظبط.",
                  icon: Search,
                },
                {
                  step: "2",
                  title: "اختار النتيجة المناسبة",
                  desc: "هتظهرلك نتائج مرتبة حسب التشابه. النتيجة الأقرب ليك هتكون فوق ومميزة.",
                  icon: MousePointerClick,
                },
                {
                  step: "3",
                  title: "انسخ الكود",
                  desc: "اضغط على كود GS1 لنسخه تلقائياً واستخدمه في الفاتورة الإلكترونية.",
                  icon: Copy,
                },
                {
                  step: "4",
                  title: "أو تصفح الأكواد",
                  desc: "ممكن تستعرض كل الأكواد مصنفة من صفحة التصفح، وتحملها كملف Excel.",
                  icon: LayoutGrid,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.step} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mono-numbers text-sm font-bold text-primary">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-xl font-bold text-foreground mb-5">
          أسئلة شائعة
        </h2>
        <Accordion className="space-y-3">
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
            <AccordionItem
              key={idx}
              className="bg-card rounded-2xl border border-border px-5 data-open:shadow-md transition-shadow"
            >
              <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline py-4">
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                  {faq.q}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pr-6 pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Credits */}
      <section className="mt-10 mb-6">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <p className="text-base font-medium text-foreground flex items-center justify-center gap-1.5 flex-wrap">
              صنع بـ <Heart className="w-4 h-4 text-red-500 fill-red-500" /> بواسطة <span className="font-bold text-primary">Moemen Hamdy</span>
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
