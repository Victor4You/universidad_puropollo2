// src/providers/FontProvider.tsx
'use client';

import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

export function FontProvider({ children }: { children: React.ReactNode }) {
  return (
    <div className={inter.className}>
      {children}
    </div>
  );
}