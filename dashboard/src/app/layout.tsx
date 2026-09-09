import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Skyra Platform Dashboard',
  description: 'Internal engineering showcase, design system browser, and QA workbench for the Skyra Platform UI foundation.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Dark mode: inline script sets class before paint to prevent flash */}
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            var stored = localStorage.getItem('skyra_theme');
            if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark');
            }
          } catch(e) {}
        `}} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
