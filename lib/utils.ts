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
		cardClasses += "bg-card-feita cursor-pointer";
		titleClasses += "text-title-feita";
	} else if (estaDisponivel) {
		cardClasses += "bg-card-disponivel cursor-pointer";
		titleClasses += "text-title-disponivel";
	} else {
		cardClasses += "bg-card-bloqueada cursor-not-allowed opacity-60";
		titleClasses += "text-muted";
	}

	const estáBloqueada = !foiFeita && !estaDisponivel;

	return { cardClasses, titleClasses, estáBloqueada };
}

// Para o theme.css não ficar muito poluido em alguns componentes iram usar essa função pra decidir a classe tailwind
export function getCurrentTheme() {
	return localStorage.getItem("theme") || "light";
}
