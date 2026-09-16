import React from 'react';
import './globals.css';
import { AppProvider } from '../context/AppContext';
import { AppShell } from '../components/AppShell';

export const metadata = {
  title: 'فرصة - منصة التوظيف والتواصل المهني',
  description: 'منصة فرصة الحديثة للتوظيف والتواصل المهني في العالم العربي بتصميم عصري باللونين الأبيض والأزرق وسهولة تامة في الاستخدام.',
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
  openGraph: {
    title: 'فرصة - منصة التوظيف والتواصل المهني',
    description: 'منصة فرصة الحديثة للتوظيف والتواصل المهني في العالم العربي بتصميم عصري باللونين الأبيض والأزرق وسهولة تامة في الاستخدام.',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Tajawal:wght@400;500;700;800;900&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="font-sans bg-slate-50 text-slate-900 antialiased min-h-screen">
        <AppProvider>
          <AppShell>
            {children}
          </AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
