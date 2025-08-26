import { useData } from '@/context/DataContext';

export default function DisciplinaTable() {
    const { TodasDisciplinas } = useData();

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-2 py-1">ID</th>
                        <th className="border px-2 py-1">Nome</th>
                        <th className="border px-2 py-1">Período</th>
                        <th className="border px-2 py-1">Horários</th>
                        <th className="border px-2 py-1">Professor</th>
                        <th className="border px-2 py-1">Carga Horaria</th>
                        <th className="border px-2 py-1">ID dos requisitos</th>
                    </tr>
                </thead>
                <tbody>
                    {TodasDisciplinas.map((d) => (
                        <tr key={d.id} className="even:bg-white odd:bg-gray-50">
                            <td className="border px-2 py-1">{d.id}</td>
                            <td className="border px-2 py-1">{d.nome}</td>
                            <td className="border px-2 py-1">{d.periodo}</td>
                            <td className="border px-2 py-1">
                                {d.horarios ? d.horarios.map((h) => `${h.dia} ${h.inicio}-${h.fim}`).join('; ') : '–'}
                            </td>
                            <td className="border px-2 py-1">{d.professor}</td>
                            <td className="border px-2 py-1">{d.carga_horaria}</td>
                            <td className="border px-2 py-1">
                                {d.requisitos ? d.requisitos.map((r) => r.id).join(', ') : '–'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
