import Link from 'next/link';
import React from 'react';
import { SiTypescript, SiTailwindcss, SiNextdotjs, SiGithub } from 'react-icons/si';
import DisciplinaTable from '../ui/DisciplinaTable';
import { Footprints, BadgeCheck, LibraryBig, Clock, Pickaxe, Sun, Moon } from 'lucide-react';
import { useDisciplinaStore } from '@/store/disciplinas/disciplinaStore';
import useCalculateProgress from '@/lib/hooks/useCalculateProgress';

export default function Sobre() {
    const DisciplinasDisponiveis = useDisciplinaStore((state) => state.DisciplinasDisponiveis);
    const getDisciplinasByIds = useDisciplinaStore((state) => state.getDisciplinasByIds);

    const { totalFeitas, faltantes } = useCalculateProgress();

    const stats = [
        {
            title: 'Disciplinas concluídas',
            value: totalFeitas,
            icon: BadgeCheck,
            color: 'text-green-600',
        },
        {
            title: 'Disciplinas disponíveis para cursar',
            value: DisciplinasDisponiveis.size,
            icon: LibraryBig,
            color: 'text-blue-600',
        },
        {
            title: 'Disciplinas para terminar o curso',
            value: faltantes,
            icon: Clock,
            color: 'text-orange-600',
        },
        {
            title: 'Próxima disciplina disponível',
            value: getDisciplinasByIds(DisciplinasDisponiveis)[0]?.nome || 'Você concluiu todas as disciplinas!',
            icon: Footprints,
            color: 'text-purple-600',
        },
    ];

    return (
        <>
            <div className="max-w-7xl mx-auto space-y-12">
                <div>
                    <h3 className="text-xl font-bold mb-4 text-foreground border-b-2 border-gray-200 pb-2 flex flex-row items-center">
                        Temas de cores{' '}
                        <span className="inline-flex gap-2 ml-5 font-bold  text-base text-yellow-500">
                            <Pickaxe /> Em construção
                        </span>
                    </h3>
                    <div className="flex gap-4">
                        <button
                            className="bg-white border-black text-black border-1 p-4 py-3 rounded-full inline-flex gap-2"
                            onClick={() => document.documentElement.classList.remove('dark')}
                        >
                            Tema Claro <Sun />
                        </button>
                        <button
                            className="bg-black border-white text-white border-1 p-4 py-3 rounded-full inline-flex gap-2"
                            onClick={() => document.documentElement.classList.add('dark')}
                        >
                            Tema Escuro <Moon />
                        </button>
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-700 border-b-2 border-gray-200 pb-2">
                        Estatísticas de progresso
                    </h3>
                    <div id="stats-container" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {stats.map((stat) => (
                            <div
                                key={stat.title}
                                className="stat-card bg-white p-4 rounded-lg shadow-sm border flex items-center"
                            >
                                <div className="text-3xl mr-4">
                                    <stat.icon size={35} className={stat.color} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-500 text-sm">{stat.title}</h4>
                                    <div className={'text-xl font-semibold ' + stat.color}>{stat.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <DisciplinaTable />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <p className="text-gray-600 leading-relaxed">
                        A ideia surgiu da necessidade recorrente de montar uma tabela no Excel todo semestre para
                        verificar os conflitos de horário e os pré-requisitos das disciplinas. Este projeto visa
                        simplificar esse processo, oferecendo uma ferramenta interativa e visual para os estudantes de
                        Ciências da Computação da Universidade Estadual do Vale do Acaraú.
                    </p>
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
