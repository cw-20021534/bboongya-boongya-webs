import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';

import './globals.css';
import { StyledComponentsRegistry } from '@/components/styled-registry.tsx';

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
    <Script
     strategy="beforeInteractive"
     src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}`}
    />
    <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
   </body>
  </html>
 );
}
