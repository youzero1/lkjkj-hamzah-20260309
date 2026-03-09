import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'lkjkj - E-Commerce Calculator',
  description: 'Calculate product prices, discounts, taxes, and shipping costs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">$</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {process.env.NEXT_PUBLIC_APP_NAME || 'lkjkj'}
                </span>
                <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
                  E-Commerce Calculator
                </span>
              </div>
              <div className="flex items-center gap-1">
                <a
                  href="/"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  Calculator
                </a>
                <a
                  href="/history"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  History
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="mt-16 border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-sm text-gray-400">
              &copy; {new Date().getFullYear()} lkjkj E-Commerce Calculator. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
