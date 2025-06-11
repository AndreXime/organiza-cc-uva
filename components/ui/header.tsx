type HeaderProps = {
  title: string;
  subtitles: string | string[];
};

export default function Header({ title, subtitles }: HeaderProps) {
  return (
    <header className="flex flex-col gap-2 mb-10 text-center">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-indigo-700">{title}</h1>
      {Array.isArray(subtitles) ? (
        subtitles.map((subtitle, i) => (
          <p key={i} className="text-gray-800 text-sm sm:text-base">
            {subtitle}
          </p>
        ))
      ) : (
        <p className="text-gray-800 text-sm sm:text-base">{subtitles}</p>
      )}
    </header>
  );
}
