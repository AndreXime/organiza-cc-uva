import AcademicEvents from "@/data/Eventos";
import { processDisciplinas, processEquivalentes } from "@/lib/csvToObject";

export const DisciplinasCurso = processDisciplinas("./data/Disciplinas.csv");
export const DisciplinasEquivalentes = processEquivalentes("./data/Equivalentes.csv", DisciplinasCurso);
export { AcademicEvents };
