'use client';

import { useEffect } from 'react';
import { useDisciplinaStore } from './disciplinaStore';

export type serverData = { DisciplinasObrigatorias: Disciplina[]; DisciplinasEquivalentes: Equivalente[] };

export default function StoreInitializer({ data }: { data: serverData }) {
    useEffect(() => {
        useDisciplinaStore.getState().init(data);
    }, []);

    return null;
}
