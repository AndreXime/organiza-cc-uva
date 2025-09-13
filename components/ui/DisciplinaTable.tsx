import { useDisciplinaStore } from '@/store/dataStore';
import { useState } from 'react';

export default function DisciplinaTable() {
    const DisciplinasTotais = useDisciplinaStore((state) => state.DisciplinasTotais);

    const [mostrarTudo, setMostrarTudo] = useState(false);

    const disciplinasVisiveis = mostrarTudo ? DisciplinasTotais : DisciplinasTotais.slice(0, 5);

    return (
        <>
            <h3 className="text-xl font-bold mb-4 text-gray-700 border-b-2 border-gray-200 pb-2 flex flex-row items-center gap-3">
                Dados utilizados
                <button className="btn-primary" onClick={() => setMostrarTudo(!mostrarTudo)}>
                    {mostrarTudo ? 'Mostrar menos' : 'Mostrar tudo'}
                </button>
            </h3>
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
                            <th className="border px-2 py-1 max-w-xs truncate">Requisitos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {disciplinasVisiveis.map((d) => (
                            <tr key={d.id} className="even:bg-white odd:bg-gray-50">
                                <td className="border px-2 py-1">{d.id}</td>
                                <td className="border px-2 py-1">{d.nome}</td>
                                <td className="border px-2 py-1">{d.periodo}</td>
                                <td className="border px-2 py-1">
                                    {d.horarios
                                        ? d.horarios.map((h) => `${h.dia} ${h.inicio}-${h.fim}`).join('; ')
                                        : '–'}
                                </td>
                                <td className="border px-2 py-1">{d.professor}</td>
                                <td className="border px-2 py-1">{d.carga_horaria}</td>
                                <td className="border px-2 py-1 max-w-xs break-words">
                                    {d.requisitos
                                        ? d.requisitos
                                              .map((r) => DisciplinasTotais.find((disc) => disc.id == r.id)?.nome)
                                              .join(', ')
                                        : '–'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
