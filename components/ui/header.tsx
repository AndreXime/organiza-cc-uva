type HeaderProps = {
    title: string;
    subtitles: string | string[];
};

export default function Header({ title, subtitles }: HeaderProps) {
    return (
        <header className="text-center mb-10 p-6 bg-blue-50 border border-blue-200 rounded-xl">
            <h2 className="text-xl md:text-2xl font-semibold text-blue-800 mb-2">{title}</h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-sm md:text-base">
                {Array.isArray(subtitles) ? (
                    subtitles.map((subtitle, i) => <span key={i}>{subtitle}</span>)
                ) : (
                    <span>{subtitles}</span>
                )}
            </p>
        </header>
    );
}
