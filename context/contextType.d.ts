import type { Dispatch, SetStateAction } from 'react';

export type DataContextType = {
    DisciplinasFeitas: Set<number>;
    setDisciplinasFeitas: Dispatch<SetStateAction<Set<number>>>;
    DisciplinasDisponiveis: Disciplina[];
    DisciplinasTotais: Disciplina[];
    DisciplinasPorPeriodo: Record<string, Disciplina[]>;
};

export type UIContextType = {
    Tab: string;
    setTab: Dispatch<SetStateAction<string>>;
    selectedDiscs: string[];
    setSelectedDiscs: React.Dispatch<React.SetStateAction<string[]>>;
    hideNonSelected: boolean;
    setHideNonSelected: React.Dispatch<React.SetStateAction<boolean>>;
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    expandedMode: boolean;
    setExpandedMode: React.Dispatch<React.SetStateAction<boolean>>;
    mostrarFeitas: boolean;
    setMostrarFeitas: React.Dispatch<React.SetStateAction<boolean>>;
};
