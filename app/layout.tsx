import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/lib/cart";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const bebas = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dmkapparel.com"),
  title: {
    default: "DMK Apparel — Mental Strength Is Trained",
    template: "%s · DMK Apparel",
  },
  description:
    "Streetwear built around mental health awareness and fitness as recovery. Hoodies, tees, and trucker hats from DMK Apparel.",
  openGraph: {
    title: "DMK Apparel — Mental Strength Is Trained",
    description:
      "Streetwear built around mental health awareness and fitness as recovery.",
    type: "website",
    images: ["/brand/logo-silver-512.png"],
  },
  icons: {
    icon: "/brand/logo-silver-512.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bebas.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-dmk-black text-foreground font-body"
      >
        <CartProvider>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
