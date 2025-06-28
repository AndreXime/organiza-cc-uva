'use client';

import { formatPeriodo } from '@/lib/utils';
import { useData } from '../../context/DataContext';
import Header from '../ui/header';

export default function GerenciadorInterativo() {
    const { DisciplinasFeitas, setDisciplinasFeitas, DisciplinasDisponiveis, TodasDisciplinas } = useData();

    // Função pra clicar e alternar se já fez ou não
    function toggleFeita(id: number) {
        setDisciplinasFeitas((prev) => {
            const nova = new Set(prev);
            if (nova.has(id)) nova.delete(id);
            else nova.add(id);
            return nova;
        });
    }

    return (
        <>
            <div className="text-center mb-10 p-6 bg-blue-50 border border-blue-200 rounded-xl">
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 mb-2">Gerenciador Interativo</h2>
                <p className="text-gray-600 max-w-3xl mx-auto text-sm md:text-base">
                    Clique nas disciplinas em <span className="font-semibold text-blue-600">Disponíveis</span> para
                    marcá-las como concluídas. Clique nas disciplinas concluidas para desmarcá-las.
                    <br />
                    As matérias só ficam disponíveis quando todos os seus pré-requisitos forem cumpridos. Suas
                    alterações são salvas automaticamente!
                </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg md:text-xl font-bold mb-4 text-blue-600 border-b-2 border-blue-200 pb-2">
                        📚 Disciplinas Disponíveis para Cursar
                    </h3>
                    <div className="space-y-3 pr-2 max-h-[50vh] lg:max-h-[60vh] overflow-y-auto">
                        {DisciplinasDisponiveis.length === 0 ? (
                            <p className="italic text-gray-500">Você concluiu todas as disciplinas parabens.</p>
                        ) : (
                            <ul className="space-y-2">
                                {DisciplinasDisponiveis.map((disciplina) => (
                                    <li
                                        key={disciplina.id}
                                        onClick={() => toggleFeita(disciplina.id)}
                                        title="Clique para desmarcar"
                                        className="course-item flex justify-between items-center p-3 md:p-4 rounded-lg cursor-pointer shadow-sm border bg-green-50 border-green-200"
                                    >
                                        <p className="font-semibold text-sm md:text-base">{disciplina.nome}</p>
                                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
                                            {formatPeriodo(disciplina.periodo)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg md:text-xl font-bold mb-4 text-green-600 border-b-2 border-green-200 pb-2">
                        ✅ Disciplinas Concluídas
                    </h3>

                    <div className="space-y-3 pr-2 max-h-[50vh] lg:max-h-[60vh] overflow-y-auto">
                        {DisciplinasFeitas.size === 0 ? (
                            <p className="italic text-gray-500">Nenhuma disciplina selecionada.</p>
                        ) : (
                            <ul className="space-y-2">
                                {[...DisciplinasFeitas].map((id) => {
                                    const disciplina = TodasDisciplinas.find((d) => d.id === id);
                                    if (disciplina) {
                                        return (
                                            <li
                                                key={id}
                                                onClick={() => toggleFeita(id)}
                                                title="Clique para desmarcar"
                                                className="course-item flex justify-between items-center p-3 md:p-4 rounded-lg cursor-pointer shadow-sm border bg-white border-gray-200"
                                            >
                                                <p className="font-semibold text-sm md:text-base">{disciplina.nome}</p>
                                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
                                                    {formatPeriodo(disciplina.periodo)}
                                                </span>
                                            </li>
                                        );
                                    }
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
