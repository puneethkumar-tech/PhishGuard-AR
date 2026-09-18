import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { BRAND } from '@/lib/constants';

export const metadata: Metadata = {
  title: `${BRAND.name} — AI Cybersecurity Threat Detection & Robustness`,
  description: 'Adversarially robust AI-powered phishing and cyber threat detection platform.',
};

const themeScript = `
  (function() {
    try {
      var storedTheme = localStorage.getItem('phishguard_theme');
      var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var activeTheme = 'dark';
      if (storedTheme === 'light') {
        activeTheme = 'light';
      } else if (storedTheme === 'dark') {
        activeTheme = 'dark';
      } else if (storedTheme === 'system') {
        activeTheme = systemDark ? 'dark' : 'light';
      } else {
        activeTheme = 'dark';
      }
      var root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(activeTheme);
      root.setAttribute('data-theme', activeTheme);
      root.style.colorScheme = activeTheme;
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-background text-text antialiased">
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
