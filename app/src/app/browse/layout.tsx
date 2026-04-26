import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تصفح الأكواد",
  description:
    "استعرض جميع أكواد GS1 و GPC المصنفة والمنظمة للمنظومة الضريبية المصرية. حمّل الأكواد كملف Excel أو PDF مجاناً.",
  alternates: {
    canonical: "/browse",
  },
  openGraph: {
    title: "تصفح أكواد GS1 مصر | جميع الأكواد مصنفة",
    description:
      "استعرض وحمّل جميع أكواد GPC للفاتورة الإلكترونية المصرية — مصنفة ومنظمة.",
    url: "https://gs1-lookup.moemenhamdy.com/browse",
  },
};

export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
