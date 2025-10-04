import { useDisciplinaStore } from '@/store/disciplinas/disciplinaStore';
import { useMemo } from 'react';

export default function ProgressBar() {
    const DisciplinasTotais = useDisciplinaStore((state) => state.DisciplinasTotais);
    const DisciplinasFeitas = useDisciplinaStore((state) => state.DisciplinasFeitas);

    const percentage = useMemo(() => {
        const disciplinasObrigatorias = DisciplinasTotais.filter(
            (disc) => disc.periodo !== 'Optativa' && disc.periodo !== 'Não ofertadas'
        );
        const numMaxOptativas = 7;

        const totalDeDisciplinasContabilizadas = disciplinasObrigatorias.length + numMaxOptativas;

        const obrigatoriasFeitasArray = Array.from(DisciplinasFeitas).filter((idFeita) =>
            disciplinasObrigatorias.some((disc) => disc.id === idFeita)
        );

        const optativasFeitasArray = Array.from(DisciplinasFeitas).filter(
            (idFeita) => !disciplinasObrigatorias.some((disc) => disc.id === idFeita)
        );

        // Limita a contagem de optativas feitas a no máximo 7
        const optativasFeitas = Math.min(optativasFeitasArray.length, numMaxOptativas);

        const totalFeitas = obrigatoriasFeitasArray.length + optativasFeitas;

        return Math.min((totalFeitas / totalDeDisciplinasContabilizadas) * 100, 100);
    }, [DisciplinasTotais, DisciplinasFeitas]);

    const getBgColor = (percent: number = percentage) => {
        if (percent < 10) return 'bg-red-600';
        if (percent < 20) return 'bg-red-500';
        if (percent < 30) return 'bg-orange-600';
        if (percent < 40) return 'bg-orange-500';
        if (percent < 50) return 'bg-yellow-500';
        if (percent < 60) return 'bg-yellow-400';
        if (percent < 70) return 'bg-amber-500';
        if (percent < 80) return 'bg-lime-500';
        if (percent < 90) return 'bg-green-500';
        return 'bg-emerald-600';
    };

    const getTextColor = (percent: number = percentage) => {
        if (percent < 10) return 'text-red-600';
        if (percent < 20) return 'text-red-500';
        if (percent < 30) return 'text-orange-600';
        if (percent < 40) return 'text-orange-500';
        if (percent < 50) return 'text-yellow-600';
        if (percent < 60) return 'text-yellow-500';
        if (percent < 70) return 'text-amber-500';
        if (percent < 80) return 'text-lime-500';
        if (percent < 90) return 'text-green-500';
        return 'text-emerald-600';
    };

    return (
        <div className="mb-10 px-4 md:px-0">
            <div className={'flex justify-between mb-1 font-medium ' + getTextColor()}>
                <span className="text-base">Progresso do Curso</span>
                <span className="text-sm">{(percentage || 0).toFixed(2)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                    className={'h-2.5 rounded-full transition-all duration-500 ' + getBgColor()}
                    style={{ width: `${percentage || 0}%` }}
                ></div>
            </div>
        </div>
    );
}
