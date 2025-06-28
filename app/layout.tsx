import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { DataProvider } from '@/context/DataContext';

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Disciplinas de Ciencias da Computação UVA',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-br">
            <DataProvider>
                <body className={`${inter.variable} antialiased`}>{children}</body>
            </DataProvider>
        </html>
    );
}
