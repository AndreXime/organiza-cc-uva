import type { Dispatch, SetStateAction } from 'react';

export type ContextType = {
    Tab: string;
    setTab: Dispatch<SetStateAction<string>>;
    DisciplinasFeitas: Set<number>;
    setDisciplinasFeitas: Dispatch<SetStateAction<Set<number>>>;
    DisciplinasDisponiveis: Disciplina[];
    TodasDisciplinas: Disciplina[];
    DisciplinasPorPeriodo: Record<string, Disciplina[]>;
};
