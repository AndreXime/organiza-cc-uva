/// <reference types="jest" />

import { useCalendarStore } from "@/features/horario/horarioStore";
import { usePlanejadorStore } from "@/features/planejador/planejadorStore";
import { useDisciplinaStore } from "@/store/disciplinaStore";
import { resetDisciplinaStoreForTests } from "@/test/resetDisciplinaStoreForTests";
import { applySnapshot, captureSnapshot, createDefaultSnapshot, isValidSnapshot } from "./profileSnapshot";

describe("profileSnapshot", () => {
	beforeEach(() => {
		localStorage.clear();
		resetDisciplinaStoreForTests();
		usePlanejadorStore.setState({ planejamento: [], semestreEmEdicao: null });
		useCalendarStore.setState({ selectedDiscs: [], hideNonSelected: false });
	});

	it("createDefaultSnapshot tem shape válido", () => {
		expect(isValidSnapshot(createDefaultSnapshot())).toBe(true);
	});

	it("capture e apply restauram DisciplinasFeitas e planejamento", () => {
		useDisciplinaStore.getState().init({
			Disciplinas: {
				metadata: { lastUpdated: new Date("2026-01-01") },
				data: [{ id: 1, nome: "A", periodo: "1° período", carga_horaria: 60 }],
			},
			DisciplinasEquivalentes: { metadata: { lastUpdated: new Date("2026-01-02") }, data: [] },
		});
		useDisciplinaStore.getState().setDisciplinasFeitas([1]);
		usePlanejadorStore.getState().setPlanejamento([{ ano: 2026, semestre: 1, disciplinas: [1] }]);

		const snap = captureSnapshot();
		useDisciplinaStore.getState().setDisciplinasFeitas([]);
		usePlanejadorStore.getState().setPlanejamento([]);
		applySnapshot(snap);

		expect(Array.from(useDisciplinaStore.getState().DisciplinasFeitas)).toEqual([1]);
		expect(usePlanejadorStore.getState().planejamento).toEqual([{ ano: 2026, semestre: 1, disciplinas: [1] }]);
	});
});
