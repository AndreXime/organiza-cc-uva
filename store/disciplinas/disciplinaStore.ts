import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { serverData } from "./DisciplinaStoreInitilizer";

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
				const novasDisponiveis = new Set(
					DisciplinasTotais.filter((d) => {
						if (d.periodo === "Não ofertadas") return false; // Não ofertada
						if (DisciplinasFeitas.has(d.id)) return false; // Não está feita
						if (!d.requisitos?.length) return true; // Não tem requisitos
						// Todos os requisitos estão no conjunto de disciplinas feitas
						return d.requisitos.every((req) => DisciplinasFeitas.has(req.id));
					}).map((d) => d.id),
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
							disc.requisitos?.some((req) => req.id === id),
					);

					if (dependeDessa) {
						return "Você não pode desmarcar esta disciplina porque outra que depende dela já está marcada como feita.";
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

				return DisciplinasTotais.find((d) => d.nome === name);
			},

			// Ação para inicializar o estado com dados do servidor
			init: (data) => {
				const DisciplinasPorPeriodo = data.DisciplinasCurso.reduce<
					Record<string, Set<number>>
				>((acc, disc) => {
					if (disc.periodo === "Optativa" && !disc.professor) {
						disc.periodo = "Não ofertadas";
					}

					if (!acc[disc.periodo]) acc[disc.periodo] = new Set();
					acc[disc.periodo].add(disc.id);
					return acc;
				}, {});

				// Ordenar: normais primeiro (1°, 2°, ...), depois optativas e não ofertadas
				const periodosOrdenados = Object.keys(DisciplinasPorPeriodo).sort(
					(a, b) => {
						const getWeight = (p: string) => {
							if (/^\d+°/.test(p)) return parseInt(p); // pega número do período
							if (p === "Optativa") return 9998; // Joga optativa para ser antepenultimo
							if (p === "Não ofertadas") return 9999; // Joga para o final
							return 10000;
						};
						return getWeight(a) - getWeight(b);
					},
				);

				const DisciplinasPorPeriodoOrdenado: Record<string, Set<number>> = {};
				for (const periodo of periodosOrdenados) {
					DisciplinasPorPeriodoOrdenado[periodo] =
						DisciplinasPorPeriodo[periodo];
				}

				set({
					DisciplinasTotais: data.DisciplinasCurso,
					DisciplinasEquivalentes: data.DisciplinasEquivalentes,
					DisciplinasPorPeriodo: DisciplinasPorPeriodoOrdenado,
				});

				get().recalculateDisponiveis();

				set({
					loading: false,
				});
			},
		}),
		{
			name: "disciplinas-feitas",
			partialize: (state) => ({ DisciplinasFeitas: state.DisciplinasFeitas }),
		},
	),
);
