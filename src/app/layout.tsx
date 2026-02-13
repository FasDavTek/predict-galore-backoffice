import type { Metadata } from 'next';
import { Inter, Ultra } from 'next/font/google';

import './globals.css';
import { Providers } from '../providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const ultra = Ultra({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-ultra',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Predict Galore - Smart predictions. Smarter choices.',
  description:
    'Predict Galore helps you make smarter sports predictions using insights and analytics.',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased ${inter.variable} ${ultra.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
