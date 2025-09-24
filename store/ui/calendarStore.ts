import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useDisciplinaStore } from '../disciplinas/disciplinaStore';
import { getDateForWeekday, setHoursAndMinutes } from '@/lib/helpers/CalendarHelper';

export interface CalendarState {
    selectedDiscs: number[];
    hideNonSelected: boolean;
    allEvents: CalendarEvent[];
    visibleEvents: CalendarEvent[];
    totalCargaHoraria: number;
    setHideNonSelected: (hide: boolean) => void;
    toggleSelectedDisc: (discId: number) => void;
    buildEvents: (DisciplinasDisponiveis: Set<number>) => void;
    calculateVisibleEvents: () => void;
}

export const useCalendarStore = create<CalendarState>()(
    persist(
        (set, get) => ({
            // Estado Inicial
            selectedDiscs: [],
            allEvents: [],
            visibleEvents: [],
            totalCargaHoraria: 0,
            hideNonSelected: false,

            // Açõesx
            buildEvents: (DisciplinasDisponiveis: Set<number>) => {
                const getDisciplinasByIds = useDisciplinaStore.getState().getDisciplinasByIds;

                const disciplinas = getDisciplinasByIds(DisciplinasDisponiveis);

                const allEvents = disciplinas.flatMap((disc) =>
                    (disc.horarios || []).map((h) => {
                        const date = getDateForWeekday(h.dia);
                        const [sh, sm] = h.inicio.split(':').map(Number);
                        const [eh, em] = h.fim.split(':').map(Number);
                        return {
                            id: disc.id,
                            title: disc.nome,
                            start: setHoursAndMinutes(date, sh, sm),
                            end: setHoursAndMinutes(date, eh, em),
                            subtitle: [disc.periodo, disc.professor || ''],
                            selected: false,
                        };
                    })
                );

                set({ allEvents });
                get().calculateVisibleEvents();
            },

            calculateVisibleEvents: () => {
                const getDisciplinasByIds = useDisciplinaStore.getState().getDisciplinasByIds;
                const { selectedDiscs, allEvents, hideNonSelected } = get();

                const cargaHoraria = getDisciplinasByIds(new Set(selectedDiscs)).reduce(
                    (sum, disc) => sum + disc.carga_horaria,
                    0
                );

                const selectedEvents = allEvents.filter((ev) => selectedDiscs.includes(ev.id));

                if (hideNonSelected) {
                    return { visibleEvents: selectedEvents, totalCargaHoraria: cargaHoraria };
                }

                const eventosVisiveis = allEvents.filter((ev) => {
                    if (selectedDiscs.includes(ev.id)) {
                        return true; // Se está selecionado sempre manter
                    } else {
                        const hasConflict = selectedEvents.some((sel) => ev.start < sel.end && ev.end > sel.start);
                        return !hasConflict; // Manter apenas se não tiver conflito.
                    }
                });

                set({ visibleEvents: eventosVisiveis, totalCargaHoraria: cargaHoraria });
            },

            setHideNonSelected: (hide) => {
                set({ hideNonSelected: hide });
                get().calculateVisibleEvents();
            },

            toggleSelectedDisc: (discId) => {
                set((state) => {
                    const isSelected = state.selectedDiscs.includes(discId);
                    if (isSelected) {
                        // Se já estiver selecionado, remove
                        return {
                            selectedDiscs: state.selectedDiscs.filter((id) => id !== discId),
                        };
                    } else {
                        // Se não, adiciona
                        return {
                            selectedDiscs: [...state.selectedDiscs, discId],
                        };
                    }
                });
                get().calculateVisibleEvents();
            },
        }),
        {
            name: 'selectedDiscs',
            partialize: (state) => ({ selectedDiscs: state.selectedDiscs }),
        }
    )
);
