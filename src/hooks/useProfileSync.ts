import { useCallback } from "react";
import { useAcademicCalendarStore } from "@/features/eventos/eventosStore";
import { useCalendarStore } from "@/features/horario/horarioStore";
import { usePlanejadorStore } from "@/features/planejador/planejadorStore";
import { useDisciplinaStore } from "@/store/disciplinaStore";
import { useUIStore } from "@/store/uiStore";

export interface ProfileSnapshotV1 {
	exportedAt: string; // ISO
	disciplina: { feitas: number[] };
	planejador: { planejamento: Array<{ ano: number; semestre: 1 | 2; disciplinas: number[] }> };
	horario: { selectedDiscs: number[]; hideNonSelected: boolean };
	eventos: { searchTerm: string; selectedFilters: string[]; timeFilter: 7 | 30 | 90 | null };
	ui: { Tab: string; mode: "default" | "minimal"; mostrarFeitas: boolean; theme?: "light" | "dark" };
}

function downloadJson(filename: string, data: unknown) {
	const json = JSON.stringify(data, null, 2);
	const blob = new Blob([json], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	try {
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	} finally {
		URL.revokeObjectURL(url);
	}
}

function isValidSnapshot(input: unknown): input is ProfileSnapshotV1 {
	if (!input || typeof input !== "object") return false;
	const s = input as Partial<ProfileSnapshotV1>;

	if (typeof s.exportedAt !== "string") return false;
	if (!s.disciplina || !Array.isArray(s.disciplina.feitas)) return false;
	if (!s.planejador || !Array.isArray(s.planejador.planejamento)) return false;
	if (!s.horario || !Array.isArray(s.horario.selectedDiscs) || typeof s.horario.hideNonSelected !== "boolean")
		return false;
	if (
		!s.eventos ||
		typeof s.eventos.searchTerm !== "string" ||
		!Array.isArray(s.eventos.selectedFilters) ||
		(s.eventos.timeFilter !== null &&
			s.eventos.timeFilter !== 7 &&
			s.eventos.timeFilter !== 30 &&
			s.eventos.timeFilter !== 90)
	) {
		return false;
	}
	if (
		!s.ui ||
		typeof s.ui.Tab !== "string" ||
		(s.ui.mode !== "default" && s.ui.mode !== "minimal") ||
		typeof s.ui.mostrarFeitas !== "boolean"
	) {
		return false;
	}

	// validação mínima de shape; conteúdo inválido é responsabilidade do usuário
	return true;
}

export default function useProfileSync() {
	const exportProfile = useCallback(() => {
		const { setMessage } = useUIStore.getState();
		const disciplina = useDisciplinaStore.getState();
		const planejador = usePlanejadorStore.getState();
		const horario = useCalendarStore.getState();
		const eventos = useAcademicCalendarStore.getState();
		const ui = useUIStore.getState();

		const theme = document.documentElement.classList.contains("dark") ? "dark" : "light";

		const snapshot: ProfileSnapshotV1 = {
			exportedAt: new Date().toISOString(),
			disciplina: { feitas: Array.from(disciplina.DisciplinasFeitas) },
			planejador: {
				planejamento: planejador.planejamento.map((p) => ({
					ano: p.ano,
					semestre: p.semestre === 2 ? 2 : 1,
					disciplinas: [...p.disciplinas],
				})),
			},
			horario: { selectedDiscs: [...horario.selectedDiscs], hideNonSelected: horario.hideNonSelected },
			eventos: {
				searchTerm: eventos.searchTerm,
				selectedFilters: [...eventos.selectedFilters],
				timeFilter: eventos.timeFilter,
			},
			ui: { Tab: ui.Tab, mode: ui.mode, mostrarFeitas: ui.mostrarFeitas, theme },
		};

		downloadJson("organiza-cc-uva.perfil.json", snapshot);
		setMessage("Perfil exportado com sucesso.");
	}, []);

	const importProfile = useCallback((data: string) => {
		const { setMessage } = useUIStore.getState();

		let parsed: unknown;
		try {
			parsed = JSON.parse(data) as unknown;
		} catch {
			setMessage("Arquivo inválido: não foi possível ler o JSON.");
			return;
		}

		if (!isValidSnapshot(parsed)) {
			setMessage("Arquivo inválido: formato inesperado.");
			return;
		}

		const snapshot = parsed;

		useDisciplinaStore.getState().setDisciplinasFeitas(snapshot.disciplina.feitas);
		usePlanejadorStore.getState().setPlanejamento(snapshot.planejador.planejamento);
		useCalendarStore.getState().setSelectedDiscs(snapshot.horario.selectedDiscs);
		useCalendarStore.getState().setHideNonSelected(snapshot.horario.hideNonSelected);

		useAcademicCalendarStore.getState().setSearchTerm(snapshot.eventos.searchTerm);
		for (const f of useAcademicCalendarStore.getState().selectedFilters) {
			useAcademicCalendarStore.getState().toggleFilter(f);
		}
		for (const f of snapshot.eventos.selectedFilters) {
			useAcademicCalendarStore.getState().toggleFilter(f);
		}
		useAcademicCalendarStore.getState().setTimeFilter(snapshot.eventos.timeFilter);

		useUIStore.getState().setMode(snapshot.ui.mode);
		useUIStore.getState().setTab(snapshot.ui.Tab);
		useUIStore.getState().setMostrarFeitas(snapshot.ui.mostrarFeitas);

		if (snapshot.ui.theme) {
			const html = document.documentElement;
			html.classList.remove(snapshot.ui.theme === "light" ? "dark" : "light");
			html.classList.add(snapshot.ui.theme);
			localStorage.setItem("theme", snapshot.ui.theme);
		}

		setMessage("Perfil importado com sucesso.");
	}, []);

	return { exportProfile, importProfile };
}
