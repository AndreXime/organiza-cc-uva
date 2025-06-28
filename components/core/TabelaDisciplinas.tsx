import { formatPeriodo } from '@/lib/utils';
import Header from '../ui/header';
import { useData } from '@/context/DataContext';
import ProgressBar from '../ui/ProgressBar';

export default function TabelaDisciplinas() {
    const { TodasDisciplinas, DisciplinasPorPeriodo, DisciplinasFeitas, DisciplinasDisponiveis } = useData();

    return (
        <>
            <Header
                title="Tabela de Disciplinas"
                subtitles={'Visualize a grade curricular completa e seu progresso no curso.'}
            />

            <ProgressBar total={TodasDisciplinas.length} current={DisciplinasFeitas.size} />

            {Object.entries(DisciplinasPorPeriodo).map(([periodo, disciplinas]) => (
                <section key={periodo} className="mb-8">
                    <h3 className="text-xl font-bold mb-4 text-gray-700 border-b-2 border-gray-200 pb-2">
                        {formatPeriodo(periodo)}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {disciplinas.map((disciplina) => {
                            const foiFeita = DisciplinasFeitas.has(disciplina.id);
                            const estaDisponivel = DisciplinasDisponiveis.find((d) => d.id === disciplina.id);

                            let cardClasses =
                                'shadow rounded p-4 border border-gray-200 flex flex-col justify-between ';
                            let titleClasses = 'font-semibold ';

                            if (foiFeita) {
                                cardClasses += 'bg-green-50 border-green-200 text-gray-500';
                                titleClasses += 'text-green-700';
                            } else if (estaDisponivel) {
                                cardClasses += 'bg-white border-blue-400';
                                titleClasses += 'text-blue-800';
                            } else {
                                cardClasses += 'bg-gray-100 border-gray-200 text-gray-400';
                                titleClasses += 'text-gray-500';
                            }

                            return (
                                <div key={disciplina.id} className={cardClasses}>
                                    <strong className={titleClasses}>{disciplina.nome}</strong>
                                    {disciplina.requisitos && disciplina.requisitos.length > 0 ? (
                                        <ul className="list-disc list-inside mt-2 text-xs">
                                            {disciplina.requisitos.map((req) => (
                                                <li key={req.id}>
                                                    {TodasDisciplinas.find((d) => d.id === req.id)?.nome ||
                                                        'Disciplina não encontrada'}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-xs italic mt-2">Sem pré-requisitos</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>
            ))}
        </>
    );
}
