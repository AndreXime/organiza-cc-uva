import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { processDisciplinas, processEquivalentes } from '@/lib/utils/csvToObject';
import StoreInitializer from '@/store/disciplinas/DisciplinaStoreInitilizer';

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Gerenciador de Progresso Acadêmico',
    description: 'Para o curso de Ciência da Computação da Universidade Estadual do Vale do Acaraú',
    icons: {
        icon: '/favicon.ico',
    },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const DisciplinasCurso = processDisciplinas('./data/Disciplinas.csv');
    const DisciplinasEquivalentes = processEquivalentes('./data/Equivalentes.csv', DisciplinasCurso);

    return (
        <html lang="pt-br">
            <StoreInitializer data={{ DisciplinasCurso, DisciplinasEquivalentes }} />
            <body className={`${inter.variable} antialiased`}>{children}</body>
        </html>
    );
}
