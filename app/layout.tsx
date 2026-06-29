import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DealDraft — AI-Powered Deal Memo Generator',
  description:
    'Generate professional investment memos from natural language prompts. Built with Next.js, TypeScript, and Claude AI.',
  openGraph: {
    title: 'DealDraft — AI Deal Memo Generator',
    description: 'Turn deal descriptions into structured investment memos in seconds.',
    url: 'https://dealdraft.vercel.app',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
