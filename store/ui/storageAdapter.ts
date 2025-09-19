import { PersistStorage } from 'zustand/middleware';
import { UIState } from './uiStore';

type PersistedState = Pick<UIState, 'selectedDiscs'>;

/**
 * A versão anterior do site armazenava as disciplinas selecionadas de forma plana e o zustand espera de outra forma
 * Esse adapter resolve esse problema de compatibilidade
 */
export const uiStorageAdapter: PersistStorage<PersistedState> = {
    getItem: (name) => {
        const str = localStorage.getItem(name);
        if (!str) {
            return null;
        }

        const storedValue = JSON.parse(str);

        // Verifica se o valor armazenado é o formato legado (um array simples)
        if (Array.isArray(storedValue)) {
            // Se for, o envolvemos na estrutura que o Zustand espera
            return {
                state: {
                    selectedDiscs: storedValue,
                },
                version: 0,
            };
        }

        // Se não for um array já está no novo formato do Zustand
        return storedValue;
    },
    setItem: (name, newValue) => {
        localStorage.setItem(name, JSON.stringify(newValue));
    },
    removeItem: (name) => localStorage.removeItem(name),
};
