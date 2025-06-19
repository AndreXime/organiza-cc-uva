import { useData } from '@/context/DataContext';

export default function Tabs() {
    const { Tab, setTab } = useData();

    const botoes = [
        { label: 'Gerenciador Interativo', path: 'gerenciador' },
        { label: 'Organizador de horarios', path: 'horario' },
        { label: 'Tabela de Disciplinas', path: 'disciplinas' },
        { label: 'Sobre o projeto', path: 'sobre' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {botoes.map((tab) => (
                <button
                    key={tab.path}
                    onClick={() => setTab(tab.path)}
                    className={`px-6 py-2 rounded-md font-bold transition ${
                        Tab === tab.path
                            ? 'bg-indigo-800 text-white shadow-lg'
                            : 'bg-indigo-600 text-white hover:bg-indigo-800'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
