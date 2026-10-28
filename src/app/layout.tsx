import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import BrandProvider from '@/providers/BrandProvider';
import { resolveBrand } from '@/branding/brand';
import '../styles/globals.scss';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Merchant Portal',
  description: 'White-label merchant portal',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  const activeBrand = resolveBrand('ecg');

  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <BrandProvider brand={activeBrand} />
        {children}
      </body>
    </html>
  );
}
