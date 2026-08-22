import type { Metadata, Viewport } from "next";
import { Heebo, Rubik_Mono_One } from "next/font/google";
import { getSeoMetadata } from "@/lib/content";
import { Providers } from "@/components/providers";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
  weight: ["400", "500", "700", "900"],
});

const rubikMono = Rubik_Mono_One({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-rubik-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata();

  return {
    title: seo.pageTitle,
    description: seo.metaDescription,
    keywords: seo.keywords.split(", ").map((k) => k.trim()),
    metadataBase: new URL(seo.canonicalUrl),
    alternates: {
      canonical: seo.canonicalUrl,
    },
    icons: {
      icon: "/favicon.svg",
    },
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      url: seo.canonicalUrl,
      siteName: seo.businessName,
      locale: "he_IL",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.ogTitle,
      description: seo.ogDescription,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#F2F2F2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} ${rubikMono.variable}`}>
      <body className="font-sans min-h-screen bg-terex-gray text-terex-charcoal">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
