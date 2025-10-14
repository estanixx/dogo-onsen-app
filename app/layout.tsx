import { Toaster } from '@/components/ui/sonner';
import './globals.css';
import { Inter, Noto_Serif_JP } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const notoSerifJP = Noto_Serif_JP({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-noto-serif',
});

export const metadata = {
  title: 'Dogo Onsen',
  description: 'Portal espiritual del Dogo Onsen',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${notoSerifJP.variable}`}>
      <body className="overflow-y-auto font-base">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
