'use client';

import { useMemo } from 'react';
import ProgressBar from '../ui/ProgressBar';
import { Eye, EyeOff } from 'lucide-react';
import { useDisciplinaStore } from '@/store/disciplinas/disciplinaStore';
import { SkeletonSection } from '../ui/LoadingSkeleton';
import { useUIStore } from '@/store/ui/uiStore';
import { generateDisciplinaClasses } from '@/lib/utils/utils';
import SectionHeader from '../ui/SectionHeader';

export default function GerenciadorInterativo() {
    const DisciplinasTotais = useDisciplinaStore((state) => state.DisciplinasTotais);
    const DisciplinasFeitas = useDisciplinaStore((state) => state.DisciplinasFeitas);
    const DisciplinasDisponiveis = useDisciplinaStore((state) => state.DisciplinasDisponiveis);
    const DisciplinasPorPeriodo = useDisciplinaStore((state) => state.DisciplinasPorPeriodo);
    const toggleDisciplina = useDisciplinaStore((state) => state.toggleDisciplina);
    const getDisciplinasByIds = useDisciplinaStore((state) => state.getDisciplinasByIds);
    const loading = useDisciplinaStore((state) => state.loading);

    const mostrarFeitas = useUIStore((state) => state.mostrarFeitas);
    const setMostrarFeitas = useUIStore((state) => state.setMostrarFeitas);
    const setMessage = useUIStore((state) => state.setMessage);

    // Função pra clicar e alternar se já fez ou não
    function toggleDisc(id: number) {
        const mensagemErro = toggleDisciplina(id);

        if (mensagemErro) {
            setMessage(mensagemErro);
        }
    }

    const disciplinasVisiveis: Record<string, Disciplina[]> = useMemo(() => {
        // Função para calcular o peso para ordenação
        const getSortWeight = (disciplina: Disciplina): number => {
            const foiFeita = DisciplinasFeitas.has(disciplina.id);
            const estaDisponivel = DisciplinasDisponiveis.has(disciplina.id);

            if (foiFeita) {
                return 2; // Feitas têm o maior peso, vão para o final
            }
            if (estaDisponivel) {
                return 0; // Disponíveis têm o menor peso, vêm primeiro
            }
            return 1; // Bloqueadas ficam no meio
        };

        if (mostrarFeitas) {
            // Mostra todas as disciplinas com a ordem: Disponíveis > Bloqueadas > Feitas
            return Object.fromEntries(
                Object.entries(DisciplinasPorPeriodo).map(([periodo, disciplinas]) => [
                    periodo,
                    getDisciplinasByIds(disciplinas)
                        .slice()
                        .sort((a, b) => getSortWeight(a) - getSortWeight(b)),
                ])
            );
        }

        // Mostra com a ordem: Disponíveis > Bloqueadas
        return Object.fromEntries(
            Object.entries(DisciplinasPorPeriodo).map(([periodo, disciplinas]) => [
                periodo,
                getDisciplinasByIds(disciplinas)
                    .filter((disc) => !DisciplinasFeitas.has(disc.id))
                    .sort((a, b) => getSortWeight(a) - getSortWeight(b)),
                ,
            ])
        );
    }, [mostrarFeitas, DisciplinasPorPeriodo, DisciplinasFeitas, DisciplinasDisponiveis, getDisciplinasByIds]);

    return (
        <>
            <SectionHeader title="Gerenciador de Disciplinas">
                <p>
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
            </SectionHeader>

            <ProgressBar />

            {!loading ? (
                <>
                    {Object.entries(disciplinasVisiveis).map(([periodo, disciplinas]) => (
                        <section key={periodo} className="mb-8">
                            <h3 className="text-xl font-bold mb-4 text-gray-700 border-b-2 border-gray-200 pb-2">
                                {periodo}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {disciplinas.map((disciplina) => {
                                    const { cardClasses, titleClasses, estáBloqueada } = generateDisciplinaClasses(
                                        disciplina.id
                                    );

                                    return (
                                        <button
                                            onClick={() => toggleDisc(disciplina.id)}
                                            key={disciplina.id}
                                            disabled={estáBloqueada}
                                            className={cardClasses + ' cursor-pointer'}
                                        >
                                            <strong className={titleClasses}>{disciplina.nome}</strong>
                                            <span className="text-xs mt-2 font-semibold">
                                                {disciplina.professor ? `${disciplina.professor} - ` : ''}{' '}
                                                {disciplina.carga_horaria} horas
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
                </>
            ) : (
                Array.from({ length: 6 }).map((_, i) => <SkeletonSection key={i} />)
            )}
        </>
    );
}
