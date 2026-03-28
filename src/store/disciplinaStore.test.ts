/// <reference types="jest" />

import type { DisciplinasServer } from "@/data";
import { resetDisciplinaStoreForTests } from "@/test/resetDisciplinaStoreForTests";
import { useDisciplinaStore } from "./disciplinaStore";

function serverData(disciplinas: Disciplina[], equivalentes: Equivalente[] = []): DisciplinasServer {
	const d1 = new Date("2026-01-01T12:00:00.000Z");
	const d2 = new Date("2026-01-02T12:00:00.000Z");
	return {
		Disciplinas: { metadata: { lastUpdated: d1 }, data: disciplinas },
		DisciplinasEquivalentes: { metadata: { lastUpdated: d2 }, data: equivalentes },
	};
}

describe("useDisciplinaStore", () => {
	beforeEach(() => {
		resetDisciplinaStoreForTests();
	});

	describe("init", () => {
		it("carrega disciplinas, equivalentes, metadata e encerra loading", () => {
			const equiv: Equivalente[] = [
				{
					nome: "X",
					curso: "CC",
					equivaleId: 1,
					equivaleNome: "Y",
					professor: "Z",
				},
			];
			const data = serverData([{ id: 1, nome: "A", periodo: "1° período", carga_horaria: 60 }], equiv);

			useDisciplinaStore.getState().init(data);

			const s = useDisciplinaStore.getState();
			expect(s.DisciplinasTotais).toHaveLength(1);
			expect(s.DisciplinasTotais[0]?.nome).toBe("A");
			expect(s.DisciplinasEquivalentes).toEqual(equiv);
			expect(s.metadata.DisciplinaLastUpdated).toEqual(data.Disciplinas.metadata.lastUpdated);
			expect(s.metadata.DisciplinaEquivalentesLastUpdated).toEqual(data.DisciplinasEquivalentes.metadata.lastUpdated);
			expect(s.loading).toBe(false);
		});

		it("agrupa optativa sem professor em Não ofertadas e ordena períodos", () => {
			const data = serverData([
				{ id: 2, nome: "Segundo", periodo: "2° período", carga_horaria: 60 },
				{ id: 1, nome: "Primeiro", periodo: "1° período", carga_horaria: 60 },
				{
					id: 3,
					nome: "Opt vira NO",
					periodo: "Optativa",
					carga_horaria: 30,
				},
				{ id: 4, nome: "Só optativa", periodo: "Optativa", carga_horaria: 30, professor: "P" },
				{ id: 5, nome: "NO", periodo: "Não ofertadas", carga_horaria: 30 },
			]);

			useDisciplinaStore.getState().init(data);

			const keys = Object.keys(useDisciplinaStore.getState().DisciplinasPorPeriodo);
			expect(keys).toEqual(["1° período", "2° período", "Optativa", "Não ofertadas"]);

			const no = useDisciplinaStore.getState().DisciplinasPorPeriodo["Não ofertadas"];
			expect(no?.has(3)).toBe(true);
			expect(no?.has(5)).toBe(true);

			const opt = useDisciplinaStore.getState().DisciplinasPorPeriodo.Optativa;
			expect(opt?.has(4)).toBe(true);
			expect(opt?.has(3)).toBe(false);
		});

		it("chama recalculateDisponiveis após carregar", () => {
			const data = serverData([
				{ id: 1, nome: "Livre", periodo: "1° período", carga_horaria: 60 },
				{
					id: 2,
					nome: "Com req",
					periodo: "1° período",
					carga_horaria: 60,
					requisitos: [{ id: 1 }],
				},
			]);

			useDisciplinaStore.getState().init(data);

			const disp = useDisciplinaStore.getState().DisciplinasDisponiveis;
			expect(disp.has(1)).toBe(true);
			expect(disp.has(2)).toBe(false);
		});

		it("atualiza periodo da disciplina no array quando optativa sem professor vira Não ofertadas", () => {
			const discs: Disciplina[] = [{ id: 1, nome: "Opt", periodo: "Optativa", carga_horaria: 30 }];
			useDisciplinaStore.getState().init(serverData(discs));

			expect(useDisciplinaStore.getState().DisciplinasTotais[0]?.periodo).toBe("Não ofertadas");
		});

		it("inclui período não numérico na ordenação após períodos numéricos e rótulos conhecidos", () => {
			useDisciplinaStore.getState().init(
				serverData([
					{ id: 1, nome: "Extra", periodo: "Especial", carga_horaria: 30 },
					{ id: 2, nome: "P1", periodo: "1° período", carga_horaria: 60 },
				]),
			);

			const keys = Object.keys(useDisciplinaStore.getState().DisciplinasPorPeriodo);
			expect(keys[0]).toBe("1° período");
			expect(keys).toContain("Especial");
		});
	});

	describe("recalculateDisponiveis", () => {
		beforeEach(() => {
			useDisciplinaStore.getState().init(
				serverData([
					{ id: 1, nome: "Base", periodo: "1° período", carga_horaria: 60 },
					{
						id: 2,
						nome: "Depende",
						periodo: "1° período",
						carga_horaria: 60,
						requisitos: [{ id: 1 }],
					},
					{ id: 99, nome: "Não ofertada", periodo: "Não ofertadas", carga_horaria: 30 },
				]),
			);
		});

		it("exclui disciplinas não ofertadas e já feitas", () => {
			useDisciplinaStore.setState({ DisciplinasFeitas: new Set([1]) });
			useDisciplinaStore.getState().recalculateDisponiveis();

			const disp = useDisciplinaStore.getState().DisciplinasDisponiveis;
			expect(disp.has(99)).toBe(false);
			expect(disp.has(1)).toBe(false);
			expect(disp.has(2)).toBe(true);
		});

		it("marca disciplina sem requisitos como disponível", () => {
			useDisciplinaStore.setState({ DisciplinasFeitas: new Set() });
			useDisciplinaStore.getState().recalculateDisponiveis();
			expect(useDisciplinaStore.getState().DisciplinasDisponiveis.has(1)).toBe(true);
		});

		it("exige todos os requisitos para liberar disciplina com múltiplos pré-requisitos", () => {
			useDisciplinaStore.getState().init(
				serverData([
					{ id: 1, nome: "R1", periodo: "1° período", carga_horaria: 60 },
					{ id: 2, nome: "R2", periodo: "1° período", carga_horaria: 60 },
					{
						id: 3,
						nome: "C",
						periodo: "1° período",
						carga_horaria: 60,
						requisitos: [{ id: 1 }, { id: 2 }],
					},
				]),
			);

			useDisciplinaStore.setState({ DisciplinasFeitas: new Set([1]) });
			useDisciplinaStore.getState().recalculateDisponiveis();
			expect(useDisciplinaStore.getState().DisciplinasDisponiveis.has(3)).toBe(false);

			useDisciplinaStore.setState({ DisciplinasFeitas: new Set([1, 2]) });
			useDisciplinaStore.getState().recalculateDisponiveis();
			expect(useDisciplinaStore.getState().DisciplinasDisponiveis.has(3)).toBe(true);
		});

		it("trata requisitos vazio ou indefinido como sem pré-requisito", () => {
			useDisciplinaStore.getState().init(
				serverData([
					{ id: 1, nome: "A", periodo: "1° período", carga_horaria: 60, requisitos: [] },
					{ id: 2, nome: "B", periodo: "1° período", carga_horaria: 60 },
				]),
			);

			useDisciplinaStore.getState().recalculateDisponiveis();
			const disp = useDisciplinaStore.getState().DisciplinasDisponiveis;
			expect(disp.has(1)).toBe(true);
			expect(disp.has(2)).toBe(true);
		});
	});

	describe("toggleDisciplina", () => {
		beforeEach(() => {
			useDisciplinaStore.getState().init(
				serverData([
					{ id: 1, nome: "A", periodo: "1° período", carga_horaria: 60 },
					{
						id: 2,
						nome: "B",
						periodo: "1° período",
						carga_horaria: 60,
						requisitos: [{ id: 1 }],
					},
				]),
			);
		});

		it("adiciona e remove disciplina quando não há dependência", () => {
			expect(useDisciplinaStore.getState().DisciplinasFeitas.has(1)).toBe(false);

			expect(useDisciplinaStore.getState().toggleDisciplina(1)).toBeUndefined();
			expect(useDisciplinaStore.getState().DisciplinasFeitas.has(1)).toBe(true);

			expect(useDisciplinaStore.getState().toggleDisciplina(1)).toBeUndefined();
			expect(useDisciplinaStore.getState().DisciplinasFeitas.has(1)).toBe(false);
		});

		it("impede desmarcar disciplina requisito de outra já feita", () => {
			useDisciplinaStore.getState().toggleDisciplina(1);
			useDisciplinaStore.getState().toggleDisciplina(2);

			const msg = useDisciplinaStore.getState().toggleDisciplina(1);
			expect(msg).toBe(
				"Você não pode desmarcar esta disciplina porque outra que depende dela já está marcada como feita.",
			);
			expect(useDisciplinaStore.getState().DisciplinasFeitas.has(1)).toBe(true);
			expect(useDisciplinaStore.getState().DisciplinasFeitas.has(2)).toBe(true);
		});

		it("atualiza DisciplinasDisponiveis ao alternar", () => {
			expect(useDisciplinaStore.getState().DisciplinasDisponiveis.has(2)).toBe(false);
			useDisciplinaStore.getState().toggleDisciplina(1);
			expect(useDisciplinaStore.getState().DisciplinasDisponiveis.has(2)).toBe(true);
		});

		it("permite desmarcar requisito se a disciplina dependente não está feita", () => {
			useDisciplinaStore.getState().toggleDisciplina(1);
			expect(useDisciplinaStore.getState().toggleDisciplina(1)).toBeUndefined();
			expect(useDisciplinaStore.getState().DisciplinasFeitas.has(1)).toBe(false);
		});

		it("bloqueia desmarcar o primeiro elo de uma cadeia de dependências", () => {
			useDisciplinaStore.getState().init(
				serverData([
					{ id: 1, nome: "A", periodo: "1° período", carga_horaria: 60 },
					{
						id: 2,
						nome: "B",
						periodo: "1° período",
						carga_horaria: 60,
						requisitos: [{ id: 1 }],
					},
					{
						id: 3,
						nome: "C",
						periodo: "1° período",
						carga_horaria: 60,
						requisitos: [{ id: 2 }],
					},
				]),
			);

			useDisciplinaStore.getState().toggleDisciplina(1);
			useDisciplinaStore.getState().toggleDisciplina(2);
			useDisciplinaStore.getState().toggleDisciplina(3);

			expect(useDisciplinaStore.getState().toggleDisciplina(1)).toBe(
				"Você não pode desmarcar esta disciplina porque outra que depende dela já está marcada como feita.",
			);
			expect(useDisciplinaStore.getState().DisciplinasFeitas.has(1)).toBe(true);
		});

		it("aceita marcar id que não existe em DisciplinasTotais (comportamento atual do store)", () => {
			expect(useDisciplinaStore.getState().toggleDisciplina(999)).toBeUndefined();
			expect(useDisciplinaStore.getState().DisciplinasFeitas.has(999)).toBe(true);
		});
	});

	describe("getDisciplinasByIds", () => {
		it("retorna apenas disciplinas cujo id está no conjunto", () => {
			useDisciplinaStore.getState().init(
				serverData([
					{ id: 10, nome: "D10", periodo: "1° período", carga_horaria: 60 },
					{ id: 20, nome: "D20", periodo: "1° período", carga_horaria: 60 },
				]),
			);

			const out = useDisciplinaStore.getState().getDisciplinasByIds(new Set([20]));
			expect(out).toHaveLength(1);
			expect(out[0]?.id).toBe(20);
		});

		it("retorna array vazio para conjunto vazio", () => {
			useDisciplinaStore.getState().init(serverData([{ id: 1, nome: "A", periodo: "1° período", carga_horaria: 60 }]));
			expect(useDisciplinaStore.getState().getDisciplinasByIds(new Set())).toEqual([]);
		});

		it("preserva a ordem do array DisciplinasTotais", () => {
			useDisciplinaStore.getState().init(
				serverData([
					{ id: 30, nome: "Terceiro", periodo: "1° período", carga_horaria: 60 },
					{ id: 10, nome: "Primeiro", periodo: "1° período", carga_horaria: 60 },
				]),
			);

			const out = useDisciplinaStore.getState().getDisciplinasByIds(new Set([10, 30]));
			expect(out.map((d) => d.id)).toEqual([30, 10]);
		});
	});

	describe("getDisciplinaByName", () => {
		it("retorna disciplina pelo nome exato", () => {
			useDisciplinaStore
				.getState()
				.init(serverData([{ id: 7, nome: "Cálculo I", periodo: "1° período", carga_horaria: 90 }]));

			const d = useDisciplinaStore.getState().getDisciplinaByName("Cálculo I");
			expect(d?.id).toBe(7);
			expect(useDisciplinaStore.getState().getDisciplinaByName("Outro")).toBeUndefined();
		});

		it("não encontra por nome com caixa diferente (comparação estrita)", () => {
			useDisciplinaStore
				.getState()
				.init(serverData([{ id: 1, nome: "Lp2", periodo: "1° período", carga_horaria: 60 }]));
			expect(useDisciplinaStore.getState().getDisciplinaByName("lp2")).toBeUndefined();
		});

		it("com nomes duplicados retorna a primeira ocorrência na lista", () => {
			useDisciplinaStore.getState().init(
				serverData([
					{ id: 1, nome: "Igual", periodo: "1° período", carga_horaria: 60 },
					{ id: 2, nome: "Igual", periodo: "2° período", carga_horaria: 60 },
				]),
			);
			expect(useDisciplinaStore.getState().getDisciplinaByName("Igual")?.id).toBe(1);
		});
	});

	describe("persistência (DisciplinasFeitas)", () => {
		it("persiste DisciplinasFeitas no localStorage após toggle", () => {
			useDisciplinaStore.getState().init(serverData([{ id: 5, nome: "X", periodo: "1° período", carga_horaria: 60 }]));
			useDisciplinaStore.getState().toggleDisciplina(5);

			const raw = localStorage.getItem("disciplinas-feitas");
			expect(raw).toBeTruthy();
			const parsed = JSON.parse(raw as string) as {
				state: { DisciplinasFeitas: number[] };
			};
			expect(parsed.state.DisciplinasFeitas).toContain(5);
		});
	});
});
