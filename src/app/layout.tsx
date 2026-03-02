import type { Metadata } from "next";
import { Cairo, Amiri, Tajawal } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { LanguageProvider } from "@/hooks/useLanguage";
import { ThemeProvider } from "@/components/ThemeProvider";

const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", display: "swap" });
const amiri = Amiri({ weight: ["400", "700"], subsets: ["arabic", "latin"], variable: "--font-amiri", display: "swap" });
const tajawal = Tajawal({ weight: ["400", "500", "700"], subsets: ["arabic"], variable: "--font-tajawal", display: "swap" });

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
    <html lang="ar" dir="rtl" suppressHydrationWarning className={`${cairo.variable} ${amiri.variable} ${tajawal.variable}`}>
      <body className="antialiased bg-background text-foreground font-arabic">
        {/* تطبيق الثيم قبل التهيئة لمنع الوميض وتأكيد عمل data-theme على html */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('ciar-theme');var r=t==='dark'||t==='light'?t:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',r);})();`,
          }}
        />
        <ThemeProvider>
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
