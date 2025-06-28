'use client';

import { useData } from '@/context/DataContext';
import Gerenciador from '@/components/core/Gerenciador';
import HorarioManager from '@/components/core/HorarioManager';
import Sobre from '@/components/core/SobreProjeto';
import TabelaDisciplinas from '@/components/core/TabelaDisciplinas';
import Tabs from '@/components/ui/Tabs';

export default function Home() {
    const { Tab } = useData();

    const ActiveTab = () => {
        switch (Tab) {
            case 'disciplinas':
                return <TabelaDisciplinas />;
            case 'gerenciador':
                return <Gerenciador />;
            case 'horario':
                return <HorarioManager />;
            case 'sobre':
                return <Sobre />;
        }
    };

    return (
        <main className="container mx-auto p-4 sm:p-6 md:p-8 py-12">
            <header className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-blue-700">Disciplinas de Ciências da Computação</h1>
                <p className="text-gray-500 mt-2">Um assistente para sua jornada acadêmica</p>
            </header>
            <Tabs />

            <main>
                <ActiveTab />
            </main>
        </main>
    );
}
