/// <reference types="vite/client" />

declare module "serverdata" {
	import type { ServerData } from "./data/index";

	const data: ServerData;
	export default data;
	export const Disciplinas: ServerData["Disciplinas"];
	export const DisciplinasEquivalentes: ServerData["DisciplinasEquivalentes"];
	export const EventosAcademicos: ServerData["EventosAcademicos"];
}
