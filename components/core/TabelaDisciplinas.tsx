import { formatPeriodo } from '@/lib/utils';
import Header from '../ui/header';
import { useData } from '@/context/DataContext';
import ProgressBar from '../ui/ProgressBar';

export default function TabelaDisciplinas() {
    const { TodasDisciplinas, DisciplinasPorPeriodo, DisciplinasFeitas } = useData();

    return (
        <div className="mx-3 md:mx-10">
            <Header
                title="Tabela de Disciplinas"
                subtitles={'Com base na aba Gerenciador Interativo aqui é gerado a grade de disciplinas'}
            />

            <section className="flex w-full justify-center px-2 pb-15 pt-0">
                <ProgressBar total={TodasDisciplinas.length} current={DisciplinasFeitas.size} />
            </section>

            {Object.entries(DisciplinasPorPeriodo).map(([periodo, disciplinas]) => (
                <section key={periodo} className="mb-10">
                    <h2 className="text-xl font-semibold mb-4 text-indigo-700 ml-1">{formatPeriodo(periodo)}</h2>
                    <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {disciplinas.map((disciplina) => (
                            <li
                                key={disciplina.id}
                                className={`${
                                    DisciplinasFeitas.has(disciplina.id)
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-indigo-100 text-indigo-800'
                                } shadow rounded p-4 border border-gray-200 flex flex-col justify-between`}
                            >
                                <strong className="text-lg text-gray-900">{disciplina.nome}</strong>
                                {disciplina.requisitos && disciplina.requisitos.length > 0 ? (
                                    <span className="mt-2 text-gray-700">
                                        <p>Depende de: </p>
                                        <ul className="list-disc pl-5">
                                            {disciplina.requisitos.map((req) => (
                                                <li key={req.id}>
                                                    {TodasDisciplinas.find((d) => d.id === req.id)?.nome ||
                                                        'Disciplina não encontrada'}
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
