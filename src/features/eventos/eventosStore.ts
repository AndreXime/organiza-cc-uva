import { create } from "zustand";
import type { EventosAcademicosServer } from "@/data";

export type TimeFilter = 7 | 30 | 90 | null; // 1 semana, 1 mês, 3 meses

interface StoreState {
	events: AcademicEvent[];
	loading: boolean;
	metadata: EventosAcademicosServer["metadata"];
	searchTerm: string;
	selectedFilters: string[];
	timeFilter: TimeFilter;

	init: (data: EventosAcademicosServer) => void;
	setSearchTerm: (term: string) => void;
	toggleFilter: (keyword: string) => void;
	setTimeFilter: (days: TimeFilter) => void;
	resetFilters: () => void;

	getFilteredEvents: () => AcademicEvent[];
}

const normalizeText = (text: string) => {
	return text
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase();
};

export const useAcademicCalendarStore = create<StoreState>((set, get) => ({
	events: [],
	metadata: { lastUpdated: new Date(), semesterDates: {} },
	loading: true,
	searchTerm: "",
	selectedFilters: [],
	timeFilter: null,

	init: (data) => {
		set({
			events: data.data,
			metadata: data.metadata,
			loading: false,
		});
	},

	setSearchTerm: (term) => set({ searchTerm: term }),

	toggleFilter: (keyword) => {
		set((state) => {
			const prev = state.selectedFilters;
			const newFilters = prev.includes(keyword) ? prev.filter((k) => k !== keyword) : [...prev, keyword];
			return { selectedFilters: newFilters };
		});
	},

	setTimeFilter: (days) =>
		set((state) => ({
			timeFilter: state.timeFilter === days ? null : days,
		})),

	resetFilters: () => set({ searchTerm: "", selectedFilters: [], timeFilter: null }),

	getFilteredEvents: () => {
		const { events, searchTerm, selectedFilters, timeFilter } = get();

		if (!searchTerm && selectedFilters.length === 0 && !timeFilter) {
			return events;
		}

		const searchNormalized = normalizeText(searchTerm);
		const now = new Date();
		now.setHours(0, 0, 0, 0); // Zerar as horas para comparar apenas o dia

		return events.filter((data) => {
			const eventText = normalizeText(data.event);

			// Verifica input de texto
			const matchesSearch = eventText.includes(searchNormalized);

			// Verifica filtros (tags)
			const matchesFilters =
				selectedFilters.length === 0 || selectedFilters.some((filter) => eventText.includes(normalizeText(filter)));

			let matchesTime = true;
			if (timeFilter) {
				const eventStart = new Date(data.date);
				eventStart.setHours(0, 0, 0, 0);
				const eventEnd = data.untilDate ? new Date(data.untilDate) : new Date(data.date);
				eventEnd.setHours(0, 0, 0, 0);
				const limitDate = new Date();
				limitDate.setDate(now.getDate() + timeFilter);

				// O evento é visível se ele começa ANTES (ou no dia) que o filtro termina
				// E termina DEPOIS (ou no dia) que o filtro começa.
				matchesTime = eventStart <= limitDate && eventEnd >= now;
			}

			return matchesSearch && matchesFilters && matchesTime;
		});
	},
}));
