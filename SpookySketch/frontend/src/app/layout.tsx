import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SpookySketch - Halloween Drawing App',
  description: 'Create spooky drawings with friends in real-time',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1A1A1F',
                color: '#F5F5F5',
                border: '1px solid rgba(255, 107, 0, 0.3)',
              },
              success: {
                iconTheme: {
                  primary: '#FF6B00',
                  secondary: '#F5F5F5',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#F5F5F5',
                },
              },
            }}
          />
          <div className="fog" />
        </AuthProvider>
      </body>
    </html>
  );
}
