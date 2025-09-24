import { useUIStore } from '@/store/ui/uiStore';

const botoes = [
    { label: 'Gerenciador de Disciplinas', path: 'gerenciador' },
    { label: 'Organizador de Horários', path: 'horario' },
    { label: 'Disciplinas Equivalentes', path: 'equivalente' },
    { label: 'Pesquisar Disciplinas', path: 'filtro' },
    { label: 'Planejador de Curso', path: 'planejador' },
    { label: 'Sobre o projeto', path: 'sobre' },
];

export default function Tabs() {
    const Tab = useUIStore((state) => state.Tab);
    const setTab = useUIStore((state) => state.setTab);

    return (
        <nav className="flex justify-center my-8 bg-card p-3 rounded-lg md:rounded-full shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {botoes.map((tab) => (
                    <button
                        key={tab.path}
                        onClick={() => setTab(tab.path)}
                        className={`px-4 py-2 text-sm font-semibold rounded-full
                ${
                    Tab === tab.path
                        ? 'text-primary-foreground bg-primary shadow-md'
                        : 'text-muted-foreground hover:bg-accent'
                }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </nav>
    );
}
