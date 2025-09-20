import { generateDisciplinaClasses } from '@/lib/utils';
import { useDisciplinaStore } from '@/store/disciplinas/disciplinaStore';
import { FiltrarDisciplina, FiltrosState, useFiltroStore } from '@/store/ui/filtroStore';
import { ArrowDownNarrowWide } from 'lucide-react';
import { useMemo } from 'react';

export default function FiltroDisciplinas() {
    const DisciplinasTotais = useDisciplinaStore((state) => state.DisciplinasTotais);
    const DisciplinasFeitas = useDisciplinaStore((state) => state.DisciplinasFeitas);

    const {
        professor,
        jaFez,
        periodo,
        turno,
        dia,
        buscaNome,
        setProfessor,
        setJaFez,
        setPeriodo,
        setTurno,
        setDia,
        setBuscaNome,
    } = useFiltroStore();

    const professoresUnicos = useMemo(() => {
        const nomes = DisciplinasTotais.map((d) => d.professor.trim());
        return Array.from(new Set(nomes)).sort();
    }, [DisciplinasTotais]);

    const periodosUnicos = useMemo(() => {
        const ps = DisciplinasTotais.map((d) => d.periodo);
        const unicos = Array.from(new Set(ps));

        return unicos.sort((a, b) => {
            const aIsOptativa = a.toLowerCase() === 'optativa';
            const bIsOptativa = b.toLowerCase() === 'optativa';

            if (aIsOptativa) return 1; // "a" (Optativa) vai para o final
            if (bIsOptativa) return -1; // "b" (Optativa) vai para o final

            // Ordenação numérica para os demais
            return parseInt(a) - parseInt(b);
        });
    }, [DisciplinasTotais]);

    const disciplinasFiltradas = useMemo(() => {
        return FiltrarDisciplina(DisciplinasTotais);
    }, [DisciplinasTotais, DisciplinasFeitas, professor, jaFez, periodo, turno, dia, buscaNome]);

    return (
        <>
            <div className="text-center mb-10 p-6 bg-blue-50 border border-blue-200 rounded-xl">
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 mb-2">Pesquisar Disciplinas</h2>
                <p className="text-gray-600 max-w-3xl mx-auto text-sm md:text-base">
                    Pesquise e filtre as disciplinas com base em qualquer critérios.
                </p>
            </div>
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
                    <div className="relative w-full">
                        <select
                            value={professor}
                            onChange={(e) => setProfessor(e.target.value)}
                            className="appearance-none border rounded-full p-3 w-full"
                        >
                            <option value="todos">Todos os professores</option>
                            {professoresUnicos.map((prof, i) => (
                                <option key={i} value={prof}>
                                    {prof}
                                </option>
                            ))}
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            <ArrowDownNarrowWide size={23} />
                        </span>
                    </div>

                    <div className="relative w-full">
                        <select
                            value={jaFez}
                            onChange={(e) => setJaFez(e.target.value as FiltrosState['jaFez'])}
                            className="appearance-none border rounded-full p-3 w-full"
                        >
                            <option value="todos">Todas as situações</option>
                            <option value="sim">Concluídas</option>
                            <option value="nao">Não concluídas</option>
                        </select>

                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            <ArrowDownNarrowWide size={23} />
                        </span>
                    </div>

                    <div className="relative w-full">
                        <select
                            value={periodo}
                            onChange={(e) => setPeriodo(e.target.value)}
                            className="appearance-none border rounded-full p-3 w-full"
                        >
                            <option value="todos">Todos os períodos</option>
                            <option value="todos_sem_optativas">Todos (Exceto Optativas)</option>
                            {periodosUnicos.map((p, i) => (
                                <option key={i} value={p}>
                                    {p}
                                </option>
                            ))}
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            <ArrowDownNarrowWide size={23} />
                        </span>
                    </div>

                    <div className="relative w-full">
                        <select
                            value={turno}
                            onChange={(e) => setTurno(e.target.value as FiltrosState['turno'])}
                            className="appearance-none border rounded-full p-3 w-full"
                        >
                            <option value="todos">Qualquer turno</option>
                            <option value="manha">Manhã</option>
                            <option value="tarde">Tarde</option>
                            <option value="noite">Noite</option>
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            <ArrowDownNarrowWide size={23} />
                        </span>
                    </div>

                    <div className="relative w-full">
                        <select
                            value={dia}
                            onChange={(e) => setDia(e.target.value as FiltrosState['dia'])}
                            className="appearance-none border rounded-full p-3 w-full"
                        >
                            <option value="todos">Qualquer dia</option>
                            <option value="Segunda">Segunda</option>
                            <option value="Terça">Terça</option>
                            <option value="Quarta">Quarta</option>
                            <option value="Quinta">Quinta</option>
                            <option value="Sexta">Sexta</option>
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            <ArrowDownNarrowWide size={23} />
                        </span>
                    </div>

                    <input
                        type="text"
                        className="border rounded-full w-full flex items-center px-3 min-h-[43px]"
                        placeholder="Pesquise pelo nome..."
                        value={buscaNome}
                        onChange={(e) => setBuscaNome(e.target.value)}
                    />

                    <h2 className="mt-3 flex items-center justify-center text-lg font-semibold col-span-full">
                        {disciplinasFiltradas.length} Disciplinas encontradas
                    </h2>
                </div>

                <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 items-stretch">
                    {disciplinasFiltradas.map((d) => {
                        const { cardClasses, titleClasses } = generateDisciplinaClasses(d.id);
                        return (
                            <li key={d.id} className={cardClasses + ' text-sm'}>
                                <p className={titleClasses + ' break-words'}>{d.nome}</p>
                                <p> {d.professor}</p>

                                <span className="text-sm mt-2">
                                    Horário:
                                    <ul className="list-disc pl-4">
                                        {d.horarios?.map((h, i) => (
                                            <li key={i}>{`${h.dia} ${h.inicio} - ${h.fim}`}</li>
                                        ))}
                                    </ul>
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    );
}
