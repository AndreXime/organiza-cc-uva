import { useDisciplinaStore } from "@/store/disciplinaStore";
/**
 * Gera classes tailwind com base no status do usuario em certa disciplina
 */
export function generateDisciplinaClasses(id: number) {
	const { DisciplinasDisponiveis, DisciplinasFeitas } = useDisciplinaStore.getState();

	const foiFeita = DisciplinasFeitas.has(id);
	const estaDisponivel = DisciplinasDisponiveis.has(id);

	let cardClasses = "course-item text-foreground ";
	let titleClasses = "font-semibold ";

	if (foiFeita) {
		cardClasses += "bg-done cursor-pointer";
		titleClasses += "text-done-foreground";
	} else if (estaDisponivel) {
		cardClasses += "bg-available cursor-pointer";
		titleClasses += "text-available-foreground";
	} else {
		cardClasses += "bg-blocked cursor-not-allowed opacity-60";
		titleClasses += "text-foreground";
	}

	const estáBloqueada = !foiFeita && !estaDisponivel;

	return { cardClasses, titleClasses, estáBloqueada };
}

// Para o theme.css não ficar muito poluido em alguns componentes iram usar essa função pra decidir a classe tailwind
export function getCurrentTheme() {
	if (typeof window === "undefined") return "light";
	return localStorage.getItem("theme") || "light";
}
