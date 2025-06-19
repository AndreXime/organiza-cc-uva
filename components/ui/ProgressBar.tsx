type ProgressBarProps = {
    current: number; // valor atual
    total: number; // valor total
};

export default function ProgressBar({ current, total }: ProgressBarProps) {
    const percentage = Math.min((current / total) * 100, 100);

    const getColor = (percent: number) => {
        if (percent < 20) return 'bg-red-500';
        if (percent < 40) return 'bg-orange-500';
        if (percent < 60) return 'bg-yellow-500';
        if (percent < 80) return 'bg-green-500';
        return 'bg-blue-600';
    };

    return (
        <div className="w-full sm:w-1/2 bg-gray-200 rounded-full h-4">
            <div
                className={`${getColor(percentage)} h-4 rounded-full transition-all duration-300`}
                style={{ width: `${percentage}%` }}
            />
            <div className="flex justify-between text-gray-700">
                <span>{`De ${total} disciplinas, você fez ${current}`}</span>
                <span className="font-bold">{Math.round(percentage)}%</span>
            </div>
        </div>
    );
}
