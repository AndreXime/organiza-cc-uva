import Link from 'next/link';
import { useData } from '@/context/DataContext';
import React, { useState } from 'react';
import { SiTypescript, SiTailwindcss, SiNextdotjs, SiGithub } from 'react-icons/si';
import DisciplinaTable from '../ui/DisciplinaTable';
import { ArrowRight, BadgeCheck, Eye, EyeOff, LibraryBig } from 'lucide-react';

export default function Sobre() {
    const { DisciplinasDisponiveis, DisciplinasFeitas } = useData();

    const [showTable, setShowTable] = useState(false);

    const stats = [
        {
            title: 'Disciplinas Concluídas',
            value: DisciplinasFeitas.size,
            icon: <BadgeCheck size={33} color="green" />,
        },
        {
            title: 'Disponíveis para Cursar',
            value: DisciplinasDisponiveis.length,
            icon: <LibraryBig size={33} color="blue" />,
        },
        {
            title: 'Próxima Disciplina Disponível',
            value: DisciplinasDisponiveis[0]?.nome || 'Você concluiu todas as disciplinas!',
            icon: <ArrowRight size={33} color="#E12AFB" />,
        },
    ];

    return (
        <>
            <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-semibold text-blue-800">Sobre este Projeto</h2>
            </div>
            <div className="max-w-7xl mx-auto space-y-12">
                <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-700 border-b-2 border-gray-200 pb-2">
                        Estatísticas do Progresso
                    </h3>
                    <div id="stats-container" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {stats.map((stat) => (
                            <div
                                key={stat.title}
                                className="stat-card bg-white p-4 rounded-lg shadow-sm border flex items-center"
                            >
                                <div className="text-3xl mr-4">{stat.icon}</div>
                                <div>
                                    <h4 className="font-bold text-gray-500 text-sm">{stat.title}</h4>
                                    <div className="text-xl font-semibold text-blue-800">{stat.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <p className="text-gray-600 leading-relaxed mb-4">
                        A ideia surgiu da necessidade recorrente de montar uma tabela no Excel todo semestre para
                        verificar os conflitos de horário e os pré-requisitos das disciplinas. Este projeto visa
                        simplificar esse processo, oferecendo uma ferramenta interativa e visual para os estudantes de
                        Ciências da Computação da Universidade Estadual do Vale do Acaraú.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        Os horários e requisitos das disciplinas foram retirados desses dois PDFs:{' '}
                        <Link
                            href="/assets/Lotação das disciplinas por sala 2025.1.pdf"
                            className="text-blue-600 hover:underline font-semibold"
                        >
                            Horários
                        </Link>{' '}
                        e{' '}
                        <Link
                            href="/assets/Fluxograma Disciplinas(Ciências da computação).pdf"
                            className="text-blue-600 hover:underline font-semibold"
                        >
                            Requisitos
                        </Link>{' '}
                        e do sistema do proprio curso.
                    </p>
                    <div className={`w-full flex justify-center items-center  ${showTable ? 'my-5' : 'mt-5'}`}>
                        <button onClick={() => setShowTable(!showTable)} className="btn-primary">
                            {!showTable ? (
                                <>
                                    <Eye size={20} /> Clique para mostrar os dados sendo utilizados
                                </>
                            ) : (
                                <>
                                    <EyeOff size={20} />
                                    Clique para esconder a tabela
                                </>
                            )}
                        </button>
                    </div>
                    {showTable && <DisciplinaTable />}
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-700 border-b-2 border-gray-200 pb-2">
                        Tecnologias Utilizadas
                    </h3>
                    <div className="flex flex-wrap justify-center gap-6 text-center">
                        <div className="text-gray-600 flex flex-col justify-center items-center gap-2">
                            <SiTypescript size={40} className="text-[#3178C6]" />
                            Typescript
                        </div>
                        <div className="text-gray-600 flex flex-col justify-center  items-center gap-2">
                            <SiNextdotjs size={40} className="text-[#000000]" />
                            Next.js
                        </div>
                        <div className="text-gray-600 flex flex-col justify-center items-center gap-2">
                            <SiTailwindcss size={40} className="text-[#06B6D4]" />
                            TailwindCSS
                        </div>
                    </div>
                </div>
                <div className="text-center">
                    <h3 className="text-xl font-bold mb-4 text-gray-700">Gostou do Projeto?</h3>
                    <p className="text-gray-600 mb-4">
                        Se quiser sugerir alguma melhoria, você pode abrir uma{' '}
                        <strong className="font-semibold">issue</strong> ou um{' '}
                        <strong className="font-semibold">pull request</strong>.
                    </p>
                    <Link
                        href="https://github.com/AndreXime/organiza-cc-uva"
                        className="inline-flex items-center gap-2 justify-center bg-gray-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-900 transition-colors"
                    >
                        <SiGithub size={30} />
                        Ver no GitHub
                    </Link>
                </div>
            </div>
        </>
    );
}
