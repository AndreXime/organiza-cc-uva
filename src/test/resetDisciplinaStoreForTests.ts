import { useDisciplinaStore } from "@/store/disciplinaStore";

/** Estado isolado do disciplina store entre testes (persist + slices usados por outros módulos). */
export function resetDisciplinaStoreForTests(): void {
	localStorage.clear();
	useDisciplinaStore.setState({
		DisciplinasFeitas: new Set(),
		DisciplinasTotais: [],
		DisciplinasPorPeriodo: {},
		DisciplinasDisponiveis: new Set(),
		DisciplinasEquivalentes: [],
		metadata: {
			DisciplinaLastUpdated: new Date(0),
			DisciplinaEquivalentesLastUpdated: new Date(0),
		},
		loading: true,
	});
}
