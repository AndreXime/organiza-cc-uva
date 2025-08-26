'use client';

import { useEffect, useMemo, useState } from 'react';
import { useData } from '../../context/DataContext';
import PopupComponent from '../ui/Popup';
import ProgressBar from '../ui/ProgressBar';
import { Eye, EyeOff, Maximize2, Minimize2 } from 'lucide-react';
import { useUI } from '@/context/UIContext';

export default function GerenciadorInterativo() {
    const { DisciplinasFeitas, setDisciplinasFeitas, DisciplinasDisponiveis, TodasDisciplinas, DisciplinasPorPeriodo } =
        useData();
    const { message, setMessage, mostrarFeitas, setMostrarFeitas, expandedMode, setExpandedMode } = useUI();

    useEffect(() => {
        if (!message) return;

        const timer = setTimeout(() => {
            setMessage('');
        }, 5000);

        return () => clearTimeout(timer);
    }, [message, setMessage]);

    // Função pra clicar e alternar se já fez ou não
    function toggleFeita(id: number) {
        setDisciplinasFeitas((prev) => {
            const nova = new Set(prev);

            if (nova.has(id)) {
                // Verifica se alguma disciplina feita depende da que está sendo desmarcada
                const dependeDessa = TodasDisciplinas.some(
                    (disc) => nova.has(disc.id) && disc.requisitos?.some((req) => req.id === id)
                );

                if (dependeDessa) {
                    setMessage(
                        'Você não pode desmarcar esta disciplina porque outra que depende dela já está marcada como feita.'
                    );
                    return prev;
                }

                nova.delete(id);
            } else {
                nova.add(id);
            }

            return nova;
        });
    }

    const disciplinasVisiveis: Record<string, Disciplina[]> = useMemo(() => {
        if (mostrarFeitas) return DisciplinasPorPeriodo;

        return Object.fromEntries(
            Object.entries(DisciplinasPorPeriodo).map(([periodo, disciplinas]) => [
                periodo,
                disciplinas.filter((disc) => !DisciplinasFeitas.has(disc.id)),
            ])
        );
    }, [mostrarFeitas, DisciplinasPorPeriodo, DisciplinasFeitas]);

    return (
        <>
            <div className="text-center mb-10 p-6 bg-blue-50 border border-blue-200 rounded-xl">
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 mb-2">Gerenciador de Disciplinas</h2>
                <p className="text-gray-600 max-w-3xl mx-auto text-sm md:text-base">
                    As disciplinas em <span className="font-bold text-green-600">verde</span> estão marcadas como{' '}
                    <span className="font-bold text-green-600">Concluídas</span>, e as em
                    <span className="font-bold text-blue-600"> azul</span> estão
                    <span className="font-bold text-blue-600"> Disponíveis</span>. <br />
                    Clique em uma disciplina disponível para marcá-la como concluída. Clique em uma disciplina concluída
                    para desmarcá-la. <br />
                    As disciplinas só aparecem como disponíveis quando todos os seus
                    <span className="font-semibold text-red-600"> pré-requisitos</span> estão cumpridos. <br />
                    Suas alterações são salvas automaticamente!
                </p>
                <div className="flex flex-wrap gap-4 items-center justify-center mt-4">
                    <p className="flex flex-wrap flex-row gap-4 items-center justify-center">
                        <button onClick={() => setExpandedMode(!expandedMode)} className="btn-primary">
                            {expandedMode ? (
                                <>
                                    <Minimize2 size={20} />
                                    Mostrar versão compacta
                                </>
                            ) : (
                                <>
                                    <Maximize2 size={20} />
                                    Mostrar versão expandida
                                </>
                            )}
                        </button>
                    </p>
                    {expandedMode && (
                        <p className="flex flex-wrap flex-row gap-4 items-center justify-center">
                            <button
                                disabled={DisciplinasFeitas.size == 0}
                                onClick={() => setMostrarFeitas(!mostrarFeitas)}
                                className="btn-primary"
                            >
                                {mostrarFeitas ? (
                                    <>
                                        <EyeOff size={20} /> Esconder disciplinas feitas
                                    </>
                                ) : (
                                    <>
                                        <Eye size={20} /> Mostrar todas disciplinas
                                    </>
                                )}
                            </button>
                        </p>
                    )}
                </div>
            </div>
            <ProgressBar
                total={TodasDisciplinas.filter((disc) => disc.periodo != 'Optativa').length}
                current={DisciplinasFeitas.size}
            />
            {expandedMode ? (
                <>
                    {Object.entries(disciplinasVisiveis).map(([periodo, disciplinas]) => (
                        <section key={periodo} className="mb-8">
                            <h3 className="text-xl font-bold mb-4 text-gray-700 border-b-2 border-gray-200 pb-2">
                                {periodo}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {disciplinas.map((disciplina) => {
                                    const foiFeita = DisciplinasFeitas.has(disciplina.id);
                                    const estaDisponivel = DisciplinasDisponiveis.find((d) => d.id === disciplina.id);

                                    let cardClasses =
                                        'text-left shadow rounded p-4 border border-gray-200 flex flex-col justify-between cursor-pointer disabled:cursor-not-allowed ';
                                    let titleClasses = 'font-semibold ';

                                    if (foiFeita) {
                                        cardClasses += 'bg-green-50';
                                        titleClasses += 'text-green-700';
                                    } else if (estaDisponivel) {
                                        cardClasses += 'bg-blue-50';
                                        titleClasses += 'text-blue-800';
                                    } else {
                                        cardClasses += 'bg-gray-100 text-gray-400';
                                        titleClasses += 'text-gray-500';
                                    }

                                    return (
                                        <button
                                            onClick={() => toggleFeita(disciplina.id)}
                                            key={disciplina.id}
                                            disabled={!foiFeita && !estaDisponivel}
                                            className={cardClasses}
                                        >
                                            <strong className={titleClasses}>{disciplina.nome}</strong>
                                            <span className="text-xs mt-2 font-semibold">
                                                {disciplina.professor} - {disciplina.carga_horaria} horas
                                            </span>
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
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-lg md:text-xl font-bold mb-4 text-blue-600 border-b-2 border-blue-200 pb-2">
                            📚 Disciplinas Disponíveis
                        </h3>
                        <div className="space-y-3 pr-2 max-h-[50vh] lg:max-h-[60vh] overflow-y-auto">
                            {DisciplinasDisponiveis.length === 0 ? (
                                <p className="italic text-gray-500">Você concluiu todas as disciplinas parabens.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {DisciplinasDisponiveis.map((disciplina) => (
                                        <li
                                            key={disciplina.id}
                                            onClick={() => toggleFeita(disciplina.id)}
                                            title="Clique para desmarcar"
                                            className="course-item flex justify-between items-center p-3 md:p-4 rounded-lg cursor-pointer shadow-sm border bg-blue-50 border-blue-200"
                                        >
                                            <p className="font-semibold text-sm md:text-base">{disciplina.nome}</p>
                                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
                                                {disciplina.periodo}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg md:text-xl font-bold mb-4 text-green-600 border-b-2 border-green-200 pb-2">
                            ✅ Disciplinas Concluídas
                        </h3>

                        <div className="space-y-3 pr-2 max-h-[50vh] lg:max-h-[60vh] overflow-y-auto">
                            {DisciplinasFeitas.size === 0 ? (
                                <p className="italic text-gray-500">Nenhuma disciplina concluída.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {[...DisciplinasFeitas].map((id) => {
                                        const disciplina = TodasDisciplinas.find((d) => d.id === id);
                                        if (disciplina) {
                                            return (
                                                <li
                                                    key={id}
                                                    onClick={() => toggleFeita(id)}
                                                    title="Clique para desmarcar"
                                                    className="course-item bg-green-50 flex justify-between items-center p-3 md:p-4 rounded-lg cursor-pointer shadow-sm border border-green-200"
                                                >
                                                    <p className="font-semibold text-sm md:text-base">
                                                        {disciplina.nome}
                                                    </p>
                                                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
                                                        {disciplina.periodo}
                                                    </span>
                                                </li>
                                            );
                                        }
                                    })}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <PopupComponent message={message} />
        </>
    );
}
