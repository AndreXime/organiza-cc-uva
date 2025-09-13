'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

export type UIContextType = {
    Tab: string;
    setTab: Dispatch<SetStateAction<string>>;
    selectedDiscs: number[];
    setSelectedDiscs: React.Dispatch<React.SetStateAction<number[]>>;
    hideNonSelected: boolean;
    setHideNonSelected: React.Dispatch<React.SetStateAction<boolean>>;
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    expandedMode: boolean;
    setExpandedMode: React.Dispatch<React.SetStateAction<boolean>>;
    mostrarFeitas: boolean;
    setMostrarFeitas: React.Dispatch<React.SetStateAction<boolean>>;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

// Contexto para persistir o estado da UI ao navegador entre as abas
export function UIProvider({ children }: { children: React.ReactNode }) {
    // HorarioManager
    const [selectedDiscs, setSelectedDiscs] = useState<number[]>([]);
    const [hideNonSelected, setHideNonSelected] = useState(false);
    // Gerenciador
    const [message, setMessage] = useState('');
    const [expandedMode, setExpandedMode] = useState(true);
    const [mostrarFeitas, setMostrarFeitas] = useState(true);
    // Abas
    const [Tab, setTab] = useState('gerenciador');

    // Recupera e atualiza o estado com os discos salvos.
    useEffect(() => {
        try {
            const savedDiscs = localStorage.getItem('selectedDiscs');
            if (savedDiscs) {
                setSelectedDiscs(JSON.parse(savedDiscs));
            }
        } catch (error) {
            console.error("Falha ao carregar 'selectedDiscs' do localStorage.", error);
        }
    }, []);

    // Salva selectedDiscs em qualquer alteração
    useEffect(() => {
        try {
            localStorage.setItem('selectedDiscs', JSON.stringify(selectedDiscs));
        } catch (error) {
            console.error("Falha ao salvar 'selectedDiscs' no localStorage.", error);
        }
    }, [selectedDiscs]);

    return (
        <UIContext.Provider
            value={{
                Tab,
                setTab,
                selectedDiscs,
                setSelectedDiscs,
                hideNonSelected,
                setHideNonSelected,
                message,
                setMessage,
                expandedMode,
                setExpandedMode,
                mostrarFeitas,
                setMostrarFeitas,
            }}
        >
            {children}
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error('Para consumir context é preciso usar contextProvider');
    }
    return context;
}
