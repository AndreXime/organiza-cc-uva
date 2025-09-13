'use client';

import { useEffect } from 'react';
import { useDisciplinaStore } from './dataStore';

interface StoreInitializerProps {
    disciplinas: Disciplina[];
}

export default function StoreInitializer({ disciplinas }: StoreInitializerProps) {
    useEffect(() => {
        useDisciplinaStore.getState().init(disciplinas);
    }, []);

    return null;
}
