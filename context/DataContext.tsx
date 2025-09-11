'use client';
import { DataContextType } from '@/context/contextType';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({
    children,
    disciplinasServer,
}: {
    children: React.ReactNode;
    disciplinasServer: Disciplina[];
}) {
    const [DisciplinasFeitas, setDisciplinasFeitas] = useState<Set<number>>(new Set());

    // Procura por disciplinas salvas no localStorage
    useEffect(() => {
        const salvas = localStorage.getItem('disciplinas');
        if (salvas) {
            try {
                const ids: number[] = JSON.parse(salvas);
                setDisciplinasFeitas(new Set(ids));
            } catch (e) {
                console.error('Erro ao carregar disciplinas feitas:', e);
            }
        }
    }, []);

    // Salva alteração do usuario com qualquer alteração
    useEffect(() => {
        localStorage.setItem('disciplinas', JSON.stringify([...DisciplinasFeitas]));
    }, [DisciplinasFeitas]);

    // Todos os dados que os componentes irão precisar
    const { DisciplinasTotais, DisciplinasPorPeriodo, DisciplinasDisponiveis } = useMemo(() => {
        const DisciplinasTotais = disciplinasServer;

        const DisciplinasPorPeriodo = DisciplinasTotais.reduce<Record<string, Disciplina[]>>((acc, disc) => {
            if (!acc[disc.periodo]) acc[disc.periodo] = [];
            acc[disc.periodo].push(disc);
            return acc;
        }, {});

        // Calcular as disciplinas que estão disponíveis pra fazer
        // Uma disciplina está disponível se:
        // - Não está marcada como feita
        // - Todos os seus requisitos (se tiver) estão dentro do conjunto feitas
        const DisciplinasDisponiveis = DisciplinasTotais.filter((d) => {
            if (DisciplinasFeitas.has(d.id)) return false;
            if (!d.requisitos?.length) return true;
            return d.requisitos.every((req) => DisciplinasFeitas.has(req.id));
        });

        return { DisciplinasTotais, DisciplinasPorPeriodo, DisciplinasDisponiveis };
    }, [DisciplinasFeitas]);

    return (
        <DataContext.Provider
            value={{
                DisciplinasFeitas,
                setDisciplinasFeitas,
                DisciplinasDisponiveis,
                DisciplinasTotais,
                DisciplinasPorPeriodo,
            }}
        >
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('Para consumir context é preciso usar contextProvider');
    }
    return context;
}
