import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  metadataBase: new URL('https://gs1-lookup.moemenhamdy.com'),
  title: {
    default: "أكواد GS1 مصر | منظومة الفاتورة الإلكترونية",
    template: "%s | أكواد GS1 مصر",
  },
  description:
    "المحرك الذكي الأسرع والأدق للبحث في أكواد GS1 الضريبية في مصر. استعرض أكثر من 5,000 كود GPC لتسجيل فواتيرك الإلكترونية بسهولة تامة.",
  keywords:
    "GS1, أكواد, فاتورة إلكترونية, ضرائب, مصر, GPC, منظومة ضريبية, e-invoicing, كود صنف, مصلحة الضرائب, GS1 Egypt, tax codes, e-invoice, ETA, كود المنتج, الفاتورة الالكترونية",
  authors: [{ name: "Moemen Hamdy", url: "https://moemenhamdy.com" }],
  creator: "Moemen Hamdy",
  publisher: "Moemen Hamdy",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "أكواد GS1 مصر | البحث في أكواد المنظومة الضريبية",
    description: "محرك بحث ذكي لأكواد الضريبة والفواتير الإلكترونية (GPC & GS1) في مصر. ابحث، تصفح، وحمّل أكثر من 5,000 كود مجاناً.",
    url: "https://gs1-lookup.moemenhamdy.com",
    siteName: "أكواد GS1 مصر",
    locale: "ar_EG",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "أكواد GS1 مصر - محرك البحث الذكي لأكواد الفاتورة الإلكترونية",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "أكواد GS1 مصر | منظومة الفاتورة الإلكترونية",
    description: "ابحث، تصفح، وحمّل أكواد GPC الخاصة بمنظومة الفواتير الإلكترونية المصرية. أكثر من 5,000 كود متاح مجاناً.",
    images: ["/og-image.png"],
    creator: "@moemenhamdy",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-icon.png',
  },
  category: "technology",
  verification: {},
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "أكواد GS1 مصر",
  alternateName: "GS1 Egypt Lookup",
  url: "https://gs1-lookup.moemenhamdy.com",
  description: "محرك بحث ذكي لأكواد المنظومة الضريبية المصرية - GPC & GS1 codes for Egyptian e-invoicing",
  inLanguage: "ar",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://gs1-lookup.moemenhamdy.com/?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
  publisher: {
    "@type": "Person",
    name: "Moemen Hamdy",
    url: "https://moemenhamdy.com",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "ما هي أكواد GS1؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "أكواد GS1 هي نظام تصنيف عالمي للمنتجات (GPC) توفره منظمة GS1. يُستخدم في منظومة الفاتورة الإلكترونية المصرية لتحديد نوع كل منتج أو خدمة.",
      },
    },
    {
      "@type": "Question",
      name: "كيف أجد كود المنتج للفاتورة الإلكترونية؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ابحث عن اسم المنتج أو الخدمة في محرك البحث الذكي. سيظهر لك الكود المناسب مع نسبة التطابق. يمكنك أيضاً تصفح جميع الأكواد من صفحة التصفح.",
      },
    },
    {
      "@type": "Question",
      name: "هل الموقع مجاني؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "نعم، الموقع مجاني تماماً ومتاح للجميع. يمكنك البحث وتصفح وتحميل جميع أكواد GS1 مجاناً.",
      },
    },
  ],
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
        <meta name="theme-color" content="#0d9488" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#134e4a" media="(prefers-color-scheme: dark)" />
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
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
