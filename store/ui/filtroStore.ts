import { create } from 'zustand';
import { useDisciplinaStore } from '../disciplinas/disciplinaStore';

export type FiltrosState = {
    professor: string;
    periodo: string;
    buscaNome: string;
    jaFez: 'todos' | 'sim' | 'nao';
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
    setBuscaNome: (busca: string) => void; // NOVA ACTION
};

const initialState: FiltrosState = {
    professor: 'todos',
    jaFez: 'todos',
    periodo: 'todos',
    turno: 'todos',
    buscaNome: '',
    dia: 'todos',
};

export const useFiltroStore = create<FiltrosState & FiltroActions>((set) => ({
    ...initialState,
    setProfessor: (professor) => set({ professor }),
    setBuscaNome: (busca) => set({ buscaNome: busca }),
    setJaFez: (status) => set({ jaFez: status }),
    setPeriodo: (periodo) => set({ periodo }),
    setTurno: (turno) => set({ turno }),
    setDia: (dia) => set({ dia }),
    resetFiltros: () => set(initialState),
}));

export function FiltrarDisciplina(Disciplinas: Disciplina[]) {
    const { professor, jaFez, periodo, turno, dia, buscaNome } = useFiltroStore.getState();

    const { DisciplinasFeitas } = useDisciplinaStore.getState();

    return Disciplinas.filter(
        (d) =>
            filtroPorProfessor(d, professor) &&
            filtroPorStatus(d, jaFez, DisciplinasFeitas) &&
            filtroPorPeriodo(d, periodo) &&
            filtroPorTurno(d, turno) &&
            filtroPorDia(d, dia) &&
            filtroPorNome(d, buscaNome)
    );
}

function filtroPorProfessor(disciplina: Disciplina, professor: string): boolean {
    if (professor === 'todos') return true;
    return disciplina.professor === professor;
}

function filtroPorStatus(disciplina: Disciplina, jaFez: string, disciplinasFeitas: Set<number>): boolean {
    const jaFoiFeita = disciplinasFeitas.has(disciplina.id);
    if (jaFez === 'sim') return jaFoiFeita;
    if (jaFez === 'nao') return !jaFoiFeita;
    return true; // para jaFez === 'todos'
}

const filtroPorPeriodo = (disciplina: Disciplina, periodo: string): boolean => {
    if (periodo === 'todos') {
        return true;
    }

    if (periodo === 'todos_sem_optativas') {
        return disciplina.periodo.toLowerCase() !== 'optativa';
    }

    return disciplina.periodo === periodo;
};

function filtroPorTurno(disciplina: Disciplina, turno: string): boolean {
    if (turno === 'todos') return true;

    if (!disciplina.horarios || disciplina.horarios.length === 0) return false;

    // verificar se TODOS os horários correspondem ao turno.
    return disciplina.horarios.every((horario) => {
        const horaInicio = parseInt(horario.inicio.split(':')[0]);
        if (turno === 'manha') return horaInicio < 12;
        if (turno === 'tarde') return horaInicio >= 12 && horaInicio < 18;
        if (turno === 'noite') return horaInicio >= 18;
        return false;
    });
}

function filtroPorDia(disciplina: Disciplina, dia: string): boolean {
    if (dia === 'todos') return true;

    if (!disciplina.horarios || disciplina.horarios.length === 0) return false;

    // verificar se TODOS os horários ocorrem no dia selecionado.
    return disciplina.horarios.every((horario) => horario.dia === dia);
}

function filtroPorNome(disciplina: Disciplina, busca: string): boolean {
    if (!busca.trim()) {
        return true;
    }

    const nomeNormalizado = normalizarTexto(disciplina.nome);
    const buscaNormalizada = normalizarTexto(busca);

    return nomeNormalizado.includes(buscaNormalizada);
}
const normalizarTexto = (texto: string): string => {
    return texto
        .toLowerCase()
        .normalize('NFD') // Decompõe os caracteres (ex: 'á' -> 'a' + '´')
        .replace(/[\u0300-\u036f]/g, ''); // Remove os diacríticos (acentos)
};
