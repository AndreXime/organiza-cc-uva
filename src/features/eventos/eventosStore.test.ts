/// <reference types="jest" />

import type { EventosAcademicosServer } from "@/data";
import { useAcademicCalendarStore } from "./eventosStore";

function resetStore(): void {
	localStorage.clear();
	useAcademicCalendarStore.setState({
		events: [],
		metadata: { lastUpdated: new Date(0), semesterDates: {} },
		loading: true,
		searchTerm: "",
		selectedFilters: [],
		timeFilter: null,
	});
}

function serverPayload(events: AcademicEvent[]): EventosAcademicosServer {
	return {
		metadata: { lastUpdated: new Date("2026-03-01T12:00:00.000Z"), semesterDates: {} },
		data: events,
	};
}

/** Meia-noite local no dia de `base` (mesmo critério do store). */
function startOfLocalDay(base: Date): Date {
	const d = new Date(base);
	d.setHours(0, 0, 0, 0);
	return d;
}

describe("eventosStore (useAcademicCalendarStore)", () => {
	beforeEach(() => {
		resetStore();
	});

	describe("init()", () => {
		it("define eventos, metadata e loading false", () => {
			const events: AcademicEvent[] = [
				{ date: new Date("2026-04-01"), event: "Prova 1" },
				{ date: new Date("2026-04-02"), event: "Recesso" },
			];
			const payload = serverPayload(events);

			useAcademicCalendarStore.getState().init(payload);

			const s = useAcademicCalendarStore.getState();
			expect(s.events).toEqual(events);
			expect(s.metadata).toEqual(payload.metadata);
			expect(s.loading).toBe(false);
		});
	});

	describe("setSearchTerm", () => {
		it("atualiza o termo", () => {
			useAcademicCalendarStore.getState().setSearchTerm("  feriado ");
			expect(useAcademicCalendarStore.getState().searchTerm).toBe("  feriado ");
		});
	});

	describe("toggleFilter", () => {
		it("adiciona e remove palavra-chave", () => {
			useAcademicCalendarStore.getState().toggleFilter("prova");
			expect(useAcademicCalendarStore.getState().selectedFilters).toEqual(["prova"]);

			useAcademicCalendarStore.getState().toggleFilter("prova");
			expect(useAcademicCalendarStore.getState().selectedFilters).toEqual([]);
		});

		it("acumula vários filtros", () => {
			useAcademicCalendarStore.getState().toggleFilter("a");
			useAcademicCalendarStore.getState().toggleFilter("b");
			expect(useAcademicCalendarStore.getState().selectedFilters).toEqual(["a", "b"]);
		});
	});

	describe("setTimeFilter", () => {
		it("define dias e alterna para null ao repetir o mesmo valor", () => {
			useAcademicCalendarStore.getState().setTimeFilter(7);
			expect(useAcademicCalendarStore.getState().timeFilter).toBe(7);

			useAcademicCalendarStore.getState().setTimeFilter(7);
			expect(useAcademicCalendarStore.getState().timeFilter).toBe(null);

			useAcademicCalendarStore.getState().setTimeFilter(30);
			expect(useAcademicCalendarStore.getState().timeFilter).toBe(30);

			useAcademicCalendarStore.getState().setTimeFilter(90);
			expect(useAcademicCalendarStore.getState().timeFilter).toBe(90);
		});
	});

	describe("resetFilters", () => {
		it("limpa busca, filtros e período", () => {
			useAcademicCalendarStore.setState({
				searchTerm: "x",
				selectedFilters: ["a"],
				timeFilter: 7,
			});

			useAcademicCalendarStore.getState().resetFilters();

			const s = useAcademicCalendarStore.getState();
			expect(s.searchTerm).toBe("");
			expect(s.selectedFilters).toEqual([]);
			expect(s.timeFilter).toBe(null);
		});
	});

	describe("getFilteredEvents", () => {
		it("sem filtros retorna todos os eventos", () => {
			const events: AcademicEvent[] = [
				{ date: new Date("2026-05-01"), event: "A" },
				{ date: new Date("2026-05-02"), event: "B" },
			];
			useAcademicCalendarStore.setState({ events });

			expect(useAcademicCalendarStore.getState().getFilteredEvents()).toEqual(events);
		});

		it("filtra por texto ignorando acento e caixa", () => {
			const events: AcademicEvent[] = [{ date: new Date("2026-05-01"), event: "Recesso de São João" }];
			useAcademicCalendarStore.setState({ events, searchTerm: "sao joao" });

			const out = useAcademicCalendarStore.getState().getFilteredEvents();
			expect(out).toHaveLength(1);
			expect(out[0]?.event).toBe("Recesso de São João");
		});

		it("busca vazia não remove eventos", () => {
			const events: AcademicEvent[] = [{ date: new Date("2026-05-01"), event: "X" }];
			useAcademicCalendarStore.setState({ events, searchTerm: "" });

			expect(useAcademicCalendarStore.getState().getFilteredEvents()).toHaveLength(1);
		});

		it("sem match na busca retorna lista vazia", () => {
			const events: AcademicEvent[] = [{ date: new Date("2026-05-01"), event: "Prova" }];
			useAcademicCalendarStore.setState({ events, searchTerm: "inexistente" });

			expect(useAcademicCalendarStore.getState().getFilteredEvents()).toEqual([]);
		});

		it("com filtros de tag: basta uma palavra bater (OR)", () => {
			const events: AcademicEvent[] = [
				{ date: new Date("2026-05-01"), event: "Prova de Cálculo" },
				{ date: new Date("2026-05-02"), event: "Entrega de trabalho" },
			];
			useAcademicCalendarStore.setState({
				events,
				selectedFilters: ["prova", "inexistente"],
			});

			const out = useAcademicCalendarStore.getState().getFilteredEvents();
			expect(out.map((e) => e.event)).toEqual(["Prova de Cálculo"]);
		});

		it("tags normalizam acento como na busca", () => {
			const events: AcademicEvent[] = [{ date: new Date("2026-05-01"), event: "Período de provas" }];
			useAcademicCalendarStore.setState({ events, selectedFilters: ["periodo"] });

			expect(useAcademicCalendarStore.getState().getFilteredEvents()).toHaveLength(1);
		});

		it("busca e tags são aplicadas em conjunto (AND)", () => {
			const events: AcademicEvent[] = [
				{ date: new Date("2026-05-01"), event: "Prova de LP2" },
				{ date: new Date("2026-05-02"), event: "Prova de Cálculo" },
			];
			useAcademicCalendarStore.setState({
				events,
				searchTerm: "lp2",
				selectedFilters: ["prova"],
			});

			const out = useAcademicCalendarStore.getState().getFilteredEvents();
			expect(out).toHaveLength(1);
			expect(out[0]?.event).toBe("Prova de LP2");
		});

		it("filtro temporal 7 dias: inclui hoje e exclui evento só no passado distante", () => {
			const today = startOfLocalDay(new Date());
			const tenDaysAgo = new Date(today);
			tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

			const events: AcademicEvent[] = [
				{ date: new Date(today), event: "Hoje" },
				{ date: new Date(tenDaysAgo), event: "Passado" },
			];
			useAcademicCalendarStore.setState({ events, timeFilter: 7 });

			const out = useAcademicCalendarStore.getState().getFilteredEvents();
			expect(out.map((e) => e.event)).toEqual(["Hoje"]);
		});

		it("filtro temporal: evento com untilDate no futuro permanece visível", () => {
			const today = startOfLocalDay(new Date());
			const start = new Date(today);
			start.setDate(start.getDate() - 5);
			const until = new Date(today);
			until.setDate(until.getDate() + 2);

			const events: AcademicEvent[] = [{ date: new Date(start), untilDate: new Date(until), event: "Intervalo longo" }];
			useAcademicCalendarStore.setState({ events, timeFilter: 7 });

			expect(useAcademicCalendarStore.getState().getFilteredEvents()).toHaveLength(1);
		});

		it("filtro temporal: evento só além da janela é excluído", () => {
			const today = startOfLocalDay(new Date());
			const far = new Date(today);
			far.setDate(far.getDate() + 30);

			const events: AcademicEvent[] = [{ date: new Date(far), event: "Muito à frente" }];
			useAcademicCalendarStore.setState({ events, timeFilter: 7 });

			expect(useAcademicCalendarStore.getState().getFilteredEvents()).toEqual([]);
		});

		it("combina tempo com busca e tags", () => {
			const today = startOfLocalDay(new Date());
			const events: AcademicEvent[] = [
				{ date: new Date(today), event: "Prova final LP2" },
				{ date: new Date(today), event: "Outro evento" },
			];
			useAcademicCalendarStore.setState({
				events,
				timeFilter: 7,
				searchTerm: "lp2",
				selectedFilters: ["prova"],
			});

			const out = useAcademicCalendarStore.getState().getFilteredEvents();
			expect(out).toHaveLength(1);
			expect(out[0]?.event).toBe("Prova final LP2");
		});
	});
});
