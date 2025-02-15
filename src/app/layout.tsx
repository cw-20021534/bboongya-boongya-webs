import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';

const geistSans = Geist({
 variable: '--font-geist-sans',
 subsets: ['latin'],
});

const geistMono = Geist_Mono({
 variable: '--font-geist-mono',
 subsets: ['latin'],
});

export const metadata: Metadata = {
 title: '자전거 라이딩 추천 서비스',
 description: 'AI가 추천하는 최적의 자전거 라이딩 코스',
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
  <html lang="en" className="min-w-screen">
   <body className={`${geistSans.variable} ${geistMono.variable} min-w-screen antialiased`}>
    {children}
   </body>
  </html>
 );
}
