type ProgressBarProps = {
    current: number; // valor atual
    total: number; // valor total
};

export default function ProgressBar({ current, total }: ProgressBarProps) {
    const percentage = Math.min((current / total) * 100, 100);

    const getBgColor = (percent: number = percentage) => {
        if (percent < 20) return 'bg-red-500';
        if (percent < 40) return 'bg-orange-500';
        if (percent < 60) return 'bg-yellow-500';
        if (percent < 80) return 'bg-green-500';
        return 'bg-blue-600';
    };

    const getTextColor = (percent: number = percentage) => {
        if (percent < 20) return 'text-red-500';
        if (percent < 40) return 'text-orange-500';
        if (percent < 60) return 'text-yellow-500';
        if (percent < 80) return 'text-green-500';
        return 'text-blue-600';
    };

    return (
        <div className="mb-10 px-4 md:px-0">
            <div className={'flex justify-between mb-1 font-medium ' + getTextColor()}>
                <span className="text-base">Progresso do Curso</span>
                <span className="text-sm">{percentage.toFixed(2)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                    className={'h-2.5 rounded-full transition-all duration-500 ' + getBgColor()}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
}
