import { generateDisciplinaClasses } from '@/lib/utils';
import { useDisciplinaStore } from '@/store/disciplinas/disciplinaStore';
import { FiltrosState, useFiltroStore } from '@/store/ui/filtroStore';
import { useMemo } from 'react';

export default function FiltroDisciplinas() {
    const DisciplinasTotais = useDisciplinaStore((state) => state.DisciplinasTotais);
    const DisciplinasFeitas = useDisciplinaStore((state) => state.DisciplinasFeitas);
    const { professor, jaFez, periodo, turno, dia, setProfessor, setJaFez, setPeriodo, setTurno, setDia } =
        useFiltroStore();

    const professoresUnicos = useMemo(() => {
        const nomes = DisciplinasTotais.map((d) => d.professor.trim());
        return Array.from(new Set(nomes)).sort();
    }, [DisciplinasTotais]);

    const periodosUnicos = useMemo(() => {
        const ps = DisciplinasTotais.map((d) => d.periodo);
        const unicos = Array.from(new Set(ps));

        // separar "Optativa" dos demais períodos
        const comuns = unicos.filter((p) => p.toLowerCase() !== 'optativa');
        const optativa = unicos.find((p) => p.toLowerCase() === 'optativa');

        comuns.sort((a, b) => {
            const numA = parseInt(a);
            const numB = parseInt(b);
            return numA - numB;
        });

        return optativa ? [...comuns, optativa] : comuns;
    }, [DisciplinasTotais]);

    const disciplinasFiltradas = useMemo(() => {
        return DisciplinasTotais.filter((d) => {
            // filtro professor
            if (professor !== 'todos' && d.professor !== professor) {
                return false;
            }
            // filtro se já fez (compara com Set de ids)
            const jaFoiFeita = DisciplinasFeitas.has(d.id);
            if (jaFez === 'sim' && !jaFoiFeita) return false;
            if (jaFez === 'nao' && jaFoiFeita) return false;

            // filtro por período da faculdade
            if (periodo !== 'todos' && d.periodo !== periodo) return false;

            if (turno !== 'todos') {
                if (!d.horarios || d.horarios.length === 0) {
                    return false;
                }

                // Verifica se algum dos horários bate com o turno selecionado
                const correspondeAoTurno = d.horarios.some((horario) => {
                    // Pega somente as horas e ignora os minutos
                    const horaInicio = parseInt(horario.inicio.split(':')[0]);

                    if (turno === 'manha' && horaInicio < 12) return true;
                    if (turno === 'tarde' && horaInicio >= 12 && horaInicio < 18) return true;
                    if (turno === 'noite' && horaInicio >= 18) return true;

                    return false;
                });

                if (!correspondeAoTurno) {
                    return false;
                }
            }

            if (dia !== 'todos') {
                // Se a disciplina não tiver horários, não corresponde a um dia específico.
                if (!d.horarios || d.horarios.length === 0) {
                    return false;
                }
                // Verifica se ALGUM dos horários da disciplina ocorre no dia selecionado.
                const temAulaNoDia = d.horarios.some((horario) => horario.dia === dia);
                if (!temAulaNoDia) {
                    return false;
                }
            }

            return true;
        });
    }, [DisciplinasTotais, DisciplinasFeitas, professor, jaFez, periodo, turno, dia]);

    return (
        <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <select
                    value={professor}
                    onChange={(e) => setProfessor(e.target.value)}
                    className="border rounded-full p-3"
                >
                    <option value="todos">Todos os professores</option>
                    {professoresUnicos.map((prof, i) => (
                        <option key={i} value={prof}>
                            {prof}
                        </option>
                    ))}
                </select>

                <select
                    value={jaFez}
                    onChange={(e) => setJaFez(e.target.value as any)}
                    className="border rounded-full p-3"
                >
                    <option value="todos">Todas as situações</option>
                    <option value="sim">Concluidas</option>
                    <option value="nao">Não concluidas</option>
                </select>

                <select
                    value={periodo}
                    onChange={(e) => setPeriodo(e.target.value)}
                    className="border rounded-full p-3"
                >
                    <option value="todos">Todos os períodos</option>
                    {periodosUnicos.map((p, i) => (
                        <option key={i} value={p}>
                            {p}
                        </option>
                    ))}
                </select>

                <select
                    value={turno}
                    onChange={(e) => setTurno(e.target.value as FiltrosState['turno'])}
                    className="border rounded-full p-3"
                >
                    <option value="todos">Qualquer turno</option>
                    <option value="manha">Manhã</option>
                    <option value="tarde">Tarde</option>
                    <option value="noite">Noite</option>
                </select>

                <select
                    value={dia}
                    onChange={(e) => setDia(e.target.value as FiltrosState['dia'])}
                    className="border rounded-full p-3"
                >
                    <option value="todos">Qualquer dia</option>
                    <option value="Segunda">Segunda</option>
                    <option value="Terça">Terça</option>
                    <option value="Quarta">Quarta</option>
                    <option value="Quinta">Quinta</option>
                    <option value="Sexta">Sexta</option>
                </select>

                <h2 className="flex items-center">{disciplinasFiltradas.length} Disciplinas encontradas</h2>
            </div>

            <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 items-stretch">
                {disciplinasFiltradas.map((d) => {
                    const { cardClasses, titleClasses } = generateDisciplinaClasses(d.id);
                    return (
                        <li key={d.id} className={cardClasses}>
                            <p className={titleClasses}>{d.nome}</p>
                            {d.professor}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
