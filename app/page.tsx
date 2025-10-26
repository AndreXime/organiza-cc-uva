'use client';

import Equivalentes from '@/components/core/Equivalentes';
import FiltroDisciplinas from '@/components/core/Filtrar';
import Gerenciador from '@/components/core/Gerenciador';
import HorarioManager from '@/components/core/HorarioManager';
import Planejador from '@/components/core/Planejador';
import Sobre from '@/components/core/SobreProjeto';
import Modal from '@/components/ui/Modal';
import Popup from '@/components/ui/Popup';
import Tabs from '@/components/ui/Tabs';
import { useUIStore } from '@/store/ui/uiStore';

export default function Home() {
    const Tab = useUIStore((state) => state.Tab);

    const ActiveTab = () => {
        switch (Tab) {
            case 'gerenciador':
                return <Gerenciador />;
            case 'horario':
                return <HorarioManager />;
            case 'sobre':
                return <Sobre />;
            case 'equivalente':
                return <Equivalentes />;
            case 'filtro':
                return <FiltroDisciplinas />;
            case 'planejador':
                return <Planejador />;
        }
    };

    return (
        <main className="container mx-auto p-4 py-8">
            <header className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-header-primary">
                    Gerenciador de Progresso Acadêmico
                </h1>
                <p className="text-foreground mt-2">
                    Para o curso de Ciência da Computação da Universidade Estadual do Vale do Acaraú
                </p>
            </header>
            <Tabs />

            <main>
                <ActiveTab />
            </main>

            <Popup />
            <Modal />
        </main>
    );
}
