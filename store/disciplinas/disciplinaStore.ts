import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { legacyStorageAdapter } from './storageAdapter';
import { serverData } from './DisciplinaStoreInitilizer';

export interface DisciplinaState {
    DisciplinasFeitas: Set<number>;
    DisciplinasTotais: Disciplina[];
    DisciplinasEquivalentes: Equivalente[];
    DisciplinasPorPeriodo: Record<string, Set<number>>;
    DisciplinasDisponiveis: Set<number>;
    loading: boolean;
    init: (data: serverData) => void;
    recalculateDisponiveis: () => void;
    toggleDisciplina: (id: number) => string | undefined;
    getDisciplinasByIds: (ids: Set<number>) => Disciplina[];
    getDisciplinaByName: (name: string) => Disciplina | undefined;
}

export const useDisciplinaStore = create<DisciplinaState>()(
    persist(
        (set, get) => ({
            // Estado Inicial
            DisciplinasFeitas: new Set(),
            DisciplinasTotais: [],
            DisciplinasPorPeriodo: {},
            DisciplinasDisponiveis: new Set(),
            DisciplinasEquivalentes: [],
            loading: true,

            recalculateDisponiveis: () => {
                const { DisciplinasTotais, DisciplinasFeitas } = get();

                // Lógica de `calcularDisponiveis` agora está aqui dentro
                const novasDisponiveis = new Set(
                    DisciplinasTotais.filter((d) => {
                        if (DisciplinasFeitas.has(d.id)) return false; // Não está feita
                        if (!d.requisitos?.length) return true; // Não tem requisitos
                        // Todos os requisitos estão no conjunto de disciplinas feitas
                        return d.requisitos.every((req) => DisciplinasFeitas.has(req.id));
                    }).map((d) => d.id)
                );

                set({ DisciplinasDisponiveis: novasDisponiveis });
            },

            toggleDisciplina(id: number) {
                const { DisciplinasFeitas, DisciplinasTotais } = get();
                const novoSetFeitas = new Set(DisciplinasFeitas);

                if (novoSetFeitas.has(id)) {
                    // Lógica para DESMARCAR
                    const dependeDessa = DisciplinasTotais.some(
                        (disc) =>
                            // A disciplina `disc` está feita E...
                            novoSetFeitas.has(disc.id) &&
                            // ...ela tem a disciplina `id` como requisito
                            disc.requisitos?.some((req) => req.id === id)
                    );

                    if (dependeDessa) {
                        return 'Você não pode desmarcar esta disciplina porque outra que depende dela já está marcada como feita.';
                    }

                    novoSetFeitas.delete(id);
                } else {
                    novoSetFeitas.add(id);
                }

                set({
                    DisciplinasFeitas: novoSetFeitas,
                });
                get().recalculateDisponiveis();
            },

            getDisciplinasByIds: (ids: Set<number>) => {
                const { DisciplinasTotais } = get();

                return DisciplinasTotais.filter((d) => ids.has(d.id));
            },

            getDisciplinaByName: (name) => {
                const { DisciplinasTotais } = get();

                return DisciplinasTotais.find((d) => d.nome == name);
            },

            // Ação para inicializar o estado com dados do servidor
            init: (data) => {
                const DisciplinasPorPeriodo = data.DisciplinasObrigatorias.reduce<Record<string, Set<number>>>(
                    (acc, disc) => {
                        if (!acc[disc.periodo]) acc[disc.periodo] = new Set();
                        acc[disc.periodo].add(disc.id);
                        return acc;
                    },
                    {}
                );

                set({
                    DisciplinasTotais: data.DisciplinasObrigatorias,
                    DisciplinasEquivalentes: data.DisciplinasEquivalentes,
                    DisciplinasPorPeriodo,
                });

                get().recalculateDisponiveis();

                set({
                    loading: false,
                });
            },
        }),
        {
            name: 'disciplinas', // Equivalente a localStorage.getItem('disciplinas')
            partialize: (state) => ({ DisciplinasFeitas: state.DisciplinasFeitas }),
            storage: legacyStorageAdapter,
        }
    )
);
