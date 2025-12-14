import { useDisciplinaStore } from "@/store/disciplinaStore";
import { create } from "zustand";

export type FiltrosType = {
	professor: string;
	periodo: string;
	buscaNome: string;
	jaFez: "todos" | "sim" | "nao";
	turno: "todos" | "manha" | "tarde" | "noite";
	dia: "todos" | "Segunda" | "Terça" | "Quarta" | "Quinta" | "Sexta";
};

type FiltrosState = {
	filtros: FiltrosType;
	disciplinasFiltradas: Disciplina[];
};

type FiltroActions = {
	setFiltro: <K extends keyof FiltrosType>(
		campo: K,
		valor: FiltrosType[K],
	) => void;
	filtrarDisciplinas: () => void;
};

export const useFiltroStore = create<FiltrosState & FiltroActions>(
	(set, get) => ({
		// Estados iniciais
		filtros: {
			professor: "todos",
			jaFez: "todos",
			periodo: "todos",
			turno: "todos",
			buscaNome: "",
			dia: "todos",
		},
		disciplinasFiltradas: [],

		// Açõesx
		filtrarDisciplinas: () => {
			const { filtros } = get();
			const { DisciplinasTotais, DisciplinasFeitas } =
				useDisciplinaStore.getState();

			set({
				disciplinasFiltradas: DisciplinasTotais.filter(
					(d) =>
						filtroPorProfessor(d, filtros.professor) &&
						filtroPorStatus(d, filtros.jaFez, DisciplinasFeitas) &&
						filtroPorPeriodo(d, filtros.periodo) &&
						filtroPorTurno(d, filtros.turno) &&
						filtroPorDia(d, filtros.dia) &&
						filtroPorNome(d, filtros.buscaNome),
				),
			});
		},

		setFiltro: (campo, valor) => {
			set((state) => ({
				filtros: {
					...state.filtros,
					[campo]: valor,
				},
			}));
			get().filtrarDisciplinas();
		},
	}),
);

function filtroPorProfessor(
	disciplina: Disciplina,
	professor: string,
): boolean {
	if (professor === "todos") return true;
	return disciplina.professor === professor;
}

function filtroPorStatus(
	disciplina: Disciplina,
	jaFez: string,
	disciplinasFeitas: Set<number>,
): boolean {
	const jaFoiFeita = disciplinasFeitas.has(disciplina.id);
	if (jaFez === "sim") return jaFoiFeita;
	if (jaFez === "nao") return !jaFoiFeita;
	return true; // para jaFez === 'todos'
}

const filtroPorPeriodo = (disciplina: Disciplina, periodo: string): boolean => {
	if (periodo === "todos") {
		return disciplina.periodo.toLowerCase() !== "não ofertadas";
	}

	if (periodo === "todos_sem_optativas") {
		return (
			disciplina.periodo.toLowerCase() !== "optativa" &&
			disciplina.periodo.toLowerCase() !== "não ofertadas"
		);
	}

	return disciplina.periodo === periodo;
};

function filtroPorTurno(disciplina: Disciplina, turno: string): boolean {
	if (turno === "todos") return true;

	if (!disciplina.horarios || disciplina.horarios.length === 0) return false;

	// verificar se TODOS os horários correspondem ao turno.
	return disciplina.horarios.every((horario) => {
		const horaInicio = parseInt(horario.inicio.split(":")[0]);
		if (turno === "manha") return horaInicio < 12;
		if (turno === "tarde") return horaInicio >= 12 && horaInicio < 18;
		if (turno === "noite") return horaInicio >= 18;
		return false;
	});
}

function filtroPorDia(disciplina: Disciplina, dia: string): boolean {
	if (dia === "todos") return true;

	if (!disciplina.horarios || disciplina.horarios.length === 0) return false;

	// verificar se TODOS os horários ocorrem no dia selecionado.
	return disciplina.horarios.every((horario) => horario.dia === dia);
}

function filtroPorNome(disciplina: Disciplina, busca: string): boolean {
	if (!busca.trim()) {
		return true;
	}

	const nomeNormalizado = normalizarTexto(disciplina.nome);
	const buscaNormalizada = normalizarTexto(busca);

	return nomeNormalizado.includes(buscaNormalizada);
}
const normalizarTexto = (texto: string): string => {
	return texto
		.toLowerCase()
		.normalize("NFD") // Decompõe os caracteres (ex: 'á' -> 'a' + '´')
		.replace(/[\u0300-\u036f]/g, ""); // Remove os diacríticos (acentos)
};
