import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'Skyra Platform Dashboard',
  description: 'Internal engineering showcase, design system browser, and QA workbench for the Skyra Platform UI foundation.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body>
        <Script id="theme-script" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: `
          try {
            var stored = localStorage.getItem('skyra_theme');
            if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark');
            }
          } catch(e) {}
        `}} />
        {children}
      </body>
    </html>
  );
}
