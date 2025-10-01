import type { Metadata } from "next";
import { Noto_Sans, Noto_Serif } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans({
  weight: "400",	
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

const notoSerif = Noto_Serif({
  weight: "400",	
  variable: "--font-noto-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dogo Onsen - Tu lugar favorito para disfrutar de la naturaleza",
  description: "Descubre el encanto de la naturaleza en Dogo Onsen. Nuestro lugar único te espera para relajarte, explorar y disfrutar de la belleza de la naturaleza.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${notoSans.variable} ${notoSerif.variable} ${notoSans.className} antialiased dark`}
      >
        <main className="w-full h-screen relative md:w-2/3 md:h-2/3 md:relative-none md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:shadow-2xl md:rounded-lg md:border-1">
          {children}
        </main>
      </body>
    </html>
  );
}
