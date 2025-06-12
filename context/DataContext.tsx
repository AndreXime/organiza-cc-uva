"use client";
import Disciplinas from "@/disciplinas/disciplinas";
import { DisciplinaComPeriodo } from "@/lib/types";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from "react";

type ContextData = {
  Tab: string;
  setTab: Dispatch<SetStateAction<string>>;
  DisciplinasFeitas: Set<number>;
  setDisciplinasFeitas: Dispatch<SetStateAction<Set<number>>>;
  DisciplinasDisponiveis: DisciplinaComPeriodo[];
  TodasDisciplinas: DisciplinaComPeriodo[];
  DisciplinasPorPeriodo: Record<string, DisciplinaComPeriodo[]>;
};

const DataContext = createContext<ContextData | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [DisciplinasFeitas, setDisciplinasFeitas] = useState<Set<number>>(new Set());
  const [Tab, setTab] = useState("gerenciador");

  // Salva no navegador as disciplinas do usuario
  useEffect(() => {
    const salvas = localStorage.getItem("disciplinas");
    if (salvas) {
      try {
        const ids: number[] = JSON.parse(salvas);
        setDisciplinasFeitas(new Set(ids));
      } catch (e) {
        console.error("Erro ao carregar disciplinas feitas:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("disciplinas", JSON.stringify([...DisciplinasFeitas]));
  }, [DisciplinasFeitas]);

  const { TodasDisciplinas, DisciplinasPorPeriodo, DisciplinasDisponiveis } = useMemo(() => {
    const TodasDisciplinas: DisciplinaComPeriodo[] = [];
    const DisciplinasPorPeriodo: Record<string, DisciplinaComPeriodo[]> = {};

    for (const [periodo, lista] of Object.entries(Disciplinas)) {
      const completas = lista.map((disc) => ({ ...disc, periodo }));
      DisciplinasPorPeriodo[periodo] = completas;
      TodasDisciplinas.push(...completas);
    }

    // Calcular as disciplinas que estão disponíveis pra fazer
    // Uma disciplina está disponível se:
    // - Não está marcada como feita
    // - Todos os seus requisitos (se tiver) estão dentro do conjunto feitas
    const DisciplinasDisponiveis = TodasDisciplinas.filter((d) => {
      if (DisciplinasFeitas.has(d.id)) return false;
      if (!d.requisitos?.length) return true;
      return d.requisitos.every((req) => DisciplinasFeitas.has(req.id));
    });

    return { TodasDisciplinas, DisciplinasPorPeriodo, DisciplinasDisponiveis };
  }, [DisciplinasFeitas]);

  return (
    <DataContext.Provider
      value={{
        Tab,
        setTab,
        DisciplinasFeitas,
        setDisciplinasFeitas,
        DisciplinasDisponiveis,
        TodasDisciplinas,
        DisciplinasPorPeriodo,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData(): ContextData {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("Para consumir context é preciso usar contextProvider");
  }
  return context;
}
