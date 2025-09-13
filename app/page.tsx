'use client';

import Gerenciador from '@/components/core/Gerenciador';
import HorarioManager from '@/components/core/HorarioManager';
import Sobre from '@/components/core/SobreProjeto';
import Popup from '@/components/ui/Popup';
import Tabs from '@/components/ui/Tabs';
import { useUI } from '@/context/UIContext';

export default function Home() {
    const { Tab } = useUI();

    const ActiveTab = () => {
        switch (Tab) {
            case 'gerenciador':
                return <Gerenciador />;
            case 'horario':
                return <HorarioManager />;
            case 'sobre':
                return <Sobre />;
        }
    };

    return (
        <main className="container mx-auto p-4 py-8">
            <header className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-blue-700">Gerenciador de Progresso Acadêmico</h1>
                <p className="text-gray-500 mt-2">
                    Para o curso de Ciência da Computação da Universidade Estadual do Vale do Acaraú
                </p>
            </header>
            <Tabs />

            <main>
                <ActiveTab />
            </main>

            <Popup />
        </main>
    );
}
