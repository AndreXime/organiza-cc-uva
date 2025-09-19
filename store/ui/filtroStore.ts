import { create } from 'zustand';

export type FiltrosState = {
    professor: string;
    jaFez: 'todos' | 'sim' | 'nao';
    periodo: string;
    turno: 'todos' | 'manha' | 'tarde' | 'noite';
    dia: 'todos' | 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta';
};

type FiltroActions = {
    setProfessor: (professor: string) => void;
    setJaFez: (status: FiltrosState['jaFez']) => void;
    setPeriodo: (periodo: string) => void;
    setTurno: (turno: FiltrosState['turno']) => void;
    setDia: (dia: FiltrosState['dia']) => void;
    resetFiltros: () => void;
};

const initialState: FiltrosState = {
    professor: 'todos',
    jaFez: 'todos',
    periodo: 'todos',
    turno: 'todos',
    dia: 'todos',
};

export const useFiltroStore = create<FiltrosState & FiltroActions>((set) => ({
    ...initialState,
    setProfessor: (professor) => set({ professor }),
    setJaFez: (status) => set({ jaFez: status }),
    setPeriodo: (periodo) => set({ periodo }),
    setTurno: (turno) => set({ turno }),
    setDia: (dia) => set({ dia }),
    resetFiltros: () => set(initialState),
}));
