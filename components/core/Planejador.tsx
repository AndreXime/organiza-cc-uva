'use client';

import { useDisciplinaStore } from '@/store/disciplinas/disciplinaStore';
import { usePlanejadorStore } from '@/store/ui/planejadorStore';
import { useUIStore } from '@/store/ui/uiStore';
import { Plus, Sparkles } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';

export default function Planejador() {
    const {
        planejamento,
        semestreEmEdicao,
        adicionarSemestre,
        iniciarEdicao,
        concluirEdicao,
        adicionarDisciplina,
        removerDisciplina,
        removerSemestre,
        getDisciplinasDisponiveisParaSelecao,
        getConflitos,
        preencherAutomaticamente,
    } = usePlanejadorStore();
    const DisciplinasTotais = useDisciplinaStore((state) => state.DisciplinasTotais);

    const handleRemoverSemestre = (ano: number, semestre: number) => {
        const { openModal } = useUIStore.getState();

        openModal(
            `Tem certeza que deseja remover o semestre ${ano}.${semestre}?\n Todas as disciplinas planejadas nele serão perdidas.`,
            () => {
                // Esta função só será chamada se o usuário clicar em "Sim"
                removerSemestre(ano, semestre);
            }
        );
    };

    const handlePreencherAuto = () => {
        const { openModal } = useUIStore.getState();

        openModal(
            `Isso apagará seu planejamento atual e criará um novo, otimizado para concluir o curso no menor tempo possível.\n
             O algoritmo pode sugerir uma carga irrealista, com várias disciplinas no mesmo semestre, mas nunca gera conflitos de horário.\n
             Deseja continuar?`,
            () => {
                preencherAutomaticamente();
            }
        );
    };

    return (
        <div className="space-y-8">
            <SectionHeader title="Planejador de Curso">
                <p>
                    Adicione os próximos semestres que você pretende cursar e planeje quais disciplinas fazer em cada um
                    deles.
                    <br />
                    Clique em Adicionar semestre e editar semestre depois clique no dropdown Adicionar disciplina e
                    aparecerão as disciplinas disponíveis no momento. Mais disciplinas ficarão disponíveis em outros
                    semestres, pois o sistema leva em conta as que você planejou nos semestres anteriores.
                    <br />
                    As disciplinas em <span className="text-yellow-600 font-bold">amarelo</span> querem dizer que há um
                    conflito de horario com alguma outra disciplina do mesmo semestre. Mas há a possibilidade das
                    disciplinas mudarem de horarios entre os semestres.
                </p>
                <div className="text-center mt-4 flex justify-center gap-4">
                    <button onClick={adicionarSemestre} className="btn-primary">
                        <Plus size={22} />
                        Adicionar Semestre
                    </button>
                    <button onClick={handlePreencherAuto} className="btn-primary">
                        <Sparkles size={20} fill="yellow" />
                        Preencher automaticamente
                    </button>
                </div>
            </SectionHeader>

            <div className="grid grid-cols-1 gap-8">
                {planejamento.map((semestre, index) => {
                    const disciplinasDisponiveis = getDisciplinasDisponiveisParaSelecao(semestre, index);
                    const conflitos = getConflitos(semestre);

                    const emEdicao =
                        semestreEmEdicao?.ano === semestre.ano && semestreEmEdicao?.semestre === semestre.semestre;

                    return (
                        <div
                            key={`${semestre.ano}-${semestre.semestre}`}
                            className="bg-white p-6 rounded-lg shadow-sm border"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold flex flex-col md:flex-row md:items-center gap-3">
                                    {semestre.ano}.{semestre.semestre}{' '}
                                    {emEdicao && (
                                        <span className="font-normal text-sm    ">
                                            Clique na disciplina para remover
                                        </span>
                                    )}
                                </h3>
                                {emEdicao ? (
                                    <span className="flex flex-col md:flex-row gap-7 items-center">
                                        <button
                                            onClick={() => handleRemoverSemestre(semestre.ano, semestre.semestre)}
                                            className="text-sm font-semibold text-red-600 hover:text-red-800"
                                        >
                                            Remover Semestre
                                        </button>
                                        <button
                                            onClick={concluirEdicao}
                                            className="text-sm font-semibold text-green-600 hover:text-green-800"
                                        >
                                            Concluir Edição
                                        </button>
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => iniciarEdicao(semestre.ano, semestre.semestre)}
                                        className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                                    >
                                        Editar
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {semestre.disciplinas.map((disciplinaId) => {
                                    const disciplina = DisciplinasTotais.find((d) => d.id === disciplinaId);
                                    const temConflito = conflitos.has(disciplinaId);
                                    const bgColor = temConflito ? 'bg-yellow-50' : 'bg-blue-50';
                                    const textColor = temConflito ? 'text-yellow-800' : 'text-blue-800';

                                    return (
                                        <div
                                            key={disciplinaId}
                                            onClick={emEdicao ? () => removerDisciplina(disciplinaId) : undefined}
                                            className={`course-item ${bgColor} gap-1 p-3 rounded select-none relative`}
                                        >
                                            <span className={`font-bold ${textColor}`}>{disciplina?.nome}</span>{' '}
                                            <span>{disciplina?.professor}</span>
                                            <span>
                                                {disciplina?.horarios
                                                    ?.map((h) => `${h.dia}: ${h.inicio} - ${h.fim}`)
                                                    .join(' e ')}
                                            </span>
                                        </div>
                                    );
                                })}
                                {semestre.disciplinas.length === 0 && (
                                    <p className="text-gray-500 text-sm italic">Nenhuma disciplina adicionada.</p>
                                )}
                            </div>

                            {emEdicao && (
                                <div className="mt-4">
                                    <select
                                        value=""
                                        onChange={(e) => adicionarDisciplina(Number(e.target.value))}
                                        className="w-full border rounded p-2"
                                    >
                                        <option value="" disabled>
                                            Adicionar disciplina...
                                        </option>
                                        {disciplinasDisponiveis.map((d) => (
                                            <option key={d.id} value={d.id}>
                                                {d.nome}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
