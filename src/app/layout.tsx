import type { Metadata } from 'next';

import { Inter, Ultra } from "next/font/google";
import './globals.css';
import { Providers } from '../providers';



// Configure Inter font
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

// Configure Ultra font using next/font/google
const ultra = Ultra({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ultra",
  weight: "400",
});

export const metadata: Metadata = {
  title: 'Predict Galore - Smart predictions. Smarter choices.',
  description:
    'Predict Galore helps you make smarter sports predictions using insights and analytics.',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ultra.variable} ${inter.variable} --font-inter antialiased `}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}