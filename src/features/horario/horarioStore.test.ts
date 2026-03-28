/// <reference types="jest" />

import { useDisciplinaStore } from "@/store/disciplinaStore";
import { resetDisciplinaStoreForTests } from "@/test/resetDisciplinaStoreForTests";
import { useCalendarStore } from "./horarioStore";

const PERSIST_KEY = "selectedDiscs";

function resetCalendarStore(): void {
	useCalendarStore.setState({
		selectedDiscs: [],
		hideNonSelected: false,
		allEvents: [],
		visibleEvents: [],
		totalCargaHoraria: 0,
	});
}

function seedDisciplinas(disciplinas: Disciplina[]): void {
	useDisciplinaStore.setState({ DisciplinasTotais: disciplinas });
}

describe("useCalendarStore", () => {
	beforeEach(() => {
		resetDisciplinaStoreForTests();
		resetCalendarStore();
	});

	describe("buildEvents", () => {
		it("sem disciplinas disponíveis gera allEvents vazio e visibleEvents vazio", () => {
			seedDisciplinas([{ id: 1, nome: "A", periodo: "1° período", carga_horaria: 60 }]);

			useCalendarStore.getState().buildEvents(new Set());

			const s = useCalendarStore.getState();
			expect(s.allEvents).toEqual([]);
			expect(s.visibleEvents).toEqual([]);
			expect(s.totalCargaHoraria).toBe(0);
		});

		it("disciplina sem horários não gera eventos", () => {
			seedDisciplinas([{ id: 1, nome: "A", periodo: "1° período", carga_horaria: 60 }]);

			useCalendarStore.getState().buildEvents(new Set([1]));

			expect(useCalendarStore.getState().allEvents).toEqual([]);
		});

		it("cria um evento por horário com título e subtítulo", () => {
			seedDisciplinas([
				{
					id: 1,
					nome: "LP2",
					periodo: "2° período",
					carga_horaria: 60,
					professor: "Maria",
					horarios: [{ dia: "Segunda", inicio: "08:00", fim: "10:00" }],
				},
			]);

			useCalendarStore.getState().buildEvents(new Set([1]));

			const evs = useCalendarStore.getState().allEvents;
			expect(evs).toHaveLength(1);
			expect(evs[0]?.id).toBe(1);
			expect(evs[0]?.title).toBe("LP2");
			expect(evs[0]?.subtitle).toEqual(["2° período", "Maria"]);
			expect(evs[0]?.start.getHours()).toBe(8);
			expect(evs[0]?.start.getMinutes()).toBe(0);
			expect(evs[0]?.end.getHours()).toBe(10);
			expect(evs[0]?.end.getMinutes()).toBe(0);
		});

		it("vários horários na mesma disciplina viram vários eventos", () => {
			seedDisciplinas([
				{
					id: 1,
					nome: "X",
					periodo: "1° período",
					carga_horaria: 90,
					horarios: [
						{ dia: "Segunda", inicio: "08:00", fim: "10:00" },
						{ dia: "Terça", inicio: "14:00", fim: "17:00" },
					],
				},
			]);

			useCalendarStore.getState().buildEvents(new Set([1]));

			expect(useCalendarStore.getState().allEvents).toHaveLength(2);
		});

		it("professor indefinido vira string vazia no subtítulo", () => {
			seedDisciplinas([
				{
					id: 1,
					nome: "Y",
					periodo: "1° período",
					carga_horaria: 60,
					horarios: [{ dia: "Quarta", inicio: "09:30", fim: "11:00" }],
				},
			]);

			useCalendarStore.getState().buildEvents(new Set([1]));

			expect(useCalendarStore.getState().allEvents[0]?.subtitle[1]).toBe("");
		});
	});

	describe("calculateVisibleEvents", () => {
		it("com nada selecionado mostra todos os eventos sem conflito entre si", () => {
			seedDisciplinas([
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
					horarios: [{ dia: "Terça", inicio: "08:00", fim: "10:00" }],
				},
			]);

			useCalendarStore.getState().buildEvents(new Set([1, 2]));

			const s = useCalendarStore.getState();
			expect(s.visibleEvents).toHaveLength(2);
			expect(s.totalCargaHoraria).toBe(0);
		});

		it("horários adjacentes no mesmo dia não conflitam", () => {
			seedDisciplinas([
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
			]);

			useCalendarStore.getState().buildEvents(new Set([1, 2]));
			useCalendarStore.getState().toggleSelectedDisc(1);

			expect(
				useCalendarStore
					.getState()
					.visibleEvents.map((e) => e.id)
					.sort((a, b) => a - b),
			).toEqual([1, 2]);
		});

		it("mesmo horário em disciplinas diferentes: ao selecionar uma, esconde a outra", () => {
			seedDisciplinas([
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
					carga_horaria: 30,
					horarios: [{ dia: "Segunda", inicio: "08:00", fim: "10:00" }],
				},
			]);

			useCalendarStore.getState().buildEvents(new Set([1, 2]));
			useCalendarStore.getState().toggleSelectedDisc(1);

			const vis = useCalendarStore.getState().visibleEvents;
			expect(vis).toHaveLength(1);
			expect(vis[0]?.id).toBe(1);
			expect(useCalendarStore.getState().totalCargaHoraria).toBe(60);
		});

		it("soma carga horária uma vez por disciplina selecionada (vários horários)", () => {
			seedDisciplinas([
				{
					id: 1,
					nome: "X",
					periodo: "1° período",
					carga_horaria: 90,
					horarios: [
						{ dia: "Segunda", inicio: "08:00", fim: "10:00" },
						{ dia: "Terça", inicio: "08:00", fim: "10:00" },
					],
				},
			]);

			useCalendarStore.getState().buildEvents(new Set([1]));
			useCalendarStore.getState().toggleSelectedDisc(1);

			expect(useCalendarStore.getState().totalCargaHoraria).toBe(90);
		});
	});

	describe("toggleSelectedDisc", () => {
		beforeEach(() => {
			seedDisciplinas([
				{
					id: 1,
					nome: "A",
					periodo: "1° período",
					carga_horaria: 60,
					horarios: [{ dia: "Segunda", inicio: "08:00", fim: "10:00" }],
				},
			]);
			useCalendarStore.getState().buildEvents(new Set([1]));
		});

		it("adiciona e remove id", () => {
			useCalendarStore.getState().toggleSelectedDisc(1);
			expect(useCalendarStore.getState().selectedDiscs).toEqual([1]);

			useCalendarStore.getState().toggleSelectedDisc(1);
			expect(useCalendarStore.getState().selectedDiscs).toEqual([]);
		});

		it("acumula várias disciplinas", () => {
			seedDisciplinas([
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
					carga_horaria: 30,
					horarios: [{ dia: "Terça", inicio: "08:00", fim: "10:00" }],
				},
			]);
			useCalendarStore.getState().buildEvents(new Set([1, 2]));

			useCalendarStore.getState().toggleSelectedDisc(1);
			useCalendarStore.getState().toggleSelectedDisc(2);

			expect(useCalendarStore.getState().selectedDiscs).toEqual([1, 2]);
			expect(useCalendarStore.getState().totalCargaHoraria).toBe(90);
		});
	});

	describe("setHideNonSelected", () => {
		beforeEach(() => {
			seedDisciplinas([
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
					carga_horaria: 30,
					horarios: [{ dia: "Terça", inicio: "08:00", fim: "10:00" }],
				},
			]);
			useCalendarStore.getState().buildEvents(new Set([1, 2]));
		});

		it("true mostra apenas eventos das disciplinas selecionadas", () => {
			useCalendarStore.getState().toggleSelectedDisc(1);
			useCalendarStore.getState().setHideNonSelected(true);

			const vis = useCalendarStore.getState().visibleEvents;
			expect(vis).toHaveLength(1);
			expect(vis[0]?.id).toBe(1);
		});

		it("false volta a aplicar lógica de conflito", () => {
			useCalendarStore.getState().toggleSelectedDisc(1);
			useCalendarStore.getState().setHideNonSelected(true);
			useCalendarStore.getState().setHideNonSelected(false);

			expect(useCalendarStore.getState().visibleEvents).toHaveLength(2);
		});

		it("true com nenhuma seleção deixa visibleEvents vazio", () => {
			useCalendarStore.getState().setHideNonSelected(true);

			expect(useCalendarStore.getState().visibleEvents).toEqual([]);
		});
	});

	describe("persistência (selectedDiscs)", () => {
		it("grava selectedDiscs no localStorage ao alternar seleção", () => {
			seedDisciplinas([
				{
					id: 1,
					nome: "A",
					periodo: "1° período",
					carga_horaria: 60,
					horarios: [{ dia: "Segunda", inicio: "08:00", fim: "10:00" }],
				},
			]);
			useCalendarStore.getState().buildEvents(new Set([1]));

			useCalendarStore.getState().toggleSelectedDisc(1);

			const raw = localStorage.getItem(PERSIST_KEY);
			expect(raw).toBeTruthy();
			const parsed = JSON.parse(raw as string) as { state: { selectedDiscs: number[] } };
			expect(parsed.state.selectedDiscs).toEqual([1]);
		});
	});
});
