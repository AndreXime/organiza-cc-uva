export function SkeletonSection() {
    return (
        <section className="mb-8 animate-pulse">
            <div className="h-6 w-40 bg-gray-300 rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="shadow rounded p-4 border border-gray-200 flex flex-col justify-between animate-pulse"
                    >
                        <div className="h-5 w-3/4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-3 w-1/2 bg-gray-300 rounded mb-4"></div>
                        <div className="space-y-2">
                            <div className="h-2 w-full bg-gray-300 rounded"></div>
                            <div className="h-2 w-5/6 bg-gray-300 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
