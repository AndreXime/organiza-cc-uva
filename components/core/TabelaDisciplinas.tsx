import { formatPeriodo } from "@/lib/utils";
import Header from "../ui/header";
import { useData } from "@/context/DataContext";

export default function TabelaDisciplinas() {
  const { TodasDisciplinas, DisciplinasPorPeriodo } = useData();

  return (
    <div className="mx-3 md:mx-10">
      <Header title="Tabela de Disciplinas" subtitles={"Todas as disciplinas registradas no momento"} />

      {Object.entries(DisciplinasPorPeriodo).map(([periodo, disciplinas]) => (
        <section key={periodo} className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700 ml-1">{formatPeriodo(periodo)}</h2>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {disciplinas.map((disciplina) => (
              <li
                key={disciplina.id}
                className="bg-white shadow rounded p-4 border border-gray-200 flex flex-col justify-between"
              >
                <strong className="text-lg text-gray-900">{disciplina.nome}</strong>
                {disciplina.requisitos && disciplina.requisitos.length > 0 ? (
                  <span className="mt-2 text-gray-700">
                    <p>Depende de: </p>
                    <ul className="list-disc pl-5">
                      {disciplina.requisitos.map((req) => (
                        <li key={req.id}>
                          {TodasDisciplinas.find((d) => d.id === req.id)?.nome || "Disciplina não encontrada"}
                        </li>
                      ))}
                    </ul>
                  </span>
                ) : (
                  <p className="mt-2 italic text-gray-500">Sem dependências</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
