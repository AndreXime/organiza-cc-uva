/// <reference types="jest" />

import { useDisciplinaStore } from "@/store/disciplinaStore";
import { resetDisciplinaStoreForTests } from "@/test/resetDisciplinaStoreForTests";
import { useFiltroStore } from "./filtroStore";

function resetFiltroStore(): void {
	useFiltroStore.setState({
		filtros: {
			professor: "todos",
			jaFez: "todos",
			periodo: "todos",
			turno: "todos",
			buscaNome: "",
			dia: "todos",
		},
		disciplinasFiltradas: [],
	});
}

function seedDisciplinas(disciplinas: Disciplina[], feitas: ReadonlySet<number> = new Set()): void {
	useDisciplinaStore.setState({
		DisciplinasTotais: disciplinas,
		DisciplinasFeitas: new Set(feitas),
	});
}

describe("useFiltroStore", () => {
	beforeEach(() => {
		resetDisciplinaStoreForTests();
		resetFiltroStore();
	});

	describe("setFiltro", () => {
		it("atualiza um campo e recalcula disciplinasFiltradas", () => {
			seedDisciplinas([
				{ id: 1, nome: "LP2", periodo: "1° período", carga_horaria: 60 },
				{ id: 2, nome: "Cálculo", periodo: "1° período", carga_horaria: 60 },
			]);

			useFiltroStore.getState().setFiltro("buscaNome", "lp2");

			expect(useFiltroStore.getState().filtros.buscaNome).toBe("lp2");
			expect(useFiltroStore.getState().disciplinasFiltradas.map((d) => d.id)).toEqual([1]);
		});

		it("preserva os demais campos de filtros", () => {
			seedDisciplinas([{ id: 1, nome: "A", periodo: "1° período", carga_horaria: 60 }]);
			useFiltroStore.getState().setFiltro("buscaNome", "a");
			useFiltroStore.getState().setFiltro("jaFez", "sim");

			const { filtros } = useFiltroStore.getState();
			expect(filtros.buscaNome).toBe("a");
			expect(filtros.jaFez).toBe("sim");
			expect(filtros.professor).toBe("todos");
			expect(filtros.periodo).toBe("todos");
		});
	});

	describe("filtrarDisciplinas", () => {
		it("com lista vazia resulta em disciplinasFiltradas vazia", () => {
			seedDisciplinas([]);
			useFiltroStore.getState().filtrarDisciplinas();
			expect(useFiltroStore.getState().disciplinasFiltradas).toEqual([]);
		});
	});

	describe("filtro por período (via filtros.periodo)", () => {
		it("todos exclui apenas Não ofertadas", () => {
			seedDisciplinas([
				{ id: 1, nome: "Obr", periodo: "1° período", carga_horaria: 60 },
				{ id: 2, nome: "NO", periodo: "Não ofertadas", carga_horaria: 30 },
				{ id: 3, nome: "Opt", periodo: "Optativa", carga_horaria: 30 },
			]);

			useFiltroStore.getState().filtrarDisciplinas();

			expect(
				useFiltroStore
					.getState()
					.disciplinasFiltradas.map((d) => d.id)
					.sort((a, b) => a - b),
			).toEqual([1, 3]);
		});

		it("todos_sem_optativas exclui Optativa e Não ofertadas", () => {
			seedDisciplinas([
				{ id: 1, nome: "Obr", periodo: "1° período", carga_horaria: 60 },
				{ id: 2, nome: "Opt", periodo: "Optativa", carga_horaria: 30 },
				{ id: 3, nome: "NO", periodo: "Não ofertadas", carga_horaria: 30 },
			]);

			useFiltroStore.getState().setFiltro("periodo", "todos_sem_optativas");

			expect(useFiltroStore.getState().disciplinasFiltradas.map((d) => d.id)).toEqual([1]);
		});

		it("valor específico exige igualdade exata do periodo", () => {
			seedDisciplinas([
				{ id: 1, nome: "A", periodo: "2° período", carga_horaria: 60 },
				{ id: 2, nome: "B", periodo: "1° período", carga_horaria: 60 },
			]);

			useFiltroStore.getState().setFiltro("periodo", "2° período");

			expect(useFiltroStore.getState().disciplinasFiltradas.map((d) => d.id)).toEqual([1]);
		});
	});

	describe("filtro por professor", () => {
		it("todos mantém todas (respeitando exclusão de Não ofertadas em periodo todos)", () => {
			seedDisciplinas([
				{ id: 1, nome: "A", periodo: "1° período", carga_horaria: 60, professor: "X" },
				{ id: 2, nome: "B", periodo: "1° período", carga_horaria: 60, professor: "Y" },
			]);
			useFiltroStore.getState().filtrarDisciplinas();
			expect(useFiltroStore.getState().disciplinasFiltradas).toHaveLength(2);
		});

		it("filtra por professor exato", () => {
			seedDisciplinas([
				{ id: 1, nome: "A", periodo: "1° período", carga_horaria: 60, professor: "Ana" },
				{ id: 2, nome: "B", periodo: "1° período", carga_horaria: 60, professor: "Beto" },
			]);

			useFiltroStore.getState().setFiltro("professor", "Ana");

			expect(useFiltroStore.getState().disciplinasFiltradas.map((d) => d.id)).toEqual([1]);
		});
	});

	describe("filtro já fez (jaFez)", () => {
		beforeEach(() => {
			seedDisciplinas(
				[
					{ id: 1, nome: "Feita", periodo: "1° período", carga_horaria: 60 },
					{ id: 2, nome: "Pendente", periodo: "1° período", carga_horaria: 60 },
				],
				new Set([1]),
			);
		});

		it("sim retorna só disciplinas marcadas como feitas", () => {
			useFiltroStore.getState().setFiltro("jaFez", "sim");
			expect(useFiltroStore.getState().disciplinasFiltradas.map((d) => d.id)).toEqual([1]);
		});

		it("nao retorna só as não feitas", () => {
			useFiltroStore.getState().setFiltro("jaFez", "nao");
			expect(useFiltroStore.getState().disciplinasFiltradas.map((d) => d.id)).toEqual([2]);
		});

		it("todos retorna ambas", () => {
			useFiltroStore.getState().setFiltro("jaFez", "todos");
			expect(
				useFiltroStore
					.getState()
					.disciplinasFiltradas.map((d) => d.id)
					.sort((a, b) => a - b),
			).toEqual([1, 2]);
		});
	});

	describe("filtro por turno", () => {
		it("todos não remove por turno", () => {
			seedDisciplinas([
				{
					id: 1,
					nome: "A",
					periodo: "1° período",
					carga_horaria: 60,
					horarios: [{ dia: "Segunda", inicio: "20:00", fim: "22:00" }],
				},
			]);
			useFiltroStore.getState().filtrarDisciplinas();
			expect(useFiltroStore.getState().disciplinasFiltradas).toHaveLength(1);
		});

		it("sem horários não passa em turno específico", () => {
			seedDisciplinas([{ id: 1, nome: "A", periodo: "1° período", carga_horaria: 60 }]);
			useFiltroStore.getState().setFiltro("turno", "manha");
			expect(useFiltroStore.getState().disciplinasFiltradas).toEqual([]);
		});

		it("manhã exige todos os horários com início antes de 12h", () => {
			seedDisciplinas([
				{
					id: 1,
					nome: "Só manhã",
					periodo: "1° período",
					carga_horaria: 60,
					horarios: [
						{ dia: "Segunda", inicio: "08:00", fim: "10:00" },
						{ dia: "Quarta", inicio: "10:00", fim: "11:00" },
					],
				},
				{
					id: 2,
					nome: "Misto",
					periodo: "1° período",
					carga_horaria: 60,
					horarios: [
						{ dia: "Segunda", inicio: "08:00", fim: "10:00" },
						{ dia: "Terça", inicio: "14:00", fim: "16:00" },
					],
				},
			]);

			useFiltroStore.getState().setFiltro("turno", "manha");

			expect(useFiltroStore.getState().disciplinasFiltradas.map((d) => d.id)).toEqual([1]);
		});

		it("tarde: 12 <= início < 18 para todos os horários", () => {
			seedDisciplinas([
				{
					id: 1,
					nome: "Tarde ok",
					periodo: "1° período",
					carga_horaria: 60,
					horarios: [{ dia: "Terça", inicio: "14:00", fim: "16:00" }],
				},
				{
					id: 2,
					nome: "Noite",
					periodo: "1° período",
					carga_horaria: 60,
					horarios: [{ dia: "Terça", inicio: "19:00", fim: "21:00" }],
				},
			]);

			useFiltroStore.getState().setFiltro("turno", "tarde");

			expect(useFiltroStore.getState().disciplinasFiltradas.map((d) => d.id)).toEqual([1]);
		});

		it("noite: início >= 18", () => {
			seedDisciplinas([
				{
					id: 1,
					nome: "Noite",
					periodo: "1° período",
					carga_horaria: 60,
					horarios: [{ dia: "Quinta", inicio: "18:00", fim: "20:00" }],
				},
				{
					id: 2,
					nome: "Tarde",
					periodo: "1° período",
					carga_horaria: 60,
					horarios: [{ dia: "Quinta", inicio: "16:00", fim: "17:00" }],
				},
			]);

			useFiltroStore.getState().setFiltro("turno", "noite");

			expect(useFiltroStore.getState().disciplinasFiltradas.map((d) => d.id)).toEqual([1]);
		});

		it("meia-noite (0h) conta como manhã", () => {
			seedDisciplinas([
				{
					id: 1,
					nome: "M",
					periodo: "1° período",
					carga_horaria: 60,
					horarios: [{ dia: "Sexta", inicio: "00:30", fim: "02:00" }],
				},
			]);

			useFiltroStore.getState().setFiltro("turno", "manha");

			expect(useFiltroStore.getState().disciplinasFiltradas.map((d) => d.id)).toEqual([1]);
		});
	});

	describe("filtro por dia", () => {
		it("sem horários não passa com dia específico", () => {
			seedDisciplinas([{ id: 1, nome: "A", periodo: "1° período", carga_horaria: 60 }]);
			useFiltroStore.getState().setFiltro("dia", "Segunda");
			expect(useFiltroStore.getState().disciplinasFiltradas).toEqual([]);
		});

		it("exige que todos os horários sejam no dia escolhido", () => {
			seedDisciplinas([
				{
					id: 1,
					nome: "Só segunda",
					periodo: "1° período",
					carga_horaria: 60,
					horarios: [
						{ dia: "Segunda", inicio: "08:00", fim: "10:00" },
						{ dia: "Segunda", inicio: "10:00", fim: "12:00" },
					],
				},
				{
					id: 2,
					nome: "Segunda e terça",
					periodo: "1° período",
					carga_horaria: 60,
					horarios: [
						{ dia: "Segunda", inicio: "08:00", fim: "10:00" },
						{ dia: "Terça", inicio: "08:00", fim: "10:00" },
					],
				},
			]);

			useFiltroStore.getState().setFiltro("dia", "Segunda");

			expect(useFiltroStore.getState().disciplinasFiltradas.map((d) => d.id)).toEqual([1]);
		});
	});

	describe("filtro por nome (buscaNome)", () => {
		it("string só com espaços não filtra", () => {
			seedDisciplinas([{ id: 1, nome: "LP2", periodo: "1° período", carga_horaria: 60 }]);
			useFiltroStore.getState().setFiltro("buscaNome", "   ");
			expect(useFiltroStore.getState().disciplinasFiltradas).toHaveLength(1);
		});

		it("normaliza acentos e caixa", () => {
			seedDisciplinas([{ id: 1, nome: "Programação Orientada a Objetos", periodo: "1° período", carga_horaria: 60 }]);
			useFiltroStore.getState().setFiltro("buscaNome", "orientada");
			expect(useFiltroStore.getState().disciplinasFiltradas.map((d) => d.id)).toEqual([1]);
		});

		it("busca normalizada inclui substring do nome normalizado", () => {
			seedDisciplinas([{ id: 1, nome: "Álgebra Linear", periodo: "1° período", carga_horaria: 60 }]);
			useFiltroStore.getState().setFiltro("buscaNome", "algebra");
			expect(useFiltroStore.getState().disciplinasFiltradas.map((d) => d.id)).toEqual([1]);
		});
	});

	describe("combinação de filtros", () => {
		it("aplica professor, jaFez e busca ao mesmo tempo", () => {
			seedDisciplinas(
				[
					{
						id: 1,
						nome: "Estrutura de Dados",
						periodo: "1° período",
						carga_horaria: 60,
						professor: "Paula",
					},
					{
						id: 2,
						nome: "Estruturas Avançadas",
						periodo: "1° período",
						carga_horaria: 60,
						professor: "Paula",
					},
					{
						id: 3,
						nome: "Estrutura de Dados",
						periodo: "1° período",
						carga_horaria: 60,
						professor: "Outro",
					},
				],
				new Set([1, 2, 3]),
			);

			useFiltroStore.getState().setFiltro("professor", "Paula");
			useFiltroStore.getState().setFiltro("jaFez", "sim");
			useFiltroStore.getState().setFiltro("buscaNome", "dados");

			expect(useFiltroStore.getState().disciplinasFiltradas.map((d) => d.id)).toEqual([1]);
		});
	});
});
