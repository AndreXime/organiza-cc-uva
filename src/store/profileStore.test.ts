/// <reference types="jest" />

import { usePlanejadorStore } from "@/features/planejador/planejadorStore";
import { useDisciplinaStore } from "@/store/disciplinaStore";
import { resetDisciplinaStoreForTests } from "@/test/resetDisciplinaStoreForTests";
import { useProfileStore } from "./profileStore";

function initMinimalDisc() {
	useDisciplinaStore.getState().init({
		Disciplinas: {
			metadata: { lastUpdated: new Date("2026-01-01") },
			data: [
				{ id: 1, nome: "A", periodo: "1° período", carga_horaria: 60 },
				{ id: 2, nome: "B", periodo: "1° período", carga_horaria: 60 },
			],
		},
		DisciplinasEquivalentes: { metadata: { lastUpdated: new Date("2026-01-02") }, data: [] },
	});
}

describe("useProfileStore", () => {
	beforeEach(() => {
		localStorage.clear();
		resetDisciplinaStoreForTests();
		usePlanejadorStore.setState({ planejamento: [], semestreEmEdicao: null });
		useProfileStore.setState({ profiles: [], activeProfileId: null });
	});

	it("ensureMigrated cria Principal a partir do estado legado", () => {
		initMinimalDisc();
		useDisciplinaStore.getState().setDisciplinasFeitas([1]);
		useProfileStore.getState().ensureMigrated();
		const s = useProfileStore.getState();
		expect(s.profiles).toHaveLength(1);
		expect(s.profiles[0]?.name).toBe("Principal");
		expect(s.activeProfileId).toBe(s.profiles[0]?.id);
		expect(s.profiles[0]?.snapshot.disciplina.feitas).toEqual([1]);
	});

	it("switchProfile salva A e restaura B", () => {
		initMinimalDisc();
		useProfileStore.getState().ensureMigrated();
		useDisciplinaStore.getState().setDisciplinasFeitas([1]);
		useProfileStore.getState().saveActiveSnapshot();
		useProfileStore.getState().createProfile("Segundo");
		expect(Array.from(useDisciplinaStore.getState().DisciplinasFeitas)).toEqual([]);
		useDisciplinaStore.getState().setDisciplinasFeitas([2]);
		const principalId = useProfileStore.getState().profiles.find((p) => p.name === "Principal")!.id;
		useProfileStore.getState().switchProfile(principalId);
		expect(Array.from(useDisciplinaStore.getState().DisciplinasFeitas)).toEqual([1]);
	});

	it("deleteProfile bloqueia o último", () => {
		useProfileStore.getState().ensureMigrated();
		const id = useProfileStore.getState().activeProfileId!;
		const err = useProfileStore.getState().deleteProfile(id);
		expect(err).toBeTruthy();
		expect(useProfileStore.getState().profiles).toHaveLength(1);
	});

	it("renameProfile vazio vira Sem nome", () => {
		useProfileStore.getState().ensureMigrated();
		const id = useProfileStore.getState().activeProfileId!;
		useProfileStore.getState().renameProfile(id, "   ");
		expect(useProfileStore.getState().profiles[0]?.name).toBe("Sem nome");
	});
});
