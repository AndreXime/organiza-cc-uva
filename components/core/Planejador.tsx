'use client';

import { useDisciplinaStore } from '@/store/disciplinas/disciplinaStore';
import { usePlanejadorStore } from '@/store/ui/planejadorStore';
import { useMemo } from 'react';

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
    } = usePlanejadorStore();
    const { DisciplinasTotais, DisciplinasFeitas } = useDisciplinaStore();

    const disciplinasNaoFeitas = useMemo(() => {
        return DisciplinasTotais.filter((d) => !DisciplinasFeitas.has(d.id));
    }, [DisciplinasFeitas, DisciplinasTotais]);

    // Pega os IDs de todas as disciplinas em todos os semestres, exceto o que está em edição
    const disciplinasPlanejadasFora = new Set(
        planejamento
            .filter((p) => !(p.ano === semestreEmEdicao?.ano && p.semestre === semestreEmEdicao?.semestre))
            .flatMap((p) => p.disciplinas)
    );

    /** TODO: Fazer um modal de confirmação mais bonito */
    const handleRemoverSemestre = (ano: number, semestre: number) => {
        if (
            window.confirm(
                `Tem certeza que deseja remover o semestre ${ano}.${semestre}? Todas as disciplinas planejadas nele serão perdidas.`
            )
        ) {
            removerSemestre(ano, semestre);
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center mb-10 p-6 bg-blue-50 border border-blue-200 rounded-xl flex justify-center items-center flex-col">
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 mb-2">Planejador de Curso</h2>
                <p className="text-sm md:text-base max-w-3xl">
                    Adicione os próximos semestres que você pretende cursar e planeje quais disciplinas fazer em cada um
                    deles.
                </p>
                <p className="max-w-3xl">
                    Clique em Adicionar semestre e depois em Adicionar disciplina e aparecerão as disciplinas
                    disponíveis no momento. Mais disciplinas ficarão disponíveis em outros semestres, pois o sistema
                    leva em conta as que você planejou nos semestres anteriores.
                </p>
                <div className="text-center mt-4">
                    <button onClick={adicionarSemestre} className="btn-primary">
                        Adicionar Semestre
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {planejamento.map((semestre, index) => {
                    const emEdicao =
                        semestreEmEdicao?.ano === semestre.ano && semestreEmEdicao?.semestre === semestre.semestre;

                    // Requisitos cumpridos = Disciplinas já feitas + disciplinas planejadas em semestres ANTERIORES
                    const requisitosCumpridos = new Set([
                        ...DisciplinasFeitas,
                        ...planejamento.slice(0, index).flatMap((p) => p.disciplinas),
                    ]);

                    // Disciplinas já planejadas em QUALQUER semestre (para evitar duplicatas)
                    const todasDisciplinasPlanejadas = new Set(planejamento.flatMap((p) => p.disciplinas));

                    const disciplinasDisponiveisParaSelecao = disciplinasNaoFeitas.filter((d) => {
                        // Regra 1: Não pode já estar planejada no semestre atual
                        if (semestre.disciplinas.includes(d.id)) return false;

                        // Regra 2: Não pode já estar planejada em NENHUM outro semestre
                        if (todasDisciplinasPlanejadas.has(d.id) && !semestre.disciplinas.includes(d.id)) return false;

                        // Regra 3: Todos os pré-requisitos devem estar no conjunto de 'requisitosCumpridos'
                        if (d.requisitos && d.requisitos.length > 0) {
                            return d.requisitos.every((req) => requisitosCumpridos.has(req.id));
                        }

                        return true; // Se não tem requisitos e passou nas outras regras, está disponível
                    });

                    return (
                        <div
                            key={`${semestre.ano}-${semestre.semestre}`}
                            className="bg-white p-6 rounded-lg shadow-sm border"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold">
                                    {semestre.ano}.{semestre.semestre}{' '}
                                    {emEdicao && (
                                        <span className="font-normal text-sm ml-3">
                                            Clique na disciplina para remover
                                        </span>
                                    )}
                                </h3>
                                {emEdicao ? (
                                    <span className="flex gap-6">
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

                            <div className="grid grid-cols-3 gap-4">
                                {semestre.disciplinas.map((disciplinaId) => {
                                    const disciplina = DisciplinasTotais.find((d) => d.id === disciplinaId);
                                    return (
                                        <div
                                            key={disciplinaId}
                                            onClick={emEdicao ? () => removerDisciplina(disciplinaId) : undefined}
                                            className="course-item bg-blue-50 gap-1 p-2 rounded cursor-pointer select-none"
                                        >
                                            <span className="font-bold text-blue-800">{disciplina?.nome}</span>
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
                                        {disciplinasDisponiveisParaSelecao.map((d) => (
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
