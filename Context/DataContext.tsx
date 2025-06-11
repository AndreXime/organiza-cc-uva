"use client";
import Disciplinas from "@/disciplinas/disciplinas";
import { DisciplinaSingle } from "@/lib/types";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from "react";

type ContextData = {
  Tab: string;
  setTab: Dispatch<SetStateAction<string>>;
  DisciplinasFeitas: Set<number>;
  setDisciplinasFeitas: Dispatch<SetStateAction<Set<number>>>;
  DisciplinasDisponiveis: (DisciplinaSingle & {
    periodo: string;
  })[];
};

const DataContext = createContext<ContextData | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  // Estado das disciplinas que o usuário já fez (ids)
  const [DisciplinasFeitas, setDisciplinasFeitas] = useState<Set<number>>(new Set());
  const [Tab, setTab] = useState("gerenciador");

  const listaCompleta: (DisciplinaSingle & { periodo: string })[] = [];
  for (const [periodo, disciplinas] of Object.entries(Disciplinas)) {
    disciplinas.forEach((d) => {
      listaCompleta.push({ ...d, periodo });
    });
  }

  // Calcular as disciplinas que estão disponíveis pra fazer
  // Uma disciplina está disponível se:
  // - Não está marcada como feita
  // - Todos os seus requisitos (se tiver) estão dentro do conjunto feitas
  const DisciplinasDisponiveis = useMemo(() => {
    return listaCompleta.filter((disciplina) => {
      if (DisciplinasFeitas.has(disciplina.id)) return false;
      if (!disciplina.requisitos || disciplina.requisitos.length === 0) return true;
      return disciplina.requisitos.every((req) => DisciplinasFeitas.has(req.id));
    });
  }, [DisciplinasFeitas]);

  return (
    <DataContext.Provider value={{ Tab, setTab, DisciplinasFeitas, setDisciplinasFeitas, DisciplinasDisponiveis }}>
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
