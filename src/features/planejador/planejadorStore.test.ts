/// <reference types="jest" />

import { useDisciplinaStore } from "@/store/disciplinaStore";
import { resetDisciplinaStoreForTests } from "@/test/resetDisciplinaStoreForTests";
import { usePlanejadorStore } from "./planejadorStore";

const PERSIST_KEY = "planejador";

function resetPlanejadorStore(): void {
	usePlanejadorStore.setState({
		planejamento: [],
		semestreEmEdicao: null,
	});
}

function setupStores(): void {
	resetDisciplinaStoreForTests();
	resetPlanejadorStore();
}

describe("usePlanejadorStore", () => {
	beforeEach(() => {
		setupStores();
	});

	describe("adicionarSemestre", () => {
		beforeEach(() => {
			jest.useFakeTimers();
		});
		afterEach(() => {
			jest.useRealTimers();
		});

		it("primeiro semestre: antes de agosto => semestre 1 no ano corrente", () => {
			jest.setSystemTime(new Date("2026-03-15T12:00:00.000Z"));

			usePlanejadorStore.getState().adicionarSemestre();

			expect(usePlanejadorStore.getState().planejamento).toEqual([{ ano: 2026, semestre: 1, disciplinas: [] }]);
		});

		it("primeiro semestre: agosto em diante => semestre 2 no ano corrente", () => {
			jest.setSystemTime(new Date("2026-08-15T12:00:00.000Z"));

			usePlanejadorStore.getState().adicionarSemestre();

			expect(usePlanejadorStore.getState().planejamento).toEqual([{ ano: 2026, semestre: 2, disciplinas: [] }]);
		});

		it("encadeia 1 => 2 => próximo ano 1", () => {
			jest.setSystemTime(new Date("2026-03-15T12:00:00.000Z"));
			const { adicionarSemestre } = usePlanejadorStore.getState();
			adicionarSemestre();
			adicionarSemestre();
			adicionarSemestre();

			expect(usePlanejadorStore.getState().planejamento).toEqual([
				{ ano: 2026, semestre: 1, disciplinas: [] },
				{ ano: 2026, semestre: 2, disciplinas: [] },
				{ ano: 2027, semestre: 1, disciplinas: [] },
			]);
		});
	});

	describe("removerSemestre", () => {
		beforeEach(() => {
			jest.useFakeTimers();
			jest.setSystemTime(new Date("2026-03-15T12:00:00.000Z"));
		});
		afterEach(() => {
			jest.useRealTimers();
		});

		it("remove semestre existente e recalcula os seguintes", () => {
			const s = usePlanejadorStore.getState();
			s.adicionarSemestre();
			s.adicionarSemestre();
			s.adicionarSemestre();

			usePlanejadorStore.getState().removerSemestre(2026, 1);

			const plan = usePlanejadorStore.getState().planejamento;
			expect(plan).toHaveLength(2);
			expect(plan[0]?.semestre).toBe(1);
			expect(plan[0]?.ano).toBe(2026);
			expect(plan[1]?.semestre).toBe(2);
			expect(plan[1]?.ano).toBe(2026);
		});

		it("índice inexistente não altera o planejamento", () => {
			usePlanejadorStore.getState().adicionarSemestre();
			const antes = usePlanejadorStore.getState().planejamento;

			usePlanejadorStore.getState().removerSemestre(2099, 2);

			expect(usePlanejadorStore.getState().planejamento).toEqual(antes);
		});

		it("zera semestreEmEdicao se o removido estava em edição", () => {
			usePlanejadorStore.getState().adicionarSemestre();
			usePlanejadorStore.getState().iniciarEdicao(2026, 1);
			usePlanejadorStore.getState().removerSemestre(2026, 1);

			expect(usePlanejadorStore.getState().semestreEmEdicao).toBe(null);
		});
	});

	describe("iniciarEdicao e concluirEdicao", () => {
		it("define e limpa semestreEmEdicao", () => {
			usePlanejadorStore.getState().iniciarEdicao(2027, 2);
			expect(usePlanejadorStore.getState().semestreEmEdicao).toEqual({ ano: 2027, semestre: 2 });

			usePlanejadorStore.getState().concluirEdicao();
			expect(usePlanejadorStore.getState().semestreEmEdicao).toBe(null);
		});
	});

	describe("adicionarDisciplina e removerDisciplina", () => {
		beforeEach(() => {
			jest.useFakeTimers();
			jest.setSystemTime(new Date("2026-03-15T12:00:00.000Z"));
			usePlanejadorStore.getState().adicionarSemestre();
			usePlanejadorStore.getState().iniciarEdicao(2026, 1);
		});
		afterEach(() => {
			jest.useRealTimers();
		});

		it("sem semestreEmEdicao não altera planejamento", () => {
			usePlanejadorStore.getState().concluirEdicao();
			usePlanejadorStore.getState().adicionarDisciplina(1);

			expect(usePlanejadorStore.getState().planejamento[0]?.disciplinas).toEqual([]);
		});

		it("adiciona e remove disciplina no semestre em edição", () => {
			usePlanejadorStore.getState().adicionarDisciplina(10);
			usePlanejadorStore.getState().adicionarDisciplina(20);
			expect(usePlanejadorStore.getState().planejamento[0]?.disciplinas).toEqual([10, 20]);

			usePlanejadorStore.getState().removerDisciplina(10);
			expect(usePlanejadorStore.getState().planejamento[0]?.disciplinas).toEqual([20]);
		});
	});

	describe("getConflitos", () => {
		it("retorna vazio sem sobreposição de horário no mesmo dia", () => {
			useDisciplinaStore.setState({
				DisciplinasTotais: [
					{
						id: 1,
						nome: "A",
						periodo: "1° período",
						carga_horaria: 60,
						horarios: [{ dia: "Segunda", inicio: "08:00", fim: "10:00" }],
					},
					{
						id: 2,
						nome: "B",
						periodo: "1° período",
						carga_horaria: 60,
						horarios: [{ dia: "Segunda", inicio: "10:00", fim: "12:00" }],
					},
				],
			});

			const semestre = { ano: 2026, semestre: 1, disciplinas: [1, 2] };
			const c = usePlanejadorStore.getState().getConflitos(semestre);

			expect([...c].sort((a, b) => a - b)).toEqual([]);
		});

		it("detecta conflito no mesmo dia com intervalos sobrepostos", () => {
			useDisciplinaStore.setState({
				DisciplinasTotais: [
					{
						id: 1,
						nome: "A",
						periodo: "1° período",
						carga_horaria: 60,
						horarios: [{ dia: "Terça", inicio: "08:00", fim: "10:00" }],
					},
					{
						id: 2,
						nome: "B",
						periodo: "1° período",
						carga_horaria: 60,
						horarios: [{ dia: "Terça", inicio: "09:00", fim: "11:00" }],
					},
				],
			});

			const c = usePlanejadorStore.getState().getConflitos({
				ano: 2026,
				semestre: 1,
				disciplinas: [1, 2],
			});

			expect([...c].sort((a, b) => a - b)).toEqual([1, 2]);
		});

		it("ignora par se alguma disciplina não tem horários", () => {
			useDisciplinaStore.setState({
				DisciplinasTotais: [
					{ id: 1, nome: "A", periodo: "1° período", carga_horaria: 60 },
					{
						id: 2,
						nome: "B",
						periodo: "1° período",
						carga_horaria: 60,
						horarios: [{ dia: "Segunda", inicio: "08:00", fim: "10:00" }],
					},
				],
			});

			const c = usePlanejadorStore.getState().getConflitos({
				ano: 2026,
				semestre: 1,
				disciplinas: [1, 2],
			});

			expect(c.size).toBe(0);
		});
	});

	describe("getDisciplinasDisponiveisParaSelecao", () => {
		beforeEach(() => {
			useDisciplinaStore.setState({
				DisciplinasFeitas: new Set([1]),
				DisciplinasTotais: [
					{ id: 1, nome: "Feita", periodo: "1° período", carga_horaria: 60 },
					{
						id: 2,
						nome: "Livre",
						periodo: "1° período",
						carga_horaria: 60,
					},
					{
						id: 3,
						nome: "Com req",
						periodo: "1° período",
						carga_horaria: 60,
						requisitos: [{ id: 1 }],
					},
					{ id: 4, nome: "NO", periodo: "Não ofertadas", carga_horaria: 30 },
					{ id: 5, nome: "Opt", periodo: "Optativa", carga_horaria: 30 },
				],
			});
		});

		it("exclui feitas, Não ofertadas e já planejadas em outro semestre", () => {
			usePlanejadorStore.setState({
				planejamento: [
					{ ano: 2026, semestre: 1, disciplinas: [5] },
					{ ano: 2026, semestre: 2, disciplinas: [] },
				],
			});

			const plan = usePlanejadorStore.getState().planejamento;
			expect(plan).toHaveLength(2);
			const s1 = plan[1];
			expect(s1).toBeDefined();
			if (s1 === undefined) {
				return;
			}

			const disponiveis = usePlanejadorStore.getState().getDisciplinasDisponiveisParaSelecao(s1, 1);

			const ids = disponiveis.map((d) => d.id).sort((a, b) => a - b);
			expect(ids).toEqual([2, 3]);
		});

		it("exclui disciplina já no próprio semestre", () => {
			usePlanejadorStore.setState({
				planejamento: [{ ano: 2026, semestre: 1, disciplinas: [2] }],
			});
			const plan = usePlanejadorStore.getState().planejamento;
			const sem = plan[0];
			expect(sem).toBeDefined();
			if (sem === undefined) {
				return;
			}

			const ids = usePlanejadorStore
				.getState()
				.getDisciplinasDisponiveisParaSelecao(sem, 0)
				.map((d) => d.id)
				.sort((a, b) => a - b);

			expect(ids).toEqual([3, 5]);
		});

		it("só oferece disciplina com requisitos já em feitas ou semestres anteriores (11 bloqueada, 10 livre)", () => {
			useDisciplinaStore.setState({
				DisciplinasFeitas: new Set(),
				DisciplinasTotais: [
					{ id: 10, nome: "Base", periodo: "1° período", carga_horaria: 60 },
					{
						id: 11,
						nome: "Dep",
						periodo: "1° período",
						carga_horaria: 60,
						requisitos: [{ id: 10 }],
					},
				],
			});
			usePlanejadorStore.setState({
				planejamento: [
					{ ano: 2026, semestre: 1, disciplinas: [] },
					{ ano: 2026, semestre: 2, disciplinas: [] },
				],
			});
			const plan = usePlanejadorStore.getState().planejamento;
			const s1 = plan[1];
			expect(s1).toBeDefined();
			if (s1 === undefined) {
				return;
			}

			const ids = usePlanejadorStore
				.getState()
				.getDisciplinasDisponiveisParaSelecao(s1, 1)
				.map((d) => d.id);

			expect(ids).toEqual([10]);
		});

		it("libera disciplina com requisitos satisfeitos por semestre anterior no planejamento", () => {
			useDisciplinaStore.setState({
				DisciplinasFeitas: new Set(),
				DisciplinasTotais: [
					{ id: 10, nome: "Base", periodo: "1° período", carga_horaria: 60 },
					{
						id: 11,
						nome: "Dep",
						periodo: "1° período",
						carga_horaria: 60,
						requisitos: [{ id: 10 }],
					},
				],
			});
			usePlanejadorStore.setState({
				planejamento: [
					{ ano: 2026, semestre: 1, disciplinas: [10] },
					{ ano: 2026, semestre: 2, disciplinas: [] },
				],
			});
			const plan = usePlanejadorStore.getState().planejamento;
			const s1 = plan[1];
			expect(s1).toBeDefined();
			if (s1 === undefined) {
				return;
			}

			const ids = usePlanejadorStore
				.getState()
				.getDisciplinasDisponiveisParaSelecao(s1, 1)
				.map((d) => d.id);

			expect(ids).toEqual([11]);
		});
	});

	describe("preencherAutomaticamente", () => {
		beforeEach(() => {
			jest.useFakeTimers();
			jest.setSystemTime(new Date("2026-03-15T12:00:00.000Z"));
		});
		afterEach(() => {
			jest.useRealTimers();
		});

		it("lista vazia gera planejamento vazio", () => {
			usePlanejadorStore.getState().preencherAutomaticamente();

			expect(usePlanejadorStore.getState().planejamento).toEqual([]);
			expect(usePlanejadorStore.getState().semestreEmEdicao).toBe(null);
		});

		it("distribui obrigatórias e limita novas optativas a 7 menos optativas já feitas", () => {
			const optFeita = { id: 100, nome: "Opt OK", periodo: "Optativa" as const, carga_horaria: 30 };
			const obrs = [1, 2, 3, 4, 5, 6, 7, 8].map((id) => ({
				id,
				nome: `O${id}`,
				periodo: "1° período",
				carga_horaria: 60,
				horarios: [
					{
						dia: "Segunda" as const,
						inicio: `${String(8 + id).padStart(2, "0")}:00`,
						fim: `${String(9 + id).padStart(2, "0")}:00`,
					},
				],
			}));
			const opts = [101, 102, 103, 104, 105, 106, 107, 108].map((id) => ({
				id,
				nome: `P${id}`,
				periodo: "Optativa" as const,
				carga_horaria: 30,
				horarios: [
					{
						dia: "Terça" as const,
						inicio: `${String((id % 12) + 8).padStart(2, "0")}:00`,
						fim: `${String((id % 12) + 9).padStart(2, "0")}:00`,
					},
				],
			}));

			useDisciplinaStore.setState({
				DisciplinasFeitas: new Set([100]),
				DisciplinasTotais: [...obrs, optFeita, ...opts],
			});

			usePlanejadorStore.getState().preencherAutomaticamente();

			const plan = usePlanejadorStore.getState().planejamento;
			const todosIds = plan.flatMap((p) => p.disciplinas);
			expect(todosIds).not.toContain(100);
			expect(new Set(todosIds).size).toBe(todosIds.length);

			const novasOptIncluidas = opts.filter((o) => todosIds.includes(o.id)).length;
			expect(novasOptIncluidas).toBe(6);
			expect(obrs.every((o) => todosIds.includes(o.id))).toBe(true);
		});

		it("não inclui Não ofertadas nem optativas já contadas como feitas na fila", () => {
			useDisciplinaStore.setState({
				DisciplinasFeitas: new Set([1]),
				DisciplinasTotais: [
					{ id: 1, nome: "Feita", periodo: "1° período", carga_horaria: 60 },
					{ id: 2, nome: "NO", periodo: "Não ofertadas", carga_horaria: 30 },
					{ id: 3, nome: "Obr", periodo: "1° período", carga_horaria: 60 },
				],
			});

			usePlanejadorStore.getState().preencherAutomaticamente();

			const todos = usePlanejadorStore.getState().planejamento.flatMap((p) => p.disciplinas);
			expect(todos).toEqual([3]);
		});
	});

	describe("persistência", () => {
		beforeEach(() => {
			jest.useFakeTimers();
			jest.setSystemTime(new Date("2026-03-15T12:00:00.000Z"));
		});
		afterEach(() => {
			jest.useRealTimers();
		});

		it("persiste apenas planejamento no localStorage", () => {
			usePlanejadorStore.getState().adicionarSemestre();
			usePlanejadorStore.getState().iniciarEdicao(2026, 1);
			usePlanejadorStore.getState().adicionarDisciplina(42);

			const raw = localStorage.getItem(PERSIST_KEY);
			expect(raw).toBeTruthy();
			const parsed = JSON.parse(raw as string) as {
				state: { planejamento: { ano: number; semestre: number; disciplinas: number[] }[] };
			};
			expect(parsed.state.planejamento[0]?.disciplinas).toEqual([42]);
		});
	});
});
