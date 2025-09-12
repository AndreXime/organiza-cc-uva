import type { Dispatch, SetStateAction } from 'react';

export interface DataContextProps {
    children: React.ReactNode;
    disciplinasServer: Disciplina[];
}

export type DataContextType = {
    DisciplinasFeitas: Set<number>;
    setDisciplinasFeitas: Dispatch<SetStateAction<Set<number>>>;
    DisciplinasTotais: Disciplina[];
    DisciplinasDisponiveis: Set<number>;
    DisciplinasPorPeriodo: Record<string, Set<number>>;
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
