'use client';

import { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import Popup from '../ui/Popup';
import ProgressBar from '../ui/ProgressBar';
import { Eye, EyeOff } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import { getDisciplinasByIds } from '@/lib/utils';

export default function GerenciadorInterativo() {
    const {
        DisciplinasFeitas,
        setDisciplinasFeitas,
        DisciplinasDisponiveis,
        DisciplinasTotais,
        DisciplinasPorPeriodo,
    } = useData();
    const { setMessage, mostrarFeitas, setMostrarFeitas } = useUI();

    // Função pra clicar e alternar se já fez ou não
    function toggleFeita(id: number) {
        let mensagemErro: string | null = null;

        setDisciplinasFeitas((prev) => {
            const nova = new Set(prev);

            if (nova.has(id)) {
                // Verifica se alguma disciplina feita depende da que está sendo desmarcada
                const dependeDessa = DisciplinasTotais.some(
                    (disc) => nova.has(disc.id) && disc.requisitos?.some((req) => req.id === id)
                );

                if (dependeDessa) {
                    mensagemErro =
                        'Você não pode desmarcar esta disciplina porque outra que depende dela já está marcada como feita.';

                    return prev;
                }

                nova.delete(id);
            } else {
                nova.add(id);
            }

            return nova;
        });

        // È preciso setar mensagem depois porque causa erro
        if (mensagemErro) {
            setMessage(mensagemErro);
        }
    }

    const disciplinasVisiveis: Record<string, Disciplina[]> = useMemo(() => {
        if (mostrarFeitas) {
            // Mostra as feitas mas ordernadas para mostrar as nao feitas primeiras
            return Object.fromEntries(
                Object.entries(DisciplinasPorPeriodo).map(([periodo, disciplinas]) => [
                    periodo,
                    getDisciplinasByIds(disciplinas)
                        .slice()
                        .sort((a, b) => {
                            const aFeita = DisciplinasFeitas.has(a.id);
                            const bFeita = DisciplinasFeitas.has(b.id);

                            // Se a for feita (1) e b não (0), a-b = 1, então b vem antes.
                            // Se b for feita (1) e a não (0), a-b = -1, então a vem antes.
                            // Se ambas tiverem o mesmo status, a-b = 0, a ordem original se mantém.
                            return Number(aFeita) - Number(bFeita);
                        }),
                ])
            );
        }

        // Esconde todas as feitas
        return Object.fromEntries(
            Object.entries(DisciplinasPorPeriodo).map(([periodo, disciplinas]) => [
                periodo,
                getDisciplinasByIds(disciplinas).filter((disc) => !DisciplinasFeitas.has(disc.id)),
            ])
        );
    }, [mostrarFeitas, DisciplinasPorPeriodo, DisciplinasFeitas]);

    return (
        <>
            <div className="text-center mb-10 p-6 bg-blue-50 border border-blue-200 rounded-xl">
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 mb-2">Gerenciador de Disciplinas</h2>
                <p className="text-gray-600 max-w-3xl mx-auto text-sm md:text-base">
                    As disciplinas em <span className="font-bold text-green-600">verde</span> estão marcadas como{' '}
                    <span className="font-bold text-green-600">Concluídas</span>, e as em
                    <span className="font-bold text-blue-600"> azul</span> estão
                    <span className="font-bold text-blue-600"> Disponíveis</span>. <br />
                    Clique em uma disciplina disponível para marcá-la como concluída. Clique em uma disciplina concluída
                    para desmarcá-la. <br />
                    As disciplinas só aparecem como disponíveis quando todos os seus
                    <span className="font-semibold text-red-600"> pré-requisitos</span> estão cumpridos. <br />
                    Suas alterações são salvas automaticamente!
                </p>
                <div className="flex flex-wrap gap-4 items-center justify-center mt-4">
                    <p className="flex flex-wrap flex-row gap-4 items-center justify-center">
                        <button
                            disabled={DisciplinasFeitas.size == 0}
                            onClick={() => setMostrarFeitas(!mostrarFeitas)}
                            className="btn-primary"
                        >
                            {mostrarFeitas ? (
                                <>
                                    <EyeOff size={20} /> Esconder disciplinas feitas
                                </>
                            ) : (
                                <>
                                    <Eye size={20} /> Mostrar todas disciplinas
                                </>
                            )}
                        </button>
                    </p>
                </div>
            </div>
            <ProgressBar
                total={DisciplinasTotais.filter((disc) => disc.periodo != 'Optativa').length}
                current={DisciplinasFeitas.size}
            />
            {Object.entries(disciplinasVisiveis).map(([periodo, disciplinas]) => (
                <section key={periodo} className="mb-8">
                    <h3 className="text-xl font-bold mb-4 text-gray-700 border-b-2 border-gray-200 pb-2">{periodo}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {disciplinas.map((disciplina) => {
                            const foiFeita = DisciplinasFeitas.has(disciplina.id);
                            const estaDisponivel = DisciplinasDisponiveis.has(disciplina.id);

                            let cardClasses =
                                'text-left shadow rounded p-4 border border-gray-200 flex flex-col justify-between cursor-pointer disabled:cursor-not-allowed ';
                            let titleClasses = 'font-semibold ';

                            if (foiFeita) {
                                cardClasses += 'bg-green-50';
                                titleClasses += 'text-green-700';
                            } else if (estaDisponivel) {
                                cardClasses += 'bg-blue-50';
                                titleClasses += 'text-blue-800';
                            } else {
                                cardClasses += 'bg-gray-100 text-gray-400';
                                titleClasses += 'text-gray-500';
                            }

                            return (
                                <button
                                    onClick={() => toggleFeita(disciplina.id)}
                                    key={disciplina.id}
                                    disabled={!foiFeita && !estaDisponivel}
                                    className={cardClasses}
                                >
                                    <strong className={titleClasses}>{disciplina.nome}</strong>
                                    <span className="text-xs mt-2 font-semibold">
                                        {disciplina.professor} - {disciplina.carga_horaria} horas
                                    </span>
                                    {disciplina.requisitos && disciplina.requisitos.length > 0 ? (
                                        <ul className="list-disc list-inside mt-2 text-xs">
                                            {disciplina.requisitos.map((req) => (
                                                <li key={req.id}>
                                                    {DisciplinasTotais.find((d) => d.id === req.id)?.nome ||
                                                        'Disciplina não encontrada'}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-xs italic mt-2">Sem pré-requisitos</p>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </section>
            ))}

            <Popup />
        </>
    );
}
