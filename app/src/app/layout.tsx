import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "أكواد GS1 مصر | البحث في أكواد المنظومة الضريبية",
  description:
    "محرك بحث ذكي لأكواد GS1 الخاصة بالمنظومة الضريبية المصرية والفواتير الإلكترونية. ابحث عن كود أي منتج أو خدمة بسهولة.",
  keywords:
    "GS1, أكواد, فاتورة إلكترونية, ضرائب, مصر, GPC, منظومة ضريبية, e-invoicing",
  openGraph: {
    title: "أكواد GS1 مصر",
    description: "ابحث عن أكواد المنظومة الضريبية المصرية",
    locale: "ar_EG",
    type: "website",
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
