import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PlanejamentoType = {
    ano: number;
    semestre: number;
    disciplinas: number[]; // Array of discipline IDs
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
};

export const usePlanejadorStore = create<PlanejadorState & PlanejadorActions>()(
    persist(
        (set, get) => ({
            // Estados iniciais
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
        }),
        {
            name: 'planejador',
        }
    )
);
