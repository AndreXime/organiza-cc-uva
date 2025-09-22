import { PersistStorage } from 'zustand/middleware';
import { DisciplinaState } from '../disciplinas/disciplinaStore';

/**
 * A versão anterior do site armazenava os IDs de forma plana e o zustand espera de outra forma
 * Esse adapter resolve esse problema de compatibilidade
 */
export const disciplinaStorageAdapter: PersistStorage<Pick<DisciplinaState, 'DisciplinasFeitas'>> = {
    getItem: (name) => {
        const str = localStorage.getItem(name);
        if (!str) {
            return {
                state: {
                    DisciplinasFeitas: new Set(),
                },
                version: 0,
            };
        }

        const storedValue = JSON.parse(str);

        // Verifica se o valor armazenado é o formato legado (um array simples)
        if (Array.isArray(storedValue)) {
            // Se for retorna o que Zustand espera
            return {
                state: {
                    DisciplinasFeitas: new Set(storedValue),
                },
                version: 0,
            };
        }

        // Garante que, mesmo no formato novo, o array seja convertido para um Set.
        // `storedValue.state.DisciplinasFeitas` virá como um array após o JSON.parse. c
        if (storedValue.state?.DisciplinasFeitas) {
            storedValue.state.DisciplinasFeitas = new Set(storedValue.state.DisciplinasFeitas);
        }

        return storedValue;
    },
    setItem: (name, newValue) => {
        // Antes de salvar, convertemos o Set para um Array para que o JSON.stringify funcione corretamente.
        const newState = {
            ...newValue,
            state: {
                ...newValue.state,
                DisciplinasFeitas: Array.from(newValue.state.DisciplinasFeitas || []),
            },
        };

        localStorage.setItem(name, JSON.stringify(newState));
    },
    removeItem: (name) => localStorage.removeItem(name),
};
