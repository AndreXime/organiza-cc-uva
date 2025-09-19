import { PersistStorage } from 'zustand/middleware';
import { DisciplinaState } from './disciplinaStore';

/**
 * A versão anterior do site armazenava os IDs de forma plana e o zustand espera de outra forma
 * Esse adapter resolve esse problema de compatibilidade
 */
export const legacyStorageAdapter: PersistStorage<Pick<DisciplinaState, 'DisciplinasFeitas'>> = {
    getItem: (name) => {
        const str = localStorage.getItem(name);
        if (!str) {
            return null;
        }

        const legacyArray: number[] = JSON.parse(str);

        // Retorna no formato que o zustand espera
        return {
            state: {
                DisciplinasFeitas: new Set(legacyArray),
            },
            version: 0,
        };
    },
    setItem: (name, newValue) => {
        const set = newValue.state.DisciplinasFeitas;

        const legacyArray = Array.from(set);

        localStorage.setItem(name, JSON.stringify(legacyArray));
    },
    removeItem: (name) => localStorage.removeItem(name),
};
