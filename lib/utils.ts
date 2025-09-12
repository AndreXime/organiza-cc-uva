import { useData } from '@/context/DataContext';

export function getDisciplinasByIds(ids: Set<number>) {
    const { DisciplinasTotais } = useData();

    return DisciplinasTotais.filter((d) => ids.has(d.id));
}
