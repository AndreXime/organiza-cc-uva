import path from "node:path";
import { processDisciplinas, processEquivalentes } from "../lib/csvToObject";
import { AcademicEvents, semesterDates } from "./Eventos";

export function buildServerData(projectRoot: string = process.cwd()) {
	const Disciplinas = {
		metadata: {
			lastUpdated: new Date("2026-03-11"),
		},
		data: processDisciplinas(path.join(projectRoot, "src/data/Disciplinas.csv")),
	};

	const DisciplinasEquivalentes = {
		metadata: {
			lastUpdated: new Date("2025-09-20"),
		},
		data: processEquivalentes(path.join(projectRoot, "src/data/Equivalentes.csv"), Disciplinas.data),
	};

	const EventosAcademicos = {
		metadata: {
			lastUpdated: new Date("2026-03-11"),
			semesterDates,
		},
		data: AcademicEvents,
	};

	return { EventosAcademicos, Disciplinas, DisciplinasEquivalentes };
}

export type ServerData = ReturnType<typeof buildServerData>;

export type EventosAcademicosServer = ServerData["EventosAcademicos"];
export type DisciplinasServer = Pick<ServerData, "Disciplinas" | "DisciplinasEquivalentes">;
