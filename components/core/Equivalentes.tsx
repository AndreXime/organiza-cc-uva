import { generateDisciplinaClasses } from '@/lib/utils';
import { useDisciplinaStore } from '@/store/disciplinas/disciplinaStore';
import { useMemo } from 'react';

export default function Equivalentes() {
    const DisciplinasEquivalentes = useDisciplinaStore((state) => state.DisciplinasEquivalentes);
    const DisciplinasFeitas = useDisciplinaStore((state) => state.DisciplinasFeitas);
    const DisciplinasDisponiveis = useDisciplinaStore((state) => state.DisciplinasDisponiveis);
    const getDisciplinaByName = useDisciplinaStore((state) => state.getDisciplinaByName);

    const DisciplinasVisiveis = useMemo(() => {
        const gruposMap = new Map<string, (typeof DisciplinasEquivalentes)[number][]>();

        // Agrupa as disciplinas pelo equivaleNome
        DisciplinasEquivalentes.forEach((disciplina) => {
            const key = disciplina.equivaleNome;
            if (!gruposMap.has(key)) gruposMap.set(key, []);
            gruposMap.get(key)!.push(disciplina);
        });

        const getSortWeight = (disciplina: Disciplina): number => {
            const foiFeita = DisciplinasFeitas.has(disciplina.id);
            const estaDisponivel = DisciplinasDisponiveis.has(disciplina.id);

            if (foiFeita) {
                return 2; // Feitas têm o maior peso, vão para o final
            }
            if (estaDisponivel) {
                return 0; // Disponíveis têm o menor peso, vêm primeiro
            }
            return 1; // Bloqueadas ficam no meio
        };

        const grupos = Array.from(gruposMap.entries()).map(([equivaleNome, disciplinas]) => {
            const disciplina = getDisciplinaByName(equivaleNome);
            const pesoGrupo = getSortWeight(disciplina!);
            return {
                equivaleNome,
                disciplinas,
                peso: pesoGrupo,
            };
        });

        // Ordena grupos
        grupos.sort((a, b) => a.peso - b.peso);

        return grupos;
    }, [DisciplinasEquivalentes]);

    return (
        <>
            <div className="text-center mb-10 p-6 bg-blue-50 border border-blue-200 rounded-xl">
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 mb-2">Disciplinas Equivalentes</h2>
                <p className="text-gray-600 max-w-3xl mx-auto text-sm md:text-base">
                    Nessa seção está presentes todas as disciplinas equivalentes até o momento, pode ser que algumas
                    estejam fora fluxo de quando podia ser aceitas para o nosso curso, deve-se consultar outra fonte
                    antes de tomar qualquer ação de matricular-se nelas.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {DisciplinasVisiveis.map((grupo) => {
                    const { cardClasses, titleClasses } = generateDisciplinaClasses(grupo.disciplinas[0].equivaleId);
                    return (
                        <section key={grupo.equivaleNome} className={'mb-8 ' + cardClasses}>
                            <h3 className={'text-xl font-bold mb-4 border-b-2 border-gray-200 pb-2 ' + titleClasses}>
                                Equivalente a {grupo.equivaleNome}
                            </h3>
                            {grupo.disciplinas.map((disciplina, index) => (
                                <div key={index} className="mb-4 h-full flex flex-col">
                                    <strong className={titleClasses}>{disciplina.nome}</strong>
                                    <span className="text-sm mt-2 font-semibold">Curso: {disciplina.curso}</span>
                                    <span className="text-sm mt-2 font-semibold">
                                        Professor: {disciplina.professor}
                                    </span>
                                    <span className="text-sm mt-2 font-semibold">
                                        Horário:
                                        <ul className="list-disc pl-4">
                                            {disciplina.horarios?.map((h, i) => (
                                                <li key={i}>{`${h.dia} ${h.inicio} - ${h.fim}`}</li>
                                            ))}
                                        </ul>
                                    </span>
                                </div>
                            ))}
                        </section>
                    );
                })}
            </div>
        </>
    );
}
