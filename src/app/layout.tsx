import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { PageStoreProvider } from '@/lib/store';
import ToastContainer from '@/components/ui/ToastContainer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Private Client Page Builder | Enterprise Client Portal Studio',
  description: 'Design, manage, and securely publish private bespoke client briefing pages with multi-tab layouts and private links.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-navy-50 text-navy-900 min-h-screen font-sans antialiased">
        <PageStoreProvider>
          {children}
          <ToastContainer />
        </PageStoreProvider>
      </body>
    </html>
  );
}
