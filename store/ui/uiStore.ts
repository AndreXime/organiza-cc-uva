import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { uiStorageAdapter } from './storageAdapter';

export interface UIState {
    Tab: string;
    selectedDiscs: number[];
    hideNonSelected: boolean;
    message: string;
    expandedMode: boolean;
    mostrarFeitas: boolean;
    setTab: (tab: string) => void;
    setHideNonSelected: (hide: boolean) => void;
    setMessage: (message: string) => void;
    setExpandedMode: (expanded: boolean) => void;
    setMostrarFeitas: (mostrar: boolean) => void;

    toggleSelectedDisc: (discId: number) => void;
}

let messageTimer: NodeJS.Timeout;

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            // Estado Inicial
            Tab: 'gerenciador',
            selectedDiscs: [],
            hideNonSelected: false,
            message: '',
            expandedMode: true,
            mostrarFeitas: true,

            // Açõesx
            setTab: (tab) => set({ Tab: tab }),
            setHideNonSelected: (hide) => set({ hideNonSelected: hide }),
            setExpandedMode: (expanded) => set({ expandedMode: expanded }),
            setMostrarFeitas: (mostrar) => set({ mostrarFeitas: mostrar }),
            setMessage: (message) => {
                // Limpa qualquer timer
                clearTimeout(messageTimer);

                set({ message });

                // Se mensagem não estiver vazia, cria um novo timer
                if (message) {
                    messageTimer = setTimeout(() => {
                        set({ message: '' });
                    }, 5000);
                }
            },
            toggleSelectedDisc: (discId) =>
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
                }),
        }),
        {
            name: 'selectedDiscs',
            storage: uiStorageAdapter,
            partialize: (state) => ({ selectedDiscs: state.selectedDiscs }),
        }
    )
);
