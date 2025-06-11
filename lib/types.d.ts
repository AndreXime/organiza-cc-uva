import { Dispatch, SetStateAction } from 'react';

export interface TabsProps {
	currentTab: string;
	setTab: Dispatch<SetStateAction<string>>;
}

export interface Horario {
	dia: 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta'; // Exemplo: "Segunda", "Terça", etc.
	inicio: string; // Exemplo: "08:00"
	fim: string; // Exemplo: "10:00"
}

export interface Requisito {
	id: number;
}

export interface DisciplinaSingle {
	id: number;
	nome: string;
	requisitos?: Requisito[];
	horarios?: Horario[];
}

export interface DisciplinasType {
	[key: string]: DisciplinaSingle[];
}
