import { AcademicEvents, semesterDates } from "@/data/Eventos";
import { processDisciplinas, processEquivalentes } from "@/lib/csvToObject";

const Disciplinas = {
	metadata: {
		lastUpdated: new Date("2025-10-03"),
	},
	data: processDisciplinas("./data/Disciplinas.csv"),
};

const DisciplinasEquivalentes = {
	metadata: {
		lastUpdated: new Date("2025-09-20"),
	},
	data: processEquivalentes("./data/Equivalentes.csv", Disciplinas.data),
};

const EventosAcademicos = {
	metadata: {
		lastUpdated: new Date("2026-03-11"),
		semesterDates,
	},
	data: AcademicEvents,
};

export default { EventosAcademicos, Disciplinas, DisciplinasEquivalentes };
export type EventosAcademicosServer = typeof EventosAcademicos;
export type DisciplinasServer = {
	Disciplinas: typeof Disciplinas;
	DisciplinasEquivalentes: typeof DisciplinasEquivalentes;
};
