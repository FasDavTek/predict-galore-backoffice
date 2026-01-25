import type { Metadata } from 'next';

import './globals.css';
import { Providers } from '../providers';

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
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
