// src/hooks/useCourseProgress.ts
import { useMemo } from "react";
import { useDisciplinaStore } from "@/store/disciplinaStore";

export default function useCalculateProgress() {
	const DisciplinasTotais = useDisciplinaStore(
		(state) => state.DisciplinasTotais,
	);
	const DisciplinasFeitas = useDisciplinaStore(
		(state) => state.DisciplinasFeitas,
	);

	// O useMemo é movido para dentro do hook. A lógica é a mesma.
	const progresso = useMemo(() => {
		const disciplinasObrigatorias = DisciplinasTotais.filter(
			(disc) => disc.periodo !== "Optativa" && disc.periodo !== "Não ofertadas",
		);
		const numMaxOptativas = 7;

		const totalNecessario = disciplinasObrigatorias.length + numMaxOptativas;

		const obrigatoriasFeitas = Array.from(DisciplinasFeitas).filter((idFeita) =>
			disciplinasObrigatorias.some((disc) => disc.id === idFeita),
		).length;

		const optativasFeitasContabilizadas = Array.from(DisciplinasFeitas).filter(
			(idFeita) => !disciplinasObrigatorias.some((disc) => disc.id === idFeita),
		).length;

		const optativasFeitas = Math.min(
			optativasFeitasContabilizadas,
			numMaxOptativas,
		);

		const totalFeitas = obrigatoriasFeitas + optativasFeitas;

		const faltantes = Math.max(0, totalNecessario - totalFeitas);
		const percentage =
			totalNecessario > 0
				? Math.min((totalFeitas / totalNecessario) * 100, 100)
				: 0;

		return {
			faltantes,
			percentage,
			totalFeitas,
			totalNecessario,
		};
	}, [DisciplinasTotais, DisciplinasFeitas]);

	return progresso;
}
