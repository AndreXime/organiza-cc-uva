"use client";

import React, { useMemo } from "react";
import Disciplinas from "@/disciplinas/disciplinas";
import { DisciplinaSingle } from "@/lib/types";
import { useData } from "../../Context/DataContext";
import Header from "../ui/header";

export default function GerenciadorInterativo() {
  const { DisciplinasFeitas, setDisciplinasFeitas, DisciplinasDisponiveis } = useData();

  // Mapa id => disciplina pra facilitar busca
  const mapaDisciplinas: Record<number, DisciplinaSingle> = {};
  Object.values(Disciplinas)
    .flat()
    .forEach((d) => (mapaDisciplinas[d.id] = d));

  // Função pra clicar e alternar se já fez ou não
  function toggleFeita(id: number) {
    setDisciplinasFeitas((prev) => {
      const nova = new Set(prev);
      if (nova.has(id)) nova.delete(id);
      else nova.add(id);
      return nova;
    });
  }

  return (
    <div className="px-6 max-w-5xl mx-auto">
      <Header
        title="Gerenciador Interativo de Disciplinas"
        subtitles={[
          "Clique nas disciplinas disponiveis para marcar como concluida e na disciplina que você já fez para desmarcar",
          "Todas as disciplina que aparecem disponiveis é porque você tem requisitos suficiente para fazer",
        ]}
      />

      <div className="flex flex-col md:flex-row justify-center gap-8 ">
        {/* Lista disciplinas feitas */}
        <section className="overflow-scroll h-150 order-2 md:order-1">
          <h2 className="text-xl font-semibold mb-4 text-green-700">Disciplinas que você já fez</h2>
          {DisciplinasFeitas.size === 0 ? (
            <p className="italic text-gray-500">Nenhuma disciplina selecionada.</p>
          ) : (
            <ul className="space-y-2">
              {[...DisciplinasFeitas].map((id) => (
                <li
                  key={id}
                  className="cursor-pointer rounded bg-green-100 text-green-800 px-4 py-2 shadow hover:bg-green-200 transition"
                  onClick={() => toggleFeita(id)}
                  title="Clique para desmarcar"
                >
                  {mapaDisciplinas[id]?.nome || "Disciplina desconhecida"}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Lista disciplinas disponíveis */}
        <section className="overflow-scroll h-150 order-1 md:order-2">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700">Disciplinas disponíveis para fazer</h2>
          {DisciplinasDisponiveis.length === 0 ? (
            <p className="italic text-gray-500">Nenhuma disciplina disponível no momento.</p>
          ) : (
            <ul className="space-y-2">
              {DisciplinasDisponiveis.map((disciplina) => (
                <li
                  key={disciplina.id}
                  className="flex justify-between cursor-pointer rounded bg-indigo-100 text-indigo-800 px-4 py-2 shadow hover:bg-indigo-200 transition"
                  onClick={() => toggleFeita(disciplina.id)}
                  title="Clique para marcar como feita"
                >
                  {disciplina.nome} <small className="text-gray-500 capitalize">{disciplina.periodo}</small>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
