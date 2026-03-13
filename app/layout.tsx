import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import React from 'react';

export const metadata = {
  title: 'SEO.PRO — Deep Audit Platform',
  description: 'Analisis SEO mendalam untuk website Anda.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* Explicit inline style as failsafe — overrides any dark-mode default */}
      <body className="mesh-bg min-h-dvh flex flex-col antialiased" style={{ backgroundColor: '#f8fafc', color: '#0f172a' }}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}