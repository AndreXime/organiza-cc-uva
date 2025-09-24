interface HeaderProps {
    title: string;
    children: React.ReactNode;
}

export default function SectionHeader({ title, children }: HeaderProps) {
    return (
        <div className="text-center mb-10 p-6 bg-info-background border border-info-border rounded-xl">
            <h2 className="text-xl md:text-2xl font-semibold text-info-foreground mb-2">{title}</h2>
            <div className="text-foreground max-w-3xl mx-auto text-sm md:text-base space-y-4">{children}</div>
        </div>
    );
}
