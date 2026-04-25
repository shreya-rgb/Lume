import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LUMÉ — Your Personal Beauty & Style AI",
  description: "LUMÉ is your personal AI beauty and style assistant. Get personalized skincare routines, outfit advice, makeup tips, and more.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "LUMÉ — Your Personal Beauty & Style AI",
    description: "Personalized skincare, makeup, outfit & haircare advice powered by AI.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "LUMÉ — Your Personal Beauty & Style AI",
    description: "Personalized skincare, makeup, outfit & haircare advice powered by AI.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-[#FDF8F5] dark:bg-[#121212] text-[#2C2C2C] dark:text-[#f0e8e0]">
        <ThemeInitializer />
        {children}
      </body>
    </html>
  );
}

function ThemeInitializer() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){try{var t=localStorage.getItem('lume-theme');if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}})();`,
      }}
    />
  );
}
