import { useDisciplinaStore } from "@/store/disciplinas/disciplinaStore";
/**
 * Gera classes tailwind com base no status do usuario em certa disciplina
 */
export function generateDisciplinaClasses(id: number) {
	const { DisciplinasDisponiveis, DisciplinasFeitas } =
		useDisciplinaStore.getState();

	const foiFeita = DisciplinasFeitas.has(id);
	const estaDisponivel = DisciplinasDisponiveis.has(id);

	let cardClasses = "course-item ";
	let titleClasses = "font-semibold ";

	if (foiFeita) {
		cardClasses += "bg-green-50 cursor-pointer";
		titleClasses += "text-green-700";
	} else if (estaDisponivel) {
		cardClasses += "bg-blue-50 cursor-pointer";
		titleClasses += "text-blue-800 ";
	} else {
		cardClasses += "bg-gray-100 text-gray-400 cursor-not-allowed";
		titleClasses += "text-gray-500";
	}

	const estáBloqueada = !foiFeita && !estaDisponivel;

	return { cardClasses, titleClasses, estáBloqueada };
}
