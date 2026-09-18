import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';
import { BRAND } from '@/lib/constants';

export const metadata: Metadata = {
  title: `${BRAND.name} — AI Cybersecurity Threat Detection & Robustness`,
  description: 'Adversarially robust AI-powered phishing and cyber threat detection platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-text antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
