import { useData } from '@/context/DataContext';

export default function Tabs() {
    const { Tab, setTab } = useData();

    const botoes = [
        { label: 'Gerenciador de Disciplinas', path: 'gerenciador' },
        { label: 'Organizador de Horários', path: 'horario' },
        { label: 'Sobre o projeto', path: 'sobre' },
    ];

    return (
        <nav className="flex justify-center my-8 bg-white p-3 rounded-lg md:rounded-full shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-3 flex-col md:flex-row justify-center gap-2">
                {botoes.map((tab) => (
                    <button
                        key={tab.path}
                        onClick={() => setTab(tab.path)}
                        className={`px-4 py-2 text-sm font-semibold rounded-full  
                    ${Tab === tab.path ? 'text-white bg-blue-600 shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </nav>
    );
}
