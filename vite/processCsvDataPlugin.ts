import path from "node:path";
import type { Plugin } from "vite";
import { buildServerData } from "../src/data";

const MODULE_ID = "serverdata";
const RESOLVED_MODULE_ID = `\0${MODULE_ID}`;

function serializeToJs(value: unknown): string {
	if (value instanceof Date) {
		return `new Date(${JSON.stringify(value.toISOString())})`;
	}

	if (Array.isArray(value)) {
		return `[${value.map((v) => serializeToJs(v)).join(",")}]`;
	}

	if (value && typeof value === "object") {
		const entries = Object.entries(value as Record<string, unknown>).map(
			([k, v]) => `${JSON.stringify(k)}:${serializeToJs(v)}`,
		);
		return `{${entries.join(",")}}`;
	}

	return JSON.stringify(value);
}

export default function processCsvDataPlugin(): Plugin {
	return {
		name: "serverdata-module",
		enforce: "pre",

		resolveId(id) {
			if (id === MODULE_ID) return RESOLVED_MODULE_ID;
			return null;
		},

		async load(id) {
			if (id !== RESOLVED_MODULE_ID) return null;

			const projectRoot = process.cwd();
			const serverData = buildServerData(projectRoot);

			// Mantem HMR/rebuild quando os dados mudarem.
			this.addWatchFile(path.join(projectRoot, "src/data/Disciplinas.csv"));
			this.addWatchFile(path.join(projectRoot, "src/data/Equivalentes.csv"));
			this.addWatchFile(path.join(projectRoot, "src/data/Eventos.ts"));
			this.addWatchFile(path.join(projectRoot, "src/data/index.ts"));

			const code = `// Gerado virtualmente por Vite.
const data = ${serializeToJs(serverData)};
const { Disciplinas, DisciplinasEquivalentes, EventosAcademicos } = data;
export { Disciplinas, DisciplinasEquivalentes, EventosAcademicos };
export default data;
`;

			return code;
		},
	};
}
