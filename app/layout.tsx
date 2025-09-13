import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import DisciplinasServer from '@/lib/csvToObject';
import { UIProvider } from '@/context/UIContext';
import StoreInitializer from '@/store/StoreInitilizer';

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Gerenciador de Progresso Acadêmico',
    description: 'Para o curso de Ciência da Computação da Universidade Estadual do Vale do Acaraú',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-br">
            <UIProvider>
                <StoreInitializer disciplinas={DisciplinasServer} />
                <body className={`${inter.variable} antialiased`}>{children}</body>
            </UIProvider>
        </html>
    );
}
