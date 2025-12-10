import { create } from "zustand";

export interface UIState {
	Tab: string;
	mode: "default" | "minimal";

	message: string;
	mostrarFeitas: boolean;
	setTab: (tab: string) => void;
	setMode: (mode: "default" | "minimal") => void;
	setMessage: (message: string) => void;
	setMostrarFeitas: (mostrar: boolean) => void;

	modalMessage: string;
	onConfirmAction: (() => void) | null;

	// Função para abrir o modal, configurando a mensagem e a ação
	openModal: (message: string, onConfirm: () => void) => void;
	closeModal: () => void;
}

let messageTimer: NodeJS.Timeout;

export const useUIStore = create<UIState>()((set) => ({
	// Estado Inicial
	Tab: "gerenciador",
	mode: "default",
	message: "",
	modalMessage: "",
	onConfirmAction: null,
	mostrarFeitas: true,

	// Açõesx
	setMode: (mode) => set({ mode }),
	setTab: (tab) => set({ Tab: tab }),
	setMostrarFeitas: (mostrar) => set({ mostrarFeitas: mostrar }),
	openModal: (message, onConfirm) => {
		set({
			modalMessage: message,
			onConfirmAction: onConfirm,
		});
	},

	closeModal: () => {
		set({
			modalMessage: "",
			onConfirmAction: null,
		});
	},

	setMessage: (message) => {
		// Limpa qualquer timer
		clearTimeout(messageTimer);

		set({ message });

		// Se mensagem não estiver vazia, cria um novo timer
		if (message) {
			messageTimer = setTimeout(() => {
				set({ message: "" });
			}, 7000);
		}
	},
}));
