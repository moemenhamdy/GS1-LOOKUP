import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "أكواد GS1 مصر | منظومة الفاتورة الإلكترونية",
  description:
    "المحرك الذكي الأسرع والأدق للبحث في أكواد GS1 الضريبية في مصر. استعرض أكثر من 5,000 كود GPC لتسجيل فواتيرك الإلكترونية بسهولة تامة.",
  keywords:
    "GS1, أكواد, فاتورة إلكترونية, ضرائب, مصر, GPC, منظومة ضريبية, e-invoicing, كود صنف, مصلحة الضرائب",
  authors: [{ name: "Moemen Hamdy" }],
  creator: "Moemen Hamdy",
  openGraph: {
    title: "أكواد GS1 مصر | البحث في أكواد المنظومة الضريبية",
    description: "محرك بحث ذكي لأكواد الضريبة والفواتير الإلكترونية (GPC & GS1) في مصر. حمل ملف الإكسيل مجاناً.",
    url: "https://gs1-lookup.moemenhamdy.com",
    siteName: "أكواد GS1 مصر",
    locale: "ar_EG",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "أكواد GS1 مصر - البحث الذكي",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "أكواد GS1 مصر | منظومة الفاتورة الإلكترونية",
    description: "ابحث، تصفح، وحمّل أكواد GPC الخاصة بمنظومة الفواتير الإلكترونية المصرية.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen flex flex-col font-[var(--font-cairo)] antialiased">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
