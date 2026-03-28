/// <reference types="jest" />

/** Exige `cwd` na raiz do repositório (caminhos `src/data/*.csv`). */
import { buildServerData, type ServerData } from "./index";

describe("buildServerData", () => {
	const projectRoot = process.cwd();
	let data: ServerData;

	beforeAll(() => {
		data = buildServerData(projectRoot);
	});

	it("disciplinas com campos mínimos e ordenadas por id", () => {
		const { Disciplinas } = data;

		expect(Disciplinas.data.length).toBeGreaterThan(0);
		expect(Disciplinas.metadata.lastUpdated).toBeInstanceOf(Date);

		for (const d of Disciplinas.data) {
			expect(d).toMatchObject({
				id: expect.any(Number),
				nome: expect.any(String),
				periodo: expect.any(String),
				carga_horaria: expect.any(Number),
			});
			expect(Number.isFinite(d.id)).toBe(true);
			expect(Number.isFinite(d.carga_horaria)).toBe(true);
		}

		const ids = Disciplinas.data.map((d) => d.id);
		expect(new Set(ids).size).toBe(ids.length);

		const sorted = [...ids].sort((a, b) => a - b);
		expect(ids).toEqual(sorted);
	});

	it("equivalentes ligados a disciplinas existentes", () => {
		const ids = new Set(data.Disciplinas.data.map((d) => d.id));

		expect(data.DisciplinasEquivalentes.metadata.lastUpdated).toBeInstanceOf(Date);

		for (const eq of data.DisciplinasEquivalentes.data) {
			expect(eq).toMatchObject({
				nome: expect.any(String),
				curso: expect.any(String),
				equivaleId: expect.any(Number),
				equivaleNome: expect.any(String),
				professor: expect.any(String),
			});
			expect(ids.has(eq.equivaleId)).toBe(true);
		}
	});

	it("eventos acadêmicos com datas e semesterDates", () => {
		const { EventosAcademicos } = data;

		expect(EventosAcademicos.data.length).toBeGreaterThan(0);
		expect(EventosAcademicos.metadata.lastUpdated).toBeInstanceOf(Date);
		expect(typeof EventosAcademicos.metadata.semesterDates).toBe("object");

		for (const range of Object.values(EventosAcademicos.metadata.semesterDates)) {
			expect(range.start).toBeInstanceOf(Date);
			expect(range.end).toBeInstanceOf(Date);
		}

		for (const ev of EventosAcademicos.data) {
			expect(ev.date).toBeInstanceOf(Date);
			expect(typeof ev.event).toBe("string");
			if (ev.untilDate !== undefined) {
				expect(ev.untilDate).toBeInstanceOf(Date);
			}
		}
	});
});
