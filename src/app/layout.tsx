import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { LanguageProvider } from "@/hooks/useLanguage";
import { ThemeProvider } from "@/components/ThemeProvider";
import { FontSettingsApplier } from "@/components/FontSettingsApplier";

/** رابط خطوط Google (20 خطاً) — تُحمّل مرة واحدة وتُطبَّق من لوحة الأدمن */
const FONTS_LINK =
  "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;500;600;700&family=Tajawal:wght@400;500;700&family=Almarai:wght@400;700&family=Changa:wght@400;500;600;700&family=El+Messiri:wght@400;500;600;700&family=Lateef:wght@400;700&family=Noto+Kufi+Arabic:wght@400;500;600;700&family=Noto+Naskh+Arabic:wght@400;500;600;700&family=Noto+Sans+Arabic:wght@400;500;600;700&family=Scheherazade+New:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Readex+Pro:wght@400;500;600;700&family=Rubik:wght@400;500;600;700&family=Rakkas&family=Aref+Ruqaa+Ink:wght@400;700&family=Katibeh&family=Lemonada:wght@400;500;600;700&family=Markazi+Text:wght@400;500;600;700&family=Jomhuria&display=swap";

export const metadata: Metadata = {
  title: "CIAR - شركة خدمات رقمية | 14 موقعاً: عقاري، سياحي، موضة، تجارة إلكترونية",
  description: "شركة CIAR تقدم خدماتها عبر 14 موقعاً إلكترونياً: عقاري، سياحي، موضة، تجارة إلكترونية، سيارات، توظيف، استثمار، تسويق، لوجستيات، وغيرها.",
  keywords: ["CIAR", "عقاري", "سياحي", "موضة", "تجارة إلكترونية", "سيارات", "توظيف", "استثمار", "شركة خدمات"],
  authors: [{ name: "CIAR" }],
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "CIAR - شركة خدمات رقمية | 14 موقعاً يخدمونك",
    description: "عقاري، سياحي، موضة، تجارة إلكترونية، سيارات، توظيف، استثمار — كل ما تحتاجه تحت سقف واحد",
    url: "https://ciar.com",
    siteName: "CIAR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CIAR - شركة خدمات رقمية | 14 موقعاً",
    description: "عقاري، سياحي، موضة، تجارة إلكترونية وأكثر",
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
        <link rel="stylesheet" href={FONTS_LINK} />
      </head>
      <body className="antialiased bg-background text-foreground font-arabic">
        {/* تطبيق الثيم قبل التهيئة لمنع الوميض وتأكيد عمل data-theme على html */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('ciar-theme');var r=t==='dark'||t==='light'?t:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',r);})();`,
          }}
        />
        <ThemeProvider>
          <FontSettingsApplier />
          <LanguageProvider>
            {children}
            <Toaster />
            <SonnerToaster position="top-left" dir="rtl" />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
