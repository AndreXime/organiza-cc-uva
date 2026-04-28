import { useMemo } from "react";
import { useDisciplinaStore } from "@/store/disciplinaStore";

export interface ProfileReport {
	obrigatorias: {
		total: number;
		feitas: number;
		faltandoIds: number[];
	};
	optativas: {
		maxCount: number;
		feitasContabilizadas: number;
		faltando: number;
	};
	progress: {
		totalFeitas: number;
		totalNecessario: number;
		percentage: number;
	};
	cargaHoraria: {
		totalObrigatorias: number;
		feitaObrigatorias: number;
		totalOptativasContabilizadas: number;
		feitaOptativasContabilizadas: number;
		totalFeita: number;
	};
}

const DEFAULT_RULES = {
	obrigatorias: { maxCargaHoraria: 2560 },
	optativas: { maxCount: 7, maxCargaHoraria: 420 },
	ignorePeriodos: ["Não ofertadas"],
};

export default function useProfileReport() {
	const DisciplinasTotais = useDisciplinaStore((s) => s.DisciplinasTotais);
	const DisciplinasFeitas = useDisciplinaStore((s) => s.DisciplinasFeitas);

	const report = useMemo<ProfileReport>(() => {
		const ignorar = new Set(DEFAULT_RULES.ignorePeriodos);
		const porId = new Map<number, Disciplina>();
		for (const d of DisciplinasTotais) porId.set(d.id, d);

		const obrigatorias = DisciplinasTotais.filter(
			(d) => d.periodo !== "Optativa" && !ignorar.has(d.periodo as "Não ofertadas"),
		);
		const obrigatoriasIds = new Set(obrigatorias.map((d) => d.id));

		const feitasObrigatorias = Array.from(DisciplinasFeitas).filter((id) => obrigatoriasIds.has(id));
		const feitasOptativas = Array.from(DisciplinasFeitas).filter((id) => !obrigatoriasIds.has(id));

		const faltandoObrigatoriasIds = obrigatorias.filter((d) => !DisciplinasFeitas.has(d.id)).map((d) => d.id);

		const optativasFeitasContabilizadas = Math.min(feitasOptativas.length, DEFAULT_RULES.optativas.maxCount);
		const optativasFaltando = Math.max(0, DEFAULT_RULES.optativas.maxCount - optativasFeitasContabilizadas);

		const cargaObrigatoriasFeita = feitasObrigatorias
			.map((id) => porId.get(id))
			.filter((d): d is Disciplina => !!d)
			.reduce((sum, d) => sum + d.carga_horaria, 0);

		const optativasDiscsFeitas = feitasOptativas.map((id) => porId.get(id)).filter((d): d is Disciplina => !!d);

		const cargaOptativasFeitaContabilizada = optativasDiscsFeitas
			.slice(0, DEFAULT_RULES.optativas.maxCount)
			.reduce((sum, d) => sum + d.carga_horaria, 0);

		const totalNecessario = obrigatorias.length + DEFAULT_RULES.optativas.maxCount;
		const totalFeitas = feitasObrigatorias.length + optativasFeitasContabilizadas;
		const percentage = totalNecessario > 0 ? Math.min((totalFeitas / totalNecessario) * 100, 100) : 0;

		return {
			obrigatorias: {
				total: obrigatorias.length,
				feitas: feitasObrigatorias.length,
				faltandoIds: faltandoObrigatoriasIds,
			},
			optativas: {
				maxCount: DEFAULT_RULES.optativas.maxCount,
				feitasContabilizadas: optativasFeitasContabilizadas,
				faltando: optativasFaltando,
			},
			progress: {
				totalFeitas,
				totalNecessario,
				percentage,
			},
			cargaHoraria: {
				totalObrigatorias: DEFAULT_RULES.obrigatorias.maxCargaHoraria,
				feitaObrigatorias: cargaObrigatoriasFeita,
				totalOptativasContabilizadas: DEFAULT_RULES.optativas.maxCargaHoraria,
				feitaOptativasContabilizadas: cargaOptativasFeitaContabilizada,
				totalFeita: cargaObrigatoriasFeita + cargaOptativasFeitaContabilizada,
			},
		};
	}, [DisciplinasTotais, DisciplinasFeitas]);

	return report;
}
