import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useDisciplinaStore } from '../disciplinas/disciplinaStore';

type PlanejamentoType = {
    ano: number;
    semestre: number;
    disciplinas: number[];
};

type PlanejadorState = {
    planejamento: PlanejamentoType[];
    semestreEmEdicao: { ano: number; semestre: number } | null;
};

type PlanejadorActions = {
    adicionarSemestre: () => void;
    removerSemestre: (ano: number, semestre: number) => void;
    iniciarEdicao: (ano: number, semestre: number) => void;
    concluirEdicao: () => void;
    adicionarDisciplina: (disciplinaId: number) => void;
    removerDisciplina: (disciplinaId: number) => void;
    getDisciplinasDisponiveisParaSelecao: (semestre: PlanejamentoType, index: number) => Disciplina[];
    getConflitos: (semestre: PlanejamentoType) => Set<number>;
    preencherAutomaticamente: () => void;
};
export const usePlanejadorStore = create<PlanejadorState & PlanejadorActions>()(
    persist(
        (set, get) => ({
            planejamento: [],
            semestreEmEdicao: null,

            // Ações
            adicionarSemestre: () => {
                const { planejamento } = get();
                const ultimoSemestre = planejamento[planejamento.length - 1];

                let novoAno: number;
                let novoSemestre: number;

                if (ultimoSemestre) {
                    // Se já existe um semestre, calcula o próximo
                    novoAno = ultimoSemestre.semestre === 1 ? ultimoSemestre.ano : ultimoSemestre.ano + 1;
                    novoSemestre = ultimoSemestre.semestre === 1 ? 2 : 1;
                } else {
                    // Se for o primeiro semestre, calcula baseado na data atual
                    const dataAtual = new Date();
                    const anoAtual = dataAtual.getFullYear();
                    const mesAtual = dataAtual.getMonth(); // 0 (Jan) a 11 (Dez)
                    novoAno = anoAtual;
                    // Se o mês for antes de Agosto (0-6), é semestre 1. Se for Agosto (7) ou depois, é semestre 2.
                    novoSemestre = mesAtual < 7 ? 1 : 2;
                }

                set({
                    planejamento: [
                        ...planejamento,
                        {
                            ano: novoAno,
                            semestre: novoSemestre,
                            disciplinas: [],
                        },
                    ],
                });
            },

            removerSemestre: (ano, semestre) => {
                set((state) => {
                    const planejamentoAtual = [...state.planejamento];
                    const indexParaRemover = planejamentoAtual.findIndex(
                        (p) => p.ano === ano && p.semestre === semestre
                    );

                    if (indexParaRemover === -1) return state;

                    // Remove o semestre
                    planejamentoAtual.splice(indexParaRemover, 1);

                    // Recalcula todos os semestres a partir do índice removido
                    for (let i = indexParaRemover; i < planejamentoAtual.length; i++) {
                        const semestreAnterior = planejamentoAtual[i - 1];
                        let anoRecalculado;
                        let semestreRecalculado;

                        if (semestreAnterior) {
                            anoRecalculado =
                                semestreAnterior.semestre === 1 ? semestreAnterior.ano : semestreAnterior.ano + 1;
                            semestreRecalculado = semestreAnterior.semestre === 1 ? 2 : 1;
                        } else {
                            // Se o primeiro item foi removido, recalcula com base na data atual
                            const dataAtual = new Date();
                            anoRecalculado = dataAtual.getFullYear();
                            const mesAtual = dataAtual.getMonth();
                            semestreRecalculado = mesAtual < 7 ? 1 : 2;
                        }

                        planejamentoAtual[i] = {
                            ...planejamentoAtual[i],
                            ano: anoRecalculado,
                            semestre: semestreRecalculado,
                        };
                    }

                    const semestreRemovidoEstavaEmEdicao =
                        state.semestreEmEdicao?.ano === ano && state.semestreEmEdicao?.semestre === semestre;

                    return {
                        planejamento: planejamentoAtual,
                        semestreEmEdicao: semestreRemovidoEstavaEmEdicao ? null : state.semestreEmEdicao,
                    };
                });
            },

            iniciarEdicao: (ano, semestre) => {
                set({ semestreEmEdicao: { ano, semestre } });
            },

            concluirEdicao: () => {
                set({ semestreEmEdicao: null });
            },

            adicionarDisciplina: (disciplinaId) => {
                const { semestreEmEdicao } = get();
                if (!semestreEmEdicao) return;

                set((state) => ({
                    planejamento: state.planejamento.map((p) =>
                        p.ano === semestreEmEdicao.ano && p.semestre === semestreEmEdicao.semestre
                            ? { ...p, disciplinas: [...p.disciplinas, disciplinaId] }
                            : p
                    ),
                }));
            },

            removerDisciplina: (disciplinaId) => {
                const { semestreEmEdicao } = get();
                if (!semestreEmEdicao) return;

                set((state) => ({
                    planejamento: state.planejamento.map((p) =>
                        p.ano === semestreEmEdicao.ano && p.semestre === semestreEmEdicao.semestre
                            ? { ...p, disciplinas: p.disciplinas.filter((id) => id !== disciplinaId) }
                            : p
                    ),
                }));
            },

            getConflitos: (semestre) => {
                const { DisciplinasTotais } = useDisciplinaStore.getState();
                const disciplinasDoSemestre = semestre.disciplinas
                    .map((id) => DisciplinasTotais.find((d) => d.id === id))
                    .filter((d): d is Disciplina => !!d);

                const conflitosSet = new Set<number>();
                for (let i = 0; i < disciplinasDoSemestre.length; i++) {
                    for (let j = i + 1; j < disciplinasDoSemestre.length; j++) {
                        const discA = disciplinasDoSemestre[i];
                        const discB = disciplinasDoSemestre[j];
                        if (!discA.horarios || !discB.horarios) continue;
                        for (const horarioA of discA.horarios) {
                            for (const horarioB of discB.horarios) {
                                if (
                                    horarioA.dia === horarioB.dia &&
                                    horarioA.inicio < horarioB.fim &&
                                    horarioA.fim > horarioB.inicio
                                ) {
                                    conflitosSet.add(discA.id);
                                    conflitosSet.add(discB.id);
                                }
                            }
                        }
                    }
                }
                return conflitosSet;
            },

            getDisciplinasDisponiveisParaSelecao: (semestre, index) => {
                const { DisciplinasTotais, DisciplinasFeitas } = useDisciplinaStore.getState();
                const { planejamento } = get();

                const disciplinasNaoFeitas = DisciplinasTotais.filter((d) => !DisciplinasFeitas.has(d.id));
                const requisitosCumpridos = new Set([
                    ...DisciplinasFeitas,
                    ...planejamento.slice(0, index).flatMap((p) => p.disciplinas),
                ]);

                return disciplinasNaoFeitas.filter((d) => {
                    const jaPlanejadaEmOutroSemestre = planejamento.some(
                        (p, i) => i !== index && p.disciplinas.includes(d.id)
                    );
                    if (jaPlanejadaEmOutroSemestre || semestre.disciplinas.includes(d.id)) {
                        return false;
                    }
                    if (d.periodo == 'Não ofertadas') {
                        return false;
                    }
                    if (d.requisitos?.length) {
                        return d.requisitos.every((req) => requisitosCumpridos.has(req.id));
                    }

                    return true;
                });
            },

            preencherAutomaticamente: () => {
                const { DisciplinasTotais, DisciplinasFeitas } = useDisciplinaStore.getState();

                const disciplinasAPlanejar = DisciplinasTotais.filter(
                    (d) => !DisciplinasFeitas.has(d.id) && !(d.periodo == 'Não ofertadas')
                );
                const disciplinasJaPlanejadas = new Set<number>();
                const novoPlanejamento: PlanejamentoType[] = [];
                const requisitosCumpridos = new Set<number>([...DisciplinasFeitas]);

                const temConflito = (disciplina: Disciplina, outras: Disciplina[]): boolean => {
                    if (!disciplina.horarios) return false;
                    for (const outra of outras) {
                        if (!outra.horarios) continue;
                        for (const h1 of disciplina.horarios) {
                            for (const h2 of outra.horarios) {
                                if (h1.dia === h2.dia && h1.inicio < h2.fim && h1.fim > h2.inicio) return true;
                            }
                        }
                    }
                    return false;
                };

                while (disciplinasJaPlanejadas.size < disciplinasAPlanejar.length) {
                    const disponiveis = disciplinasAPlanejar.filter(
                        (d) =>
                            !disciplinasJaPlanejadas.has(d.id) &&
                            (!d.requisitos || d.requisitos.every((req) => requisitosCumpridos.has(req.id)))
                    );

                    if (disponiveis.length === 0) {
                        console.error(
                            'Não foi possível planejar todas as disciplinas. Verifique se há ciclos de pré-requisitos ou disciplinas sem horário.'
                        );
                        break;
                    }

                    const semestreAtual: Disciplina[] = [];
                    for (const disciplina of disponiveis) {
                        if (!temConflito(disciplina, semestreAtual)) {
                            semestreAtual.push(disciplina);
                        }
                    }

                    const idsDoSemestre = semestreAtual.map((d) => d.id);
                    const ultimo = novoPlanejamento[novoPlanejamento.length - 1];
                    let ano, semestre;
                    if (ultimo) {
                        ano = ultimo.semestre === 1 ? ultimo.ano : ultimo.ano + 1;
                        semestre = ultimo.semestre === 1 ? 2 : 1;
                    } else {
                        const data = new Date();
                        ano = data.getFullYear();
                        semestre = data.getMonth() < 7 ? 1 : 2;
                    }

                    novoPlanejamento.push({ ano, semestre, disciplinas: idsDoSemestre });
                    idsDoSemestre.forEach((id) => {
                        disciplinasJaPlanejadas.add(id);
                        requisitosCumpridos.add(id);
                    });
                }
                set({ planejamento: novoPlanejamento, semestreEmEdicao: null });
            },
        }),
        {
            name: 'planejador',
            partialize: (state) => ({ planejamento: state.planejamento }),
        }
    )
);
